import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Clock, Zap, CreditCard } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCharging } from "@/providers/charging-provider";

export default function BookingScreen() {
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1 hour");
  const { startSession } = useCharging();

  const dates = ["Today", "Tomorrow", "Dec 18", "Dec 19"];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const durations = ["30 min", "1 hour", "2 hours", "3 hours"];

  const handleBooking = () => {
    if (!selectedTime) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    Alert.alert(
      "Booking Confirmed",
      `Your charging slot has been booked for ${selectedDate} at ${selectedTime}`,
      [
        {
          text: "OK",
          onPress: () => {
            startSession("Mall of Asia Supercharger");
            router.replace("/charging-session" as any);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Select Date</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateScroll}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateCard,
                    selectedDate === date && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === date && styles.selectedText,
                    ]}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Select Time</Text>
            </View>
            <View style={styles.timeGrid}>
              {times.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeCard,
                    selectedTime === time && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.selectedText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={20} color="#00FF88" />
              <Text style={styles.sectionTitle}>Charging Duration</Text>
            </View>
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationCard,
                    selectedDuration === duration && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === duration && styles.selectedText,
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Station</Text>
              <Text style={styles.summaryValue}>Mall of Asia</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedTime || "Not selected"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{selectedDuration}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Cost</Text>
              <Text style={styles.summaryTotal}>₹450</Text>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <View style={styles.paymentHeader}>
              <CreditCard size={20} color="#00FF88" />
              <Text style={styles.paymentTitle}>Payment Method</Text>
            </View>
            <TouchableOpacity style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <CreditCard size={24} color="#00FF88" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentCardNumber}>•••• 4242</Text>
                <Text style={styles.paymentCardType}>Visa</Text>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00FF88", "#00CC6F"]}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bookText}>Confirm Booking</Text>
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
  dateScroll: {
    flexDirection: "row",
  },
  dateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCard: {
    backgroundColor: "#00FF88",
    borderColor: "#00FF88",
  },
  dateText: {
    fontSize: 14,
    color: "#B8BED9",
    fontWeight: "500",
  },
  selectedText: {
    color: "#0A0E27",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  timeCard: {
    width: "31%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingVertical: 12,
    margin: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  timeText: {
    fontSize: 14,
    color: "#B8BED9",
    fontWeight: "500",
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  durationCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingVertical: 12,
    margin: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  durationText: {
    fontSize: 14,
    color: "#B8BED9",
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8B92B9",
  },
  summaryValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  summaryTotal: {
    fontSize: 18,
    color: "#00FF88",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 12,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  paymentCardType: {
    fontSize: 14,
    color: "#8B92B9",
  },
  changeText: {
    fontSize: 14,
    color: "#00FF88",
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
  bookButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  bookGradient: {
    padding: 16,
    alignItems: "center",
  },
  bookText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0E27",
  },
});