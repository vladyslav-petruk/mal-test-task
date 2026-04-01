import { fireEvent, render, screen } from '@testing-library/react-native';

import { useOnboardingStore } from '../../../../store/onboardingStore';
import { AddressStep } from './AddressStep';

beforeEach(() => {
  useOnboardingStore.getState().resetDraft();
  useOnboardingStore.setState({ currentStep: 3 });
});

describe('AddressStep', () => {
  it('renders address inputs', () => {
    render(<AddressStep />);

    expect(screen.getByPlaceholderText('123 Main St')).toBeTruthy();
    expect(screen.getByPlaceholderText('Springfield')).toBeTruthy();
    expect(screen.getByPlaceholderText('US')).toBeTruthy();
  });

  it('syncs to store and advances on Next', () => {
    render(<AddressStep />);

    fireEvent.changeText(screen.getByPlaceholderText('123 Main St'), '42 Oak Ave');
    fireEvent.changeText(screen.getByPlaceholderText('Springfield'), 'Portland');
    fireEvent.changeText(screen.getByPlaceholderText('US'), 'CA');
    fireEvent.press(screen.getByText('Next'));

    const state = useOnboardingStore.getState();
    expect(state.draft.address.addressLine1).toBe('42 Oak Ave');
    expect(state.draft.address.city).toBe('Portland');
    expect(state.draft.address.country).toBe('CA');
    expect(state.currentStep).toBe(4);
  });

  it('syncs to store and goes back on Back', () => {
    render(<AddressStep />);

    fireEvent.changeText(screen.getByPlaceholderText('Springfield'), 'Austin');
    fireEvent.press(screen.getByText('Back'));

    expect(useOnboardingStore.getState().draft.address.city).toBe('Austin');
    expect(useOnboardingStore.getState().currentStep).toBe(2);
  });
});
