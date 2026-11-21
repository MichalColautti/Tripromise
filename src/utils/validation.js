const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateEmail(email) {
  if (!email.trim()) {
    return 'Enter your email address.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function validatePassword(password) {
  if (!password) {
    return 'Enter your password.';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}
