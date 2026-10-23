import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import DisguiseTabs from "./DisguiseTabs";
import EmergencyStack from "./EmergencyStack";

const AuthStack = createNativeStackNavigator();

export default function RootNavigation({
  authenticated,
  emergencyMode,
  onLogin,
  onLogout,
  onEnterEmergency,
  onExitEmergency,
}) {
  if (!authenticated) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={onLogin} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </AuthStack.Navigator>
    );
  }

  if (emergencyMode) {
    return <EmergencyStack onExitEmergency={onExitEmergency} />;
  }

  return (
    <DisguiseTabs
      onEnterEmergency={onEnterEmergency}
      onLogout={onLogout}
    />
  );
}
