import { Alert } from 'react-native';

export function getOnboardingLabel(status: string, step: number): string {
  if (status === 'success') return 'Completed';
  if (step > 0) return `In Progress (Step ${step + 1}/5)`;
  return 'Not Started';
}

export function showClearOnboardingConfirmation(
  clearOnboarding: () => void,
): void {
  Alert.alert(
    'Clear onboarding information?',
    'This will remove your saved onboarding draft and status. You can start again from Step 1.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: clearOnboarding,
      },
    ],
  );
}
