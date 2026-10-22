import LoginScreen from "../screens/LoginScreen";
import DisguiseTabs from "./DisguiseTabs";
import EmergencyStack from "./EmergencyStack";

export default function RootNavigation({
  authenticated,
  emergencyMode,
  onLogin,
  onLogout,
  onEnterEmergency,
  onExitEmergency,
}) {
  if (!authenticated) {
    return <LoginScreen onLogin={onLogin} />;
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
