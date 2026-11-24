import { useState } from 'react';
import { StyleSheet } from 'react-native';

import AuthLayout from '../../components/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeading from '../../components/ScreenHeading';
import TextField from '../../components/TextField';
import TextLink from '../../components/TextLink';
import { spacing } from '../../constants/theme';
import { sendPasswordReset } from '../../services/authService';
import { validateEmail } from '../../utils/validation';

export default function ForgotPasswordScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) {
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      navigation.replace('ResetLinkSent', { email: email.trim() });
    } catch {
      setError('Could not send the link. Try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout centered>
      <ScreenHeading
        eyebrow="Let's get you back in"
        title="Forgot your password?"
        subtitle="No worries. We'll send a reset link to your email address."
      />

      <TextField
        label="Email address"
        value={email}
        onChangeText={setEmail}
        error={error}
        placeholder="alex@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={handleSend}
        style={styles.field}
      />

      <PrimaryButton title="Send reset link" onPress={handleSend} loading={loading} />

      <TextLink
        title="Back to log in"
        onPress={() => navigation.popTo('Login')}
        style={styles.back}
        textStyle={styles.backText}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
  back: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  backText: {
    fontSize: 15,
  },
});
