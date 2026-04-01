import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuthStore } from '../../../../store/authStore';
import { useOnboardingStore } from '../../../../store/onboardingStore';
import * as mockApi from '../../../../api/mockApi';
import { ApiError } from '../../../../api/errors';
import { ReviewStep } from './ReviewStep';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, dispatch: mockDispatch }),
  CommonActions: { reset: jest.fn((args) => ({ type: 'RESET', ...args })) },
}));

const FILLED_DRAFT = {
  profile: { fullName: 'Jane Doe', dateOfBirth: '1990-05-15', nationality: 'US' },
  document: { documentType: 'PASSPORT', documentNumber: 'P123' },
  selfie: { hasSelfie: true },
  address: { addressLine1: '42 Oak', city: 'Portland', country: 'US' },
  consents: { termsAccepted: false },
};

const MOCK_SESSION = {
  accessToken: 'tok-123',
  refreshToken: 'ref-456',
  expiresAt: new Date(Date.now() + 600_000).toISOString(),
};

beforeEach(() => {
  jest.restoreAllMocks();
  mockNavigate.mockClear();
  mockDispatch.mockClear();

  useOnboardingStore.getState().resetDraft();
  useOnboardingStore.setState({
    draft: { ...FILLED_DRAFT },
    currentStep: 4,
    submissionStatus: 'idle',
    submissionError: null,
  });

  useAuthStore.setState({
    status: 'logged_in',
    session: MOCK_SESSION,
    user: { id: '1', email: 'jane@test.com', fullName: 'Jane Doe' },
    error: null,
  });
});

describe('ReviewStep', () => {
  it('displays all draft fields in the summary', () => {
    render(<ReviewStep />);

    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('1990-05-15')).toBeTruthy();
    expect(screen.getByText('PASSPORT')).toBeTruthy();
    expect(screen.getByText('P123')).toBeTruthy();
    expect(screen.getByText('Yes')).toBeTruthy();
    expect(screen.getByText('42 Oak')).toBeTruthy();
    expect(screen.getByText('Portland')).toBeTruthy();
  });

  it('renders the consent toggle off by default', () => {
    render(<ReviewStep />);

    expect(screen.getByText('I accept the Terms & Conditions')).toBeTruthy();
    const toggle = screen.getByRole('switch');
    expect(toggle.props.value).toBe(false);
  });

  it('disables Submit when terms are not accepted', () => {
    render(<ReviewStep />);

    const submitButton = screen.getByText('Submit').parent?.parent;
    expect(submitButton?.props.accessibilityState?.disabled).toBe(true);
  });

  it('enables Submit after accepting terms', () => {
    useOnboardingStore.setState({
      draft: { ...FILLED_DRAFT, consents: { termsAccepted: true } },
    });

    render(<ReviewStep />);

    const submitButton = screen.getByText('Submit').parent?.parent;
    expect(submitButton?.props.accessibilityState?.disabled).toBe(false);
  });

  it('goes back one step when Back is pressed', () => {
    render(<ReviewStep />);

    fireEvent.press(screen.getByText('Back'));

    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it('shows success screen after successful submission', async () => {
    jest.spyOn(mockApi, 'apiSubmit').mockResolvedValue({
      submissionId: 'sub-1',
      status: 'RECEIVED',
    });

    useOnboardingStore.setState({
      draft: { ...FILLED_DRAFT, consents: { termsAccepted: true } },
    });

    render(<ReviewStep />);

    fireEvent.press(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Onboarding Complete')).toBeTruthy();
    });

    expect(
      screen.getByText('Your information has been submitted successfully.'),
    ).toBeTruthy();
    expect(screen.getByText('Back to Home')).toBeTruthy();
    expect(useOnboardingStore.getState().submissionStatus).toBe('success');
  });

  it('shows error message on submission failure', async () => {
    jest.spyOn(mockApi, 'apiSubmit').mockRejectedValue(
      new ApiError('Server error', { status: 500, code: 'SERVER_ERROR' }),
    );

    useOnboardingStore.setState({
      draft: { ...FILLED_DRAFT, consents: { termsAccepted: true } },
    });

    render(<ReviewStep />);

    fireEvent.press(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeTruthy();
    });

    expect(useOnboardingStore.getState().submissionStatus).toBe('error');
  });

  it('dispatches navigation reset when "Back to Home" is pressed', async () => {
    useOnboardingStore.setState({ submissionStatus: 'success' });

    render(<ReviewStep />);

    fireEvent.press(screen.getByText('Back to Home'));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
