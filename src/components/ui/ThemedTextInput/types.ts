import type { TextInputProps } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
};
