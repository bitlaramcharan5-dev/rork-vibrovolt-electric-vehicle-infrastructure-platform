import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter, MapPin, Zap, Star, Navigation, Truck, Bike, Car, Bus } from "lucide-react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchNearbyStations } from "@/services/stations";
import { Station, VehicleCategory } from "@/types/station";
import HyderabadMap from "@/components/HyderabadMap";

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [vehicle, setVehicle] = useState<VehicleCategory | 'All'>("All");

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ["stations", "nearby"],
    queryFn: fetchNearbyStations,
  });

  const filters = [
    { id: "all", label: "All", icon: Zap },
    { id: "fast", label: "Fast DC", icon: Zap },
    { id: "available", label: "Available", icon: MapPin },
    { id: "ondemand", label: "On-Demand", icon: Truck },
  ];

  const vehicleFilters: { id: VehicleCategory | 'All'; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'All', label: 'All Vehicles', icon: Car },
    { id: '2W', label: '2W', icon: Bike },
    { id: '3W', label: '3W', icon: Truck },
    { id: 'Car', label: 'Car', icon: Car },
    { id: 'SUV', label: 'SUV', icon: Car },
    { id: 'Bus', label: 'Bus', icon: Bus },
  ];

  const filteredStations = useMemo(() => {
    return stations.filter((station: Station) => {
      if (searchQuery && !station.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedFilter === "fast" && station.type !== "DC Fast") {
        return false;
      }
      if (selectedFilter === "available" && !(station.available > 0)) {
        return false;
      }
      if (selectedFilter === "ondemand" && !station.onDemand) {
        return false;
      }
      if (vehicle !== 'All') {
        const supported = station.supportedVehicles ?? [];
        if (!supported.includes(vehicle)) return false;
      }
      return true;
    });
  }, [stations, searchQuery, selectedFilter, vehicle]);

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => router.push(`/station/${item.id}` as any)}
      activeOpacity={0.8}
      testID={`station-${item.id}`}
    >
      <View style={styles.stationHeader}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.name}</Text>
          <View style={styles.stationMeta}>
            <MapPin size={14} color="#8B92B9" />
            <Text style={styles.stationDistance}>{item.distance}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, item.available > 0 ? styles.availableBadge : styles.busyBadge]}>
          <Text style={styles.statusText}>
            {item.available > 0 ? `${item.available} Available` : "Busy"}
          </Text>
        </View>
      </View>

      <View style={styles.stationDetails}>
        <View style={styles.detailItem}>
          <Zap size={16} color="#00FF88" />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.priceText}>₹{item.price}/kWh</Text>
        </View>
      </View>

      {item.onDemand && (
        <View style={styles.onDemandBadge}>
          <Truck size={14} color="#00FF88" />
          <Text style={styles.onDemandText}>On-Demand Available</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0E27", "#10163A"]} style={styles.headerGradient}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#8B92B9" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Hyderabad stations..."
            placeholderTextColor="#8B92B9"
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="search-input"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#00FF88" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, selectedFilter === filter.id && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.8}
              testID={`filter-${filter.id}`}
            >
              <filter.icon size={16} color={selectedFilter === filter.id ? "#0A0E27" : "#8B92B9"} />
              <Text style={[styles.filterLabel, selectedFilter === filter.id && styles.filterLabelActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {vehicleFilters.map((vf) => (
            <TouchableOpacity
              key={vf.id}
              style={[styles.filterChip, vehicle === vf.id && styles.filterChipActive]}
              onPress={() => setVehicle(vf.id)}
              activeOpacity={0.8}
              testID={`vehicle-${vf.id}`}
            >
              <vf.icon size={16} color={vehicle === vf.id ? "#0A0E27" : "#8B92B9"} />
              <Text style={[styles.filterLabel, vehicle === vf.id && styles.filterLabelActive]}>
                {vf.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <HyderabadMap stations={filteredStations} />

      <TouchableOpacity style={styles.onDemandButton} onPress={() => router.push("/need-charger" as any)} activeOpacity={0.8}>
        <LinearGradient colors={["#00FF88", "#00CC6F"]} style={styles.onDemandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Truck size={24} color="#0A0E27" />
          <View style={styles.onDemandContent}>
            <Text style={styles.onDemandTitle}>Need charging at your location?</Text>
            <Text style={styles.onDemandSubtitle}>Request on-demand service</Text>
          </View>
          <Navigation size={20} color="#0A0E27" />
        </LinearGradient>
      </TouchableOpacity>

      <FlatList
        data={filteredStations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0E27" },
  headerGradient: { paddingHorizontal: 16, paddingBottom: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 12, paddingHorizontal: 16, marginTop: 16, marginBottom: 16 },
  searchInput: { flex: 1, height: 48, fontSize: 16, color: "#FFFFFF", marginLeft: 12 },
  filterButton: { padding: 8 },
  filterScroll: { maxHeight: 40 },
  filterContent: { paddingRight: 16 },
  filterChip: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  filterChipActive: { backgroundColor: "#00FF88", borderColor: "#00FF88" },
  filterLabel: { color: "#8B92B9", fontSize: 14, marginLeft: 6 },
  filterLabelActive: { color: "#0A0E27", fontWeight: "600" },
  onDemandButton: { marginHorizontal: 16, marginVertical: 16, borderRadius: 12, overflow: "hidden" },
  onDemandGradient: { flexDirection: "row", alignItems: "center", padding: 16 },
  onDemandContent: { flex: 1, marginLeft: 12 },
  onDemandTitle: { fontSize: 16, fontWeight: "600", color: "#0A0E27" },
  onDemandSubtitle: { fontSize: 14, color: "#0A0E27", opacity: 0.8, marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  stationCard: { backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  stationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 4 },
  stationMeta: { flexDirection: "row", alignItems: "center" },
  stationDistance: { fontSize: 14, color: "#8B92B9", marginLeft: 4, marginRight: 12 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 14, color: "#8B92B9", marginLeft: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  availableBadge: { backgroundColor: "rgba(0, 255, 136, 0.2)" },
  busyBadge: { backgroundColor: "rgba(255, 107, 107, 0.2)" },
  statusText: { fontSize: 12, fontWeight: "600", color: "#00FF88" },
  stationDetails: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailItem: { flexDirection: "row", alignItems: "center" },
  detailText: { fontSize: 14, color: "#B8BED9", marginLeft: 6 },
  priceText: { fontSize: 16, fontWeight: "600", color: "#00FF88" },
  onDemandBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 255, 136, 0.1)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 12, alignSelf: "flex-start" },
  onDemandText: { fontSize: 12, color: "#00FF88", marginLeft: 6, fontWeight: "500" },
});