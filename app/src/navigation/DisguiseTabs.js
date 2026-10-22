import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import CycleStack from "./CycleStack";
import HistoryStack from "./HistoryStack";

const Tab = createBottomTabNavigator();

export default function DisguiseTabs({ onEnterEmergency, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#FAD2DC",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#EC5F7B",
        tabBarInactiveTintColor: "#B08A95",
      }}
    >
      <Tab.Screen
        name="Hoje"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <CycleStack
            {...props}
            onEnterEmergency={onEnterEmergency}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Meus Ciclos"
        component={HistoryStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
