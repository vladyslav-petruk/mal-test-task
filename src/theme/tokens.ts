import type { ThemeMode } from '../types';

/** Semantic color/spacing tokens — screens consume these, not raw hex everywhere. */
export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryText: string;
    danger: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
  };
};

export const lightTheme: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    danger: '#DC2626',
    success: '#059669',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10 },
};

export const darkTheme: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    danger: '#F87171',
    success: '#34D399',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10 },
};

export function getThemeTokens(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? darkTheme : lightTheme;
}
