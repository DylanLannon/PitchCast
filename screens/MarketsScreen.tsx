import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../constants/colors";

const MARKETS = [
  { id: 1, name: "Stokesley Farmers Market", day: "Saturday", time: "9am - 2pm", risk: "⚠️ Moderate", color: COLORS.warning, paid: true },
  { id: 2, name: "Crathorne Hall Market", day: "Sunday", time: "10am - 3pm", risk: "✅ Good", color: COLORS.success, paid: true },
  { id: 3, name: "Middlesbrough Market", day: "Wednesday", time: "9am - 4pm", risk: "🔴 High Risk", color: COLORS.danger, paid: false },
];

export default function MarketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Markets</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {MARKETS.map((market) => (
          <View key={market.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <Text style={styles.marketName}>{market.name}</Text>
                <Text style={styles.marketTime}>{market.day} • {market.time}</Text>
              </View>
              <Text style={[styles.risk, { color: market.color }]}>{market.risk}</Text>
            </View>
            {market.paid && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>💳 Pitch fee paid</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.sm },
  card: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardLeft: { flex: 1 },
  marketName: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  marketTime: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  risk: { fontSize: FONTS.size.sm, fontWeight: "600", marginLeft: 8 },
  paidBadge: { marginTop: 10, backgroundColor: COLORS.gray100, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  paidText: { fontSize: FONTS.size.xs, color: COLORS.gray600 },
});