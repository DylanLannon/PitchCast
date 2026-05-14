import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { getForecast, assessRisk, ForecastDay } from "../services/weather";

const STOKESLEY = { lat: 54.4618, lon: -1.3318 };

function getRiskFromForecast(day: ForecastDay) {
  if (day.windSpeed > 25 || day.rainChance > 80) return { emoji: "🔴", color: COLORS.danger, label: "High Risk" };
  if (day.windSpeed > 15 || day.rainChance > 50) return { emoji: "⚠️", color: COLORS.warning, label: "Moderate" };
  return { emoji: "✅", color: COLORS.success, label: "Good" };
}

function getStockPercent(day: ForecastDay): number {
  let pct = 100;
  if (day.windSpeed > 25) pct -= 40;
  else if (day.windSpeed > 15) pct -= 20;
  if (day.rainChance > 80) pct -= 30;
  else if (day.rainChance > 50) pct -= 15;
  if (day.temp < 5) pct -= 10;
  else if (day.temp > 20) pct += 10;
  return Math.max(20, Math.min(120, pct));
}

export default function ForecastScreen() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForecast(STOKESLEY.lat, STOKESLEY.lon)
      .then(setForecast)
      .catch(() => {
        setForecast([
          { date: "2026-05-14", day: "Wed", temp: 9, windSpeed: 5, rainChance: 20, description: "clear sky", icon: "01d" },
          { date: "2026-05-15", day: "Thu", temp: 11, windSpeed: 12, rainChance: 40, description: "partly cloudy", icon: "02d" },
          { date: "2026-05-16", day: "Fri", temp: 8, windSpeed: 22, rainChance: 70, description: "heavy rain", icon: "10d" },
          { date: "2026-05-17", day: "Sat", temp: 13, windSpeed: 8, rainChance: 15, description: "sunny", icon: "01d" },
          { date: "2026-05-18", day: "Sun", temp: 15, windSpeed: 6, rainChance: 10, description: "clear sky", icon: "01d" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading forecast...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>5 Day Forecast</Text>
          <Text style={styles.subtitle}>📍 Stokesley Market</Text>
        </View>

        {forecast.map((day, i) => {
          const risk = getRiskFromForecast(day);
          const stock = getStockPercent(day);
          const barColor = stock >= 90 ? COLORS.success : stock >= 60 ? COLORS.warning : COLORS.danger;

          return (
            <View key={i} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day.day}</Text>
                  <Text style={styles.description}>
                    {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
                  </Text>
                </View>
                <View style={styles.stats}>
                  <Text style={styles.stat}>🌡️ {day.temp}°C</Text>
                  <Text style={styles.stat}>💨 {day.windSpeed}mph</Text>
                  <Text style={styles.stat}>🌧️ {day.rainChance}%</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: risk.color }]}>
                  <Text style={styles.badgeText}>{risk.emoji} {risk.label}</Text>
                </View>
              </View>

              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>📦 Stock: </Text>
                <Text style={[styles.stockValue, { color: barColor }]}>{stock}%</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${Math.min(stock, 100)}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 4 },
  card: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dayInfo: { flex: 1 },
  dayName: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text },
  description: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  stats: { alignItems: "flex-end", marginRight: 12, gap: 2 },
  stat: { fontSize: FONTS.size.xs, color: COLORS.textMuted },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: COLORS.white, fontSize: FONTS.size.xs, fontWeight: "700" },
  stockRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  stockLabel: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  stockValue: { fontSize: FONTS.size.sm, fontWeight: "700", minWidth: 40 },
  barBg: { flex: 1, height: 6, backgroundColor: COLORS.gray200, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
});