import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../../hooks/useTheme';
import { ONBOARDING_TOTAL_STEPS } from '../../../../store/onboardingStore';

const STEP_LABELS = ['Profile', 'Document', 'Selfie', 'Address', 'Review'];

type Props = { currentStep: number };

export function StepIndicator({ currentStep }: Props) {
  const t = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const bg = isActive
          ? t.colors.primary
          : isDone
            ? t.colors.success
            : t.colors.border;

        return (
          <View key={i} style={styles.step}>
            <View
              style={[
                styles.dot,
                { backgroundColor: bg, borderRadius: t.radius.sm },
              ]}
            >
              <Text style={[styles.dotText, { color: t.colors.primaryText }]}>
                {isDone ? '✓' : i + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? t.colors.text : t.colors.textMuted },
              ]}
              numberOfLines={1}
            >
              {STEP_LABELS[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { alignItems: 'center', flex: 1 },
  dot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { fontSize: 12, fontWeight: '700' },
  label: { fontSize: 10, marginTop: 4 },
});
