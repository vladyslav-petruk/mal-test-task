import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-screens', () => {
  /* eslint-disable @typescript-eslint/no-require-imports -- Jest mock factory must use require */
  const React = require('react');
  const { View } = require('react-native');
  const Stack = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);
  return {
    enableScreens: jest.fn(),
    enableFreeze: jest.fn(),
    screensEnabled: () => true,
    freezeEnabled: () => false,
    compatibilityFlags: {},
    featureFlags: {},
    ScreenStack: Stack,
    ScreenStackItem: Stack,
    Screen: Stack,
    ScreenContainer: Stack,
  };
});

