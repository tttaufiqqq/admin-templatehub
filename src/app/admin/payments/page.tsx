import { AdminPaymentsRoute } from "@/page-shells/admin/payments-page";

type AdminPaymentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  return <AdminPaymentsRoute searchParams={searchParams} />;
}
