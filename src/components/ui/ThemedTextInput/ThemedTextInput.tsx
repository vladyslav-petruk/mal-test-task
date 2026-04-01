import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';

import { useTheme } from '../../../hooks/useTheme';
import type { ThemedTextInputProps } from './types';

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  function ThemedTextInput({ label, error, style, ...rest }, ref) {
    const t = useTheme();

    return (
      <View style={styles.wrapper}>
        {label ? (
          <Text style={[styles.label, { color: t.colors.textMuted }]}>{label}</Text>
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={t.colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: t.colors.surface,
              color: t.colors.text,
              borderColor: error ? t.colors.danger : t.colors.border,
              borderRadius: t.radius.md,
              paddingHorizontal: t.spacing.md,
              paddingVertical: t.spacing.sm + 4,
            },
            style,
          ]}
          {...rest}
        />
        {error ? (
          <Text style={[styles.error, { color: t.colors.danger }]}>{error}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { fontSize: 16, borderWidth: 1 },
  error: { fontSize: 12, marginTop: 4 },
});
