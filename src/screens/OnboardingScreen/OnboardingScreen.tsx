import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { useOnboardingStore } from '../../store/onboardingStore';

import { StepIndicator } from './components/StepIndicator';
import { ProfileStep } from './steps/ProfileStep';
import { DocumentStep } from './steps/DocumentStep';
import { SelfieStep } from './steps/SelfieStep';
import { AddressStep } from './steps/AddressStep';
import { ReviewStep } from './steps/ReviewStep';

const STEPS = [ProfileStep, DocumentStep, SelfieStep, AddressStep, ReviewStep];

export function OnboardingScreen() {
  const t = useTheme();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const StepComponent = STEPS[currentStep];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { backgroundColor: t.colors.background }]}
    >
      <View
        style={{
          paddingHorizontal: t.spacing.lg,
          paddingTop: t.spacing.md,
        }}
      >
        <StepIndicator currentStep={currentStep} />
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: t.spacing.lg,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <StepComponent />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
