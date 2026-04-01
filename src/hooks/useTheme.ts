import { useThemeStore } from '../store/themeStore';
import type { ThemeTokens } from '../theme/tokens';

export function useTheme(): ThemeTokens {
  return useThemeStore((s) => s.tokens);
}
