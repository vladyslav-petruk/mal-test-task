/** Auth/session lifecycle used by the auth store and guards. */
export type AuthSessionStatus =
  | 'logged_out'
  | 'logging_in'
  | 'logged_in'
  | 'refreshing'
  | 'expired';

export type User = {
  id: string;
  email: string;
  fullName: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type OnboardingProfile = {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
};

export type OnboardingDocument = {
  documentType: string;
  documentNumber: string;
};

export type OnboardingSelfie = {
  hasSelfie: boolean;
};

export type OnboardingAddress = {
  addressLine1: string;
  city: string;
  country: string;
};

export type OnboardingConsents = {
  termsAccepted: boolean;
};

/** Full draft synced with global onboarding state. */
export type OnboardingDraft = {
  profile: OnboardingProfile;
  document: OnboardingDocument;
  selfie: OnboardingSelfie;
  address: OnboardingAddress;
  consents: OnboardingConsents;
};

export type OnboardingSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export type SubmissionResult = {
  submissionId: string;
  status: 'RECEIVED' | 'FAILED';
};

export type ThemeMode = 'light' | 'dark';
