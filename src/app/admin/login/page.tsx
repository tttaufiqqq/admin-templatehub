import { AdminLoginRoute } from "@/page-shells/admin/login-page";

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  return <AdminLoginRoute searchParams={searchParams} />;
}
