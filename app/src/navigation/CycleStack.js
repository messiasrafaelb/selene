import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CycleHomeScreen from "../screens/cycle/CycleHomeScreen";
import NewCycleScreen from "../screens/cycle/NewCycleScreen";

const Stack = createNativeStackNavigator();

export default function CycleStack({ onEnterEmergency, onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC5F7B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="CycleHome" options={{ headerShown: false }}>
        {(props) => (
          <CycleHomeScreen
            {...props}
            onEnterEmergency={onEnterEmergency}
            onLogout={onLogout}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="NewCycle"
        component={NewCycleScreen}
        options={{ title: "Registrar Ciclo" }}
      />
    </Stack.Navigator>
  );
}
