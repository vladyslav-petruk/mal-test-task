/** Typed API failures for mock login/me/refresh/submit. */
export type ApiErrorCode = 'UNAUTHORIZED' | 'BAD_REQUEST' | 'SERVER_ERROR' | 'NETWORK';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    options: {
      status: number;
      code: ApiErrorCode;
      fieldErrors?: Record<string, string>;
    },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }
}
