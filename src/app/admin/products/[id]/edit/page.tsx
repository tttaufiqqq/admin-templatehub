import { AdminEditProductRoute } from "@/page-shells/admin/edit-product-page";

type EditAdminProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditAdminProductPage({
  params,
  searchParams,
}: EditAdminProductPageProps) {
  return (
    <AdminEditProductRoute
      params={params}
      searchParams={searchParams}
    />
  );
}
