import type { z } from "zod";

export type ValidationFieldErrors = Record<string, string[]>;

export function zodIssuesToFieldErrors(
  issues: z.ZodIssue[],
): ValidationFieldErrors {
  const fieldErrors: ValidationFieldErrors = {};

  for (const issue of issues) {
    const pathKey = issue.path.join(".");

    if (!fieldErrors[pathKey]) {
      fieldErrors[pathKey] = [];
    }

    fieldErrors[pathKey].push(issue.message);
  }

  return fieldErrors;
}

export function getFirstFieldError(
  fieldErrors: ValidationFieldErrors,
  key: string,
) {
  return fieldErrors[key]?.[0];
}

export function buildValidationSummaryMessage(
  fieldErrors: ValidationFieldErrors,
  fallbackMessage: string,
) {
  const firstError = Object.values(fieldErrors)[0]?.[0];
  return firstError ?? fallbackMessage;
}
