import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../constants/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon 👋</Text>
            <Text style={styles.business}>Butterfold Bakery</Text>
          </View>
          <Text style={styles.logo}>⛅</Text>
        </View>

        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>Tomorrow's Forecast</Text>
          <Text style={styles.alertLocation}>📍 Stokesley Market</Text>
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>⚠️ Moderate Risk</Text>
          </View>
          <Text style={styles.alertDesc}>Wind speeds of 18mph expected. Monitor conditions before setting up.</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌡️</Text>
            <Text style={styles.statValue}>14°C</Text>
            <Text style={styles.statLabel}>Temp</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💨</Text>
            <Text style={styles.statValue}>18mph</Text>
            <Text style={styles.statLabel}>Wind</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌧️</Text>
            <Text style={styles.statValue}>40%</Text>
            <Text style={styles.statLabel}>Rain</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>Medium</Text>
            <Text style={styles.statLabel}>Footfall</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Markets This Week</Text>
          {[
            { name: "Stokesley Market", day: "Saturday", risk: "⚠️ Moderate", color: COLORS.warning },
            { name: "Crathorne Hall", day: "Sunday", risk: "✅ Good", color: COLORS.success },
          ].map((market, i) => (
            <TouchableOpacity key={i} style={styles.marketCard}>
              <View>
                <Text style={styles.marketName}>{market.name}</Text>
                <Text style={styles.marketDay}>{market.day}</Text>
              </View>
              <Text style={[styles.marketRisk, { color: market.color }]}>{market.risk}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: COLORS.white },
  greeting: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  business: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text },
  logo: { fontSize: 36 },
  alertCard: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 16, padding: 20 },
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
  marketCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  marketName: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  marketDay: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  marketRisk: { fontSize: FONTS.size.sm, fontWeight: "600" },
});