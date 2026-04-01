import { act, render, screen, waitFor } from '@testing-library/react-native';

import { SESSION_EXPIRED_MESSAGE, useAuthStore } from '../store/authStore';
import { RootNavigator } from './RootNavigator';

describe('RootNavigator route guard', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    useAuthStore.setState({
      status: 'logged_out',
      user: null,
      session: null,
      error: null,
      sessionExpiredMessage: null,
    });
  });

  it('shows auth stack when logged out', async () => {
    render(<RootNavigator />);
    expect(await screen.findByText('Sign In')).toBeTruthy();
  });

  it('redirects to Login automatically when session expires while app is open', async () => {
    jest.useFakeTimers();

    useAuthStore.setState({
      status: 'logged_in',
      user: { id: 'USR-001', email: 'jane.doe@example.com', fullName: 'Jane Doe' },
      session: {
        accessToken: 'access_guard_test',
        refreshToken: 'refresh_guard_test',
        expiresAt: new Date(Date.now() + 1_000).toISOString(),
      },
      error: null,
      sessionExpiredMessage: null,
    });

    render(<RootNavigator />);
    expect(await screen.findByText('Start Onboarding')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1_100);
    });

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeTruthy();
    });
    expect(screen.getByText(SESSION_EXPIRED_MESSAGE)).toBeTruthy();

  });
});
