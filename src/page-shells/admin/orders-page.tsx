import { updateAdminOrderAction } from "@/app/admin/actions";
import { AdminOrderUpdateForm } from "@/components/admin/admin-order-update-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminOrdersPageData } from "@/server/services/admin-service";

type AdminOrdersRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptySearchParams: Record<string, string | string[] | undefined> = {};

function getFirstSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function AdminOrdersRoute({
  searchParams,
}: AdminOrdersRouteProps) {
  const adminUser = await requireAdminUser();
  const orders = await getAdminOrdersPageData();
  const resolvedSearchParams = (await searchParams) ?? emptySearchParams;
  const notice = getFirstSearchParamValue(resolvedSearchParams.notice);

  return (
    <AdminShell
      adminUser={adminUser}
      currentPath="/admin/orders"
      description="Review buyer details, checkout outcomes, payment state, and the narrow manual decisions that still sit outside the automated callback-driven success path."
      eyebrow="Admin workspace"
      notice={notice}
      title="Order review"
    >
      {orders.length === 0 ? (
        <div className="border border-[#173648]/12 bg-white/80 p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
            No orders yet
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#173648]">
            Orders will appear here after checkout records are created.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#173648]/72">
            Once buyers start checking out, this view becomes the main place to review
            statuses, leave internal notes, and handle the limited manual outcomes that
            sit outside the normal paid callback flow.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="grid gap-6 rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)] lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                  {order.publicOrderNo}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#173648]">
                  {order.buyerFullName}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#173648]/72">
                  {order.buyerEmail}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/60">
                  <span className="rounded-full bg-[#f3f6fb] px-3 py-1.5">
                    {order.status.replaceAll("_", " ")}
                  </span>
                  <span className="rounded-full bg-[#f3f6fb] px-3 py-1.5">
                    {(order.payment?.status ?? "no payment").replaceAll("_", " ")}
                  </span>
                  <span className="rounded-full bg-[#f3f6fb] px-3 py-1.5">
                    {order.currencyCode} {(order.totalCents / 100).toFixed(2)}
                  </span>
                  <span>{order.items.length} items</span>
                </div>
                <div className="mt-5 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[18px] border border-[#173648]/10 bg-[#f9fbfd] px-4 py-3 text-sm leading-7 text-[#173648]/72"
                    >
                      {item.productNameSnapshot} x {item.quantity}
                    </div>
                  ))}
                </div>
              </div>

              <AdminOrderUpdateForm
                action={updateAdminOrderAction}
                order={{
                  id: order.id,
                  notes: order.notes,
                  status: order.status,
                }}
              />
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
