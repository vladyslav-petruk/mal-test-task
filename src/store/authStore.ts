import { create } from 'zustand';

import { apiLogin } from '../api/mockApi';
import { ApiError } from '../api/errors';
import type { AuthSessionStatus, Session, User } from '../types';

type AuthState = {
  status: AuthSessionStatus;
  user: User | null;
  session: Session | null;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong';
      set({ status: 'logged_out', error: message });
    }
  },

  logout: () => {
    set({ status: 'logged_out', user: null, session: null, error: null });
  },
}));
