import { render, screen } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
  it('shows auth stack when logged out', async () => {
    render(<App />);

    expect(await screen.findByText('Sign In')).toBeTruthy();
  });
});
