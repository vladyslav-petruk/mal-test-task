import type { OnboardingDraft, Session, SubmissionResult, User } from '../types';
import { ApiError } from './errors';
import { DEFAULT_DELAY_MS, mockDelay } from './delay';

/** Successful login payload. */
export type LoginResponse = {
  user: User;
  session: Session;
};

/** Deterministic one-shot HTTP failures for tests/demo (cleared after the matching call). */
export type SimulatedHttpFailure = 400 | 401 | 500;

/** Tunable mock behavior (e.g. tests can tweak before calling). */
export type MockApiOptions = {
  /** Artificial delay applied to each call (ms). */
  delayMs: number;
  /** Next `apiLogin` fails with this status once, then cleared. */
  loginFailureOnce?: SimulatedHttpFailure;
  /** Next `apiRefresh` fails with this status once, then cleared. */
  refreshFailureOnce?: SimulatedHttpFailure;
  /** Next `apiMe` fails with this status once, then cleared. */
  meFailureOnce?: SimulatedHttpFailure;
  /** Next `apiSubmit` fails with this status once, then cleared. */
  submitFailureOnce?: SimulatedHttpFailure;
};

let options: MockApiOptions = {
  delayMs: DEFAULT_DELAY_MS,
};

export function setMockApiOptions(partial: Partial<MockApiOptions>): void {
  options = { ...options, ...partial };
}

export function getMockApiOptions(): MockApiOptions {
  return { ...options };
}

/** Clears sessions and resets one-shot flags — call from tests between cases. */
export function resetMockApiState(): void {
  accessByToken.clear();
  refreshByToken.clear();
  userById.clear();
  nextId = 1;
  options = {
    delayMs: DEFAULT_DELAY_MS,
  };
}

const KNOWN_USER: User = {
  id: 'USR-001',
  email: 'jane.doe@example.com',
  fullName: 'Jane Doe',
};

let nextId = 1;
const accessByToken = new Map<
  string,
  { userId: string; expiresAtMs: number }
>();
const refreshByToken = new Map<string, { userId: string }>();
const userById = new Map<string, User>();

