import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push("/(auth)/verify" as any);
      setLoading(false);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the electric revolution</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color="#8B92B9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="#8B92B9"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#8B92B9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#8B92B9"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#8B92B9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor="#8B92B9"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#8B92B9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8B92B9"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#00FF88", "#00CC6F"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.registerButtonText}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B92B9",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#FFFFFF",
  },
  registerButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0E27",
  },
  termsText: {
    fontSize: 14,
    color: "#8B92B9",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  termsLink: {
    color: "#00FF88",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#8B92B9",
    fontSize: 16,
  },
  signInText: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "600",
  },
});