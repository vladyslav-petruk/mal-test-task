/**
 * Unit tests for onboarding draft/step state and theme mode (Zustand + AsyncStorage hydrate).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getThemeTokens } from '../theme/tokens';
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from './onboardingStore';
import { useThemeStore } from './themeStore';

const KEY_THEME = 'app:themeMode';
const KEY_ONBOARDING_DRAFT = 'app:onboardingDraft';
const KEY_ONBOARDING_STEP = 'app:onboardingStep';

describe('OnboardingStore — draft updates and step progression', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetDraft();
  });

  it('merges partial profile updates into the global draft', () => {
    useOnboardingStore.getState().updateProfile({ fullName: 'Ada Lovelace' });
    expect(useOnboardingStore.getState().draft.profile.fullName).toBe('Ada Lovelace');

    useOnboardingStore.getState().updateProfile({ nationality: 'UK' });
    const profile = useOnboardingStore.getState().draft.profile;
    expect(profile.fullName).toBe('Ada Lovelace');
    expect(profile.nationality).toBe('UK');
  });

  it('updates document, selfie, address, and consents sections independently', () => {
    useOnboardingStore.getState().updateDocument({ documentType: 'PASSPORT' });
    useOnboardingStore.getState().updateSelfie({ hasSelfie: true });
    useOnboardingStore.getState().updateAddress({ city: 'London' });
    useOnboardingStore.getState().updateConsents({ termsAccepted: true });

    const { draft } = useOnboardingStore.getState();
    expect(draft.document.documentType).toBe('PASSPORT');
    expect(draft.selfie.hasSelfie).toBe(true);
    expect(draft.address.city).toBe('London');
    expect(draft.consents.termsAccepted).toBe(true);
  });

  it('advances currentStep on nextStep and stops at the last step', () => {
    expect(useOnboardingStore.getState().currentStep).toBe(0);

    useOnboardingStore.getState().nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(1);

    for (let i = 0; i < 10; i++) {
      useOnboardingStore.getState().nextStep();
    }
    expect(useOnboardingStore.getState().currentStep).toBe(ONBOARDING_TOTAL_STEPS - 1);
  });

  it('moves back on prevStep and clamps at step 0', () => {
    useOnboardingStore.setState({ currentStep: 3 });
    useOnboardingStore.getState().prevStep();
    expect(useOnboardingStore.getState().currentStep).toBe(2);

    useOnboardingStore.setState({ currentStep: 0 });
    useOnboardingStore.getState().prevStep();
    expect(useOnboardingStore.getState().currentStep).toBe(0);
  });

  it('goToStep clamps to the valid step range', () => {
    useOnboardingStore.getState().goToStep(-5);
    expect(useOnboardingStore.getState().currentStep).toBe(0);

    useOnboardingStore.getState().goToStep(99);
    expect(useOnboardingStore.getState().currentStep).toBe(ONBOARDING_TOTAL_STEPS - 1);
  });

  it('hydrate restores draft and step from persisted storage', async () => {
    const persistedDraft = {
      profile: { fullName: 'Persisted', dateOfBirth: '1990-01-01', nationality: 'US' },
      document: { documentType: '', documentNumber: '' },
      selfie: { hasSelfie: false },
      address: { addressLine1: '', city: '', country: '' },
      consents: { termsAccepted: false },
    };
    await AsyncStorage.setItem(KEY_ONBOARDING_DRAFT, JSON.stringify(persistedDraft));
    await AsyncStorage.setItem(KEY_ONBOARDING_STEP, '2');

    await useOnboardingStore.getState().hydrate();

    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(2);
    expect(state.draft.profile.fullName).toBe('Persisted');
  });
});

describe('ThemeStore — toggle and persisted mode', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useThemeStore.setState({
      mode: 'light',
      tokens: getThemeTokens('light'),
    });
  });

  it('toggle switches mode from light to dark and updates tokens', () => {
    expect(useThemeStore.getState().mode).toBe('light');
    expect(useThemeStore.getState().tokens.mode).toBe('light');

    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().mode).toBe('dark');
    expect(useThemeStore.getState().tokens.mode).toBe('dark');
    expect(useThemeStore.getState().tokens.colors.background).toBe(
      getThemeTokens('dark').colors.background,
    );
  });

  it('toggle again returns to light', () => {
    useThemeStore.getState().toggle();
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().mode).toBe('light');
    expect(useThemeStore.getState().tokens.colors.background).toBe(
      getThemeTokens('light').colors.background,
    );
  });

  it('hydrate applies theme mode persisted in AsyncStorage', async () => {
    await AsyncStorage.setItem(KEY_THEME, 'dark');

    useThemeStore.setState({
      mode: 'light',
      tokens: getThemeTokens('light'),
    });

    await useThemeStore.getState().hydrate();

    expect(useThemeStore.getState().mode).toBe('dark');
    expect(useThemeStore.getState().tokens.mode).toBe('dark');
  });
});
