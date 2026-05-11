import { updateAdminProductAction } from "@/app/admin/actions";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminProductFormData } from "@/server/services/admin-service";

type AdminEditProductRouteProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptySearchParams: Record<string, string | string[] | undefined> = {};

function getFirstSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function AdminEditProductRoute({
  params,
  searchParams,
}: AdminEditProductRouteProps) {
  const { id } = await params;
  const adminUser = await requireAdminUser();
  const data = await getAdminProductFormData(id);
  const resolvedSearchParams = (await searchParams) ?? emptySearchParams;
  const notice = getFirstSearchParamValue(resolvedSearchParams.notice);

  return (
    <AdminShell
      adminUser={adminUser}
      currentPath="/admin/products"
      description="Update storefront content, pricing, publishing state, and linked protected assets without losing the existing product identity."
      eyebrow="Admin workspace"
      notice={notice}
      title={`Edit ${data.product?.name ?? "product"}`}
    >
      <AdminProductForm
        action={updateAdminProductAction}
        categories={data.categories}
        product={data.product}
        submitLabel="Save product changes"
        tags={data.tags}
      />
    </AdminShell>
  );
}
