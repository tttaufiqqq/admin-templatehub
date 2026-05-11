import { NextResponse } from "next/server";

import { isAppError } from "@/lib/status/app-error";

type RouteSuccessOptions<T> = {
  code: string;
  message: string;
  data: T;
  status?: number;
};

type RouteFailureOptions = {
  fallbackCode: string;
  fallbackMessage: string;
  logPrefix: string;
};

export function routeSuccess<T>({
  code,
  message,
  data,
  status = 200,
}: RouteSuccessOptions<T>) {
  return NextResponse.json(
    {
      ok: true,
      code,
      message,
      data,
    },
    { status },
  );
}

export function routeError(error: unknown, options: RouteFailureOptions) {
  if (isAppError(error)) {
    return NextResponse.json(
      {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
      { status: error.statusCode },
    );
  }

  console.error(`${options.logPrefix}:`, error);

  return NextResponse.json(
    {
      code: options.fallbackCode,
      message: options.fallbackMessage,
    },
    { status: 500 },
  );
}

export async function handleJsonRoute<T>(
  handler: () => Promise<NextResponse<T> | NextResponse>,
  options: RouteFailureOptions,
) {
  try {
    return await handler();
  } catch (error) {
    return routeError(error, options);
  }
}
