import { render, screen } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
  it('renders starter text', () => {
    render(<App />);

    expect(
      screen.getByText('Open up App.tsx to start working on your app!')
    ).toBeTruthy();
  });
});

