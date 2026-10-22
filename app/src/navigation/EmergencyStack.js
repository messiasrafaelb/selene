import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmergencyScreen from "../screens/emergency/EmergencyScreen";
import NewContactScreen from "../screens/emergency/NewContactScreen";

const Stack = createNativeStackNavigator();

export default function EmergencyStack({ onExitEmergency }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC5F7B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="EmergencyHome" options={{ title: "Apoio e Emergência" }}>
        {(props) => <EmergencyScreen {...props} onExitEmergency={onExitEmergency} />}
      </Stack.Screen>
      <Stack.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{ title: "Novo Contato de Segurança" }}
      />
    </Stack.Navigator>
  );
}
