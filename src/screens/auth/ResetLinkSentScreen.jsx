import AuthLayout from '../../components/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeading from '../../components/ScreenHeading';

export default function ResetLinkSentScreen({ navigation, route }) {
  const email = route.params?.email ?? 'your email address';

  return (
    <AuthLayout centered>
      <ScreenHeading
        eyebrow="Check your inbox"
        title="You've got mail."
        subtitle={`A password reset link has been sent to ${email}. Follow the link to choose a new password.`}
      />

      <PrimaryButton title="Back to log in" onPress={() => navigation.popTo('Login')} />
    </AuthLayout>
  );
}
