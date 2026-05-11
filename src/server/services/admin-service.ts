import { Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/status/app-error";
import { zodIssuesToFieldErrors } from "@/lib/validation/errors";
import {
  adminOrderUpdateSchema,
  adminProductFormSchema,
} from "@/lib/validation/schemas";
import { requireAdminUser } from "@/server/services/admin-auth-service";

type ParsedAssetLine = {
  fileName: string;
  storagePath: string;
  mimeType: string;
  versionLabel: string;
  sortOrder: number;
};

export class AdminActionError extends AppError {
  constructor(
    message: string,
    code: string,
    readonly redirectPath: string,
    statusCode = 400,
    details?: Record<string, unknown>,
  ) {
    super(message, statusCode, code, details);
    this.name = "AdminActionError";
  }
}

export class AdminValidationError extends AdminActionError {
  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message, "invalid_input", "", 400, { fieldErrors });
    this.name = "AdminValidationError";
  }
}

function parsePriceMajorToCents(priceMajor: string) {
  return Math.round(Number.parseFloat(priceMajor) * 100);
}

function normalizeOptionalText(value: string | undefined) {
  const trimmedValue = value?.trim() ?? "";

  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function deriveAdminProductPublishedAt(input: {
  existingPublishedAt: Date | null;
  nextStatus: ProductStatus;
}) {
  if (input.nextStatus === "published") {
    return input.existingPublishedAt ?? new Date();
  }

  if (input.nextStatus === "archived") {
    return null;
  }

  return input.existingPublishedAt;
}

export function deriveAdminOrderPaymentStatus(input: {
  currentPaymentStatus: "created" | "pending" | "paid" | "failed" | "expired" | "cancelled";
  requestedOrderStatus: "awaiting_payment" | "failed" | "cancelled" | "refunded";
}) {
  if (input.currentPaymentStatus === "paid") {
    return "paid";
  }

  if (input.requestedOrderStatus === "cancelled") {
    return "cancelled";
  }

  if (input.requestedOrderStatus === "failed") {
    return "failed";
  }

  if (input.requestedOrderStatus === "awaiting_payment") {
    return input.currentPaymentStatus === "created" ? "created" : "pending";
  }

  return input.currentPaymentStatus;
}

export function parseAssetsText(assetsText: string | undefined) {
  const normalizedText = assetsText?.trim();

  if (!normalizedText) {
    return [];
  }

  return normalizedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [fileName, storagePath, mimeType, versionLabel, sortOrderRaw] =
        line.split("|").map((part) => part.trim());

      if (!fileName || !storagePath || !mimeType) {
        throw new AdminValidationError(
          `Asset line ${index + 1} must include fileName, storagePath, and mimeType.`,
          {
            assetsText: [
              `Asset line ${index + 1} must include fileName|storagePath|mimeType and can optionally include versionLabel|sortOrder.`,
            ],
          },
        );
      }

      return {
        fileName,
        storagePath,
        mimeType,
        versionLabel: versionLabel || "v1",
        sortOrder: sortOrderRaw ? Number.parseInt(sortOrderRaw, 10) : (index + 1) * 10,
      } satisfies ParsedAssetLine;
    });
}

export function serializeAssetsForTextarea(
  assets: Array<{
    fileName: string;
    storagePath: string;
    mimeType: string;
    versionLabel: string;
    sortOrder: number;
  }>,
) {
  return assets
    .map(
      (asset) =>
        `${asset.fileName}|${asset.storagePath}|${asset.mimeType}|${asset.versionLabel}|${asset.sortOrder}`,
    )
    .join("\n");
}

async function writeAuditLog(input: {
  adminUserId: string;
  actionType: string;
  entityType: string;
  entityId?: string | null;
  beforeJson?: Prisma.InputJsonValue | null;
  afterJson?: Prisma.InputJsonValue | null;
}) {
  await prisma.adminAuditLog.create({
    data: {
      adminUserId: input.adminUserId,
      actionType: input.actionType,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      beforeJson: input.beforeJson ?? Prisma.JsonNull,
      afterJson: input.afterJson ?? Prisma.JsonNull,
    },
  });
}

export async function getAdminCatalogReferenceData() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return { categories, tags };
}

export async function getAdminProductsPageData() {
  return prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      previewImagePath: true,
      status: true,
      priceCents: true,
      currencyCode: true,
      updatedAt: true,
      publishedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      assets: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getAdminDashboardData() {
  const totalProducts = await prisma.product.count();
  const publishedProducts = await prisma.product.count({
    where: {
      status: ProductStatus.published,
    },
  });
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.count({
    where: {
      status: "paid",
    },
  });
  const activeCustomers = await prisma.appUser.count({
    where: {
      role: "customer",
      status: "active",
    },
  });
  const pendingPayments = await prisma.payment.count({
    where: {
      status: {
        in: ["created", "pending"],
      },
    },
  });
  const recentOrders = await prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 5,
    select: {
      id: true,
      publicOrderNo: true,
      buyerFullName: true,
      totalCents: true,
      currencyCode: true,
      createdAt: true,
      status: true,
      payment: {
        select: {
          status: true,
        },
      },
    },
  });
  const productStatusBreakdown = await prisma.product.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  return {
    totalProducts,
    publishedProducts,
    totalOrders,
    paidOrders,
    activeCustomers,
    pendingPayments,
    recentOrders,
    productStatusBreakdown,
  };
}

