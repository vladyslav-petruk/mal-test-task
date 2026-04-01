import { render, screen } from '@testing-library/react-native';

import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getOnboardingLabel, HomeScreen } from './HomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

beforeEach(() => {
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
});
