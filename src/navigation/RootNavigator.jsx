import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../constants/theme";
import useAuth from "../hooks/useAuth";
import HomeScreen from "../screens/HomeScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetLinkSentScreen from "../screens/auth/ResetLinkSentScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ResetLinkSent" component={ResetLinkSentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
