import AuthLayout from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeading from '../components/ScreenHeading';
import useAuth from '../hooks/useAuth';

export default function HomeScreen() {
  const { user, logOut } = useAuth();

  return (
    <AuthLayout centered>
      <ScreenHeading
        eyebrow="Your trips"
        title={`Hi, ${user.name}.`}
        subtitle="Your trips will show up here."
      />

      <PrimaryButton title="Log out" onPress={logOut} />
    </AuthLayout>
  );
}
