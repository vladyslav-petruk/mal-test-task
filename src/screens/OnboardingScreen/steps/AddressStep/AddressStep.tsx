import { useState } from 'react';
import { View } from 'react-native';

import { ThemedTextInput } from '../../../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import { useOnboardingStore } from '../../../../store/onboardingStore';
import type { OnboardingAddress } from '../../../../types';

export function AddressStep() {
  const t = useTheme();
  const globalAddr = useOnboardingStore((s) => s.draft.address);
  const { updateAddress, nextStep, prevStep } = useOnboardingStore();

  const [local, setLocal] = useState<OnboardingAddress>({ ...globalAddr });

  const handleNext = () => {
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
        onChangeText={(v) => setLocal((s) => ({ ...s, addressLine1: v }))}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="City"
        placeholder="Springfield"
        value={local.city}
        onChangeText={(v) => setLocal((s) => ({ ...s, city: v }))}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="Country"
        placeholder="US"
        value={local.country}
        onChangeText={(v) => setLocal((s) => ({ ...s, country: v }))}
        autoCapitalize="characters"
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
