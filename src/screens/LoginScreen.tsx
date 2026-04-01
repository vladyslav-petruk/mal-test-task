import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  type TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ThemedButton } from '../components/ui/ThemedButton';
import { ThemedTextInput } from '../components/ui/ThemedTextInput';
import { useTheme } from '../hooks/useTheme';
import { validateLoginFields } from '../lib/validation';
import { useAuthStore } from '../store/authStore';

export function LoginScreen() {
  const t = useTheme();
  const { status, error: serverError, login } = useAuthStore();

  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const isLoading = status === 'logging_in';

  const handleLogin = () => {
    const errors = validateLoginFields(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    login(email, password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.root, { backgroundColor: t.colors.background }]}
      >
        <View style={[styles.card, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.lg }]}>
          <Text style={[styles.title, { color: t.colors.text }]}>Sign In</Text>
          <Text style={[styles.subtitle, { color: t.colors.textMuted }]}>
            Enter your credentials to continue
          </Text>

          <View style={{ height: t.spacing.lg }} />

          <ThemedTextInput
            label="Email"
            placeholder="jane.doe@example.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            error={fieldErrors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!isLoading}
          />

          <View style={{ height: t.spacing.md }} />

          <ThemedTextInput
            ref={passwordRef}
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (fieldErrors.password)
                setFieldErrors((p) => ({ ...p, password: undefined }));
            }}
            error={fieldErrors.password}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!isLoading}
          />

          {serverError ? (
            <Text
              style={[styles.serverError, { color: t.colors.danger, marginTop: t.spacing.md }]}
            >
              {serverError}
            </Text>
          ) : null}

          <View style={{ height: t.spacing.lg }} />

          <ThemedButton
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { width: '100%' },
  title: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  serverError: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
