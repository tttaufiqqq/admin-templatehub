"use server";

import { ProductStatus } from "@prisma/client";
import { redirect, unstable_rethrow } from "next/navigation";

import { isAppError } from "@/lib/status/app-error";
import {
  createActionFailure,
  type ActionState,
} from "@/lib/status/action-state";
import {
  clearAdminSessionCookie,
  loginAdminUser,
} from "@/server/services/admin-auth-service";
import { AdminValidationError } from "@/server/services/admin-service";
import {
  changeAdminProductStatus,
  createAdminProduct,
  updateAdminOrder,
  updateAdminProduct,
} from "@/server/services/admin-service";

function getTrimmedFieldValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getAllStringFieldValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value))
    .filter(Boolean);
}

type LoginActionValues = {
  email: string;
  password: string;
};

type ProductActionValues = {
  productId?: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  priceMajor: string;
  previewImagePath: string;
  status: string;
  tagIds: string[];
  assetsText: string;
};

type OrderActionValues = {
  orderId: string;
  status: string;
  notes: string;
};

type ProductStatusActionValues = {
  productId: string;
  status: string;
};

export type LoginActionState = ActionState<LoginActionValues>;
export type ProductFormActionState = ActionState<ProductActionValues>;
export type OrderUpdateActionState = ActionState<OrderActionValues>;
export type ProductStatusActionState = ActionState<ProductStatusActionValues>;

function buildActionFailure<TValues extends Record<string, unknown>>(
  error: unknown,
  fallbackMessage: string,
  values?: Partial<TValues>,
) {
  unstable_rethrow(error);

  if (error instanceof AdminValidationError) {
    return createActionFailure<TValues>(
      error.code,
      error.message,
      {
        fieldErrors:
          (error.details?.fieldErrors as Record<string, string[]> | undefined) ??
          undefined,
        values,
      },
    );
  }

  if (isAppError(error)) {
    return createActionFailure<TValues>(
      error.code,
      error.message,
      {
        fieldErrors:
          (error.details?.fieldErrors as Record<string, string[]> | undefined) ??
          undefined,
        values,
      },
    );
  }

  console.error("Admin action failed:", error);
  return createActionFailure<TValues>("internal_error", fallbackMessage, { values });
}

function extractProductValues(formData: FormData): ProductActionValues {
  return {
    productId: getTrimmedFieldValue(formData, "productId") || undefined,
    name: getTrimmedFieldValue(formData, "name"),
    slug: getTrimmedFieldValue(formData, "slug"),
    categoryId: getTrimmedFieldValue(formData, "categoryId"),
    shortDescription: getTrimmedFieldValue(formData, "shortDescription"),
    description: getTrimmedFieldValue(formData, "description"),
    priceMajor: getTrimmedFieldValue(formData, "priceMajor"),
    previewImagePath: getTrimmedFieldValue(formData, "previewImagePath"),
    status: getTrimmedFieldValue(formData, "status"),
    tagIds: getAllStringFieldValues(formData, "tagIds"),
    assetsText: getTrimmedFieldValue(formData, "assetsText"),
  };
}

function extractOrderValues(formData: FormData): OrderActionValues {
  return {
    orderId: getTrimmedFieldValue(formData, "orderId"),
    status: getTrimmedFieldValue(formData, "status"),
    notes: getTrimmedFieldValue(formData, "notes"),
  };
}

export async function loginAdminAction(
  _previousState: LoginActionState | void,
  formData: FormData,
): Promise<LoginActionState> {
  const values = {
    email: getTrimmedFieldValue(formData, "email"),
    password: getTrimmedFieldValue(formData, "password"),
  };

  try {
    const result = await loginAdminUser(values);

    if (!result.ok) {
      return createActionFailure<LoginActionValues>(
        "invalid_credentials",
        "The admin email or password was not accepted.",
        {
          values: {
            email: values.email,
          },
        },
      );
    }

    redirect("/admin/products?notice=signed_in");
  } catch (error) {
    return buildActionFailure<LoginActionValues>(
      error,
      "Admin sign-in could not be completed right now.",
      {
        email: values.email,
      },
    );
  }
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login?notice=signed_out");
}

export async function createAdminProductAction(
  _previousState: ProductFormActionState | void,
  formData: FormData,
): Promise<ProductFormActionState> {
  const values = extractProductValues(formData);

  try {
    await createAdminProduct(values);

    redirect("/admin/products?notice=product_created");
  } catch (error) {
    return buildActionFailure<ProductActionValues>(
      error,
      "The product could not be created right now.",
      values,
    );
  }
}

export async function updateAdminProductAction(
  _previousState: ProductFormActionState | void,
  formData: FormData,
): Promise<ProductFormActionState> {
  const values = extractProductValues(formData);

  try {
    await updateAdminProduct(values);

    redirect(`/admin/products/${values.productId}/edit?notice=product_updated`);
  } catch (error) {
    return buildActionFailure<ProductActionValues>(
      error,
      "The product could not be updated right now.",
      values,
    );
  }
}

export async function changeAdminProductStatusAction(
  _previousState: ProductStatusActionState | void,
  formData: FormData,
): Promise<ProductStatusActionState> {
  const values = {
    productId: getTrimmedFieldValue(formData, "productId"),
    status: getTrimmedFieldValue(formData, "status"),
  };

  try {
    await changeAdminProductStatus({
      productId: values.productId,
      status: values.status as ProductStatus,
    });

    redirect("/admin/products?notice=status_updated");
  } catch (error) {
    return buildActionFailure<ProductStatusActionValues>(
      error,
      "The product status could not be updated right now.",
      values,
    );
  }
}

export async function updateAdminOrderAction(
  _previousState: OrderUpdateActionState | void,
  formData: FormData,
): Promise<OrderUpdateActionState> {
  const values = extractOrderValues(formData);

  try {
    await updateAdminOrder(values);

    redirect("/admin/orders?notice=order_updated");
  } catch (error) {
    return buildActionFailure<OrderActionValues>(
      error,
      "The order review update could not be saved right now.",
      values,
    );
  }
}
