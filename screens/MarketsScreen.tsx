import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";
import AddMarketScreen from "./AddMarketScreen";

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

export default function MarketsScreen() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("markets").select("*").order("created_at", { ascending: false });
    if (!error && data) setMarkets(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showAdd} animationType="slide">
        <AddMarketScreen
          onSuccess={() => { setShowAdd(false); fetchMarkets(); }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Markets</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : markets.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏪</Text>
            <Text style={styles.emptyTitle}>No markets yet</Text>
            <Text style={styles.emptyDesc}>Add your first market to get weather alerts and stock recommendations</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowAdd(true)}>
              <Text style={styles.emptyBtnText}>Add your first market</Text>
            </TouchableOpacity>
          </View>
        ) : (
          markets.map((market) => (
            <View key={market.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={styles.marketName}>{market.name}</Text>
                  <Text style={styles.marketLocation}>📍 {market.location}</Text>
                  <Text style={styles.marketDays}>{market.trading_days.join(", ")}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.productType}>{market.product_type}</Text>
                  {market.pitch_prepaid && (
                    <View style={styles.prepaidBadge}>
                      <Text style={styles.prepaidText}>💳 Pre-paid</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
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
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  marketName: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  marketLocation: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginBottom: 2 },
  marketDays: { fontSize: FONTS.size.xs, color: COLORS.textMuted },
  productType: { fontSize: FONTS.size.xs, color: COLORS.primary, fontWeight: "600", backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  prepaidBadge: { backgroundColor: COLORS.gray100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  prepaidText: { fontSize: FONTS.size.xs, color: COLORS.gray600 },
  empty: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  emptyBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.md },
});