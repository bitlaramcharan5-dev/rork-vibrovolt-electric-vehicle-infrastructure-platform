import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Truck, Clock, Battery, Phone } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnDemandScreen() {
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [urgency, setUrgency] = useState("standard");
  const [batteryLevel, setBatteryLevel] = useState("");
  const [phone, setPhone] = useState("");

  const vehicleTypes = [
    { id: "sedan", label: "Sedan", price: "₹500" },
    { id: "suv", label: "SUV", price: "₹700" },
    { id: "truck", label: "Truck", price: "₹1000" },
  ];

  const urgencyLevels = [
    { id: "standard", label: "Standard", time: "2-3 hours", price: "Free" },
    { id: "express", label: "Express", time: "1 hour", price: "+₹200" },
    { id: "urgent", label: "Urgent", time: "30 min", price: "+₹500" },
  ];

  const handleRequest = () => {
    if (!location || !batteryLevel || !phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert(
      "Request Submitted",
      "Your on-demand charging request has been submitted. A driver will contact you shortly.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["#00FF88", "#00CC6F"]}
              style={styles.heroGradient}
            >
              <Truck size={48} color="#0A0E27" />
              <Text style={styles.heroTitle}>On-Demand Charging</Text>
              <Text style={styles.heroSubtitle}>
                We bring the charger to you
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Your Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your current location"
              placeholderTextColor="#8B92B9"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationButtonText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Truck size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Vehicle Type</Text>
            </View>
            {vehicleTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  vehicleType === type.id && styles.selectedOption,
                ]}
                onPress={() => setVehicleType(type.id)}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{type.label}</Text>
                  <Text style={styles.optionPrice}>{type.price}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    vehicleType === type.id && styles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Urgency</Text>
            </View>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.optionCard,
                  urgency === level.id && styles.selectedOption,
                ]}
                onPress={() => setUrgency(level.id)}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{level.label}</Text>
                  <Text style={styles.optionTime}>{level.time}</Text>
                </View>
                <Text style={styles.optionPrice}>{level.price}</Text>
                <View
                  style={[
                    styles.radio,
                    urgency === level.id && styles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Battery size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Current Battery Level</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter battery percentage (e.g., 20)"
              placeholderTextColor="#8B92B9"
              value={batteryLevel}
              onChangeText={setBatteryLevel}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Contact Number</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#8B92B9"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.estimateCard}>
            <Text style={styles.estimateTitle}>Estimated Cost</Text>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Base Charge</Text>
              <Text style={styles.estimateValue}>₹500</Text>
            </View>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Urgency Fee</Text>
              <Text style={styles.estimateValue}>
                {urgency === "express" ? "₹200" : urgency === "urgent" ? "₹500" : "₹0"}
              </Text>
            </View>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Energy (est. 30 kWh)</Text>
              <Text style={styles.estimateValue}>₹600</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.estimateRow}>
              <Text style={styles.estimateTotal}>Total</Text>
              <Text style={styles.estimateTotalValue}>
                ₹{1100 + (urgency === "express" ? 200 : urgency === "urgent" ? 500 : 0)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequest}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00FF88", "#00CC6F"]}
            style={styles.requestGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.requestText}>Request Service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  heroCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  heroGradient: {
    padding: 24,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A0E27",
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#0A0E27",
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  locationButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  locationButtonText: {
    fontSize: 14,
    color: "#00FF88",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedOption: {
    borderColor: "#00FF88",
    backgroundColor: "rgba(0, 255, 136, 0.05)",
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  optionTime: {
    fontSize: 14,
    color: "#8B92B9",
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00FF88",
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8B92B9",
  },
  radioSelected: {
    borderColor: "#00FF88",
    backgroundColor: "#00FF88",
  },
  estimateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  estimateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  estimateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  estimateLabel: {
    fontSize: 14,
    color: "#8B92B9",
  },
  estimateValue: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  estimateTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  estimateTotalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00FF88",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 12,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#0A0E27",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  requestButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  requestGradient: {
    padding: 16,
    alignItems: "center",
  },
  requestText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0E27",
  },
});