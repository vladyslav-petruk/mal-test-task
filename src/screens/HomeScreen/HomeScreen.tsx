import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ThemedButton } from '../../components/ui/ThemedButton';
import { useTheme } from '../../hooks/useTheme';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';

type Nav = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export function getOnboardingLabel(status: string, step: number): string {
  if (status === 'success') return 'Completed';
  if (step > 0) return `In Progress (Step ${step + 1}/5)`;
  return 'Not Started';
}

export function HomeScreen() {
  const t = useTheme();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { currentStep, submissionStatus } = useOnboardingStore();
  const onboardingLabel = getOnboardingLabel(submissionStatus, currentStep);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: t.colors.surface,
            borderRadius: t.radius.md,
            padding: t.spacing.lg,
          },
        ]}
      >
        <Text style={[styles.greeting, { color: t.colors.text }]}>
          Welcome, {user?.fullName ?? 'User'}
        </Text>
        <Text style={[styles.email, { color: t.colors.textMuted }]}>
          {user?.email}
        </Text>

        <View style={{ height: t.spacing.lg }} />

        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: t.colors.textMuted }]}>
            Onboarding
          </Text>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  submissionStatus === 'success'
                    ? t.colors.success
                    : t.colors.text,
              },
            ]}
          >
            {onboardingLabel}
          </Text>
        </View>
      </View>

      <View style={{ height: t.spacing.lg }} />

      <ThemedButton
        title={
          submissionStatus === 'success'
            ? 'Onboarding Complete'
            : currentStep > 0
              ? 'Resume Onboarding'
              : 'Start Onboarding'
        }
        onPress={() => navigation.navigate('Onboarding')}
        disabled={submissionStatus === 'success'}
      />

      <View style={{ height: t.spacing.md }} />

      <ThemedButton
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
        variant="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { width: '100%' },
  greeting: { fontSize: 22, fontWeight: '700' },
  email: { fontSize: 14, marginTop: 2 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: { fontSize: 14 },
  statusValue: { fontSize: 14, fontWeight: '600' },
});
