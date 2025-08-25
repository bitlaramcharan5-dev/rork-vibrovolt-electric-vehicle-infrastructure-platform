import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Zap, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A", "#0A0E27"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {Platform.OS !== 'web' && (
              <Animated.View style={[styles.glowCircle, animatedGlowStyle]} />
            )}
            <Animated.View style={Platform.OS !== 'web' ? animatedLogoStyle : undefined}>
              <View style={styles.logoCircle}>
                <Zap size={60} color="#00FF88" strokeWidth={2.5} />
              </View>
            </Animated.View>
          </View>

          <Text style={styles.title}>ViBROVOLT</Text>
          <Text style={styles.subtitle}>Charge Anywhere, Anytime</Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Find charging stations instantly</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Book slots & skip the queue</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>On-demand mobile charging</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(auth)/register" as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#00FF88", "#00CC6F"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <ChevronRight size={20} color="#0A0E27" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(auth)/login" as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderWidth: 2,
    borderColor: "#00FF88",
    alignItems: "center",
    justifyContent: "center",
  },
  glowCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#00FF88",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#8B92B9",
    marginBottom: 48,
  },
  features: {
    marginBottom: 60,
    width: "100%",
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF88",
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#B8BED9",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0E27",
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#8B92B9",
  },
});