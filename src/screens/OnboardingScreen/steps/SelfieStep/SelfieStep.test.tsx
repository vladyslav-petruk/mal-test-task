import { fireEvent, render, screen } from '@testing-library/react-native';

import { useOnboardingStore } from '../../../../store/onboardingStore';
import { SelfieStep } from './SelfieStep';

beforeEach(() => {
  useOnboardingStore.getState().resetDraft();
  useOnboardingStore.setState({ currentStep: 2 });
});

describe('SelfieStep', () => {
  it('renders "No Selfie Yet" initially', () => {
    render(<SelfieStep />);

    expect(screen.getByText('No Selfie Yet')).toBeTruthy();
    expect(screen.getByText('Capture Selfie')).toBeTruthy();
  });

  it('captures selfie and shows confirmation', () => {
    render(<SelfieStep />);

    fireEvent.press(screen.getByText('Capture Selfie'));

    expect(screen.getByText('Selfie Captured ✓')).toBeTruthy();
    expect(screen.queryByText('Capture Selfie')).toBeNull();
  });

  it('advances to next step on Next', () => {
    render(<SelfieStep />);

    fireEvent.press(screen.getByText('Next'));

    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it('goes back on Back', () => {
    render(<SelfieStep />);

    fireEvent.press(screen.getByText('Back'));

    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });
});
