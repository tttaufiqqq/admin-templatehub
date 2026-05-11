"use client";

import { useActionState } from "react";

import type { ProductFormActionState } from "@/app/admin/actions";
import { FieldErrorText } from "@/components/ui/field-error-text";
import { getFormFieldClassName } from "@/components/ui/form-field-styles";
import { FormErrorBanner } from "@/components/ui/form-status";
import { ValidationSummary } from "@/components/ui/validation-summary";
import { ProductStatus } from "@prisma/client";

type AdminProductFormProps = {
  action: (
    state: ProductFormActionState | void,
    formData: FormData,
  ) => Promise<ProductFormActionState | void>;
  submitLabel: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    shortDescription: string | null;
    description: string;
    priceMajor: string;
    previewImagePath: string | null;
    status: ProductStatus;
    assetsText: string;
    tagIds: string[];
  } | null;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export function AdminProductForm({
  action,
  submitLabel,
  product,
  categories,
  tags,
}: AdminProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const failureState = state?.ok === false ? state : null;
  const currentValues = {
    productId: failureState?.values?.productId ?? product?.id ?? "",
    name: failureState?.values?.name ?? product?.name ?? "",
    slug: failureState?.values?.slug ?? product?.slug ?? "",
    categoryId:
      failureState?.values?.categoryId ??
      product?.categoryId ??
      categories[0]?.id ??
      "",
    shortDescription:
      failureState?.values?.shortDescription ?? product?.shortDescription ?? "",
    description: failureState?.values?.description ?? product?.description ?? "",
    priceMajor: failureState?.values?.priceMajor ?? product?.priceMajor ?? "",
    previewImagePath:
      failureState?.values?.previewImagePath ?? product?.previewImagePath ?? "",
    status: failureState?.values?.status ?? product?.status ?? ProductStatus.draft,
    assetsText: failureState?.values?.assetsText ?? product?.assetsText ?? "",
    tagIds: failureState?.values?.tagIds ?? product?.tagIds ?? [],
  };
  const fieldErrors = failureState?.fieldErrors ?? {};
  const validationErrors = Object.values(fieldErrors)
    .map((messages) => messages[0])
    .filter(Boolean);
  const formKey = JSON.stringify(currentValues);

  return (
    <form
      action={formAction}
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      key={formKey}
    >
      {currentValues.productId ? (
        <input name="productId" type="hidden" value={currentValues.productId} />
      ) : null}

      <div className="space-y-6 rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
            Product details
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#173648]/72">
            Define the storefront copy, pricing, and publishing state that buyers will
            see before checkout.
          </p>
          {failureState ? (
            <div className="mt-5 space-y-4">
              <ValidationSummary errors={validationErrors} />
              <FormErrorBanner
                message={failureState.message}
                title="Product details need attention"
              />
            </div>
          ) : null}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Product name
              </span>
              <input
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.name?.length),
                )}
                defaultValue={currentValues.name}
                name="name"
                required
                type="text"
              />
              <FieldErrorText message={fieldErrors.name?.[0]} />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Slug
              </span>
              <input
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.slug?.length),
                )}
                defaultValue={currentValues.slug}
                name="slug"
                required
                type="text"
              />
              <FieldErrorText message={fieldErrors.slug?.[0]} />
              <span className="safe-break text-sm text-[#173648]/55">
                Use a stable URL-friendly value, for example `planner-bundle-pro`.
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Price
              </span>
              <input
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.priceMajor?.length),
                )}
                defaultValue={currentValues.priceMajor}
                name="priceMajor"
                required
                type="text"
              />
              <FieldErrorText
                hint="Enter the storefront price in major currency units, for example `49.90`."
                message={fieldErrors.priceMajor?.[0]}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Category
              </span>
              <select
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.categoryId?.length),
                )}
                defaultValue={currentValues.categoryId}
                name="categoryId"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.isActive ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
              <FieldErrorText message={fieldErrors.categoryId?.[0]} />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Status
              </span>
              <select
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.status?.length),
                )}
                defaultValue={currentValues.status}
                name="status"
                required
              >
                {Object.values(ProductStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <FieldErrorText message={fieldErrors.status?.[0]} />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Short description
              </span>
              <input
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.shortDescription?.length),
                )}
                defaultValue={currentValues.shortDescription}
                name="shortDescription"
                type="text"
              />
              <FieldErrorText message={fieldErrors.shortDescription?.[0]} />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Preview image path
              </span>
              <input
                className={getFormFieldClassName(
                  "border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.previewImagePath?.length),
                )}
                defaultValue={currentValues.previewImagePath}
                name="previewImagePath"
                type="text"
              />
              <FieldErrorText
                hint="Optional public preview image path. Prefer localized Lumina assets such as `/images/lumina/products/pendant.jpg`."
                message={fieldErrors.previewImagePath?.[0]}
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
                Full description
              </span>
              <textarea
                className={getFormFieldClassName(
                  "min-h-40 border border-[#173648]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173648]",
                  Boolean(fieldErrors.description?.length),
                )}
                defaultValue={currentValues.description}
                name="description"
                required
              />
              <FieldErrorText message={fieldErrors.description?.[0]} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
            Tags
          </p>
          <div className="mt-5 grid gap-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-3 border border-[#173648]/10 bg-white px-4 py-3 text-sm"
              >
                <input
                  defaultChecked={currentValues.tagIds.includes(tag.id)}
                  name="tagIds"
                  type="checkbox"
                  value={tag.id}
                />
                <span>{tag.name}</span>
                <span className="safe-break text-[#173648]/45">{tag.slug}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#173648]/55">
            Asset linking
          </p>
          <p className="mt-3 text-sm leading-7 text-[#173648]/72">
            One line per asset using
            {" "}
            <code>fileName|storagePath|mimeType|versionLabel|sortOrder</code>.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#173648]/68">
            `storagePath` should resolve inside `STORAGE_ROOT`, not the public web
            directory. Keep the file names aligned with the protected files you seed or
            deploy.
          </p>
          <textarea
            className={getFormFieldClassName(
              "mt-5 min-h-56 w-full border border-[#173648]/12 bg-white px-4 py-3 font-mono text-xs outline-none focus:border-[#173648]",
              Boolean(fieldErrors.assetsText?.length),
            )}
            defaultValue={currentValues.assetsText}
            name="assetsText"
          />
          <div className="mt-3">
            <FieldErrorText message={fieldErrors.assetsText?.[0]} />
          </div>
        </div>

        <div className="rounded-[28px] border border-[#173648]/12 bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,28,44,0.08)]">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-[#173648] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#285569] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
