import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [eveningAlert, setEveningAlert] = useState(true);
  const [morningAlert, setMorningAlert] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowEmoji}>🏪</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Business name</Text>
                <Text style={styles.rowValue}>Butterfold Bakery</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowEmoji}>📦</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Product type</Text>
                <Text style={styles.rowValue}>Perishable — Bakery</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowEmoji}>💳</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Connect SumUp</Text>
                <Text style={styles.rowValue}>Not connected</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowEmoji}>🔔</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Push notifications</Text>
                <Text style={styles.rowValue}>Receive weather alerts</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: COLORS.primary }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowEmoji}>🌆</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Evening alert</Text>
                <Text style={styles.rowValue}>6pm the day before</Text>
              </View>
              <Switch
                value={eveningAlert}
                onValueChange={setEveningAlert}
                trackColor={{ true: COLORS.primary }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowEmoji}>🌅</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Morning alert</Text>
                <Text style={styles.rowValue}>6am on market day</Text>
              </View>
              <Switch
                value={morningAlert}
                onValueChange={setMorningAlert}
                trackColor={{ true: COLORS.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowEmoji}>👤</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Profile</Text>
                <Text style={styles.rowValue}>Dylan Lannon</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowEmoji}>💷</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Subscription</Text>
                <Text style={styles.rowValue}>Free trial</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
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
  card: { backgroundColor: COLORS.white, borderRadius: 12, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 16 },
  rowEmoji: { fontSize: 22, marginRight: 12 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: FONTS.size.md, color: COLORS.text, fontWeight: "500" },
  rowValue: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  chevron: { fontSize: 20, color: COLORS.gray400 },
  divider: { height: 0.5, backgroundColor: COLORS.gray200, marginLeft: 50 },
});