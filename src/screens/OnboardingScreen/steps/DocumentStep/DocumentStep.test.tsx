import { fireEvent, render, screen } from '@testing-library/react-native';

import { useOnboardingStore } from '../../../../store/onboardingStore';
import { DocumentStep } from './DocumentStep';

beforeEach(() => {
  useOnboardingStore.getState().resetDraft();
  useOnboardingStore.setState({ currentStep: 1 });
});

describe('DocumentStep', () => {
  it('renders document inputs', () => {
    render(<DocumentStep />);

    expect(screen.getByPlaceholderText('PASSPORT')).toBeTruthy();
    expect(screen.getByPlaceholderText('P12345678')).toBeTruthy();
  });

  it('syncs to store and advances on Next', () => {
    render(<DocumentStep />);

    fireEvent.changeText(screen.getByPlaceholderText('PASSPORT'), 'ID_CARD');
    fireEvent.changeText(screen.getByPlaceholderText('P12345678'), 'X999');
    fireEvent.press(screen.getByText('Next'));

    const state = useOnboardingStore.getState();
    expect(state.draft.document.documentType).toBe('ID_CARD');
    expect(state.draft.document.documentNumber).toBe('X999');
    expect(state.currentStep).toBe(2);
  });

  it('syncs to store and goes back on Back', () => {
    render(<DocumentStep />);

    fireEvent.changeText(screen.getByPlaceholderText('PASSPORT'), 'VISA');
    fireEvent.press(screen.getByText('Back'));

    const state = useOnboardingStore.getState();
    expect(state.draft.document.documentType).toBe('VISA');
    expect(state.currentStep).toBe(0);
  });
});
