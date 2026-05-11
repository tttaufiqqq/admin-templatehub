import { createAdminProductAction } from "@/app/admin/actions";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminProductFormData } from "@/server/services/admin-service";

export async function AdminNewProductRoute() {
  const adminUser = await requireAdminUser();
  const data = await getAdminProductFormData(null);

  return (
    <AdminShell
      adminUser={adminUser}
      currentPath="/admin/products"
      description="Create a new digital product record, attach storefront metadata, and link the protected assets that will be delivered after successful payment."
      eyebrow="Admin workspace"
      title="Create admin product"
    >
      <AdminProductForm
        action={createAdminProductAction}
        categories={data.categories}
        submitLabel="Create product"
        tags={data.tags}
      />
    </AdminShell>
  );
}
