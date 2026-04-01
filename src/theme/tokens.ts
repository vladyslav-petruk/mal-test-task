import type { ThemeMode } from '../types';

/**
 * Typography roles — every Text uses one of these via `useTheme().typography.*`
 * plus `color` from `useTheme().colors.*`.
 */
export type TypographyTokens = {
  /** Login / marketing hero */
  hero: { fontSize: number; fontWeight: '700' };
  /** Primary screen titles */
  title: { fontSize: number; fontWeight: '700' };
  /** Section headings (Profile, Document, …) */
  section: { fontSize: number; fontWeight: '700' };
  /** Default paragraph */
  body: { fontSize: number; fontWeight: '400' };
  /** Emphasized body (e.g. selfie placeholder) */
  bodyEmphasis: { fontSize: number; fontWeight: '600' };
  /** Muted secondary text */
  bodyMedium: { fontSize: number; fontWeight: '500' };
  /** Status / row values */
  bodyStrong: { fontSize: number; fontWeight: '600' };
  /** Secondary line under titles */
  subtitle: { fontSize: number; fontWeight: '400' };
  /** Form field labels */
  label: { fontSize: number; fontWeight: '600' };
  /** Settings / list row title */
  rowLabel: { fontSize: number; fontWeight: '500' };
  /** Inline errors, helper text, field hints */
  caption: { fontSize: number; fontWeight: '400' | '500' };
  /** Input error under field (slightly smaller) */
  fieldError: { fontSize: number; fontWeight: '400' };
  /** Primary buttons */
  button: { fontSize: number; fontWeight: '600' };
  /** Stepper dots, badges */
  overline: { fontSize: number; fontWeight: '700' };
  /** Tiny labels (e.g. step names) */
  micro: { fontSize: number; fontWeight: '400' };
  /** Large success / empty-state glyph */
  display: { fontSize: number; fontWeight: '700' };
};

/** Semantic color/spacing/typography — screens use `useTheme()` only, not raw hex or ad-hoc font sizes. */
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
    xxs: number;
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
  typography: TypographyTokens;
};

/** Shared between light/dark — type scale does not change with mode. */
export const baseTypography: TypographyTokens = {
  hero: { fontSize: 26, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyEmphasis: { fontSize: 16, fontWeight: '600' },
  bodyMedium: { fontSize: 14, fontWeight: '500' },
  bodyStrong: { fontSize: 14, fontWeight: '600' },
  subtitle: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  caption: { fontSize: 13, fontWeight: '500' },
  fieldError: { fontSize: 12, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
  overline: { fontSize: 12, fontWeight: '700' },
  micro: { fontSize: 10, fontWeight: '400' },
  display: { fontSize: 48, fontWeight: '700' },
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
  spacing: { xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10 },
  typography: baseTypography,
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
  spacing: { xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10 },
  typography: baseTypography,
};

export function getThemeTokens(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? darkTheme : lightTheme;
}
