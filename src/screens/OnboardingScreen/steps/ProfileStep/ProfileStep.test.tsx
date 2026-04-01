import { fireEvent, render, screen } from '@testing-library/react-native';

import { useOnboardingStore } from '../../../../store/onboardingStore';
import { ProfileStep } from './ProfileStep';

beforeEach(() => {
  useOnboardingStore.getState().resetDraft();
});

describe('ProfileStep', () => {
  it('renders all profile inputs', () => {
    render(<ProfileStep />);

    expect(screen.getByPlaceholderText('Jane Doe')).toBeTruthy();
    expect(screen.getByPlaceholderText('1990-05-15')).toBeTruthy();
    expect(screen.getByPlaceholderText('US')).toBeTruthy();
  });

  it('initializes fields from global store', () => {
    useOnboardingStore.setState({
      draft: {
        ...useOnboardingStore.getState().draft,
        profile: { fullName: 'Alice', dateOfBirth: '2000-01-01', nationality: 'UK' },
      },
    });

    render(<ProfileStep />);

    expect(screen.getByDisplayValue('Alice')).toBeTruthy();
    expect(screen.getByDisplayValue('2000-01-01')).toBeTruthy();
    expect(screen.getByDisplayValue('UK')).toBeTruthy();
  });

  it('syncs local state to global store and advances on Next', () => {
    render(<ProfileStep />);

    fireEvent.changeText(screen.getByPlaceholderText('Jane Doe'), 'Bob');
    fireEvent.changeText(screen.getByPlaceholderText('1990-05-15'), '1985-03-10');
    fireEvent.changeText(screen.getByPlaceholderText('US'), 'CA');

    fireEvent.press(screen.getByText('Next'));

    const state = useOnboardingStore.getState();
    expect(state.draft.profile.fullName).toBe('Bob');
    expect(state.draft.profile.dateOfBirth).toBe('1985-03-10');
    expect(state.draft.profile.nationality).toBe('CA');
    expect(state.currentStep).toBe(1);
  });

  it('shows validation errors and does not advance when inputs are invalid', () => {
    render(<ProfileStep />);

    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('Full name is required')).toBeTruthy();
    expect(screen.getByText('Date of birth is required')).toBeTruthy();
    expect(screen.getByText('Nationality is required')).toBeTruthy();
    expect(useOnboardingStore.getState().currentStep).toBe(0);
  });
});
