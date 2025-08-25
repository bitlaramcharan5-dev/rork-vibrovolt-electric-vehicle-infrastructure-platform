import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Gift, Leaf } from "lucide-react-native";
import { router } from "expo-router";
import { useWallet } from "@/providers/wallet-provider";
import { BRAND } from "@/constants/brand";
import { useTheme } from "@/providers/theme-provider";

export default function WalletScreen() {
  const { balance, transactions, cards, carbonCredits, partners, redeemCredits } = useWallet();
  const { colors } = useTheme();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id ?? "");
  const selectedPartner = useMemo(() => partners.find(p => p.id === selectedPartnerId), [partners, selectedPartnerId]);
  const [creditsToRedeem, setCreditsToRedeem] = useState<string>(selectedPartner ? String(selectedPartner.minCredits) : "");

  const onSelectPartner = (id: string) => {
    console.log("Selecting partner", id);
    setSelectedPartnerId(id);
    const partner = partners.find(p => p.id === id);
    if (partner) {
      setCreditsToRedeem(String(partner.minCredits));
    }
  };

  const onRedeem = () => {
    const amount = Number(creditsToRedeem);
    if (!selectedPartner) {
      Alert.alert("Choose partner", "Please select a partner to redeem.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Enter a valid credit amount.");
      return;
    }
    const res = redeemCredits(selectedPartner.id, amount);
    if (!res.ok) {
      Alert.alert("Redeem failed", res.error ?? "Could not redeem credits.");
      return;
    }
    Alert.alert("Success", `Redeemed ${amount} credits at ${selectedPartner.name}.`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[BRAND.colors.green, BRAND.colors.greenDark]}
        style={styles.balanceCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.balanceHeader}>
          <View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
          </View>
          <View style={styles.walletIcon}>
            <WalletIcon size={32} color={BRAND.colors.navy} />
          </View>
        </View>

        <View style={styles.balanceActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/add-funds" as any)}
            activeOpacity={0.8}
            testID="add-funds"
          >
            <Plus size={20} color={BRAND.colors.navy} />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} testID="rewards">
            <Gift size={20} color={BRAND.colors.navy} />
            <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Carbon Credits</Text>
        <View style={[styles.creditsCard, { backgroundColor: colors.card, borderColor: colors.border }]} testID="carbon-credits-card">
          <View style={styles.creditsHeader}>
            <View style={styles.creditsIconWrap}>
              <Leaf size={20} color={BRAND.colors.green} />
            </View>
            <Text style={[styles.creditsValue, { color: colors.text }]}>{carbonCredits}</Text>
            <Text style={styles.creditsUnit}>credits</Text>
          </View>

          <View style={styles.redeemSection}>
            <Text style={styles.redeemLabel}>Redeem at</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partnerRow}>
              {partners.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.partnerChip, selectedPartnerId === p.id && styles.partnerChipActive]}
                  onPress={() => onSelectPartner(p.id)}
                  activeOpacity={0.8}
                  testID={`partner-${p.id}`}
                >
                  <Text style={[styles.partnerText, selectedPartnerId === p.id && styles.partnerTextActive]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.redeemRow}>
              <TextInput
                style={[styles.redeemInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                placeholder={`Min ${selectedPartner?.minCredits ?? 0}`}
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={creditsToRedeem}
                onChangeText={setCreditsToRedeem}
                testID="redeem-input"
              />
              <TouchableOpacity style={styles.redeemButton} onPress={onRedeem} activeOpacity={0.9} testID="redeem-button">
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.redeemHelper}>Use credits at Vibro Cafe, Swiggy, Zomato, BookMyShow, District</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
        {cards.map((card) => (
          <TouchableOpacity key={card.id} style={[styles.cardItem, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}>
            <View style={styles.cardIcon}>
              <CreditCard size={24} color={BRAND.colors.green} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardNumber, { color: colors.text }]}>•••• {card.last4}</Text>
              <Text style={styles.cardType}>{card.type}</Text>
            </View>
            {card.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addCardButton} activeOpacity={0.8}>
          <Plus size={20} color={BRAND.colors.green} />
          <Text style={styles.addCardText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((transaction) => (
          <View key={transaction.id} style={[styles.transactionItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[
              styles.transactionIcon,
              transaction.type === "credit" ? styles.creditIcon : styles.debitIcon,
            ]}>
              {transaction.type === "credit" ? (
                <ArrowDownLeft size={20} color={BRAND.colors.green} />
              ) : (
                <ArrowUpRight size={20} color="#FF6B6B" />
              )}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: colors.text }]}>{transaction.title}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === "credit" ? styles.creditAmount : styles.debitAmount,
              ]}
            >
              {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: BRAND.colors.navy,
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: BRAND.colors.navy,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(10, 14, 39, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 39, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: BRAND.colors.navy,
    marginLeft: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: BRAND.colors.green,
  },
  creditsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  creditsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  creditsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,255,136,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  creditsValue: {
    fontSize: 28,
    fontWeight: "700",
    marginRight: 6,
  },
  creditsUnit: {
    fontSize: 14,
    color: BRAND.colors.slate,
    marginTop: 8,
  },
  redeemSection: {
    marginTop: 8,
  },
  redeemLabel: {
    color: BRAND.colors.slate,
    marginBottom: 8,
  },
  partnerRow: {
    paddingVertical: 4,
  },
  partnerChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: BRAND.colors.border,
    marginRight: 8,
  },
  partnerChipActive: {
    backgroundColor: BRAND.colors.green,
    borderColor: BRAND.colors.green,
  },
  partnerText: {
    color: BRAND.colors.navy,
    fontSize: 14,
  },
  partnerTextActive: {
    color: BRAND.colors.navy,
    fontWeight: "700",
  },
  redeemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  redeemInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  redeemButton: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND.colors.green,
  },
  redeemButtonText: {
    color: BRAND.colors.navy,
    fontWeight: "700",
  },
  redeemHelper: {
    marginTop: 8,
    color: BRAND.colors.slate,
    fontSize: 12,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: BRAND.colors.slate,
  },
  defaultBadge: {
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: BRAND.colors.green,
    fontWeight: "600",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BRAND.colors.green,
    borderStyle: "dashed",
  },
  addCardText: {
    fontSize: 16,
    color: BRAND.colors.green,
    marginLeft: 8,
    fontWeight: "500",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
  },
  debitIcon: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: BRAND.colors.slate,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  creditAmount: {
    color: BRAND.colors.green,
  },
  debitAmount: {
    color: "#FF6B6B",
  },
});