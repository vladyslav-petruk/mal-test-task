import type { Session } from '../types';

/** True when the access token expiry time is in the past (or equal to now). */
export function isAccessTokenExpired(session: Session): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now();
}
