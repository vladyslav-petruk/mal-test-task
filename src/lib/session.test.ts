import { isAccessTokenExpired } from './session';

describe('isAccessTokenExpired', () => {
  it('returns false when expiresAt is in the future', () => {
    const session = {
      accessToken: 'a',
      refreshToken: 'r',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    };
    expect(isAccessTokenExpired(session)).toBe(false);
  });

  it('returns true when expiresAt is in the past', () => {
    const session = {
      accessToken: 'a',
      refreshToken: 'r',
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    };
    expect(isAccessTokenExpired(session)).toBe(true);
  });
});
