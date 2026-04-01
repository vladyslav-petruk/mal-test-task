import { render, screen } from '@testing-library/react-native';

import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders all 5 step labels', () => {
    render(<StepIndicator currentStep={0} />);

    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Document')).toBeTruthy();
    expect(screen.getByText('Selfie')).toBeTruthy();
    expect(screen.getByText('Address')).toBeTruthy();
    expect(screen.getByText('Review')).toBeTruthy();
  });

  it('shows step number for upcoming steps', () => {
    render(<StepIndicator currentStep={0} />);

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows checkmark for completed steps', () => {
    render(<StepIndicator currentStep={2} />);

    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks).toHaveLength(2);
  });

  it('shows current step number for active step', () => {
    render(<StepIndicator currentStep={2} />);

    expect(screen.getByText('3')).toBeTruthy();
  });
});
