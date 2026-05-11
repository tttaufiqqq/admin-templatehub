import type { ReactNode } from "react";
import Link from "next/link";

import { Calendar, CreditCard, Package2, ReceiptText, Users2 } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminDashboardData } from "@/server/services/admin-service";
import { Calendar as AdminCalendar } from "@/ui/calendar";

type AdminDashboardRouteDeps = {
  requireAdminUser: typeof requireAdminUser;
  getAdminDashboardData: typeof getAdminDashboardData;
  AdminShellComponent: typeof AdminShell;
};

const defaultAdminDashboardRouteDeps: AdminDashboardRouteDeps = {
  requireAdminUser,
  getAdminDashboardData,
  AdminShellComponent: AdminShell,
};

function formatCurrencyLabel(amountCents: number, currencyCode: string) {
  const amount = amountCents / 100;

  if (currencyCode === "MYR") {
    return `RM ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
  }

  return `${currencyCode} ${amount.toFixed(2)}`;
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--color-brand-border)] bg-white p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)]">
          {icon}
        </span>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/45">
        {label}
      </p>
      <p className="mt-3 text-3xl font-light tracking-[-0.06em] text-[var(--color-brand-primary)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-brand-primary)]/68">
        {detail}
      </p>
    </div>
  );
}

export async function renderAdminDashboardRoute(
  deps: AdminDashboardRouteDeps = defaultAdminDashboardRouteDeps,
) {
  const adminUser = await deps.requireAdminUser();
  const dashboard = await deps.getAdminDashboardData();
  const AdminShellComponent = deps.AdminShellComponent;

  return (
    <AdminShellComponent
      adminUser={adminUser}
      currentPath="/admin"
      description="A Lumina-style control room for the real storefront, combining live product, order, payment, and customer signals with a decorative dashboard shell where deeper analytics have not been built yet."
      eyebrow="Admin workspace"
      title="Admin dashboard"
    >
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            detail={`${dashboard.publishedProducts} published and storefront-visible.`}
            icon={<Package2 size={20} />}
            label="Products"
            value={`${dashboard.totalProducts}`}
          />
          <StatCard
            detail={`${dashboard.paidOrders} marked paid so far.`}
            icon={<ReceiptText size={20} />}
            label="Orders"
            value={`${dashboard.totalOrders}`}
          />
          <StatCard
            detail={`${dashboard.pendingPayments} still awaiting payment completion.`}
            icon={<CreditCard size={20} />}
            label="Pending payments"
            value={`${dashboard.pendingPayments}`}
          />
          <StatCard
            detail="Active customer accounts available for owned checkout."
            icon={<Users2 size={20} />}
            label="Customers"
            value={`${dashboard.activeCustomers}`}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[color:var(--color-brand-border)] bg-white p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/45">
                    Product status mix
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[var(--color-brand-primary)]">
                    Real publishing breakdown
                  </h2>
                </div>
                <Link
                  className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)] underline underline-offset-4"
                  href="/admin/products"
                >
                  Open products
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {dashboard.productStatusBreakdown.map((item) => {
                  const width =
                    dashboard.totalProducts > 0
                      ? Math.max(
                          10,
                          Math.round((item._count._all / dashboard.totalProducts) * 100),
                        )
                      : 10;

                  return (
                    <div key={item.status}>
                      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/58">
                        <span>{item.status}</span>
                        <span>{item._count._all}</span>
                      </div>
                      <div className="h-3 rounded-full bg-[var(--color-brand-bg)]">
                        <div
                          className="h-3 rounded-full bg-[var(--color-brand-primary)]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <AdminCalendar className="p-6" />
          </div>

          <div className="rounded-[28px] border border-[color:var(--color-brand-border)] bg-white shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
            <div className="flex items-center justify-between border-b border-[color:var(--color-brand-border)] px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/45">
                  Latest activity
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[var(--color-brand-primary)]">
                  Recent orders
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-bg)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/65">
                <Calendar className="h-4 w-4" />
                Live data
              </span>
            </div>
            <div className="divide-y divide-[color:var(--color-brand-border)]">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/45">
                      {order.publicOrderNo}
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[var(--color-brand-primary)]">
                      {order.buyerFullName}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-brand-primary)]/68">
                      {order.status.replaceAll("_", " ")} • {(order.payment?.status ?? "no payment").replaceAll("_", " ")}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/45">
                      Order total
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[var(--color-brand-primary)]">
                      {formatCurrencyLabel(order.totalCents, order.currencyCode)}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-brand-primary)]/68">
                      {order.createdAt.toLocaleDateString("en-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShellComponent>
  );
}

export async function AdminDashboardRoute() {
  return renderAdminDashboardRoute();
}
