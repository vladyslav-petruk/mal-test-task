import type {
  OnboardingAddress,
  OnboardingDocument,
  OnboardingDraft,
  OnboardingProfile,
  OnboardingSelfie,
} from '../types';

export function validateLoginFields(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = 'Enter a valid email';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Must be at least 4 characters';
  }
  return errors;
}

type ProfileErrors = Partial<Record<keyof OnboardingProfile, string>>;
type DocumentErrors = Partial<Record<keyof OnboardingDocument, string>>;
type AddressErrors = Partial<Record<keyof OnboardingAddress, string>>;
type SelfieErrors = { hasSelfie?: string };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateOnboardingProfile(
  profile: OnboardingProfile,
): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!profile.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }
  if (!profile.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!ISO_DATE_RE.test(profile.dateOfBirth.trim())) {
    errors.dateOfBirth = 'Use YYYY-MM-DD format';
  }
  if (!profile.nationality.trim()) {
    errors.nationality = 'Nationality is required';
  } else if (!/^[a-z]{2,3}$/i.test(profile.nationality.trim())) {
    errors.nationality = 'Use 2-3 letter country code';
  }
  return errors;
}

export function validateOnboardingDocument(
  document: OnboardingDocument,
): DocumentErrors {
  const errors: DocumentErrors = {};
  if (!document.documentType.trim()) {
    errors.documentType = 'Document type is required';
  }
  if (!document.documentNumber.trim()) {
    errors.documentNumber = 'Document number is required';
  } else if (!/^[a-z0-9-]{4,20}$/i.test(document.documentNumber.trim())) {
    errors.documentNumber = 'Use 4-20 letters/numbers';
  }
  return errors;
}

export function validateOnboardingAddress(
  address: OnboardingAddress,
): AddressErrors {
  const errors: AddressErrors = {};
  if (!address.addressLine1.trim()) {
    errors.addressLine1 = 'Address line is required';
  }
  if (!address.city.trim()) {
    errors.city = 'City is required';
  }
  if (!address.country.trim()) {
    errors.country = 'Country is required';
  } else if (!/^[a-z]{2,3}$/i.test(address.country.trim())) {
    errors.country = 'Use 2-3 letter country code';
  }
  return errors;
}

export function validateOnboardingSelfie(
  selfie: OnboardingSelfie,
): SelfieErrors {
  if (!selfie.hasSelfie) return { hasSelfie: 'Please capture a selfie' };
  return {};
}

export function validateOnboardingDraftForSubmit(
  draft: OnboardingDraft,
): string | null {
  const profileErrors = validateOnboardingProfile(draft.profile);
  if (Object.values(profileErrors)[0]) return Object.values(profileErrors)[0] ?? null;
  const documentErrors = validateOnboardingDocument(draft.document);
  if (Object.values(documentErrors)[0])
    return Object.values(documentErrors)[0] ?? null;
  const addressErrors = validateOnboardingAddress(draft.address);
  if (Object.values(addressErrors)[0]) return Object.values(addressErrors)[0] ?? null;
  const selfieErrors = validateOnboardingSelfie(draft.selfie);
  if (selfieErrors.hasSelfie) return selfieErrors.hasSelfie;
  if (!draft.consents.termsAccepted) return 'Please accept terms before submitting';
  return null;
}
