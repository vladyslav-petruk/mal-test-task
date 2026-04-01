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
          <Text style={[t.typography.label, { color: t.colors.textMuted, marginBottom: t.spacing.xs }]}>
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={t.colors.textMuted}
          style={[
            t.typography.body,
            {
              backgroundColor: t.colors.surface,
              color: t.colors.text,
              borderColor: error ? t.colors.danger : t.colors.border,
              borderRadius: t.radius.md,
              paddingHorizontal: t.spacing.md,
              paddingVertical: t.spacing.sm + 4,
              borderWidth: 1,
            },
            style,
          ]}
          {...rest}
        />
        {error ? (
          <Text
            style={[
              t.typography.fieldError,
              { color: t.colors.danger, marginTop: t.spacing.xs },
            ]}
          >
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
});
