import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigation/RootNavigation";
import { clearAuthToken } from "./src/services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);

  function handleLogin(authenticatedUser) {
    setCurrentUser(
      authenticatedUser || {
        id: 1,
        name: "Selena",
        email: "selena@gmail.com",
        pin: "1800",
      }
    );
  }

  function handleLogout() {
    clearAuthToken();
    setEmergencyMode(false);
    setCurrentUser(null);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigation
          authenticated={Boolean(currentUser)}
          currentUser={currentUser}
          emergencyMode={emergencyMode}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onEnterEmergency={() => setEmergencyMode(true)}
          onExitEmergency={() => setEmergencyMode(false)}
        />
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
