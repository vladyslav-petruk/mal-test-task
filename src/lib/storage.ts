import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  THEME_MODE: 'app:themeMode',
  ONBOARDING_DRAFT: 'app:onboardingDraft',
  ONBOARDING_STEP: 'app:onboardingStep',
  SESSION: 'secure:session',
} as const;

export async function loadThemeMode(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
}

export async function saveThemeMode(mode: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
}

export async function loadOnboardingDraft(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DRAFT);
}

export async function saveOnboardingDraft(json: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DRAFT, json);
}

export async function loadOnboardingStep(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_STEP);
}

export async function saveOnboardingStep(step: number): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_STEP, String(step));
}

export async function clearOnboardingStorage(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ONBOARDING_DRAFT,
    STORAGE_KEYS.ONBOARDING_STEP,
  ]);
}

export async function loadSession(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.SESSION);
}

export async function saveSession(json: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.SESSION, json);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION);
}
