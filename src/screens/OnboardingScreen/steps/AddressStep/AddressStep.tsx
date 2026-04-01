import { useState } from 'react';
import { View } from 'react-native';

import { ThemedTextInput } from '../../../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import { validateOnboardingAddress } from '../../../../lib/validation';
import { useOnboardingStore } from '../../../../store/onboardingStore';
import type { OnboardingAddress } from '../../../../types';

export function AddressStep() {
  const t = useTheme();
  const globalAddr = useOnboardingStore((s) => s.draft.address);
  const { updateAddress, nextStep, prevStep } = useOnboardingStore();

  const [local, setLocal] = useState<OnboardingAddress>({ ...globalAddr });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnboardingAddress, string>>
  >({});

  const handleNext = () => {
    const nextErrors = validateOnboardingAddress(local);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    updateAddress(local);
    nextStep();
  };

  const handleBack = () => {
    updateAddress(local);
    prevStep();
  };

  return (
    <View>
      <ThemedTextInput
        label="Address Line"
        placeholder="123 Main St"
        value={local.addressLine1}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, addressLine1: v }));
          if (errors.addressLine1)
            setErrors((p) => ({ ...p, addressLine1: undefined }));
        }}
        error={errors.addressLine1}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="City"
        placeholder="Springfield"
        value={local.city}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, city: v }));
          if (errors.city) setErrors((p) => ({ ...p, city: undefined }));
        }}
        error={errors.city}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="Country"
        placeholder="US"
        value={local.country}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, country: v }));
          if (errors.country) setErrors((p) => ({ ...p, country: undefined }));
        }}
        autoCapitalize="characters"
        error={errors.country}
      />
      <View style={{ height: t.spacing.lg }} />
      <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <ThemedButton title="Back" onPress={handleBack} variant="outline" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedButton title="Next" onPress={handleNext} />
        </View>
      </View>
    </View>
  );
}
