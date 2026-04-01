import '@testing-library/jest-native/extend-expect';

jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'), // eslint-disable-line @typescript-eslint/no-require-imports
);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

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

