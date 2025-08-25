import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { BRAND } from '@/constants/brand';
import { MessageCircle, Phone, Mail } from 'lucide-react-native';

export default function SupportScreen() {
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const onSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Missing info', 'Please fill subject and message');
      return;
    }
    console.log('Support Ticket', { subject, message });
    Alert.alert('Submitted', 'Your ticket has been submitted. Our team will contact you shortly.');
    setSubject('');
    setMessage('');
  };

  const openMail = () => Linking.openURL('mailto:support@vibrovolt.com');
  const openPhone = () => Linking.openURL('tel:+919999999999');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="support-screen">
      <Text style={styles.title}>Help & Support</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create a Ticket</Text>
        <TextInput style={styles.input} placeholder="Subject" placeholderTextColor={BRAND.colors.slate} value={subject} onChangeText={setSubject} testID="subject-input" />
        <TextInput style={[styles.input, styles.textarea]} placeholder="Explain your issue" placeholderTextColor={BRAND.colors.slate} value={message} onChangeText={setMessage} multiline numberOfLines={5} testID="message-input" />
        <TouchableOpacity style={styles.button} onPress={onSubmit} activeOpacity={0.9} testID="submit-ticket">
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.action} onPress={openMail} activeOpacity={0.85} testID="email-support">
          <Mail size={20} color={BRAND.colors.green} />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={openPhone} activeOpacity={0.85} testID="call-support">
          <Phone size={20} color={BRAND.colors.green} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} activeOpacity={0.85} testID="chat-support">
          <MessageCircle size={20} color={BRAND.colors.green} />
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>FAQs</Text>
        <Text style={styles.faqQ}>How do I start a charging session?</Text>
        <Text style={styles.faqA}>Find a station on Discover, select a connector, and tap Start Charging.</Text>
        <Text style={styles.faqQ}>How are carbon credits calculated?</Text>
        <Text style={styles.faqA}>Based on kWh charged and grid mix. You can redeem in Wallet.</Text>
        <Text style={styles.faqQ}>Where is VIBROVOLT available?</Text>
        <Text style={styles.faqA}>Currently focused on Hyderabad, Telangana with on-demand expansion.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.colors.white },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: BRAND.colors.navy, marginBottom: 12 },
  card: { backgroundColor: 'rgba(10,14,39,0.04)', borderWidth: 1, borderColor: 'rgba(10,14,39,0.08)', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: BRAND.colors.navy, marginBottom: 8 },
  input: { height: 44, borderRadius: 10, paddingHorizontal: 12, backgroundColor: BRAND.colors.white, borderWidth: 1, borderColor: 'rgba(10,14,39,0.12)', color: BRAND.colors.navy, marginBottom: 8 },
  textarea: { height: 120, paddingTop: 12 },
  button: { height: 48, borderRadius: 12, backgroundColor: BRAND.colors.green, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: BRAND.colors.navy, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10 as any, marginBottom: 12 },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BRAND.colors.white, borderWidth: 1, borderColor: 'rgba(10,14,39,0.12)', borderRadius: 12, paddingVertical: 12, gap: 6 as any },
  actionText: { color: BRAND.colors.navy, fontWeight: '600' },
  faqQ: { marginTop: 8, color: BRAND.colors.navy, fontWeight: '700' },
  faqA: { color: BRAND.colors.slate },
});
