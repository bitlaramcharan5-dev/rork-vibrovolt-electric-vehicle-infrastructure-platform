import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Battery, Zap, Clock, DollarSign, X, Pause, Play } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useCharging } from "@/providers/charging-provider";
import { useTheme } from "@/providers/theme-provider";
import { BRAND } from "@/constants/brand";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;
const isTablet = screenWidth > 768;

export default function ChargingSessionScreen() {
  const [battery, setBattery] = useState<number>(45);
  const [duration, setDuration] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentPower, setCurrentPower] = useState<number>(120);
  const { stopSession } = useCharging();
  const { colors, isDark } = useTheme();

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!isPaused) {
      pulseScale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isPaused, pulseScale]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setBattery((prev) => {
        const newBattery = Math.min(prev + 0.5, 100);
        if (newBattery >= 100) {
          setIsPaused(true);
          Alert.alert(
            "Charging Complete!",
            "Your vehicle is fully charged.",
            [{ text: "OK", onPress: () => router.back() }]
          );
        }
        return newBattery;
      });
      setDuration((prev) => prev + 1);
      setEnergy((prev) => prev + (currentPower / 3600)); // kWh per second
      setCost((prev) => prev + (currentPower * 15 / 3600)); // ₹15 per kWh
      
      // Simulate power fluctuation
      setCurrentPower((prev) => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(100, Math.min(150, prev + variation));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, currentPower]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const formatDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const handleStop = useCallback(() => {
    Alert.alert(
      "Stop Charging?",
      `Current charge: ${battery.toFixed(1)}%\nTotal cost: ₹${cost.toFixed(0)}\n\nAre you sure you want to stop the charging session?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: () => {
            stopSession();
            router.back();
          },
        },
      ]
    );
  }, [battery, cost, stopSession]);

  return (
    <LinearGradient
      colors={isDark ? [BRAND.colors.navy, '#1A1F3A', BRAND.colors.navy] : [colors.background, '#F8F9FA', colors.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]} onPress={handleStop}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Charging Session</Text>
          <TouchableOpacity style={[styles.pauseButton, { backgroundColor: colors.card }]} onPress={togglePause}>
            {isPaused ? (
              <Play size={24} color={colors.primary} fill={colors.primary} />
            ) : (
              <Pause size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.batteryContainer}>
            <Animated.View style={animatedStyle}>
              <View style={[styles.batteryCircle, { 
                backgroundColor: `${colors.primary}15`, 
                borderColor: colors.primary 
              }]}>
                <Battery 
                  size={isSmallScreen ? 50 : 60} 
                  color={colors.primary} 
                  fill={battery > 20 ? colors.primary : '#FF6B6B'} 
                />
                <Text style={[styles.batteryPercent, { color: colors.primary }]}>
                  {battery.toFixed(1)}%
                </Text>
              </View>
            </Animated.View>
            <View style={[styles.chargingIndicator, { backgroundColor: `${colors.primary}15` }]}>
              <View style={[styles.chargingDot, { 
                backgroundColor: isPaused ? '#FF6B6B' : colors.primary 
              }]} />
              <Text style={[styles.chargingText, { color: colors.primary }]}>
                {isPaused ? 'Paused' : 'Charging'}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Clock size={isSmallScreen ? 20 : 24} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(duration)}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Duration</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Zap size={isSmallScreen ? 20 : 24} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{energy.toFixed(2)} kWh</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Energy</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                <DollarSign size={isSmallScreen ? 20 : 24} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>₹{cost.toFixed(0)}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Cost</Text>
            </View>
          </View>

          <View style={[styles.sessionInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Station</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>Hitech City Supercharger</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Charger</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>DC Fast #3</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Power</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>{currentPower.toFixed(0)} kW</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Rate</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>₹15/kWh</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Status</Text>
              <Text style={[styles.infoValue, { color: isPaused ? '#FF6B6B' : colors.primary }]}>
                {isPaused ? 'Paused' : 'Active'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.stopButton, { backgroundColor: '#FF6B6B' }]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <Text style={[styles.stopButtonText, { color: BRAND.colors.white }]}>Stop Charging</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isSmallScreen ? 12 : 16,
  },
  closeButton: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: isSmallScreen ? 18 : 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "600",
  },
  pauseButton: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: isSmallScreen ? 18 : 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 32 : (isSmallScreen ? 20 : 24),
  },
  batteryContainer: {
    alignItems: "center",
    marginTop: isSmallScreen ? 24 : 32,
    marginBottom: isSmallScreen ? 32 : 48,
  },
  batteryCircle: {
    width: isSmallScreen ? 160 : (isTablet ? 200 : 180),
    height: isSmallScreen ? 160 : (isTablet ? 200 : 180),
    borderRadius: isSmallScreen ? 80 : (isTablet ? 100 : 90),
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  batteryPercent: {
    fontSize: isSmallScreen ? 28 : (isTablet ? 36 : 32),
    fontWeight: "bold",
    marginTop: 8,
  },
  chargingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: isSmallScreen ? 20 : 24,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chargingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chargingText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: isSmallScreen ? 24 : 32,
    gap: isSmallScreen ? 8 : 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: isSmallScreen ? 12 : 16,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIcon: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: isSmallScreen ? 20 : 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isSmallScreen ? 8 : 12,
  },
  statValue: {
    fontSize: isSmallScreen ? 16 : 20,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    textAlign: 'center',
  },
  sessionInfo: {
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: isSmallScreen ? 24 : 32,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: isSmallScreen ? 12 : 16,
  },
  infoLabel: {
    fontSize: isSmallScreen ? 12 : 14,
  },
  infoValue: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "500",
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  stopButton: {
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  stopButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
});