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

/**
 * Root switches between nested `AuthNavigator` and `AppNavigator` (never both mounted).
 */
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
