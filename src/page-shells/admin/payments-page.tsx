import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/server/services/admin-auth-service";
import { getAdminPaymentEventsPageData } from "@/server/services/admin-service";

type AdminPaymentsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptySearchParams: Record<string, string | string[] | undefined> = {};

function getFirstSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export async function AdminPaymentsRoute({
  searchParams,
}: AdminPaymentsRouteProps) {
  const adminUser = await requireAdminUser();
  const paymentEvents = await getAdminPaymentEventsPageData();
  const resolvedSearchParams = (await searchParams) ?? emptySearchParams;
  const notice = getFirstSearchParamValue(resolvedSearchParams.notice);

  return (
    <AdminShell
      adminUser={adminUser}
      currentPath="/admin/payments"
      description="Review the latest ToyyibPay lifecycle payloads, their processing outcome, and the order references they were matched against."
      eyebrow="Admin workspace"
      notice={notice}
      title="Payment event review"
    >
      {paymentEvents.length === 0 ? (
        <div className="border border-[#173648]/12 bg-white/80 p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
            No payment events yet
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#173648]">
            Gateway payloads will appear here after bill creation or payment callbacks run.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#173648]/72">
            Use this page to troubleshoot callback mismatches, duplicate events, or
            unusual payment states once live gateway traffic starts flowing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                    {event.providerEventName.replaceAll("_", " ")} • {event.source.replaceAll("_", " ")}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#173648]">
                    {event.payment.order.publicOrderNo}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#173648]/72">
                    {event.payment.order.buyerEmail}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[#173648]/10 bg-[#f8f5ee] px-4 py-3 text-sm leading-7 text-[#173648]/74">
                  <p>Payment status: {event.payment.status.replaceAll("_", " ")}</p>
                  <p>Processing: {event.processingStatus.replaceAll("_", " ")}</p>
                  <p>Bill code: {event.payment.providerBillCode ?? "Not set"}</p>
                </div>
              </div>
              {event.processingNotes ? (
                <p className="mt-4 text-sm leading-7 text-[#173648]/72">
                  {event.processingNotes}
                </p>
              ) : null}
              <pre className="mt-5 overflow-x-auto rounded-[20px] border border-[#173648]/10 bg-[#102a3a] p-4 text-xs leading-6 text-[#f7efe4]">
                {JSON.stringify(event.payloadJson, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