export async function getAdminProductFormData(productId: string | null) {
  const referenceData = await getAdminCatalogReferenceData();

  if (!productId) {
    return {
      ...referenceData,
      product: null,
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true,
      shortDescription: true,
      description: true,
      priceCents: true,
      previewImagePath: true,
      status: true,
      assets: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          fileName: true,
          storagePath: true,
          mimeType: true,
          versionLabel: true,
          sortOrder: true,
          isActive: true,
        },
      },
      tags: {
        select: {
          tagId: true,
        },
      },
    },
  });

  if (!product) {
    throw new AdminActionError(
      "The requested product could not be found.",
      "product_not_found",
      "/admin/products?error=product-not-found",
    );
  }

  return {
    ...referenceData,
    product: {
      ...product,
      priceMajor: (product.priceCents / 100).toFixed(2),
      assetsText: serializeAssetsForTextarea(
        product.assets.filter((asset) => asset.isActive),
      ),
      tagIds: product.tags.map((tag) => tag.tagId),
    },
  };
}

export async function getAdminOrdersPageData() {
  return prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      publicOrderNo: true,
      buyerFullName: true,
      buyerEmail: true,
      status: true,
      totalCents: true,
      currencyCode: true,
      notes: true,
      createdAt: true,
      paidAt: true,
      payment: {
        select: {
          status: true,
          providerBillCode: true,
          paymentUrl: true,
        },
      },
      items: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          productNameSnapshot: true,
          quantity: true,
          lineTotalCents: true,
        },
      },
    },
  });
}

export async function getAdminPaymentEventsPageData() {
  return prisma.paymentEvent.findMany({
    orderBy: [{ receivedAt: "desc" }],
    take: 100,
    select: {
      id: true,
      source: true,
      providerEventName: true,
      processingStatus: true,
      processingNotes: true,
      receivedAt: true,
      payment: {
        select: {
          status: true,
          providerBillCode: true,
          order: {
            select: {
              publicOrderNo: true,
              buyerEmail: true,
            },
          },
        },
      },
      payloadJson: true,
    },
  });
}

export async function createAdminProduct(input: unknown) {
  const adminUser = await requireAdminUser();
  const parsedInputResult = adminProductFormSchema.safeParse(input);

  if (!parsedInputResult.success) {
    throw new AdminValidationError(
      "Review the highlighted product details and try again.",
      zodIssuesToFieldErrors(parsedInputResult.error.issues),
    );
  }

  const parsedInput = parsedInputResult.data;
  const parsedAssets = parseAssetsText(parsedInput.assetsText);

  const createdProduct = await prisma.product.create({
    data: {
      categoryId: parsedInput.categoryId,
      name: parsedInput.name,
      slug: parsedInput.slug,
      shortDescription: normalizeOptionalText(parsedInput.shortDescription),
      description: parsedInput.description,
      priceCents: parsePriceMajorToCents(parsedInput.priceMajor),
      previewImagePath: normalizeOptionalText(parsedInput.previewImagePath),
      status: parsedInput.status,
      publishedAt: parsedInput.status === "published" ? new Date() : null,
      createdById: adminUser.id,
      updatedById: adminUser.id,
      tags: {
        create: parsedInput.tagIds.map((tagId) => ({
          tagId,
        })),
      },
      assets: {
        create: parsedAssets.map((asset) => ({
          fileName: asset.fileName,
          storagePath: asset.storagePath,
          mimeType: asset.mimeType,
          versionLabel: asset.versionLabel,
          sortOrder: asset.sortOrder,
          fileSizeBytes: BigInt(0),
          isActive: true,
        })),
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });

  await writeAuditLog({
    adminUserId: adminUser.id,
    actionType: "product.create",
    entityType: "product",
    entityId: createdProduct.id,
    afterJson: createdProduct,
  });

  return createdProduct;
}

export async function updateAdminProduct(input: unknown) {
  const adminUser = await requireAdminUser();
  const parsedInputResult = adminProductFormSchema.safeParse(input);

  if (!parsedInputResult.success) {
    throw new AdminValidationError(
      "Review the highlighted product details and try again.",
      zodIssuesToFieldErrors(parsedInputResult.error.issues),
    );
  }

  const parsedInput = parsedInputResult.data;

  if (!parsedInput.productId) {
    throw new AdminValidationError("Product id is required for updates.", {
      productId: ["Product id is required for updates."],
    });
  }

  const productId = parsedInput.productId;

  const parsedAssets = parseAssetsText(parsedInput.assetsText);
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      assets: true,
      tags: true,
    },
  });

  if (!existingProduct) {
    throw new AdminActionError(
      "The requested product could not be found.",
      "product_not_found",
      "/admin/products?error=product-not-found",
      404,
    );
  }

  const nextStoragePaths = new Set(parsedAssets.map((asset) => asset.storagePath));

  const updatedProduct = await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        categoryId: parsedInput.categoryId,
        name: parsedInput.name,
        slug: parsedInput.slug,
        shortDescription: normalizeOptionalText(parsedInput.shortDescription),
        description: parsedInput.description,
        priceCents: parsePriceMajorToCents(parsedInput.priceMajor),
        previewImagePath: normalizeOptionalText(parsedInput.previewImagePath),
        status: parsedInput.status,
        publishedAt: deriveAdminProductPublishedAt({
          existingPublishedAt: existingProduct.publishedAt,
          nextStatus: parsedInput.status,
        }),
        updatedById: adminUser.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    await tx.productTag.deleteMany({
      where: {
        productId,
      },
    });

    if (parsedInput.tagIds.length > 0) {
      await tx.productTag.createMany({
        data: parsedInput.tagIds.map((tagId) => ({
          productId,
          tagId,
        })),
      });
    }

    for (const asset of parsedAssets) {
      await tx.productAsset.upsert({
        where: {
          storagePath: asset.storagePath,
        },
        update: {
          fileName: asset.fileName,
          mimeType: asset.mimeType,
          versionLabel: asset.versionLabel,
          sortOrder: asset.sortOrder,
          isActive: true,
        },
        create: {
          productId,
          fileName: asset.fileName,
          storagePath: asset.storagePath,
          mimeType: asset.mimeType,
          versionLabel: asset.versionLabel,
          sortOrder: asset.sortOrder,
          fileSizeBytes: BigInt(0),
          isActive: true,
        },
      });
    }

    await tx.productAsset.updateMany({
      where: {
        productId,
        storagePath: {
          notIn: Array.from(nextStoragePaths),
        },
      },
      data: {
        isActive: false,
      },
    });

    return product;
  });

  await writeAuditLog({
    adminUserId: adminUser.id,
    actionType: "product.update",
    entityType: "product",
    entityId: updatedProduct.id,
    beforeJson: {
      id: existingProduct.id,
      name: existingProduct.name,
      slug: existingProduct.slug,
      status: existingProduct.status,
    },
    afterJson: updatedProduct,
  });

  return updatedProduct;
}

