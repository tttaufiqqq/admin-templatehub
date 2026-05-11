"use client";

import { useActionState } from "react";

import type { ProductStatusActionState } from "@/app/admin/actions";
import { FormErrorBanner } from "@/components/ui/form-status";

type AdminProductStatusActionsProps = {
  action: (
    state: ProductStatusActionState | void,
    formData: FormData,
  ) => Promise<ProductStatusActionState | void>;
  product: {
    id: string;
    status: "draft" | "published" | "archived";
  };
};

export function AdminProductStatusActions({
  action,
  product,
}: AdminProductStatusActionsProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="flex flex-col gap-3 lg:min-w-[240px]">
      {state?.ok === false ? (
        <FormErrorBanner
          message={state.message}
          title="Status update blocked"
        />
      ) : null}
      {product.status !== "published" ? (
        <form action={formAction}>
          <input name="productId" type="hidden" value={product.id} />
          <input name="status" type="hidden" value="published" />
          <button
            className="inline-flex w-full items-center justify-center border border-[color:var(--color-brand-border)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            Publish to storefront
          </button>
        </form>
      ) : null}
      {product.status !== "archived" ? (
        <form action={formAction}>
          <input name="productId" type="hidden" value={product.id} />
          <input name="status" type="hidden" value="archived" />
          <button
            className="inline-flex w-full items-center justify-center border border-[color:var(--color-brand-border)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            Archive product
          </button>
        </form>
      ) : null}
      {product.status !== "draft" ? (
        <form action={formAction}>
          <input name="productId" type="hidden" value={product.id} />
          <input name="status" type="hidden" value="draft" />
          <button
            className="inline-flex w-full items-center justify-center border border-[color:var(--color-brand-border)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            Move back to draft
          </button>
        </form>
      ) : null}
    </div>
  );
}
