import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { getOnboardingLabel } from '../../lib/onboardingUi';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { HomeScreen } from './HomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

beforeEach(() => {
  jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  useAuthStore.setState({
    status: 'logged_in',
    user: { id: '1', email: 'jane@test.com', fullName: 'Jane Doe' },
    session: null,
    error: null,
  });
  useOnboardingStore.setState({
    currentStep: 0,
    submissionStatus: 'idle',
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOnboardingLabel', () => {
  it('returns "Completed" when status is success', () => {
    expect(getOnboardingLabel('success', 0)).toBe('Completed');
  });

  it('returns "In Progress" with step info when step > 0', () => {
    expect(getOnboardingLabel('idle', 2)).toBe('In Progress (Step 3/5)');
  });

  it('returns "Not Started" when idle and step is 0', () => {
    expect(getOnboardingLabel('idle', 0)).toBe('Not Started');
  });
});

describe('HomeScreen', () => {
  it('renders user greeting and email', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Welcome, Jane Doe')).toBeTruthy();
    expect(screen.getByText('jane@test.com')).toBeTruthy();
  });

  it('shows "Not Started" when onboarding is idle at step 0', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Not Started')).toBeTruthy();
    expect(screen.getByText('Start Onboarding')).toBeTruthy();
  });

  it('shows "Completed" when submission is success', () => {
    useOnboardingStore.setState({ submissionStatus: 'success' });

    render(<HomeScreen />);

    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('Onboarding Complete')).toBeTruthy();
  });

  it('disables onboarding button after completion', () => {
    useOnboardingStore.setState({ submissionStatus: 'success' });

    render(<HomeScreen />);

    const buttons = screen.getAllByRole('button');
    const onboardingBtn = buttons.find(
      (b) => screen.getByText('Onboarding Complete') !== null,
    );
    expect(onboardingBtn?.props.accessibilityState?.disabled).toBe(true);
  });

  it('shows "Resume Onboarding" when in progress', () => {
    useOnboardingStore.setState({ currentStep: 3 });

    render(<HomeScreen />);

    expect(screen.getByText('In Progress (Step 4/5)')).toBeTruthy();
    expect(screen.getByText('Resume Onboarding')).toBeTruthy();
  });

  it('renders Settings button', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('opens confirmation alert before clearing onboarding info', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByText('Clear Onboarding Info'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear onboarding information?',
      'This will remove your saved onboarding draft and status. You can start again from Step 1.',
      expect.any(Array),
    );
  });

  it('clears onboarding state after confirm action', () => {
    useOnboardingStore.setState({
      currentStep: 4,
      submissionStatus: 'success',
      draft: {
        ...useOnboardingStore.getState().draft,
        profile: {
          ...useOnboardingStore.getState().draft.profile,
          fullName: 'To Be Cleared',
        },
      },
    });

    render(<HomeScreen />);
    fireEvent.press(screen.getByText('Clear Onboarding Info'));

    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2] as {
      text?: string;
      onPress?: () => void;
    }[];
    const confirmButton = buttons.find((b) => b.text === 'Clear');
    act(() => {
      confirmButton?.onPress?.();
    });

    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.submissionStatus).toBe('idle');
    expect(state.draft.profile.fullName).toBe('');
  });
});
