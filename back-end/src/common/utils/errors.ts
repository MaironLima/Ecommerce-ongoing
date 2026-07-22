export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const ERRORS = {
  UNAUTHENTICATED: {
    status: 401,
    message: 'Authentication required: invalid or missing session',
    code: 'UNAUTHENTICATED',
  },
  TOKEN_EXPIRED: {
    status: 401,
    message: 'Session expired, please login again',
    code: 'TOKEN_EXPIRED',
  },
} as const;

export function unauthenticated() {
  const e = ERRORS.UNAUTHENTICATED;
  return new HttpError(e.status, e.message, e.code);
}

export function tokenExpired() {
  const e = ERRORS.TOKEN_EXPIRED;
  return new HttpError(e.status, e.message, e.code);
}