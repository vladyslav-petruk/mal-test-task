import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/themeStore';

const { width = 0, height = 0 } = Dimensions.get('window');

/** In Jest `initialWindowMetrics` is null (no native module), so we provide a fallback. */
const fallbackMetrics = {
  frame: { x: 0, y: 0, width, height },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function App() {
  const themeMode = useThemeStore((s) => s.mode);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics ?? fallbackMetrics}>
      <RootNavigator />
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}
