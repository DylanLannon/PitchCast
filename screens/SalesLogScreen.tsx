import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";
import { getCurrentWeather } from "../services/weather";

interface Market {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface SalesLog {
  id: string;
  date: string;
  revenue: number;
  units_sold: number;
  notes: string;
  weather_temp: number;
  weather_wind: number;
  weather_description: string;
  market_id: string;
}

export default function SalesLogScreen() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [logs, setLogs] = useState<SalesLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [revenue, setRevenue] = useState("");
  const [units, setUnits] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    const { data } = await supabase.from("markets").select("id, name, lat, lon").order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setMarkets(data);
      setSelectedMarket(data[0]);
      loadLogs(data[0].id);
    } else {
      setLoading(false);
    }
  };

  const loadLogs = async (marketId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("sales_logs")
      .select("*")
      .eq("market_id", marketId)
      .order("date", { ascending: false });
    if (data) setLogs(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!revenue) { setError("Please enter your revenue"); return; }
    if (!selectedMarket) return;
    setSaving(true);
    setError(null);

    let weatherData = null;
    try {
      weatherData = await getCurrentWeather(selectedMarket.lat, selectedMarket.lon);
    } catch {}

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("sales_logs").insert({
      user_id: user?.id,
      market_id: selectedMarket.id,
      date: new Date().toISOString().split("T")[0],
      revenue: parseFloat(revenue),
      units_sold: units ? parseInt(units) : null,
      notes: notes || null,
      weather_temp: weatherData?.temp ?? null,
      weather_wind: weatherData?.windSpeed ?? null,
      weather_rain: weatherData?.rainChance ?? null,
      weather_description: weatherData?.description ?? null,
    });

    if (error) {
      setError(error.message);
    } else {
      setRevenue("");
      setUnits("");
      setNotes("");
      setShowForm(false);
      loadLogs(selectedMarket.id);
    }
    setSaving(false);
  };

  const averageRevenue = logs.length > 0
    ? Math.round(logs.reduce((sum, log) => sum + log.revenue, 0) / logs.length)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sales Log</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
            <Text style={styles.addBtnText}>{showForm ? "Cancel" : "+ Log Sales"}</Text>
          </TouchableOpacity>
        </View>

        {markets.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketPicker} contentContainerStyle={styles.marketPickerContent}>
            {markets.map(market => (
              <TouchableOpacity
                key={market.id}
                style={[styles.chip, selectedMarket?.id === market.id && styles.chipActive]}
                onPress={() => { setSelectedMarket(market); loadLogs(market.id); }}
              >
                <Text style={[styles.chipText, selectedMarket?.id === market.id && styles.chipTextActive]}>{market.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Log today's sales</Text>
            <Text style={styles.fieldLabel}>Revenue (£)</Text>
            <TextInput style={styles.input} placeholder="e.g. 245.50" placeholderTextColor={COLORS.gray400} value={revenue} onChangeText={setRevenue} keyboardType="decimal-pad" />
            <Text style={styles.fieldLabel}>Units sold (optional)</Text>
            <TextInput style={styles.input} placeholder="e.g. 48" placeholderTextColor={COLORS.gray400} value={units} onChangeText={setUnits} keyboardType="number-pad" />
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Anything worth noting about today..." placeholderTextColor={COLORS.gray400} value={notes} onChangeText={setNotes} multiline />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>Save sales log</Text>}
            </TouchableOpacity>
          </View>
        )}

        {logs.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>£{averageRevenue}</Text>
              <Text style={styles.statLabel}>Avg revenue</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{logs.length}</Text>
              <Text style={styles.statLabel}>Markets logged</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>£{Math.max(...logs.map(l => l.revenue))}</Text>
              <Text style={styles.statLabel}>Best day</Text>
            </View>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : logs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No sales logged yet</Text>
            <Text style={styles.emptyDesc}>Log your sales after each market and we'll start building predictions based on weather patterns</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent sales</Text>
            {logs.map((log, i) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logTop}>
                  <View>
                    <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</Text>
                    {log.weather_description && (
                      <Text style={styles.logWeather}>
                        {log.weather_description.charAt(0).toUpperCase() + log.weather_description.slice(1)} • {log.weather_temp}°C • {log.weather_wind}mph
                      </Text>
                    )}
                  </View>
                  <Text style={styles.logRevenue}>£{log.revenue.toFixed(2)}</Text>
                </View>
                {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
              </View>
            ))}
          </View>
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
  marketPicker: { marginBottom: 8 },
  marketPickerContent: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.white },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white, fontWeight: "600" },
  form: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  formTitle: { fontSize: FONTS.size.lg, fontWeight: "600", color: COLORS.text, marginBottom: 16 },
  fieldLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, padding: 12, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50 },
  textArea: { height: 80, textAlignVertical: "top" },
  error: { fontSize: FONTS.size.sm, color: COLORS.danger, marginTop: 4 },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 16 },
  saveBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.md },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, alignItems: "center" },
  statValue: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.primary },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  logCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 8 },
  logTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logDate: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  logWeather: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  logRevenue: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.primary },
  logNotes: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 8 },
  empty: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 22 },
});