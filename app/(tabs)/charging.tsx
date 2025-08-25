import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Zap, Clock, MapPin, Calendar, ChevronRight, Battery } from "lucide-react-native";
import { router } from "expo-router";
import { useCharging } from "@/providers/charging-provider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/providers/theme-provider";
import { BRAND } from "@/constants/brand";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;
const isTablet = screenWidth > 768;

export default function ChargingScreen() {
  const { activeSession, upcomingBookings, chargingHistory } = useCharging();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      {activeSession ? (
        <TouchableOpacity
          style={styles.activeSessionCard}
          onPress={() => router.push("/charging-session" as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[BRAND.colors.green, BRAND.colors.greenDark]}
            style={styles.activeSessionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>Active Charging Session</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={styles.sessionStats}>
              <View style={styles.statItem}>
                <Battery size={isSmallScreen ? 20 : 24} color={BRAND.colors.navy} />
                <Text style={styles.statValue}>{activeSession.battery}%</Text>
                <Text style={styles.statLabel}>Battery</Text>
              </View>
              <View style={styles.statItem}>
                <Zap size={isSmallScreen ? 20 : 24} color={BRAND.colors.navy} />
                <Text style={styles.statValue}>{activeSession.power} kW</Text>
                <Text style={styles.statLabel}>Power</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={isSmallScreen ? 20 : 24} color={BRAND.colors.navy} />
                <Text style={styles.statValue}>{activeSession.duration}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
            </View>

            <View style={styles.sessionLocation}>
              <MapPin size={16} color={BRAND.colors.navy} />
              <Text style={styles.locationText}>{activeSession.station}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={[styles.noSessionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.noSessionIcon, { backgroundColor: colors.card }]}>
            <Zap size={isSmallScreen ? 28 : 32} color={colors.subtext} />
          </View>
          <Text style={[styles.noSessionTitle, { color: colors.text }]}>No Active Session</Text>
          <Text style={[styles.noSessionText, { color: colors.subtext }]}>
            Find a charging station to start
          </Text>
          <TouchableOpacity
            style={[styles.findStationButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={[styles.findStationText, { color: isDark ? colors.text : BRAND.colors.navy }]}>Find Stations</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Bookings</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingBookings.length > 0 ? (
          upcomingBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <View style={styles.bookingTime}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.bookingDate, { color: colors.subtext }]}>{booking.date}</Text>
                <Text style={[styles.bookingSlot, { color: colors.primary }]}>{booking.time}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={[styles.bookingStation, { color: colors.text }]}>{booking.station}</Text>
                <View style={styles.bookingMeta}>
                  <MapPin size={14} color={colors.subtext} />
                  <Text style={[styles.bookingLocation, { color: colors.subtext }]}>{booking.location}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.subtext} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No upcoming bookings</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Charging History</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {chargingHistory.map((session) => (
          <View key={session.id} style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyStation, { color: colors.text }]}>{session.station}</Text>
              <Text style={[styles.historyAmount, { color: colors.primary }]}>₹{session.amount}</Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={[styles.historyDate, { color: colors.subtext }]}>{session.date}</Text>
              <Text style={[styles.historyEnergy, { color: colors.subtext }]}>{session.energy} kWh</Text>
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 80,
  },
  activeSessionCard: {
    margin: isTablet ? 24 : 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  activeSessionGradient: {
    padding: isSmallScreen ? 16 : 20,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallScreen ? 16 : 24,
  },
  sessionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "600",
    color: BRAND.colors.navy,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 39, 0.2)",
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: isSmallScreen ? 4 : 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0000",
    marginRight: 6,
  },
  liveText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: "600",
    color: BRAND.colors.navy,
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: isSmallScreen ? 16 : 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "bold",
    color: BRAND.colors.navy,
    marginTop: isSmallScreen ? 4 : 8,
  },
  statLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    color: BRAND.colors.navy,
    opacity: 0.7,
    marginTop: 4,
  },
  sessionLocation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 39, 0.1)",
    padding: isSmallScreen ? 10 : 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: BRAND.colors.navy,
    marginLeft: 8,
    fontWeight: "500",
  },
  noSessionCard: {
    borderRadius: 16,
    padding: isSmallScreen ? 24 : 32,
    margin: isTablet ? 24 : 16,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  noSessionIcon: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: isSmallScreen ? 28 : 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isSmallScreen ? 12 : 16,
  },
  noSessionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noSessionText: {
    fontSize: isSmallScreen ? 12 : 14,
    marginBottom: isSmallScreen ? 20 : 24,
    textAlign: 'center',
  },
  findStationButton: {
    paddingHorizontal: isSmallScreen ? 20 : 24,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  findStationText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  section: {
    marginTop: isSmallScreen ? 20 : 24,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallScreen ? 12 : 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: isSmallScreen ? 12 : 14,
  },
  bookingCard: {
    borderRadius: 12,
    padding: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 8 : 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bookingTime: {
    marginRight: isSmallScreen ? 12 : 16,
  },
  bookingDate: {
    fontSize: isSmallScreen ? 10 : 12,
    marginTop: 4,
  },
  bookingSlot: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "600",
    marginTop: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingStation: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookingMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingLocation: {
    fontSize: isSmallScreen ? 12 : 14,
    marginLeft: 4,
  },
  emptyState: {
    borderRadius: 12,
    padding: isSmallScreen ? 20 : 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: isSmallScreen ? 12 : 14,
  },
  historyCard: {
    borderRadius: 12,
    padding: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 8 : 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyStation: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  historyAmount: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyDate: {
    fontSize: isSmallScreen ? 12 : 14,
  },
  historyEnergy: {
    fontSize: isSmallScreen ? 12 : 14,
  },
});