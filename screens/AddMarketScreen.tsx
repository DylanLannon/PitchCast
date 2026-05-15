import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

const PRODUCT_TYPES = ["Bakery", "Hot Food", "Confectionery", "Drinks", "Produce", "Crafts", "Other"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddMarketScreen({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [prepaid, setPrepaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!name || !location || !lat || !lon || selectedDays.length === 0 || !productType) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("markets").insert({
      user_id: user?.id,
      name,
      location,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      trading_days: selectedDays,
      product_type: productType,
      pitch_prepaid: prepaid,
    });
    if (error) {
      setError(error.message);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Market</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.save}>Save</Text>}
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Market name</Text>
          <TextInput style={styles.input} placeholder="Stokesley Farmers Market" placeholderTextColor={COLORS.gray400} value={name} onChangeText={setName} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} placeholder="Stokesley, North Yorkshire" placeholderTextColor={COLORS.gray400} value={location} onChangeText={setLocation} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Coordinates</Text>
          <Text style={styles.hint}>Find your coordinates at maps.google.com</Text>
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.half]} placeholder="Latitude e.g. 54.4618" placeholderTextColor={COLORS.gray400} value={lat} onChangeText={setLat} keyboardType="decimal-pad" />
            <TextInput style={[styles.input, styles.half]} placeholder="Longitude e.g. -1.3318" placeholderTextColor={COLORS.gray400} value={lon} onChangeText={setLon} keyboardType="decimal-pad" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Trading days</Text>
          <View style={styles.chipRow}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.chip, selectedDays.includes(day) && styles.chipActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.chipText, selectedDays.includes(day) && styles.chipTextActive]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Product type</Text>
          <View style={styles.chipRow}>
            {PRODUCT_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, productType === type && styles.chipActive]}
                onPress={() => setProductType(type)}
              >
                <Text style={[styles.chipText, productType === type && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.label}>Pitch fee pre-paid</Text>
              <Text style={styles.hint}>You'll attend regardless of weather</Text>
            </View>
            <Switch value={prepaid} onValueChange={setPrepaid} trackColor={{ true: COLORS.primary }} />
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.gray200 },
  title: { fontSize: FONTS.size.lg, fontWeight: "600", color: COLORS.text },
  cancel: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  save: { fontSize: FONTS.size.md, color: COLORS.primary, fontWeight: "600" },
  scroll: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  label: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  hint: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 14, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50 },
  row: { flexDirection: "row", gap: 8 },
  half: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white, fontWeight: "600" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  error: { fontSize: FONTS.size.sm, color: COLORS.danger, textAlign: "center", marginBottom: 16 },
});