import { useState } from 'react';

import AuthLayout from '../../components/AuthLayout';
import InlinePrompt from '../../components/InlinePrompt';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeading from '../../components/ScreenHeading';
import TextField from '../../components/TextField';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const nextErrors = {
      name: name.trim() ? null : 'Enter your name.',
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: confirmPassword === password ? null : 'Passwords do not match.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
    } catch {
      setErrors({ email: 'Could not create the account. Try again.' });
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScreenHeading
        eyebrow="Let's get you started"
        title={'Create your\naccount.'}
        subtitle="Plan every trip in one place."
      />

      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        placeholder="Alex"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
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
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />
      <TextField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <PrimaryButton title="Sign up" onPress={handleRegister} loading={loading} />

      <InlinePrompt
        text="Already have an account?"
        linkTitle="Log in"
        onPress={() => navigation.popTo('Login')}
      />
    </AuthLayout>
  );
}
