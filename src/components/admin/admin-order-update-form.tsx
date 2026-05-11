"use client";

import { useActionState } from "react";

import type { OrderUpdateActionState } from "@/app/admin/actions";
import { FieldErrorText } from "@/components/ui/field-error-text";
import { getFormFieldClassName } from "@/components/ui/form-field-styles";
import { FormErrorBanner } from "@/components/ui/form-status";

type AdminOrderUpdateFormProps = {
  action: (
    state: OrderUpdateActionState | void,
    formData: FormData,
  ) => Promise<OrderUpdateActionState | void>;
  order: {
    id: string;
    status: string;
    notes: string | null;
  };
};

export function AdminOrderUpdateForm({
  action,
  order,
}: AdminOrderUpdateFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const failureState = state?.ok === false ? state : null;
  const fieldErrors = failureState?.fieldErrors ?? {};
  const currentValues = {
    orderId: failureState?.values?.orderId ?? order.id,
    status:
      failureState?.values?.status ??
      (order.status === "paid" ? "refunded" : order.status),
    notes: failureState?.values?.notes ?? order.notes ?? "",
  };
  const formKey = JSON.stringify(currentValues);

  return (
    <form
      action={formAction}
      className="brand-gradient-soft grid gap-4 border border-[color:var(--color-brand-border)] p-5"
      key={formKey}
    >
      <input name="orderId" type="hidden" value={currentValues.orderId} />
      {failureState ? (
        <FormErrorBanner
          message={failureState.message}
          title="Order update blocked"
        />
      ) : null}
      <label className="grid gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
          Manual review status
        </span>
        <select
          className={getFormFieldClassName(
            "border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-sm text-[var(--color-brand-primary)] outline-none focus:border-[var(--color-brand-primary)]",
            Boolean(fieldErrors.status?.length),
          )}
          defaultValue={currentValues.status}
          name="status"
        >
          <option value="awaiting_payment">awaiting_payment</option>
          <option value="failed">failed</option>
          <option value="cancelled">cancelled</option>
          <option value="refunded">refunded</option>
        </select>
        <FieldErrorText message={fieldErrors.status?.[0]} />
      </label>
      <label className="grid gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
          Internal notes
        </span>
        <textarea
          className={getFormFieldClassName(
            "min-h-28 border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-sm text-[var(--color-brand-primary)] outline-none focus:border-[var(--color-brand-primary)]",
            Boolean(fieldErrors.notes?.length),
          )}
          defaultValue={currentValues.notes}
          name="notes"
        />
        <FieldErrorText message={fieldErrors.notes?.[0]} />
      </label>
      <p className="text-sm leading-7 text-[var(--color-brand-primary)]/68">
        Use this panel for exceptions such as manual cancellations, failed
        follow-up, or refund tracking. Normal successful payments should still
        arrive through the gateway callback flow.
      </p>
      <button
        className="inline-flex items-center justify-center bg-[var(--color-brand-primary)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[var(--color-brand-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save review update"}
      </button>
    </form>
  );
}
