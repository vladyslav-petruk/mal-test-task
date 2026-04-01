import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../../../hooks/useTheme';
import type { ThemedButtonProps } from './types';

export function ThemedButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: ThemedButtonProps) {
  const t = useTheme();
  const isDisabled = disabled || loading;

  const isPrimary = variant === 'primary';
  const bgColor = isPrimary ? t.colors.primary : 'transparent';
  const textColor = isPrimary ? t.colors.primaryText : t.colors.primary;
  const borderColor = isPrimary ? t.colors.primary : t.colors.border;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor,
          borderRadius: t.radius.md,
          paddingVertical: t.spacing.sm + 4,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  text: { fontSize: 16, fontWeight: '600' },
});
