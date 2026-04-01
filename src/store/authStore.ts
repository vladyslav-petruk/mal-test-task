import { create } from 'zustand';

import { apiLogin, apiMe, apiRefresh, apiSubmit } from '../api/mockApi';
import { ApiError } from '../api/errors';
import { isAccessTokenExpired } from '../lib/session';
import { clearSession, loadSession, saveSession } from '../lib/storage';
import type {
  AuthSessionStatus,
  OnboardingDraft,
  Session,
  SubmissionResult,
  User,
} from '../types';

export const SESSION_EXPIRED_MESSAGE =
  'Session expired. Please sign in again.';

type AuthState = {
  status: AuthSessionStatus;
  user: User | null;
  session: Session | null;
  /** Login form error (e.g. invalid credentials). */
  error: string | null;
  /** Shown on Login after expiry / forced logout (not the same as `error`). */
  sessionExpiredMessage: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  /** After hydration: validate session with GET /me (uses refresh-on-401 once). */
  bootstrapSession: () => Promise<void>;
  /**
   * Runs a protected call with the current access token.
   * Proactively refreshes if access is expired; on 401, refreshes once and retries once.
   * Refresh failure → logout and `sessionExpiredMessage`.
   */
  runProtected: <T>(fn: (accessToken: string) => Promise<T>) => Promise<T>;
  submitOnboarding: (draft: OnboardingDraft) => Promise<SubmissionResult>;
};

function persistSession(user: User, session: Session): void {
  saveSession(JSON.stringify({ user, session })).catch(() => {});
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'logged_out',
  user: null,
  session: null,
  error: null,
  sessionExpiredMessage: null,

  login: async (email, password) => {
    set({
      status: 'logging_in',
      error: null,
      sessionExpiredMessage: null,
    });
    try {
      const { user, session } = await apiLogin(email, password);
      set({
        status: 'logged_in',
        user,
        session,
        error: null,
      });
      persistSession(user, session);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong';
      set({ status: 'logged_out', error: message });
    }
  },

  logout: () => {
    clearSession().catch(() => {});
    set({
      status: 'logged_out',
      user: null,
      session: null,
      error: null,
      sessionExpiredMessage: null,
    });
  },

  hydrate: async () => {
    const json = await loadSession();
    if (!json) return;
    try {
      const parsed = JSON.parse(json) as { user: User; session: Session };
      let { user, session } = parsed;

      if (isAccessTokenExpired(session)) {
        try {
          set({ status: 'refreshing' });
          const newSession = await apiRefresh(session.refreshToken);
          session = newSession;
          persistSession(user, newSession);
          set({ status: 'logged_in', user, session: newSession });
        } catch {
          await clearSession();
          set({
            status: 'logged_out',
            sessionExpiredMessage: SESSION_EXPIRED_MESSAGE,
            error: null,
          });
        }
        return;
      }

      set({ status: 'logged_in', user, session });
    } catch {
      await clearSession();
    }
  },

  bootstrapSession: async () => {
    if (get().status !== 'logged_in') return;
    try {
      const user = await get().runProtected((token) => apiMe(token));
      set({ user });
    } catch {
      /* runProtected already logged out on hard failure */
    }
  },

  runProtected: async (fn) => {
    const refreshSessionTokens = async (): Promise<Session> => {
      const state = get();
      const { session, user } = state;
      if (!session || !user) {
        throw new ApiError('Not authenticated', {
          status: 401,
          code: 'UNAUTHORIZED',
        });
      }
      set({ status: 'refreshing' });
      try {
        const newSession = await apiRefresh(session.refreshToken);
        persistSession(user, newSession);
        set({ status: 'logged_in', session: newSession });
        return newSession;
      } catch {
        clearSession().catch(() => {});
        set({
          status: 'logged_out',
          user: null,
          session: null,
          sessionExpiredMessage: SESSION_EXPIRED_MESSAGE,
          error: null,
        });
        throw new ApiError('Session expired', {
          status: 401,
          code: 'UNAUTHORIZED',
        });
      }
    };

    const state = get();
    const { session, user } = state;
    if (!session || !user) {
      throw new ApiError('Not authenticated', {
        status: 401,
        code: 'UNAUTHORIZED',
      });
    }

    let accessToken = session.accessToken;
    if (isAccessTokenExpired(session)) {
      const newSession = await refreshSessionTokens();
      accessToken = newSession.accessToken;
    }

    try {
      return await fn(accessToken);
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 401) throw err;
      const newSession = await refreshSessionTokens();
      return await fn(newSession.accessToken);
    }
  },

  submitOnboarding: async (draft) => {
    return get().runProtected((token) => apiSubmit(token, draft));
  },
}));
