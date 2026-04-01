export function validateLoginFields(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = 'Enter a valid email';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Must be at least 4 characters';
  }
  return errors;
}
