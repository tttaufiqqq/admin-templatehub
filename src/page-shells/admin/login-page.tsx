import { redirect } from "next/navigation";

import { loginAdminAction } from "@/app/admin/actions";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { StatusCard } from "@/components/ui/status-card";
import { getCurrentAdminUser } from "@/server/services/admin-auth-service";

type AdminLoginRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptySearchParams: Record<string, string | string[] | undefined> = {};

function getFirstSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getNoticeMessage(
  notice: string | null,
  error: string | null,
) {
  if (error === "invalid-credentials") {
    return "The admin email or password was not accepted.";
  }

  if (error === "auth-required") {
    return "Sign in with an active admin account to open the admin workspace.";
  }

  if (notice === "signed_out" || notice === "signed-out") {
    return "The admin session has been closed.";
  }

  return null;
}

export async function AdminLoginRoute({
  searchParams,
}: AdminLoginRouteProps) {
  const [adminUser, resolvedSearchParams] = await Promise.all([
    getCurrentAdminUser(),
    searchParams ?? Promise.resolve(emptySearchParams),
  ]);

  if (adminUser) {
    redirect("/admin/products");
  }

  const noticeMessage = getNoticeMessage(
    getFirstSearchParamValue(resolvedSearchParams.notice) || null,
    getFirstSearchParamValue(resolvedSearchParams.error) || null,
  );

  return (
    <main className="brand-gradient-hero min-h-screen px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <section className="flex flex-col justify-between border border-white/14 bg-white/8 p-8 backdrop-blur">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Admin access
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              TemplateHub operational workspace
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/78">
              Sign in with the seeded admin account to manage products, review orders,
              inspect payment callbacks, and record administrative changes with audit
              trails.
            </p>
          </div>
          <div className="mt-10 border border-white/14 bg-white/8 p-5 text-sm leading-7 text-white/76">
            <p className="safe-break">Bootstrap email: <code>{process.env.ADMIN_BOOTSTRAP_EMAIL ?? "admin@example.com"}</code></p>
            <p>Use the admin bootstrap password from your local environment settings.</p>
          </div>
        </section>

        <section className="brand-gradient-soft border border-[color:var(--color-brand-border)] p-8 text-[var(--color-brand-primary)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
            Sign in
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            Open the admin workspace
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-brand-primary)]/72">
            This workspace is intended for controlled product publishing, order review,
            and payment troubleshooting. Keep the bootstrap credentials private.
          </p>
          {noticeMessage ? (
            <StatusCard
              className="mt-6 bg-white"
              message={noticeMessage}
              title={
                getFirstSearchParamValue(resolvedSearchParams.error)
                  ? "Sign-in required"
                  : "Session updated"
              }
              tone={
                getFirstSearchParamValue(resolvedSearchParams.error)
                  ? "warning"
                  : "info"
              }
            />
          ) : null}
          <AdminLoginForm action={loginAdminAction} />
        </section>
      </div>
    </main>
  );
}
