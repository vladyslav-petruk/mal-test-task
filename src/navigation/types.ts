import type { NavigatorScreenParams } from '@react-navigation/native';

/** Auth stack — only Login when logged out. */
export type AuthStackParamList = {
  Login: undefined;
};

/** App stack — Home, onboarding, settings. */
export type AppStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  Settings: undefined;
};

/** Root: either auth or main app (implementation wires one navigator). */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
