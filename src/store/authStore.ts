import { create } from 'zustand';

import type { AuthSessionStatus } from '../types';

type AuthState = {
  status: AuthSessionStatus;
  setStatus: (status: AuthSessionStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'logged_out',
  setStatus: (status) => set({ status }),
}));
