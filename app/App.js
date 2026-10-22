import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigation/RootNavigation";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  function handleLogout() {
    setEmergencyMode(false);
    setAuthenticated(false);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigation
          authenticated={authenticated}
          emergencyMode={emergencyMode}
          onLogin={() => setAuthenticated(true)}
          onLogout={handleLogout}
          onEnterEmergency={() => setEmergencyMode(true)}
          onExitEmergency={() => setEmergencyMode(false)}
        />
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