function randomSuffix(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function defaultAccessTtlMs(): number {
  return 2 * 60 * 1000;
}

function issueSession(user: User): Session {
  const accessToken = `access_${nextId++}_${randomSuffix()}`;
  const refreshToken = `refresh_${nextId++}_${randomSuffix()}`;
  const expiresAtMs = Date.now() + defaultAccessTtlMs();
  userById.set(user.id, user);
  accessByToken.set(accessToken, { userId: user.id, expiresAtMs });
  refreshByToken.set(refreshToken, { userId: user.id });
  return {
    accessToken,
    refreshToken,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

function assertValidAccessToken(accessToken: string): { userId: string } {
  const row = accessByToken.get(accessToken);
  if (!row) {
    throw new ApiError('Invalid or unknown access token', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }
  if (Date.now() >= row.expiresAtMs) {
    throw new ApiError('Access token expired', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }
  return { userId: row.userId };
}

function codeForStatus(status: SimulatedHttpFailure): 'BAD_REQUEST' | 'UNAUTHORIZED' | 'SERVER_ERROR' {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  return 'SERVER_ERROR';
}

/** Throws `ApiError` for a simulated status; optional `fieldErrors` only for 400 + submit. */
function throwSimulatedHttpFailure(
  status: SimulatedHttpFailure,
  endpoint: 'login' | 'refresh' | 'me' | 'submit',
): never {
  const code = codeForStatus(status);
  const message = `Simulated ${status} (${endpoint})`;
  const fieldErrors =
    status === 400 && endpoint === 'submit'
      ? { _simulated: 'Simulated validation failure' }
      : undefined;
  throw new ApiError(message, { status, code, fieldErrors });
}

function takeSimulatedFailureOnce(
  endpoint: 'login' | 'refresh' | 'me' | 'submit',
): SimulatedHttpFailure | undefined {
  const key =
    endpoint === 'login'
      ? 'loginFailureOnce'
      : endpoint === 'refresh'
        ? 'refreshFailureOnce'
        : endpoint === 'me'
          ? 'meFailureOnce'
          : 'submitFailureOnce';
  const status = options[key];
  if (status === undefined) return undefined;
  setMockApiOptions({ [key]: undefined } as Partial<MockApiOptions>);
  return status;
}

function collectDraftFieldErrors(draft: OnboardingDraft): Record<string, string> {
  const e: Record<string, string> = {};
  const p = draft.profile;
  if (!p.fullName.trim()) e['profile.fullName'] = 'Required';
  if (!p.dateOfBirth.trim()) e['profile.dateOfBirth'] = 'Required';
  if (!p.nationality.trim()) e['profile.nationality'] = 'Required';

  const d = draft.document;
  if (!d.documentType.trim()) e['document.documentType'] = 'Required';
  if (!d.documentNumber.trim()) e['document.documentNumber'] = 'Required';

  if (!draft.selfie.hasSelfie) e['selfie'] = 'Selfie is required';

  const a = draft.address;
  if (!a.addressLine1.trim()) e['address.addressLine1'] = 'Required';
  if (!a.city.trim()) e['address.city'] = 'Required';
  if (!a.country.trim()) e['address.country'] = 'Required';

  if (!draft.consents.termsAccepted) e['consents.termsAccepted'] = 'You must accept the terms';

  return e;
}

/**
 * Mock login. Succeeds for `jane.doe@example.com` + `password`.
 * Any other combination yields 401 (invalid credentials).
 */
export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  await mockDelay(options.delayMs);

  const simulated = takeSimulatedFailureOnce('login');
  if (simulated !== undefined) {
    throwSimulatedHttpFailure(simulated, 'login');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== KNOWN_USER.email || password !== 'password') {
    throw new ApiError('Invalid email or password', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const user = { ...KNOWN_USER, email: KNOWN_USER.email };
  const session = issueSession(user);
  return { user, session };
}

/**
 * Mock refresh. Invalid or unknown refresh token → 401 (caller should logout).
 */
export async function apiRefresh(refreshToken: string): Promise<Session> {
  await mockDelay(options.delayMs);

  const simulated = takeSimulatedFailureOnce('refresh');
  if (simulated !== undefined) {
    throwSimulatedHttpFailure(simulated, 'refresh');
  }

  const row = refreshByToken.get(refreshToken);
  if (!row) {
    throw new ApiError('Invalid or expired refresh token', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }

  refreshByToken.delete(refreshToken);

  const user = userById.get(row.userId);
  if (!user) {
    throw new ApiError('User not found', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }

  return issueSession(user);
}

/**
 * Mock GET /me. Expired or unknown access token → 401.
 */
export async function apiMe(accessToken: string): Promise<User> {
  await mockDelay(options.delayMs);

  const simulated = takeSimulatedFailureOnce('me');
  if (simulated !== undefined) {
    throwSimulatedHttpFailure(simulated, 'me');
  }

  const { userId } = assertValidAccessToken(accessToken);
  const user = userById.get(userId);
  if (!user) {
    throw new ApiError('User not found', {
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }
  return { ...user };
}

/**
 * Mock submit. Missing required fields → 400 with `fieldErrors` on `ApiError`.
 * Expired access token → 401.
 */
export async function apiSubmit(
  accessToken: string,
  draft: OnboardingDraft,
): Promise<SubmissionResult> {
  await mockDelay(options.delayMs);

  const simulated = takeSimulatedFailureOnce('submit');
  if (simulated !== undefined) {
    throwSimulatedHttpFailure(simulated, 'submit');
  }

  assertValidAccessToken(accessToken);

  const fieldErrors = collectDraftFieldErrors(draft);
  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError('Validation failed', {
      status: 400,
      code: 'BAD_REQUEST',
      fieldErrors,
    });
  }

  const submissionId = `SUB-${nextId++}`;
  return {
    submissionId,
    status: 'RECEIVED',
  };
}
