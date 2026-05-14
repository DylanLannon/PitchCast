import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import MarketsScreen from "./screens/MarketsScreen";
import AlertsScreen from "./screens/AlertsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ForecastScreen from "./screens/ForecastScreen";
import { COLORS } from "./constants/colors";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray400,
            tabBarStyle: {
              backgroundColor: COLORS.white,
              borderTopColor: COLORS.gray200,
              borderTopWidth: 0.5,
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
              tabBarLabel: "Home",
            }}
          />
          <Tab.Screen
            name="Forecast"
            component={ForecastScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📅</Text>,
              tabBarLabel: "Forecast",
            }}
          />
          <Tab.Screen
            name="Markets"
            component={MarketsScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏪</Text>,
              tabBarLabel: "Markets",
            }}
          />
          <Tab.Screen
            name="Alerts"
            component={AlertsScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔔</Text>,
              tabBarLabel: "Alerts",
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⚙️</Text>,
              tabBarLabel: "Settings",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}