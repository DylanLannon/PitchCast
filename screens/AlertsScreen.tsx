import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../constants/colors";

const ALERTS = [
  {
    id: 1,
    market: "Stokesley Farmers Market",
    day: "Tomorrow - Saturday",
    type: "wind",
    emoji: "💨",
    severity: "moderate",
    message: "Wind speeds of 18mph expected. Monitor conditions before setting up.",
    color: COLORS.warning,
    bg: "#FFF7ED",
  },
  {
    id: 2,
    market: "Middlesbrough Market",
    day: "Wednesday",
    type: "rain",
    emoji: "🌧️",
    severity: "high",
    message: "Heavy rain forecast all day. Footfall likely to be significantly reduced.",
    color: COLORS.danger,
    bg: "#FEF2F2",
  },
  {
    id: 3,
    market: "Crathorne Hall Market",
    day: "Sunday",
    type: "good",
    emoji: "☀️",
    severity: "low",
    message: "Great conditions expected. High footfall predicted.",
    color: COLORS.success,
    bg: "#F0FDF4",
  },
];

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.subtitle}>Next 7 days</Text>
        </View>

        {ALERTS.map((alert) => (
          <View key={alert.id} style={[styles.card, { backgroundColor: alert.bg }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{alert.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.marketName}>{alert.market}</Text>
                <Text style={styles.day}>{alert.day}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: alert.color }]}>
                <Text style={styles.badgeText}>{alert.severity.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={[styles.message, { color: alert.color }]}>{alert.message}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
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