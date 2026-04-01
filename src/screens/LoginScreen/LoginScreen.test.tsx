import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuthStore } from '../../store/authStore';
import { LoginScreen } from './LoginScreen';

beforeEach(() => {
  useAuthStore.setState({
    status: 'logged_out',
    user: null,
    session: null,
    error: null,
    sessionExpiredMessage: null,
  });
});

describe('LoginScreen', () => {
  it('renders the sign-in form', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(screen.getByText('Enter your credentials to continue')).toBeTruthy();
    expect(screen.getByText('Log In')).toBeTruthy();
  });

  it('shows validation error for empty email', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('shows validation error for invalid email format', () => {
    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('jane.doe@example.com'), 'bad-email');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Enter a valid email')).toBeTruthy();
  });

  it('shows validation error for empty password', () => {
    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('jane.doe@example.com'), 'a@b.com');
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  it('clears field error when user types', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText('Log In'));
    expect(screen.getByText('Email is required')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('jane.doe@example.com'), 'a');
    expect(screen.queryByText('Email is required')).toBeNull();
  });

  it('calls login with valid credentials', () => {
    const loginSpy = jest.fn();
    useAuthStore.setState({ login: loginSpy });

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('jane.doe@example.com'), 'jane@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secret');
    fireEvent.press(screen.getByText('Log In'));

    expect(loginSpy).toHaveBeenCalledWith('jane@test.com', 'secret');
  });

  it('displays session expired message when set', () => {
    useAuthStore.setState({
      sessionExpiredMessage: 'Session expired. Please sign in again.',
    });

    render(<LoginScreen />);

    expect(
      screen.getByText('Session expired. Please sign in again.'),
    ).toBeTruthy();
  });

  it('displays a server error from the store', () => {
    useAuthStore.setState({ status: 'logged_out', error: 'Invalid credentials' });

    render(<LoginScreen />);

    expect(screen.getByText('Invalid credentials')).toBeTruthy();
  });

  it('disables the button when logging in', async () => {
    useAuthStore.setState({ status: 'logging_in' });

    render(<LoginScreen />);

    const button = screen.getByRole('button');
    await waitFor(() => {
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });
});
