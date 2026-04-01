import { StyleSheet, Text, View } from 'react-native';

import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import { useOnboardingStore } from '../../../../store/onboardingStore';

export function SelfieStep() {
  const t = useTheme();
  const hasSelfie = useOnboardingStore((s) => s.draft.selfie.hasSelfie);
  const { updateSelfie, nextStep, prevStep } = useOnboardingStore();

  const handleCapture = () => {
    updateSelfie({ hasSelfie: true });
  };

  return (
    <View>
      <View
        style={[
          styles.placeholder,
          {
            backgroundColor: t.colors.surface,
            borderColor: hasSelfie ? t.colors.success : t.colors.border,
            borderRadius: t.radius.md,
          },
        ]}
      >
        <Text
          style={[
            t.typography.bodyEmphasis,
            { color: hasSelfie ? t.colors.success : t.colors.textMuted },
          ]}
        >
          {hasSelfie ? 'Selfie Captured ✓' : 'No Selfie Yet'}
        </Text>
      </View>

      <View style={{ height: t.spacing.md }} />

      {!hasSelfie ? (
        <ThemedButton title="Capture Selfie" onPress={handleCapture} />
      ) : null}

      <View style={{ height: t.spacing.lg }} />

      <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <ThemedButton title="Back" onPress={prevStep} variant="outline" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedButton title="Next" onPress={nextStep} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
