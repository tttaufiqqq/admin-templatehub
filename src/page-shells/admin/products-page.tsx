import Link from "next/link";
import Image from "next/image";

import { changeAdminProductStatusAction } from "@/app/admin/actions";
import { AdminProductStatusActions } from "@/components/admin/admin-product-status-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminProductsPageData } from "@/server/services/admin-service";
import { resolveStorefrontImageUrl } from "@/utils/storefront-image";

type AdminProductsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptySearchParams: Record<string, string | string[] | undefined> = {};

function getFirstSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function AdminProductsRoute({
  searchParams,
}: AdminProductsRouteProps) {
  const adminUser = await requireAdminUser();
  const products = await getAdminProductsPageData();
  const resolvedSearchParams = (await searchParams) ?? emptySearchParams;
  const notice = getFirstSearchParamValue(resolvedSearchParams.notice);

  return (
    <AdminShell
      adminUser={adminUser}
      currentPath="/admin/products"
      description="Manage storefront product records, publishing state, pricing, tags, and protected asset links without touching the validated checkout or payment flow."
      eyebrow="Admin workspace"
      notice={notice}
      title="Product operations"
    >
      <div className="mb-6 flex justify-end">
        <Link
          className="inline-flex items-center justify-center bg-[var(--color-brand-primary)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[var(--color-brand-secondary)]"
          href="/admin/products/new"
        >
          Create product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-[color:var(--color-brand-border)] bg-white/80 p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
            No products yet
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-brand-primary)]">
            Create the first product record to populate the storefront.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-brand-primary)]/72">
            Start with a name, slug, category, price, and at least one protected
            asset mapping so the catalog, checkout, and delivery flow can all be
            exercised from one product entry.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="brand-shadow-card overflow-hidden rounded-[28px] border border-[color:var(--color-brand-border)] bg-white/90"
            >
              <div className="grid gap-0 lg:grid-cols-[0.3fr_0.7fr]">
                <div className="relative min-h-56 overflow-hidden bg-[var(--color-brand-muted)]">
                  <Image
                    alt={product.name}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(min-width: 1024px) 24vw, 100vw"
                    src={resolveStorefrontImageUrl({
                      previewImagePath: product.previewImagePath,
                      slug: product.slug,
                      productId: product.id,
                    })}
                  />
                </div>
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
                    {product.category.name}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-brand-primary)]">
                    {product.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/60">
                    <span>{product.slug}</span>
                    <span>{product.status.replaceAll("_", " ")}</span>
                    <span>
                      {product.currencyCode} {(product.priceCents / 100).toFixed(2)}
                    </span>
                    <span>{product.assets.length} active assets</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-brand-primary)]/72">
                    Tags:{" "}
                    {product.tags.length > 0
                      ? product.tags.map((tag) => tag.tag.name).join(", ")
                      : "No tags linked yet"}
                  </p>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[240px]">
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-brand-border)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-muted)]"
                      href={`/admin/products/${product.id}/edit`}
                    >
                      Edit product details
                    </Link>
                    <AdminProductStatusActions
                      action={changeAdminProductStatusAction}
                      product={{
                        id: product.id,
                        status: product.status,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
