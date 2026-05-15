import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [eveningAlert, setEveningAlert] = useState(true);
  const [morningAlert, setMorningAlert] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? "");
      setBusinessName(user.user_metadata?.business_name ?? "");
    }
  };

  const saveBusinessName = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { business_name: businessName } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Business name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Butterfold Bakery"
              placeholderTextColor={COLORS.gray400}
              value={businessName}
              onChangeText={setBusinessName}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveBusinessName} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.saveBtnText}>{saved ? "Saved ✓" : "Save"}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{email}</Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row}>
              <Text style={styles.fieldLabel}>💳 Connect SumUp</Text>
              <Text style={styles.fieldValueMuted}>Coming soon</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.fieldLabel}>🔔 Push notifications</Text>
                <Text style={styles.fieldValueMuted}>Receive weather alerts</Text>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: COLORS.primary }} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.fieldLabel}>🌆 Evening alert</Text>
                <Text style={styles.fieldValueMuted}>6pm the day before</Text>
              </View>
              <Switch value={eveningAlert} onValueChange={setEveningAlert} trackColor={{ true: COLORS.primary }} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.fieldLabel}>🌅 Morning alert</Text>
                <Text style={styles.fieldValueMuted}>6am on market day</Text>
              </View>
              <Switch value={morningAlert} onValueChange={setMorningAlert} trackColor={{ true: COLORS.primary }} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>💷 Subscription</Text>
              <Text style={styles.fieldValueMuted}>Free trial</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginTop: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16 },
  fieldLabel: { fontSize: FONTS.size.md, color: COLORS.text, fontWeight: "500", marginBottom: 4 },
  fieldValue: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  fieldValueMuted: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, padding: 12, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50, marginBottom: 8 },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 8, padding: 10, alignItems: "center", marginBottom: 8 },
  saveBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.sm },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  rowInfo: { flex: 1 },
  divider: { height: 0.5, backgroundColor: COLORS.gray200, marginVertical: 8 },
  signOutBtn: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, alignItems: "center", borderWidth: 1, borderColor: COLORS.danger },
  signOutText: { color: COLORS.danger, fontWeight: "600", fontSize: FONTS.size.md },
});