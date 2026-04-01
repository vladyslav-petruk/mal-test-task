import { apiMe, resetMockApiState, setMockApiOptions } from '../api/mockApi';
import { SESSION_EXPIRED_MESSAGE, useAuthStore } from './authStore';
import { useOnboardingStore } from './onboardingStore';

const VALID_SUBMIT_DRAFT = {
  profile: { fullName: 'Jane Doe', dateOfBirth: '1990-05-15', nationality: 'US' },
  document: { documentType: 'PASSPORT', documentNumber: 'P123' },
  selfie: { hasSelfie: true },
  address: { addressLine1: '42 Oak', city: 'Portland', country: 'US' },
  consents: { termsAccepted: true },
};

afterEach(() => {
  jest.useRealTimers();
});

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

  it('auto-logs out when the active session expires while idle', () => {
    jest.useFakeTimers();

    useAuthStore.setState({
      status: 'logged_in',
      user: { id: 'USR-001', email: 'jane.doe@example.com', fullName: 'Jane Doe' },
      session: {
        accessToken: 'access_idle_expiry',
        refreshToken: 'refresh_idle_expiry',
        expiresAt: new Date(Date.now() + 1_000).toISOString(),
      },
      error: null,
      sessionExpiredMessage: null,
    });

    jest.advanceTimersByTime(1_100);

    expect(useAuthStore.getState().status).toBe('logged_out');
    expect(useAuthStore.getState().sessionExpiredMessage).toBe(
      SESSION_EXPIRED_MESSAGE,
    );

    jest.useRealTimers();
  });
});

describe('Milestone 2 — onboarding draft preserved across auth changes', () => {
  beforeEach(() => {
    resetMockApiState();
    setMockApiOptions({ delayMs: 0 });
    useAuthStore.getState().logout();
    useOnboardingStore.getState().resetDraft();
  });

  it('logout does not clear onboarding draft or step', async () => {
    useOnboardingStore.setState({ currentStep: 3 });
    useOnboardingStore.getState().updateProfile({ fullName: 'SavedName' });

    await useAuthStore.getState().login('jane.doe@example.com', 'password');
    useAuthStore.getState().logout();

    expect(useOnboardingStore.getState().currentStep).toBe(3);
    expect(useOnboardingStore.getState().draft.profile.fullName).toBe('SavedName');
  });

  it('refresh failure after 401 leaves onboarding draft intact', async () => {
    useOnboardingStore.setState({ currentStep: 2 });

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
    expect(useOnboardingStore.getState().currentStep).toBe(2);
  });
});

describe('submitOnboarding — integration (401 then refresh then retry)', () => {
  beforeEach(() => {
    resetMockApiState();
    setMockApiOptions({ delayMs: 0 });
    useAuthStore.getState().logout();
  });

  it('succeeds when the first apiSubmit returns 401 once', async () => {
    await useAuthStore.getState().login('jane.doe@example.com', 'password');
    setMockApiOptions({ delayMs: 0, submitFailureOnce: 401 });

    const result = await useAuthStore.getState().submitOnboarding(VALID_SUBMIT_DRAFT);

    expect(result.submissionId).toBeDefined();
    expect(result.status).toBe('RECEIVED');
    expect(useAuthStore.getState().status).toBe('logged_in');
  });
});
