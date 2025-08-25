import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Invalid credentials. Try demo@vibrovolt.com / demo123");
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue charging</Text>
            </View>

            <View style={styles.form}>
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
                <Lock size={20} color="#8B92B9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8B92B9"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#8B92B9" />
                  ) : (
                    <Eye size={20} color="#8B92B9" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#00FF88", "#00CC6F"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <Text style={styles.demoText}>Demo credentials:</Text>
                <Text style={styles.demoCredentials}>demo@vibrovolt.com / demo123</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register" as any)}>
                <Text style={styles.signUpText}>Sign Up</Text>
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
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#00FF88",
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0E27",
  },
  demoContainer: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
  },
  demoText: {
    fontSize: 12,
    color: "#8B92B9",
    marginBottom: 4,
  },
  demoCredentials: {
    fontSize: 14,
    color: "#00FF88",
    fontWeight: "500",
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
  signUpText: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "600",
  },
});