import { create } from 'zustand';

import { getThemeTokens, type ThemeTokens } from '../theme/tokens';
import type { ThemeMode } from '../types';

type ThemeState = {
  mode: ThemeMode;
  tokens: ThemeTokens;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  tokens: getThemeTokens('light'),
  toggle: () =>
    set((s) => {
      const next: ThemeMode = s.mode === 'light' ? 'dark' : 'light';
      return { mode: next, tokens: getThemeTokens(next) };
    }),
}));
