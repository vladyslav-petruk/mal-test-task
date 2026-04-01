import {
  validateLoginFields,
  validateOnboardingAddress,
  validateOnboardingDocument,
  validateOnboardingDraftForSubmit,
  validateOnboardingProfile,
  validateOnboardingSelfie,
} from './validation';

describe('onboarding validation helpers', () => {
  it('validates profile fields', () => {
    const errors = validateOnboardingProfile({
      fullName: '',
      dateOfBirth: '1990/01/01',
      nationality: 'U',
    });
    expect(errors.fullName).toBe('Full name is required');
    expect(errors.dateOfBirth).toBe('Use YYYY-MM-DD format');
    expect(errors.nationality).toBe('Use 2-3 letter country code');
  });

  it('validates document fields', () => {
    const errors = validateOnboardingDocument({
      documentType: '',
      documentNumber: 'A',
    });
    expect(errors.documentType).toBe('Document type is required');
    expect(errors.documentNumber).toBe('Use 4-20 letters/numbers');
  });

  it('validates address fields', () => {
    const errors = validateOnboardingAddress({
      addressLine1: '',
      city: '',
      country: 'X',
    });
    expect(errors.addressLine1).toBe('Address line is required');
    expect(errors.city).toBe('City is required');
    expect(errors.country).toBe('Use 2-3 letter country code');
  });

  it('validates selfie capture', () => {
    expect(validateOnboardingSelfie({ hasSelfie: false }).hasSelfie).toBe(
      'Please capture a selfie',
    );
    expect(validateOnboardingSelfie({ hasSelfie: true }).hasSelfie).toBeUndefined();
  });

  it('returns first draft submit error or null when valid', () => {
    const invalidDraftError = validateOnboardingDraftForSubmit({
      profile: { fullName: '', dateOfBirth: '1990-05-15', nationality: 'US' },
      document: { documentType: 'PASSPORT', documentNumber: 'P12345' },
      selfie: { hasSelfie: true },
      address: { addressLine1: '123 Main', city: 'Austin', country: 'US' },
      consents: { termsAccepted: true },
    });
    expect(invalidDraftError).toBe('Full name is required');

    const validDraftError = validateOnboardingDraftForSubmit({
      profile: { fullName: 'Jane Doe', dateOfBirth: '1990-05-15', nationality: 'US' },
      document: { documentType: 'PASSPORT', documentNumber: 'P12345' },
      selfie: { hasSelfie: true },
      address: { addressLine1: '123 Main', city: 'Austin', country: 'US' },
      consents: { termsAccepted: true },
    });
    expect(validDraftError).toBeNull();
  });
});

describe('login validation helper', () => {
  it('validates login fields', () => {
    expect(validateLoginFields('', '')).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
  });
});
