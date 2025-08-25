import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MapPin, Zap, Star, Clock, Phone, Navigation } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND } from "@/constants/brand";
import { fetchNearbyStations } from "@/services/stations";
import type { Station } from "@/types/station";

export default function StationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchNearbyStations();
        const sid = Array.isArray(id) ? id[0] : id;
        const found = data.find((s) => s.id === sid) ?? null;
        if (mounted) setStation(found);
        console.log("StationDetailsScreen:loaded", { sid, found });
      } catch (e) {
        console.error("StationDetailsScreen:error", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const availableCount = station?.available ?? 0;
  const totalCount = station?.total ?? 0;

  return (
    <View style={styles.container} testID="station-details-screen">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.stationName} testID="station-name">
            {station?.name ?? "Station"}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text style={styles.rating}>{station?.rating?.toFixed(1) ?? "-"}</Text>
            <Text style={styles.reviews}>• {station?.type ?? ""}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={18} color={BRAND.colors.slate} />
            <Text style={styles.infoText}>{station?.address ?? "Address unavailable"}</Text>
          </View>
        </View>

        <View style={styles.card} testID="availability-card">
          <Text style={styles.sectionTitle}>Charger Availability</Text>
          <View style={styles.chargerGrid}>
            {Array.from({ length: Math.max(totalCount, 8) }).map((_, idx) => {
              const slotNum = idx + 1;
              const isAvailable = slotNum <= availableCount;
              return (
                <View
                  key={slotNum}
                  style={[styles.chargerSlot, isAvailable ? styles.availableSlot : styles.occupiedSlot]}
                >
                  <Zap size={20} color={isAvailable ? BRAND.colors.green : "#FF6B6B"} />
                  <Text style={[styles.slotNumber, { color: BRAND.colors.navy }]}>{slotNum}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.availableDot]} />
              <Text style={styles.legendText}>Available ({availableCount})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.occupiedDot]} />
              <Text style={styles.legendText}>Occupied ({Math.max(totalCount - availableCount, 0)})</Text>
            </View>
          </View>
        </View>

        <View style={styles.card} testID="pricing-card">
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{station?.type ?? "Charging"}</Text>
            <Text style={styles.priceValue}>₹{station?.price ?? 0}/kWh</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Parking Fee</Text>
            <Text style={styles.priceValue}>Free</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Idle Fee</Text>
            <Text style={styles.priceValue}>₹50/hour</Text>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 100 }]} testID="amenities-card">
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {["Restrooms", "WiFi", "Food Court", "Shops"].map((a) => (
              <View key={a} style={styles.amenityItem}>
                <Text style={styles.amenityText}>• {a}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        <TouchableOpacity style={styles.navigateButton} activeOpacity={0.8} testID="navigate-btn">
          <Navigation size={20} color={BRAND.colors.white} />
          <Text style={styles.navigateText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push(`/booking/${Array.isArray(id) ? id[0] : id}` as any)}
          activeOpacity={0.8}
          testID="book-btn"
        >
          <View style={styles.bookGradient}>
            <Text style={styles.bookText}>Book Slot</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    padding: 24,
    paddingTop: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
  },
  stationName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A0E27",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0E27",
    marginLeft: 6,
  },
  reviews: {
    fontSize: 14,
    color: "#8B92B9",
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E6E9F2",
    shadowColor: "#0A0E27",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#667085",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0E27",
    marginBottom: 12,
  },
  chargerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chargerSlot: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  availableSlot: {
    backgroundColor: "rgba(0, 255, 136, 0.08)",
    borderWidth: 1,
    borderColor: "#00FF88",
  },
  occupiedSlot: {
    backgroundColor: "rgba(255, 107, 107, 0.08)",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  slotNumber: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availableDot: {
    backgroundColor: "#00FF88",
  },
  occupiedDot: {
    backgroundColor: "#FF6B6B",
  },
  legendText: {
    fontSize: 12,
    color: "#8B92B9",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: "#667085",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A0E27",
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    width: "50%",
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: "#667085",
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6E9F2",
  },
  navigateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0E27",
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  bookButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#00FF88",
  },
  bookGradient: {
    padding: 16,
    alignItems: "center",
  },
  bookText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0E27",
  },
});