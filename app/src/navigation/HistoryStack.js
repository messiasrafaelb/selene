import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CycleHistoryScreen from "../screens/cycle/CycleHistoryScreen";
import NewCycleScreen from "../screens/cycle/NewCycleScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC5F7B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="CycleHistoryList"
        component={CycleHistoryScreen}
        options={{ title: "Histórico de Ciclos" }}
      />
      <Stack.Screen
        name="NewCycle"
        component={NewCycleScreen}
        options={{ title: "Registrar Ciclo" }}
      />
    </Stack.Navigator>
  );
}
