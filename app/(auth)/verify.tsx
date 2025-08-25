import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Shield } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function VerifyScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { login } = useAuth();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      await login("demo@vibrovolt.com", "demo123");
      router.replace("/(tabs)");
      setLoading(false);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Shield size={40} color="#00FF88" />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your phone
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.disabledButton]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#00FF88", "#00CC6F"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.verifyButtonText}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderWidth: 2,
    borderColor: "#00FF88",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B92B9",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 48,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  verifyButton: {
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
  verifyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0E27",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    color: "#8B92B9",
    fontSize: 16,
  },
  resendLink: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "600",
  },
});