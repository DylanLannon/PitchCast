import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { getForecast, ForecastDay } from "../services/weather";
import { supabase } from "../services/supabase";

interface Market {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

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
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    const { data } = await supabase.from("markets").select("id, name, lat, lon").order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setMarkets(data);
      setSelectedMarket(data[0]);
      loadForecast(data[0].lat, data[0].lon);
    } else {
      loadForecast(54.4618, -1.3318);
    }
  };

  const loadForecast = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const data = await getForecast(lat, lon);
      setForecast(data);
    } catch {
      setForecast([
        { date: "2026-05-14", day: "Wed", temp: 9, windSpeed: 5, rainChance: 20, description: "clear sky", icon: "01d" },
        { date: "2026-05-15", day: "Thu", temp: 11, windSpeed: 12, rainChance: 40, description: "partly cloudy", icon: "02d" },
        { date: "2026-05-16", day: "Fri", temp: 8, windSpeed: 22, rainChance: 70, description: "heavy rain", icon: "10d" },
        { date: "2026-05-17", day: "Sat", temp: 13, windSpeed: 8, rainChance: 15, description: "sunny", icon: "01d" },
        { date: "2026-05-18", day: "Sun", temp: 15, windSpeed: 6, rainChance: 10, description: "clear sky", icon: "01d" },
      ]);
    }
    setLoading(false);
  };

  const selectMarket = (market: Market) => {
    setSelectedMarket(market);
    loadForecast(market.lat, market.lon);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>5 Day Forecast</Text>
          {selectedMarket && (
            <Text style={styles.subtitle}>📍 {selectedMarket.name}</Text>
          )}
          {!selectedMarket && (
            <Text style={styles.subtitle}>📍 Stokesley, North Yorkshire</Text>
          )}
        </View>

        {markets.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketPicker} contentContainerStyle={styles.marketPickerContent}>
            {markets.map(market => (
              <TouchableOpacity
                key={market.id}
                style={[styles.marketChip, selectedMarket?.id === market.id && styles.marketChipActive]}
                onPress={() => selectMarket(market)}
              >
                <Text style={[styles.marketChipText, selectedMarket?.id === market.id && styles.marketChipTextActive]}>
                  {market.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading forecast...</Text>
          </View>
        ) : (
          forecast.map((day, i) => {
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
          })
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
  marketPicker: { marginBottom: 8 },
  marketPickerContent: { paddingHorizontal: 16, gap: 8 },
  marketChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.white },
  marketChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  marketChipText: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  marketChipTextActive: { color: COLORS.white, fontWeight: "600" },
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