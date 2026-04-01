import { create } from 'zustand';

import { apiLogin } from '../api/mockApi';
import { ApiError } from '../api/errors';
import { clearSession, loadSession, saveSession } from '../lib/storage';
import type { AuthSessionStatus, Session, User } from '../types';

type AuthState = {
  status: AuthSessionStatus;
  user: User | null;
  session: Session | null;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'logged_out',
  user: null,
  session: null,
  error: null,

  login: async (email, password) => {
    set({ status: 'logging_in', error: null });
    try {
      const { user, session } = await apiLogin(email, password);
      set({ status: 'logged_in', user, session, error: null });
      saveSession(JSON.stringify({ user, session })).catch(() => {});
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong';
      set({ status: 'logged_out', error: message });
    }
  },

  logout: () => {
    clearSession().catch(() => {});
    set({ status: 'logged_out', user: null, session: null, error: null });
  },

  hydrate: async () => {
    const json = await loadSession();
    if (!json) return;
    try {
      const { user, session } = JSON.parse(json) as {
        user: User;
        session: Session;
      };
      if (new Date(session.expiresAt).getTime() <= Date.now()) {
        await clearSession();
        return;
      }
      set({ status: 'logged_in', user, session });
    } catch {
      await clearSession();
    }
  },
}));
