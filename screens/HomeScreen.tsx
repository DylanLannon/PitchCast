import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { getCurrentWeather, assessRisk, WeatherData, RiskAssessment } from "../services/weather";
import WeatherCard from "../components/WeatherCard";
import { supabase } from "../services/supabase";

interface Market {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  trading_days: string[];
  product_type: string;
  pitch_prepaid: boolean;
}

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [primaryMarket, setPrimaryMarket] = useState<Market | null>(null);
  const [businessName, setBusinessName] = useState("PitchCast");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.business_name) {
      setBusinessName(user.user_metadata.business_name);
    }

    const { data } = await supabase.from("markets").select("*").order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setMarkets(data);
      setPrimaryMarket(data[0]);
      try {
        const weatherData = await getCurrentWeather(data[0].lat, data[0].lon);
        setWeather(weatherData);
        setRisk(assessRisk(weatherData));
      } catch {
        const mock: WeatherData = { temp: 14, windSpeed: 12, windDeg: 180, description: "partly cloudy", icon: "02d", rainChance: 30, humidity: 65 };
        setWeather(mock);
        setRisk(assessRisk(mock));
      }
    } else {
      try {
        const weatherData = await getCurrentWeather(54.4618, -1.3318);
        setWeather(weatherData);
        setRisk(assessRisk(weatherData));
      } catch {
        const mock: WeatherData = { temp: 14, windSpeed: 12, windDeg: 180, description: "partly cloudy", icon: "02d", rainChance: 30, humidity: 65 };
        setWeather(mock);
        setRisk(assessRisk(mock));
      }
    }
    setLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.business}>{businessName}</Text>
          </View>
          <Text style={styles.logo}>⛅</Text>
        </View>

        {weather && risk && (
          <>
            <View style={[styles.alertCard, { backgroundColor: risk.color }]}>
              <Text style={styles.alertTitle}>Today's Forecast</Text>
              <Text style={styles.alertLocation}>📍 {primaryMarket ? primaryMarket.name : "Your location"}</Text>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{risk.emoji} {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk</Text>
              </View>
              <Text style={styles.alertDesc}>{risk.message}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🌡️</Text>
                <Text style={styles.statValue}>{weather.temp}°C</Text>
                <Text style={styles.statLabel}>Temp</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>💨</Text>
                <Text style={styles.statValue}>{weather.windSpeed}mph</Text>
                <Text style={styles.statLabel}>Wind</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>💧</Text>
                <Text style={styles.statValue}>{weather.humidity}%</Text>
                <Text style={styles.statLabel}>Humidity</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>☁️</Text>
                <Text style={styles.statValue}>{weather.rainChance}%</Text>
                <Text style={styles.statLabel}>Cloud</Text>
              </View>
            </View>

            <WeatherCard weather={weather} risk={risk} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Conditions</Text>
              <View style={styles.conditionCard}>
                <Text style={styles.conditionText}>
                  {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
                </Text>
              </View>
            </View>
          </>
        )}

        {markets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Markets</Text>
            {markets.map((market, i) => (
              <TouchableOpacity key={market.id} style={styles.marketCard} onPress={() => {
                setPrimaryMarket(market);
                getCurrentWeather(market.lat, market.lon)
                  .then(w => { setWeather(w); setRisk(assessRisk(w)); })
                  .catch(() => {});
              }}>
                <View>
                  <Text style={styles.marketName}>{market.name}</Text>
                  <Text style={styles.marketDay}>{market.trading_days.join(", ")}</Text>
                </View>
                <Text style={[styles.marketRisk, { color: primaryMarket?.id === market.id ? risk?.color : COLORS.gray400 }]}>
                  {primaryMarket?.id === market.id ? risk?.emoji + " " + risk?.level : "Tap to check"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {markets.length === 0 && (
          <View style={styles.section}>
            <View style={styles.noMarketsCard}>
              <Text style={styles.noMarketsEmoji}>🏪</Text>
              <Text style={styles.noMarketsText}>Add your first market to get personalised alerts</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: COLORS.white },
  greeting: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  business: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text },
  logo: { fontSize: 36 },
  alertCard: { margin: 16, borderRadius: 16, padding: 20 },
  alertTitle: { fontSize: FONTS.size.sm, color: COLORS.white, opacity: 0.8, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 },
  alertLocation: { fontSize: FONTS.size.md, color: COLORS.white, marginBottom: 12 },
  alertBadge: { backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  alertBadgeText: { color: COLORS.white, fontSize: FONTS.size.sm, fontWeight: "600" },
  alertDesc: { color: COLORS.white, opacity: 0.9, fontSize: FONTS.size.sm, lineHeight: 20 },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, alignItems: "center" },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: FONTS.size.sm, fontWeight: "700", color: COLORS.text },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  conditionCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16 },
  conditionText: { fontSize: FONTS.size.md, color: COLORS.text },
  marketCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  marketName: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  marketDay: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  marketRisk: { fontSize: FONTS.size.sm, fontWeight: "600" },
  noMarketsCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 24, alignItems: "center" },
  noMarketsEmoji: { fontSize: 36, marginBottom: 8 },
  noMarketsText: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center" },
});