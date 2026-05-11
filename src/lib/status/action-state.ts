export type ActionFieldErrors = Record<string, string[]>;

export type ActionFailureState<TValues extends Record<string, unknown>> = {
  ok: false;
  code: string;
  message: string;
  fieldErrors?: ActionFieldErrors;
  values?: Partial<TValues>;
};

export type ActionSuccessState<TData = undefined> = {
  ok: true;
  code: string;
  message: string;
  data?: TData;
};

export type ActionState<
  TValues extends Record<string, unknown>,
  TData = undefined,
> = ActionFailureState<TValues> | ActionSuccessState<TData> | null;

export function createActionFailure<TValues extends Record<string, unknown>>(
  code: string,
  message: string,
  options?: {
    fieldErrors?: ActionFieldErrors;
    values?: Partial<TValues>;
  },
): ActionFailureState<TValues> {
  return {
    ok: false,
    code,
    message,
    fieldErrors: options?.fieldErrors,
    values: options?.values,
  };
}

export function createActionSuccess<TData = undefined>(
  code: string,
  message: string,
  data?: TData,
): ActionSuccessState<TData> {
  return {
    ok: true,
    code,
    message,
    data,
  };
}
