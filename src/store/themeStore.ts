import { create } from 'zustand';

import { loadThemeMode, saveThemeMode } from '../lib/storage';
import { getThemeTokens, type ThemeTokens } from '../theme/tokens';
import type { ThemeMode } from '../types';

type ThemeState = {
  mode: ThemeMode;
  tokens: ThemeTokens;
  toggle: () => void;
  hydrate: () => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  tokens: getThemeTokens('light'),

  toggle: () =>
    set((s) => {
      const next: ThemeMode = s.mode === 'light' ? 'dark' : 'light';
      saveThemeMode(next).catch(() => {});
      return { mode: next, tokens: getThemeTokens(next) };
    }),

  hydrate: async () => {
    const stored = await loadThemeMode();
    if (stored === 'dark' || stored === 'light') {
      set({ mode: stored, tokens: getThemeTokens(stored) });
    }
  },
}));
