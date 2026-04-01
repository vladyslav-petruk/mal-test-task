import { create } from 'zustand';

import {
  clearOnboardingStorage,
  loadOnboardingDraft,
  loadOnboardingStep,
  saveOnboardingDraft,
  saveOnboardingStep,
} from '../lib/storage';
import type {
  OnboardingAddress,
  OnboardingConsents,
  OnboardingDocument,
  OnboardingDraft,
  OnboardingProfile,
  OnboardingSelfie,
  OnboardingSubmissionStatus,
} from '../types';

/**
 * Onboarding draft lives in this store only; it is not tied to auth session.
 * Logout and session expiry (auth store) do not clear draft — users can sign back in
 * and continue. Draft + step are cleared only via `resetDraft()` (e.g. after a
 * successful submit when we intentionally clear persisted copy) or explicit reset.
 */
export const ONBOARDING_TOTAL_STEPS = 5;

const EMPTY_DRAFT: OnboardingDraft = {
  profile: { fullName: '', dateOfBirth: '', nationality: '' },
  document: { documentType: '', documentNumber: '' },
  selfie: { hasSelfie: false },
  address: { addressLine1: '', city: '', country: '' },
  consents: { termsAccepted: false },
};

type OnboardingState = {
  draft: OnboardingDraft;
  currentStep: number;
  submissionStatus: OnboardingSubmissionStatus;
  submissionError: string | null;

  updateProfile: (profile: Partial<OnboardingProfile>) => void;
  updateDocument: (document: Partial<OnboardingDocument>) => void;
  updateSelfie: (selfie: Partial<OnboardingSelfie>) => void;
  updateAddress: (address: Partial<OnboardingAddress>) => void;
  updateConsents: (consents: Partial<OnboardingConsents>) => void;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  setSubmissionStatus: (
    status: OnboardingSubmissionStatus,
    error?: string | null,
  ) => void;
  resetDraft: () => void;
  hydrate: () => Promise<void>;
};

function persistDraft(draft: OnboardingDraft, step: number) {
  saveOnboardingDraft(JSON.stringify(draft)).catch(() => {});
  saveOnboardingStep(step).catch(() => {});
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  draft: { ...EMPTY_DRAFT },
  currentStep: 0,
  submissionStatus: 'idle',
  submissionError: null,

  updateProfile: (partial) =>
    set((s) => {
      const draft = { ...s.draft, profile: { ...s.draft.profile, ...partial } };
      persistDraft(draft, s.currentStep);
      return { draft };
    }),

  updateDocument: (partial) =>
    set((s) => {
      const draft = { ...s.draft, document: { ...s.draft.document, ...partial } };
      persistDraft(draft, s.currentStep);
      return { draft };
    }),

  updateSelfie: (partial) =>
    set((s) => {
      const draft = { ...s.draft, selfie: { ...s.draft.selfie, ...partial } };
      persistDraft(draft, s.currentStep);
      return { draft };
    }),

  updateAddress: (partial) =>
    set((s) => {
      const draft = { ...s.draft, address: { ...s.draft.address, ...partial } };
      persistDraft(draft, s.currentStep);
      return { draft };
    }),

  updateConsents: (partial) =>
    set((s) => {
      const draft = { ...s.draft, consents: { ...s.draft.consents, ...partial } };
      persistDraft(draft, s.currentStep);
      return { draft };
    }),

  nextStep: () =>
    set((s) => {
      const next = Math.min(s.currentStep + 1, ONBOARDING_TOTAL_STEPS - 1);
      persistDraft(s.draft, next);
      return { currentStep: next };
    }),

  prevStep: () =>
    set((s) => {
      const prev = Math.max(s.currentStep - 1, 0);
      persistDraft(s.draft, prev);
      return { currentStep: prev };
    }),

  goToStep: (step) => {
    const clamped = Math.max(0, Math.min(step, ONBOARDING_TOTAL_STEPS - 1));
    persistDraft(get().draft, clamped);
    set({ currentStep: clamped });
  },

  setSubmissionStatus: (status, error = null) =>
    set({ submissionStatus: status, submissionError: error }),

  resetDraft: () => {
    clearOnboardingStorage().catch(() => {});
    set({
      draft: { ...EMPTY_DRAFT },
      currentStep: 0,
      submissionStatus: 'idle',
      submissionError: null,
    });
  },

  hydrate: async () => {
    const [draftJson, stepStr] = await Promise.all([
      loadOnboardingDraft(),
      loadOnboardingStep(),
    ]);
    const updates: Partial<OnboardingState> = {};
    if (draftJson) {
      try {
        updates.draft = JSON.parse(draftJson) as OnboardingDraft;
      } catch {
        /* corrupted data — start fresh */
      }
    }
    if (stepStr) {
      const parsed = parseInt(stepStr, 10);
      if (!isNaN(parsed)) updates.currentStep = parsed;
    }
    if (Object.keys(updates).length > 0) set(updates);
  },
}));

export { EMPTY_DRAFT };
