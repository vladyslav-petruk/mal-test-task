import { fireEvent, render, screen } from '@testing-library/react-native';

import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { SettingsScreen } from './SettingsScreen';

beforeEach(() => {
  useAuthStore.setState({
    status: 'logged_in',
    user: null,
    session: null,
    error: null,
  });
  useThemeStore.setState({ mode: 'light' });
});

describe('SettingsScreen', () => {
  it('renders the dark mode toggle', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Dark Mode')).toBeTruthy();
  });

  it('toggles theme mode when switch is pressed', () => {
    render(<SettingsScreen />);

    const toggle = screen.getByRole('switch');
    expect(toggle.props.value).toBe(false);

    fireEvent(toggle, 'valueChange', true);
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('calls logout when Log Out is pressed', () => {
    const logoutSpy = jest.fn();
    useAuthStore.setState({ logout: logoutSpy });

    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Log Out'));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
