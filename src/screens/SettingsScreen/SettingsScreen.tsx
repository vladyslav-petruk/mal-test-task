import { StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { ThemedButton } from '../../components/ui/ThemedButton';

export function SettingsScreen() {
  const t = useTheme();
  const { mode, toggle } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <View
        style={[
          styles.row,
          {
            backgroundColor: t.colors.surface,
            borderRadius: t.radius.md,
            padding: t.spacing.md,
          },
        ]}
      >
        <Text style={[styles.label, { color: t.colors.text }]}>Dark Mode</Text>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggle}
          trackColor={{ false: t.colors.border, true: t.colors.primary }}
          thumbColor={t.colors.primaryText}
        />
      </View>

      <View style={{ height: t.spacing.xl }} />

      <ThemedButton title="Log Out" onPress={logout} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 16, fontWeight: '500' },
});
