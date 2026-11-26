import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AuthLayout from '../../components/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeading from '../../components/ScreenHeading';
import TextLink from '../../components/TextLink';
import { colors, fonts, spacing } from '../../constants/theme';
import { sendPasswordReset } from '../../services/authService';
import { getPasswordResetErrorMessage } from '../../utils/authErrors';

const RESEND_COOLDOWN_SECONDS = 30;

export default function ResetLinkSentScreen({ navigation, route }) {
  const email = route.params?.email ?? 'your email address';
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cooldownSeconds]);

  const handleResend = async () => {
    if (resendLoading || cooldownSeconds > 0) {
      return;
    }

    setResendLoading(true);
    setNotice(null);
    setError(null);

    try {
      await sendPasswordReset(email);
      setNotice('If an account exists for this address, a new reset link has been requested.');
    } catch (resetError) {
      setError(getPasswordResetErrorMessage(resetError));
    } finally {
      setResendLoading(false);
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    }
  };

  const resendTitle = resendLoading
    ? 'Sending reset link…'
    : cooldownSeconds > 0
      ? `Resend in ${cooldownSeconds}s`
      : 'Resend reset link';

  return (
    <AuthLayout centered>
      <ScreenHeading
        eyebrow="Check your inbox"
        title="You've got mail."
        subtitle={`If an account exists for ${email}, we'll send a password reset link. Follow the link to choose a new password.`}
      />

      <View style={styles.actions}>
        <PrimaryButton
          title={resendTitle}
          onPress={handleResend}
          loading={resendLoading}
          disabled={cooldownSeconds > 0}
        />
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextLink
          title="Back to log in"
          onPress={() => navigation.popTo('Login')}
          style={styles.back}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  notice: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: 'center',
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.error,
    textAlign: 'center',
  },
  back: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
});
