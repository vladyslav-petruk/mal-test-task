import { useState } from 'react';
import { View } from 'react-native';

import { ThemedTextInput } from '../../../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import { validateOnboardingDocument } from '../../../../lib/validation';
import { useOnboardingStore } from '../../../../store/onboardingStore';
import type { OnboardingDocument } from '../../../../types';

export function DocumentStep() {
  const t = useTheme();
  const globalDoc = useOnboardingStore((s) => s.draft.document);
  const { updateDocument, nextStep, prevStep } = useOnboardingStore();

  const [local, setLocal] = useState<OnboardingDocument>({ ...globalDoc });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnboardingDocument, string>>
  >({});

  const handleNext = () => {
    const nextErrors = validateOnboardingDocument(local);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    updateDocument(local);
    nextStep();
  };

  const handleBack = () => {
    updateDocument(local);
    prevStep();
  };

  return (
    <View>
      <ThemedTextInput
        label="Document Type"
        placeholder="PASSPORT"
        value={local.documentType}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, documentType: v }));
          if (errors.documentType)
            setErrors((p) => ({ ...p, documentType: undefined }));
        }}
        autoCapitalize="characters"
        error={errors.documentType}
      />
      <View style={{ height: t.spacing.md }} />
      <ThemedTextInput
        label="Document Number"
        placeholder="P12345678"
        value={local.documentNumber}
        onChangeText={(v) => {
          setLocal((s) => ({ ...s, documentNumber: v }));
          if (errors.documentNumber)
            setErrors((p) => ({ ...p, documentNumber: undefined }));
        }}
        autoCapitalize="characters"
        error={errors.documentNumber}
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
