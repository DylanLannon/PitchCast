import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMagicLink = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.sentEmoji}>📬</Text>
          <Text style={styles.sentTitle}>Check your email</Text>
          <Text style={styles.sentDesc}>We sent a magic link to {email}. Tap it to sign in — no password needed.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSent(false)}>
            <Text style={styles.backBtnText}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        <View style={styles.top}>
          <Text style={styles.logo}>⛅</Text>
          <Text style={styles.title}>PitchCast</Text>
          <Text style={styles.subtitle}>Weather intelligence for outdoor traders</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.gray400}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleMagicLink} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.btnText}>Send magic link</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.hint}>No password needed — we'll email you a sign in link</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { flex: 1, padding: 24, justifyContent: "center" },
  top: { alignItems: "center", marginBottom: 48 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: FONTS.size.xxxl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center" },
  form: { gap: 8 },
  label: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 16, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50 },
  error: { fontSize: FONTS.size.sm, color: COLORS.danger },
  btn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  btnText: { color: COLORS.white, fontSize: FONTS.size.md, fontWeight: "600" },
  hint: { fontSize: FONTS.size.sm, color: COLORS.textMuted, textAlign: "center", marginTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  sentEmoji: { fontSize: 64, marginBottom: 16 },
  sentTitle: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  sentDesc: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 24, marginBottom: 24 },
  backBtn: { padding: 12 },
  backBtnText: { color: COLORS.primary, fontSize: FONTS.size.md, fontWeight: "600" },
});