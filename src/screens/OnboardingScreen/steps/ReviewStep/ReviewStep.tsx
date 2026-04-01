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
    <View style={[styles.fieldRow, { borderBottomColor: t.colors.border }]}>
      <Text style={[styles.fieldLabel, { color: t.colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.fieldValue, { color: t.colors.text }]}>
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
      <View style={styles.center}>
        <Text style={[styles.successIcon, { color: t.colors.success }]}>
          ✓
        </Text>
        <Text style={[styles.successTitle, { color: t.colors.text }]}>
          Onboarding Complete
        </Text>
        <Text style={[styles.successSub, { color: t.colors.textMuted }]}>
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
      <Text style={[styles.sectionTitle, { color: t.colors.text }]}>
        Profile
      </Text>
      <Field label="Full Name" value={draft.profile.fullName} />
      <Field label="Date of Birth" value={draft.profile.dateOfBirth} />
      <Field label="Nationality" value={draft.profile.nationality} />

      <View style={{ height: t.spacing.md }} />
      <Text style={[styles.sectionTitle, { color: t.colors.text }]}>
        Document
      </Text>
      <Field label="Type" value={draft.document.documentType} />
      <Field label="Number" value={draft.document.documentNumber} />

      <View style={{ height: t.spacing.md }} />
      <Text style={[styles.sectionTitle, { color: t.colors.text }]}>
        Selfie
      </Text>
      <Field
        label="Captured"
        value={draft.selfie.hasSelfie ? 'Yes' : 'No'}
      />

      <View style={{ height: t.spacing.md }} />
      <Text style={[styles.sectionTitle, { color: t.colors.text }]}>
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
          style={[styles.consentLabel, { color: t.colors.text, flex: 1 }]}
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
            styles.error,
            { color: t.colors.danger, marginTop: t.spacing.sm },
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
    paddingTop: 60,
  },
  successIcon: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700' },
  successSub: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldLabel: { fontSize: 14 },
  fieldValue: { fontSize: 14, fontWeight: '500' },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consentLabel: { fontSize: 14, fontWeight: '500' },
  error: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
