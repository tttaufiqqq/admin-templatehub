import { AdminProductsRoute } from "@/page-shells/admin/products-page";

type AdminProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  return <AdminProductsRoute searchParams={searchParams} />;
}
