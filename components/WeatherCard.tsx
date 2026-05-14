import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/colors";
import { WeatherData, RiskAssessment } from "../services/weather";

interface Props {
  weather: WeatherData;
  risk: RiskAssessment;
}

function getStockRecommendation(weather: WeatherData): { percentage: number; reason: string } {
  let percentage = 100;
  const reasons: string[] = [];

  if (weather.windSpeed > 25) {
    percentage -= 40;
    reasons.push("very high winds");
  } else if (weather.windSpeed > 15) {
    percentage -= 20;
    reasons.push("strong winds");
  }

  if (weather.rainChance > 80) {
    percentage -= 30;
    reasons.push("heavy rain expected");
  } else if (weather.rainChance > 50) {
    percentage -= 15;
    reasons.push("rain likely");
  }

  if (weather.temp < 5) {
    percentage -= 10;
    reasons.push("very cold temperatures");
  } else if (weather.temp > 20) {
    percentage += 10;
    reasons.push("warm sunny weather");
  }

  percentage = Math.max(20, Math.min(120, percentage));

  const reason = reasons.length > 0
    ? `Due to ${reasons.join(" and ")}`
    : "Conditions look great today";

  return { percentage, reason };
}

export default function WeatherCard({ weather, risk }: Props) {
  const { percentage, reason } = getStockRecommendation(weather);
  const barColor = percentage >= 90 ? COLORS.success : percentage >= 60 ? COLORS.warning : COLORS.danger;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📦 Stock Recommendation</Text>
      <View style={styles.percentageRow}>
        <Text style={[styles.percentage, { color: barColor }]}>{percentage}%</Text>
        <Text style={styles.ofUsual}>of usual stock</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.reason}>{reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16 },
  title: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  percentageRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginBottom: 10 },
  percentage: { fontSize: FONTS.size.xxxl, fontWeight: "700" },
  ofUsual: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginBottom: 6 },
  barBg: { height: 8, backgroundColor: COLORS.gray200, borderRadius: 4, marginBottom: 10 },
  barFill: { height: 8, borderRadius: 4 },
  reason: { fontSize: FONTS.size.sm, color: COLORS.textMuted, lineHeight: 20 },
});