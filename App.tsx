import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import HomeScreen from "./screens/HomeScreen";
import MarketsScreen from "./screens/MarketsScreen";
import AlertsScreen from "./screens/AlertsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ForecastScreen from "./screens/ForecastScreen";
import LoginScreen from "./screens/LoginScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import SalesLogScreen from "./screens/SalesLogScreen";
import { COLORS } from "./constants/colors";
import { supabase } from "./services/supabase";

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkIfNewUser(session);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkIfNewUser(session);
    });
  }, []);

  const checkIfNewUser = async (session: Session) => {
    const hasBusinessName = session.user.user_metadata?.business_name;
    if (!hasBusinessName) setIsNewUser(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
      </SafeAreaProvider>
    );
  }

  if (isNewUser) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={() => setIsNewUser(false)} />
      </SafeAreaProvider>
    );
  }

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
            name="Sales"
            component={SalesLogScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💷</Text>,
              tabBarLabel: "Sales",
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