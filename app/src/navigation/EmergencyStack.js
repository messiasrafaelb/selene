import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import EmergencyScreen from "../screens/emergency/EmergencyScreen";
import NewContactScreen from "../screens/emergency/NewContactScreen";

const Stack = createNativeStackNavigator();

export default function EmergencyStack({ currentUser, onExitEmergency }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC5F7B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerQuickExit}
            onPress={onExitEmergency}
            activeOpacity={0.85}
          >
            <Ionicons name="exit-outline" size={16} color="#EC5F7B" />
            <Text style={styles.headerQuickExitText}>Saída Rápida</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="EmergencyHome" options={{ title: "Apoio e Emergência" }}>
        {(props) => (
          <EmergencyScreen
            {...props}
            currentUser={currentUser}
            onExitEmergency={onExitEmergency}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="NewContact" options={{ title: "Contato de Segurança" }}>
        {(props) => (
          <NewContactScreen
            {...props}
            currentUser={currentUser}
            onExitEmergency={onExitEmergency}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerQuickExit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  headerQuickExitText: {
    color: "#EC5F7B",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
});
