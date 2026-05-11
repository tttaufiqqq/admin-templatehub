"use client";

import { useActionState } from "react";

import type { LoginActionState } from "@/app/admin/actions";
import { FieldErrorText } from "@/components/ui/field-error-text";
import { getFormFieldClassName } from "@/components/ui/form-field-styles";
import { FormErrorBanner } from "@/components/ui/form-status";
import { ValidationSummary } from "@/components/ui/validation-summary";

type AdminLoginFormProps = {
  action: (
    state: LoginActionState | void,
    formData: FormData,
  ) => Promise<LoginActionState | void>;
};

export function AdminLoginForm({ action }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const failureState = state?.ok === false ? state : null;
  const fieldErrors = failureState?.fieldErrors ?? {};
  const validationErrors = Object.values(fieldErrors)
    .map((messages) => messages[0])
    .filter(Boolean);
  const formKey = JSON.stringify({
    email: failureState?.values?.email ?? "",
  });

  return (
    <form action={formAction} className="mt-8 grid gap-5" key={formKey}>
      {failureState ? (
        <div className="space-y-4">
          <ValidationSummary errors={validationErrors} />
          <FormErrorBanner
            message={failureState.message}
            title="Sign-in could not continue"
          />
        </div>
      ) : null}
      <label className="grid gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
          Admin email
        </span>
        <input
          className={getFormFieldClassName(
            "border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-sm text-[var(--color-brand-primary)] outline-none focus:border-[var(--color-brand-primary)]",
            Boolean(fieldErrors.email?.length),
          )}
          defaultValue={failureState?.values?.email ?? ""}
          name="email"
          required
          type="email"
        />
        <FieldErrorText message={fieldErrors.email?.[0]} />
      </label>
      <label className="grid gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-primary)]/55">
          Password
        </span>
        <input
          className={getFormFieldClassName(
            "border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-sm text-[var(--color-brand-primary)] outline-none focus:border-[var(--color-brand-primary)]",
            Boolean(fieldErrors.password?.length),
          )}
          name="password"
          required
          type="password"
        />
        <FieldErrorText message={fieldErrors.password?.[0]} />
      </label>
      <button
        className="mt-2 inline-flex items-center justify-center bg-[var(--color-brand-primary)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[var(--color-brand-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
