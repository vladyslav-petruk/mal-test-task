import { useState } from 'react';
import { View } from 'react-native';

import { ThemedTextInput } from '../../../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import { validateOnboardingProfile } from '../../../../lib/validation';
import { useOnboardingStore } from '../../../../store/onboardingStore';
import type { OnboardingProfile } from '../../../../types';

export function ProfileStep() {
  const t = useTheme();
  const globalProfile = useOnboardingStore((s) => s.draft.profile);
  const { updateProfile, nextStep } = useOnboardingStore();

  const [local, setLocal] = useState<OnboardingProfile>({ ...globalProfile });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnboardingProfile, string>>
  >({});

  const handleNext = () => {
    const nextErrors = validateOnboardingProfile(local);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    updateProfile(local);
    nextStep();
  };

  return (
    <View>
      <ThemedTextInput
        label="Full Name"
        placeholder="Jane Doe"
        value={local.fullName}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, fullName: v }));
          if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
        }}
        error={errors.fullName}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="Date of Birth"
        placeholder="1990-05-15"
        value={local.dateOfBirth}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, dateOfBirth: v }));
          if (errors.dateOfBirth)
            setErrors((p) => ({ ...p, dateOfBirth: undefined }));
        }}
        error={errors.dateOfBirth}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="Nationality"
        placeholder="US"
        value={local.nationality}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, nationality: v }));
          if (errors.nationality)
            setErrors((p) => ({ ...p, nationality: undefined }));
        }}
        autoCapitalize="characters"
        error={errors.nationality}
      />
      <View style={{ height: t.spacing.lg }} />
      <ThemedButton title="Next" onPress={handleNext} />
    </View>
  );
}
