import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Truck, Navigation, Phone, LocateFixed, ArrowLeft, Map } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchNearbyStations } from '@/services/stations';
import { router } from 'expo-router';

export default function NeedChargerScreen() {
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const { data: stations = [] } = useQuery({ queryKey: ['stations', 'nearby'], queryFn: fetchNearbyStations });

  const osmUrl = useMemo(() => {
    const center = '17.3850,78.4867';
    const base = `https://staticmap.openstreetmap.de/staticmap.php?center=${center}&zoom=11&size=1200x600&maptype=mapnik`;
    const markers = stations
      .filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')
      .map((s) => `&markers=${s.lat},${s.lng},lightgreen1`)
      .join('');
    return `${base}${markers}`;
  }, [stations]);

  const openMaps = useCallback(() => {
    const q = encodeURIComponent(address || 'EV Charger near me');
    const native = Platform.select({
      ios: `maps://?q=${q}`,
      android: `geo:0,0?q=${q}`,
      default: `https://www.google.com/maps/search/?api=1&query=${q}`,
    });
    Linking.openURL(native ?? `https://www.google.com/maps/search/?api=1&query=${q}`);
  }, [address]);

  const submit = useCallback(() => {
    if (!address || !phone) {
      Alert.alert('Missing details', 'Please add your address and phone number');
      return;
    }
    Alert.alert('Request received', 'We will reach out shortly to confirm your on-location charging request.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }, [address, phone]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0E27", "#10163A"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" testID="back-button">
            <ArrowLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Need Charger</Text>
          <View style={{ width: 22 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard} testID="static-map">
          <ImageBackground source={{ uri: osmUrl }} style={styles.mapImage} imageStyle={{ width: '100%', height: '100%' }} resizeMode="cover">
            <View style={styles.mapOverlay} />
          </ImageBackground>
          <TouchableOpacity style={styles.mapOpen} onPress={openMaps} activeOpacity={0.85} testID="open-maps">
            <Map size={16} color="#0A0E27" />
            <Text style={styles.mapOpenText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.inputRow}>
            <MapPin size={18} color="#00FF88" />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address or drop location"
              placeholderTextColor="#8B92B9"
              autoCapitalize="words"
              testID="address-input"
            />
          </View>

          <View style={styles.inputRow}>
            <Phone size={18} color="#00FF88" />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#8B92B9"
              keyboardType="phone-pad"
              testID="phone-input"
            />
          </View>

          <TextInput
            style={styles.note}
            value={note}
            onChangeText={setNote}
            placeholder="Note for driver (landmark, parking, timings)"
            placeholderTextColor="#8B92B9"
            multiline
            numberOfLines={4}
            testID="note-input"
          />
        </View>

        <View style={styles.stationsHeader}>
          <Text style={styles.stationsTitle}>Nearby Stations</Text>
          <TouchableOpacity onPress={openMaps}>
            <Text style={styles.seeAll}>See on Maps</Text>
          </TouchableOpacity>
        </View>

        {stations.map((s) => (
          <View key={s.id} style={styles.stationCard} testID={`suggestion-${s.id}`}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stationName}>{s.name}</Text>
              <Text style={styles.stationAddr}>{s.address}</Text>
            </View>
            <LinearGradient colors={["#00FF88", "#00CC6F"]} style={styles.badge}>
              <Truck size={14} color="#0A0E27" />
              <Text style={styles.badgeText}>On-demand</Text>
            </LinearGradient>
          </View>
        ))}

        <TouchableOpacity onPress={submit} activeOpacity={0.9} style={styles.cta} testID="submit-button">
          <LinearGradient colors={["#00FF88", "#00CC6F"]} style={styles.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <LocateFixed size={20} color="#0A0E27" />
            <Text style={styles.ctaText}>Request Charger To My Location</Text>
            <Navigation size={18} color="#0A0E27" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 48 },
  mapCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  mapImage: { width: '100%', aspectRatio: 2, backgroundColor: '#10163A' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  mapOpen: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#00FF88', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  mapOpenText: { color: '#0A0E27', fontWeight: '700', marginLeft: 6 },
  section: { marginTop: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  input: { flex: 1, height: 48, color: '#FFFFFF', marginLeft: 8 },
  note: { minHeight: 96, color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  stationsHeader: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stationsTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  seeAll: { color: '#00FF88' },
  stationCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10 },
  stationName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  stationAddr: { color: '#8B92B9', marginTop: 4, fontSize: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  badgeText: { color: '#0A0E27', marginLeft: 6, fontWeight: '700' },
  cta: { marginTop: 20 },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12 },
  ctaText: { color: '#0A0E27', fontWeight: '700' },
});
