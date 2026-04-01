import { render, screen } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
  it('shows auth stack when logged out', () => {
    render(<App />);

    expect(screen.getByText('Sign In')).toBeTruthy();
  });
});

