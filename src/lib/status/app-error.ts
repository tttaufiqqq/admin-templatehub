export type AppErrorDetails = Record<string, unknown>;

export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
    readonly details?: AppErrorDetails,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
  }
}

export class ValidationAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 400,
    code = "invalid_input",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "ValidationAppError";
  }
}

export class AuthAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 401,
    code = "auth_required",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "AuthAppError";
  }
}

export class ConflictAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 409,
    code = "conflict",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "ConflictAppError";
  }
}

export class NotFoundAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 404,
    code = "not_found",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "NotFoundAppError";
  }
}

export class AccessAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 403,
    code = "access_denied",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "AccessAppError";
  }
}

export class ExternalServiceAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 502,
    code = "external_service_failed",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "ExternalServiceAppError";
  }
}

export class ConfigAppError extends AppError {
  constructor(
    message: string,
    details?: AppErrorDetails,
    statusCode = 500,
    code = "configuration_error",
    options?: ErrorOptions,
  ) {
    super(message, statusCode, code, details, options);
    this.name = "ConfigAppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
