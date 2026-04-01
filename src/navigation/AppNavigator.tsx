import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../hooks/useTheme';
import { HomeScreen, OnboardingScreen, SettingsScreen } from '../screens';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const t = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: t.colors.surface },
        headerTintColor: t.colors.text,
        headerTitleStyle: { color: t.colors.text },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ title: 'Onboarding' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
