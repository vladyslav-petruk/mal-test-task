import { render, screen } from '@testing-library/react-native';

import { ThemedTextInput } from './ThemedTextInput';

describe('ThemedTextInput', () => {
  it('renders the label when provided', () => {
    render(<ThemedTextInput label="Email" />);

    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders the error message when provided', () => {
    render(<ThemedTextInput error="Required" />);

    expect(screen.getByText('Required')).toBeTruthy();
  });

  it('does not render label or error when omitted', () => {
    render(<ThemedTextInput placeholder="Type here" />);

    expect(screen.queryByText('Email')).toBeNull();
    expect(screen.queryByText('Required')).toBeNull();
  });

  it('renders placeholder text', () => {
    render(<ThemedTextInput placeholder="Enter email" />);

    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });
});
