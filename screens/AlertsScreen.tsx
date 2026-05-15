import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { getCurrentWeather, getForecast, WeatherData } from "../services/weather";
import { supabase } from "../services/supabase";

interface Market {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  trading_days: string[];
  pitch_prepaid: boolean;
}

interface Alert {
  marketName: string;
  day: string;
  emoji: string;
  severity: string;
  message: string;
  color: string;
  bg: string;
}

function getAlertFromWeather(weather: { windSpeed: number; rainChance: number; temp: number; description: string }, dayLabel: string, marketName: string, prepaid: boolean): Alert {
  const isHighWind = weather.windSpeed > 25;
  const isHighRain = weather.rainChance > 80;
  const isModWind = weather.windSpeed > 15;
  const isModRain = weather.rainChance > 50;

  if (isHighWind || isHighRain) {
    return {
      marketName,
      day: dayLabel,
      emoji: isHighWind ? "💨" : "🌧️",
      severity: "HIGH",
      message: prepaid
        ? `Tough conditions expected. You're committed — focus on bringing reduced stock to minimise waste.`
        : `Poor conditions. Consider whether it's worth attending — footfall likely to be very low.`,
      color: COLORS.danger,
      bg: "#FEF2F2",
    };
  }
  if (isModWind || isModRain) {
    return {
      marketName,
      day: dayLabel,
      emoji: isModWind ? "💨" : "🌦️",
      severity: "MODERATE",
      message: `Mixed conditions expected. Bring around 75-80% of usual stock and monitor the morning forecast.`,
      color: COLORS.warning,
      bg: "#FFF7ED",
    };
  }
  return {
    marketName,
    day: dayLabel,
    emoji: "☀️",
    severity: "GOOD",
    message: `Great conditions forecast. High footfall likely — make sure you have enough stock!`,
    color: COLORS.success,
    bg: "#F0FDF4",
  };
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const { data: markets } = await supabase.from("markets").select("*");
    if (!markets || markets.length === 0) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    const allAlerts: Alert[] = [];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (const market of markets) {
      try {
        const forecast = await getForecast(market.lat, market.lon);
        for (const day of forecast) {
          const dayName = dayNames[new Date(day.date).getDay()];
          if (market.trading_days.includes(dayName)) {
            allAlerts.push(getAlertFromWeather(day, `${day.day} — ${market.location}`, market.name, market.pitch_prepaid));
          }
        }
        const todayWeather = await getCurrentWeather(market.lat, market.lon);
        const today = dayNames[new Date().getDay()];
        if (market.trading_days.includes(today)) {
          allAlerts.unshift(getAlertFromWeather(
            { windSpeed: todayWeather.windSpeed, rainChance: todayWeather.rainChance, temp: todayWeather.temp, description: todayWeather.description },
            `Today`,
            market.name,
            market.pitch_prepaid
          ));
        }
      } catch (e) {
        console.log("Error fetching alerts for market:", market.name);
      }
    }

    setAlerts(allAlerts);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.subtitle}>Based on your trading days</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Checking your markets...</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>No alerts yet</Text>
            <Text style={styles.emptyDesc}>Add markets with trading days to receive personalised weather alerts</Text>
          </View>
        ) : (
          alerts.map((alert, i) => (
            <View key={i} style={[styles.card, { backgroundColor: alert.bg }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.emoji}>{alert.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.marketName}>{alert.marketName}</Text>
                  <Text style={styles.day}>{alert.day}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: alert.color }]}>
                  <Text style={styles.badgeText}>{alert.severity}</Text>
                </View>
              </View>
              <Text style={[styles.message, { color: alert.color }]}>{alert.message}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  loadingContainer: { alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  loadingText: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 4 },
  empty: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 22 },
  card: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  emoji: { fontSize: 28, marginRight: 12 },
  cardInfo: { flex: 1 },
  marketName: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  day: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: COLORS.white, fontSize: FONTS.size.xs, fontWeight: "700" },
  message: { fontSize: FONTS.size.sm, lineHeight: 20 },
});