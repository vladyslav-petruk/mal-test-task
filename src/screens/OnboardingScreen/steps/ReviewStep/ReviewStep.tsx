import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { ThemedButton } from '../../../../components/ui/ThemedButton';
import { useTheme } from '../../../../hooks/useTheme';
import type { AppStackParamList } from '../../../../navigation/types';
import { apiSubmit } from '../../../../api/mockApi';
import { ApiError } from '../../../../api/errors';
import { clearOnboardingStorage } from '../../../../lib/storage';
import { useAuthStore } from '../../../../store/authStore';
import { useOnboardingStore } from '../../../../store/onboardingStore';

type Nav = NativeStackNavigationProp<AppStackParamList, 'Onboarding'>;

function Field({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.fieldRow,
        {
          borderBottomColor: t.colors.border,
          paddingVertical: t.spacing.xs + 2,
        },
      ]}
    >
      <Text style={[t.typography.bodyMedium, { color: t.colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[t.typography.bodyMedium, { color: t.colors.text }]}>
        {value || '—'}
      </Text>
    </View>
  );
}

export function ReviewStep() {
  const t = useTheme();
  const navigation = useNavigation<Nav>();
  const session = useAuthStore((s) => s.session);
  const {
    draft,
    submissionStatus,
    submissionError,
    updateConsents,
    setSubmissionStatus,
    prevStep,
  } = useOnboardingStore();

  const isSubmitting = submissionStatus === 'submitting';
  const isSuccess = submissionStatus === 'success';

  const handleSubmit = async () => {
    if (!session) return;
    setSubmissionStatus('submitting');
    try {
      await apiSubmit(session.accessToken, draft);
      setSubmissionStatus('success');
      clearOnboardingStorage().catch(() => {});
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Submission failed';
      setSubmissionStatus('error', message);
    }
  };

  if (isSuccess) {
    return (
      <View
        style={[
          styles.center,
          { paddingTop: t.spacing.xl + t.spacing.lg + t.spacing.sm },
        ]}
      >
        <Text
          style={[
            t.typography.display,
            {
              color: t.colors.success,
              marginBottom: t.spacing.sm + t.spacing.xs,
            },
          ]}
        >
          ✓
        </Text>
        <Text style={[t.typography.title, { color: t.colors.text }]}>
          Onboarding Complete
        </Text>
        <Text
          style={[
            t.typography.subtitle,
            {
              color: t.colors.textMuted,
              marginTop: t.spacing.xs,
              textAlign: 'center',
            },
          ]}
        >
          Your information has been submitted successfully.
        </Text>
        <View style={{ height: t.spacing.lg }} />
        <ThemedButton
          title="Back to Home"
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }),
            )
          }
        />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text
        style={[
          t.typography.section,
          { color: t.colors.text, marginBottom: t.spacing.sm },
        ]}
      >
        Profile
      </Text>
      <Field label="Full Name" value={draft.profile.fullName} />
      <Field label="Date of Birth" value={draft.profile.dateOfBirth} />
      <Field label="Nationality" value={draft.profile.nationality} />

      <View style={{ height: t.spacing.md }} />
      <Text
        style={[
          t.typography.section,
          { color: t.colors.text, marginBottom: t.spacing.sm },
        ]}
      >
        Document
      </Text>
      <Field label="Type" value={draft.document.documentType} />
      <Field label="Number" value={draft.document.documentNumber} />

      <View style={{ height: t.spacing.md }} />
      <Text
        style={[
          t.typography.section,
          { color: t.colors.text, marginBottom: t.spacing.sm },
        ]}
      >
        Selfie
      </Text>
      <Field
        label="Captured"
        value={draft.selfie.hasSelfie ? 'Yes' : 'No'}
      />

      <View style={{ height: t.spacing.md }} />
      <Text
        style={[
          t.typography.section,
          { color: t.colors.text, marginBottom: t.spacing.sm },
        ]}
      >
        Address
      </Text>
      <Field label="Address" value={draft.address.addressLine1} />
      <Field label="City" value={draft.address.city} />
      <Field label="Country" value={draft.address.country} />

      <View style={{ height: t.spacing.lg }} />

      <View
        style={[
          styles.consentRow,
          {
            backgroundColor: t.colors.surface,
            borderRadius: t.radius.md,
            padding: t.spacing.md,
          },
        ]}
      >
        <Text
          style={[t.typography.bodyMedium, { color: t.colors.text, flex: 1 }]}
        >
          I accept the Terms & Conditions
        </Text>
        <Switch
          value={draft.consents.termsAccepted}
          onValueChange={(v) => updateConsents({ termsAccepted: v })}
          trackColor={{ false: t.colors.border, true: t.colors.primary }}
          thumbColor={t.colors.primaryText}
        />
      </View>

      {submissionError ? (
        <Text
          style={[
            t.typography.caption,
            {
              color: t.colors.danger,
              marginTop: t.spacing.sm,
              textAlign: 'center',
            },
          ]}
        >
          {submissionError}
        </Text>
      ) : null}

      <View style={{ height: t.spacing.lg }} />

      <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <ThemedButton
            title="Back"
            onPress={prevStep}
            variant="outline"
            disabled={isSubmitting}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedButton
            title="Submit"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !draft.consents.termsAccepted}
          />
        </View>
      </View>

      <View style={{ height: t.spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
