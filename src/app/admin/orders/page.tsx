import { AdminOrdersRoute } from "@/page-shells/admin/orders-page";

type AdminOrdersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  return <AdminOrdersRoute searchParams={searchParams} />;
}
