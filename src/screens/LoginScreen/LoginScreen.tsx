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

import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { useTheme } from '../../hooks/useTheme';
import { validateLoginFields } from '../../lib/validation';
import { useAuthStore } from '../../store/authStore';
import type { LoginFieldErrors } from './types';

export function LoginScreen() {
  const t = useTheme();
  const { status, error: serverError, sessionExpiredMessage, login } =
    useAuthStore();

  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

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
        style={[
          styles.root,
          {
            backgroundColor: t.colors.background,
            paddingHorizontal: t.spacing.lg,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: t.colors.surface,
              borderRadius: t.radius.md,
              padding: t.spacing.lg,
            },
          ]}
        >
          <Text style={[t.typography.hero, { color: t.colors.text }]}>Sign In</Text>
          <Text
            style={[
              t.typography.subtitle,
              { color: t.colors.textMuted, marginTop: t.spacing.xs },
            ]}
          >
            Enter your credentials to continue
          </Text>

          <View style={{ height: t.spacing.lg }} />

          {sessionExpiredMessage ? (
            <Text
              style={[
                t.typography.caption,
                {
                  color: t.colors.danger,
                  marginBottom: t.spacing.md,
                  textAlign: 'center',
                },
              ]}
              accessibilityRole="alert"
            >
              {sessionExpiredMessage}
            </Text>
          ) : null}

          <ThemedTextInput
            label="Email"
            placeholder="jane.doe@example.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (fieldErrors.email)
                setFieldErrors((p) => ({ ...p, email: undefined }));
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
              style={[
                t.typography.caption,
                {
                  color: t.colors.danger,
                  marginTop: t.spacing.md,
                  textAlign: 'center',
                },
              ]}
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
  root: { flex: 1, justifyContent: 'center' },
  card: { width: '100%' },
});
