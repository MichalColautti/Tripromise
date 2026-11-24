import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AuthLayout from '../../components/AuthLayout';
import InlinePrompt from '../../components/InlinePrompt';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeading from '../../components/ScreenHeading';
import TextField from '../../components/TextField';
import TextLink from '../../components/TextLink';
import { spacing } from '../../constants/theme';
import useAuth from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';

export default function LoginScreen({ navigation }) {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    const nextErrors = {
      email: validateEmail(email),
      password: password ? null : 'Enter your password.',
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setLoading(true);
    try {
      await logIn(email, password);
    } catch {
      setErrors({ password: 'Incorrect email or password.' });
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer="A little space. A fresh start.">
      <ScreenHeading
        eyebrow="Good to see you again"
        title={'Welcome\nback.'}
        subtitle="Log in to pick up where you left off."
      />

      <TextField
        label="Email address"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="alex@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleLogIn}
        style={styles.passwordField}
      />

      <View style={styles.forgotRow}>
        <TextLink
          title="Forgot password?"
          onPress={() => navigation.navigate('ForgotPassword', { email })}
          textStyle={styles.forgotText}
        />
      </View>

      <PrimaryButton title="Log in" onPress={handleLogIn} loading={loading} />

      <InlinePrompt
        text="New to Tripromise?"
        linkTitle="Create an account"
        onPress={() => navigation.navigate('Register')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  passwordField: {
    marginBottom: spacing.md,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontSize: 13,
  },
});
