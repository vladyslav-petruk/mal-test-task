import type { ViewStyle } from 'react-native';

export type ThemedButtonVariant = 'primary' | 'outline';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ThemedButtonVariant;
  style?: ViewStyle;
};
