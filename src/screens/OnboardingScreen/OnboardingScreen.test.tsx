import { render, screen } from '@testing-library/react-native';

import { useOnboardingStore } from '../../store/onboardingStore';
import { OnboardingScreen } from './OnboardingScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), dispatch: jest.fn() }),
  CommonActions: { reset: jest.fn() },
}));

beforeEach(() => {
  useOnboardingStore.getState().resetDraft();
});

describe('OnboardingScreen', () => {
  it('renders step indicator with all labels', () => {
    render(<OnboardingScreen />);

    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Document')).toBeTruthy();
    expect(screen.getByText('Selfie')).toBeTruthy();
    expect(screen.getByText('Address')).toBeTruthy();
    expect(screen.getByText('Review')).toBeTruthy();
  });

  it('renders ProfileStep on step 0', () => {
    render(<OnboardingScreen />);

    expect(screen.getByPlaceholderText('Jane Doe')).toBeTruthy();
  });

  it('renders DocumentStep on step 1', () => {
    useOnboardingStore.setState({ currentStep: 1 });

    render(<OnboardingScreen />);

    expect(screen.getByPlaceholderText('PASSPORT')).toBeTruthy();
  });

  it('renders SelfieStep on step 2', () => {
    useOnboardingStore.setState({ currentStep: 2 });

    render(<OnboardingScreen />);

    expect(screen.getByText('No Selfie Yet')).toBeTruthy();
  });

  it('renders AddressStep on step 3', () => {
    useOnboardingStore.setState({ currentStep: 3 });

    render(<OnboardingScreen />);

    expect(screen.getByPlaceholderText('123 Main St')).toBeTruthy();
  });

  it('renders ReviewStep on step 4', () => {
    useOnboardingStore.setState({ currentStep: 4 });

    render(<OnboardingScreen />);

    expect(screen.getByText('I accept the Terms & Conditions')).toBeTruthy();
  });
});
