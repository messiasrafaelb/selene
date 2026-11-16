import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CycleHistoryScreen from "../screens/cycle/CycleHistoryScreen";
import NewCycleScreen from "../screens/cycle/NewCycleScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack({ currentUser }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC5F7B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="CycleHistoryList" options={{ title: "Histórico de Ciclos" }}>
        {(props) => <CycleHistoryScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name="NewCycle" options={{ title: "Registrar Ciclo" }}>
        {(props) => <NewCycleScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
