import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BRAND } from '@/constants/brand';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="privacy-screen">
      <Text style={styles.title}>Privacy & Security</Text>
      <Text style={styles.paragraph}>We respect your privacy. VIBROVOLT collects only the data required to deliver reliable EV charging services in Hyderabad, Telangana.</Text>

      <Text style={styles.sectionTitle}>Data We Collect</Text>
      <Text style={styles.paragraph}>• Account details: name, email, phone. {'\n'}• Charging data: station, session times, kWh, pricing. {'\n'}• Location: for station discovery and navigation. {'\n'}• Payments: tokenized by PCI-DSS compliant gateways.</Text>

      <Text style={styles.sectionTitle}>How We Use Data</Text>
      <Text style={styles.paragraph}>• To provide and improve charging, bookings, and on-demand dispatch. {'\n'}• Fraud prevention and compliance (GST, invoicing). {'\n'}• Customer support and notifications. {'\n'}• Carbon credit calculations and rewards.</Text>

      <Text style={styles.sectionTitle}>Security</Text>
      <Text style={styles.paragraph}>• Encryption in transit (TLS) and at rest. {'\n'}• Role-based access and least privilege. {'\n'}• Regular audits, logging and monitoring.</Text>

      <Text style={styles.sectionTitle}>Your Controls</Text>
      <Text style={styles.paragraph}>• Download or delete your data by writing to support@vibrovolt.com. {'\n'}• Manage notification preferences in Profile. {'\n'}• Withdraw consent anytime.</Text>

      <Text style={styles.sectionTitle}>Cookies & SDKs</Text>
      <Text style={styles.paragraph}>We use minimal analytics and error tracking to keep the app reliable. No third-party ad trackers.</Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.paragraph}>For privacy queries: dpo@vibrovolt.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.colors.white,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BRAND.colors.navy,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND.colors.navy,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: BRAND.colors.slate,
    lineHeight: 20,
  },
});
