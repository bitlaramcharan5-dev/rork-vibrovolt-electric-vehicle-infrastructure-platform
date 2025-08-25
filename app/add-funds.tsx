import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Wallet, CreditCard } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddFundsScreen() {
  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const quickAmounts = ["500", "1000", "2000", "5000"];

  const handleAddFunds = () => {
    const finalAmount = selectedAmount || amount;
    if (!finalAmount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    Alert.alert(
      "Success",
      `₹${finalAmount} has been added to your wallet`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.walletCard}>
          <LinearGradient
            colors={["#00FF88", "#00CC6F"]}
            style={styles.walletGradient}
          >
            <Wallet size={48} color="#0A0E27" />
            <Text style={styles.walletTitle}>Add Money to Wallet</Text>
            <Text style={styles.walletBalance}>Current Balance: ₹2,450</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Amount</Text>
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickAmountCard,
                  selectedAmount === amt && styles.selectedAmount,
                ]}
                onPress={() => {
                  setSelectedAmount(amt);
                  setAmount("");
                }}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    selectedAmount === amt && styles.selectedAmountText,
                  ]}
                >
                  ₹{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Or Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#8B92B9"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setSelectedAmount("");
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
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

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFunds}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00FF88", "#00CC6F"]}
            style={styles.addGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.addText}>Add Money</Text>
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
    flex: 1,
    padding: 16,
  },
  walletCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  walletGradient: {
    padding: 24,
    alignItems: "center",
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A0E27",
    marginTop: 12,
  },
  walletBalance: {
    fontSize: 16,
    color: "#0A0E27",
    opacity: 0.8,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  quickAmountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  quickAmountCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingVertical: 20,
    margin: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedAmount: {
    backgroundColor: "#00FF88",
    borderColor: "#00FF88",
  },
  quickAmountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectedAmountText: {
    color: "#0A0E27",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencySymbol: {
    fontSize: 24,
    color: "#00FF88",
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 24,
    color: "#FFFFFF",
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
    padding: 16,
    backgroundColor: "#0A0E27",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  addGradient: {
    padding: 16,
    alignItems: "center",
  },
  addText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0E27",
  },
});