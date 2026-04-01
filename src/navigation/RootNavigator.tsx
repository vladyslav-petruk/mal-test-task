import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isLoggedIn = useAuthStore(
    (s) => s.status === 'logged_in' || s.status === 'refreshing',
  );

  return (
    <NavigationContainer>
      <RootStack.Navigator
        key={isLoggedIn ? 'app' : 'auth'}
        screenOptions={{ headerShown: false }}
      >
        {isLoggedIn ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