export async function changeAdminProductStatus(input: {
  productId: string;
  status: ProductStatus;
}) {
  const adminUser = await requireAdminUser();
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: input.productId,
    },
    select: {
      id: true,
      name: true,
      status: true,
      publishedAt: true,
    },
  });

  if (!existingProduct) {
    throw new AdminActionError(
      "The requested product could not be found.",
      "product_not_found",
      "/admin/products?error=product-not-found",
    );
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: input.productId,
    },
    data: {
      status: input.status,
      publishedAt: deriveAdminProductPublishedAt({
        existingPublishedAt: existingProduct.publishedAt,
        nextStatus: input.status,
      }),
      updatedById: adminUser.id,
    },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });

  await writeAuditLog({
    adminUserId: adminUser.id,
    actionType: "product.status",
    entityType: "product",
    entityId: updatedProduct.id,
    beforeJson: existingProduct,
    afterJson: updatedProduct,
  });

  return updatedProduct;
}

export async function updateAdminOrder(input: unknown) {
  const adminUser = await requireAdminUser();
  const parsedInputResult = adminOrderUpdateSchema.safeParse(input);

  if (!parsedInputResult.success) {
    throw new AdminValidationError(
      "Review the order update fields and try again.",
      zodIssuesToFieldErrors(parsedInputResult.error.issues),
    );
  }

  const parsedInput = parsedInputResult.data;
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: parsedInput.orderId,
    },
    select: {
      id: true,
      publicOrderNo: true,
      status: true,
      notes: true,
      payment: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!existingOrder) {
    throw new AdminActionError(
      "The requested order could not be found.",
      "order_not_found",
      "/admin/orders?error=order-not-found",
      404,
    );
  }

  if (existingOrder.status === "paid" && parsedInput.status !== "refunded") {
    throw new AdminActionError(
      "Paid orders should not be moved away from the successful state through this admin form.",
      "paid_order_locked",
      "/admin/orders?error=paid-order-locked",
    );
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: {
        id: parsedInput.orderId,
      },
      data: {
        status: parsedInput.status,
        notes: normalizeOptionalText(parsedInput.notes),
      },
      select: {
        id: true,
        publicOrderNo: true,
        status: true,
        notes: true,
      },
    });

    if (existingOrder.payment && existingOrder.payment.status !== "paid") {
      await tx.payment.update({
        where: {
          id: existingOrder.payment.id,
        },
        data: {
          status: deriveAdminOrderPaymentStatus({
            currentPaymentStatus: existingOrder.payment.status,
            requestedOrderStatus: parsedInput.status,
          }),
        },
      });
    }

    return order;
  });

  await writeAuditLog({
    adminUserId: adminUser.id,
    actionType: "order.update",
    entityType: "order",
    entityId: updatedOrder.id,
    beforeJson: existingOrder,
    afterJson: updatedOrder,
  });

  return updatedOrder;
}
