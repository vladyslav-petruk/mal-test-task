import { apiMe, resetMockApiState, setMockApiOptions } from '../api/mockApi';
import { SESSION_EXPIRED_MESSAGE, useAuthStore } from './authStore';

describe('AuthStore — session lifecycle & refresh-then-retry', () => {
  beforeEach(async () => {
    resetMockApiState();
    setMockApiOptions({ delayMs: 0 });
    useAuthStore.getState().logout();
  });

  it('runProtected refreshes once when the protected call returns 401, then retries successfully', async () => {
    await useAuthStore.getState().login('jane.doe@example.com', 'password');
    expect(useAuthStore.getState().status).toBe('logged_in');

    setMockApiOptions({ delayMs: 0, meFailureOnce: 401 });

    const user = await useAuthStore.getState().runProtected((token) => apiMe(token));
    expect(user.fullName).toBe('Jane Doe');
    expect(useAuthStore.getState().status).toBe('logged_in');
    expect(useAuthStore.getState().session).not.toBeNull();
  });

  it('runProtected logs out when refresh fails after a 401', async () => {
    await useAuthStore.getState().login('jane.doe@example.com', 'password');
    setMockApiOptions({
      delayMs: 0,
      meFailureOnce: 401,
      refreshFailureOnce: 401,
    });

    await expect(
      useAuthStore.getState().runProtected((token) => apiMe(token)),
    ).rejects.toThrow();

    expect(useAuthStore.getState().status).toBe('logged_out');
    expect(useAuthStore.getState().sessionExpiredMessage).toBe(SESSION_EXPIRED_MESSAGE);
  });

  it('obtains a new session via apiLogin after successful credentials', async () => {
    await useAuthStore.getState().login('jane.doe@example.com', 'password');
    const session = useAuthStore.getState().session;
    expect(session?.accessToken).toBeDefined();
    expect(session?.refreshToken).toBeDefined();
    expect(session?.expiresAt).toBeDefined();
  });
});
