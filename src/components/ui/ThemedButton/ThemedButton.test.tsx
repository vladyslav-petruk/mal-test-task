import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemedButton } from './ThemedButton';

describe('ThemedButton', () => {
  it('renders the title text', () => {
    render(<ThemedButton title="Submit" onPress={jest.fn()} />);

    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ThemedButton title="Go" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<ThemedButton title="Go" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(<ThemedButton title="Go" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when loading', () => {
    render(<ThemedButton title="Go" onPress={jest.fn()} loading />);

    expect(screen.queryByText('Go')).toBeNull();
  });
});
