import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { BRAND } from '@/constants/brand';
import { Bike, Car, Plus, Trash2, Pencil } from 'lucide-react-native';

export type VehicleCategory = '2W' | '4W';

export interface Vehicle {
  id: string;
  category: VehicleCategory;
  brand: string;
  model: string;
  regNumber: string;
  connector: 'Type2' | 'CCS2' | 'GB/T' | 'CHAdeMO' | 'IEC60309';
  batteryKWh: number;
  fastCharge: boolean;
}

const indian2W = [
  { brand: 'Ather', model: '450X', connector: 'Type2' as const, batteryKWh: 3.7 },
  { brand: 'Ola', model: 'S1 Pro', connector: 'Type2' as const, batteryKWh: 4 },
  { brand: 'TVS', model: 'iQube', connector: 'Type2' as const, batteryKWh: 3.04 },
  { brand: 'Bajaj', model: 'Chetak', connector: 'Type2' as const, batteryKWh: 3 },
  { brand: 'Hero', model: 'Vida V1', connector: 'Type2' as const, batteryKWh: 3.9 },
];

const indian4W = [
  { brand: 'Tata', model: 'Nexon EV', connector: 'CCS2' as const, batteryKWh: 40.5 },
  { brand: 'Tata', model: 'Tiago EV', connector: 'CCS2' as const, batteryKWh: 24 },
  { brand: 'Mahindra', model: 'XUV400', connector: 'CCS2' as const, batteryKWh: 39.4 },
  { brand: 'MG', model: 'ZS EV', connector: 'CCS2' as const, batteryKWh: 50.3 },
  { brand: 'Hyundai', model: 'Kona Electric', connector: 'CCS2' as const, batteryKWh: 39.2 },
];

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', category: '2W', brand: 'Ather', model: '450X', regNumber: 'TS09 AB 1234', connector: 'Type2', batteryKWh: 3.7, fastCharge: false },
    { id: '2', category: '4W', brand: 'Tata', model: 'Nexon EV', regNumber: 'TS10 CD 5678', connector: 'CCS2', batteryKWh: 40.5, fastCharge: true },
  ]);

  const [category, setCategory] = useState<VehicleCategory>('2W');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [regNumber, setRegNumber] = useState<string>('');
  const [connector, setConnector] = useState<Vehicle['connector']>('Type2');
  const [batteryKWh, setBatteryKWh] = useState<string>('');
  const [fastCharge, setFastCharge] = useState<boolean>(false);

  const presets = useMemo(() => (category === '2W' ? indian2W : indian4W), [category]);

  const onSelectPreset = (p: { brand: string; model: string; connector: Vehicle['connector']; batteryKWh: number }) => {
    setBrand(p.brand);
    setModel(p.model);
    setConnector(p.connector);
    setBatteryKWh(String(p.batteryKWh));
  };

  const addVehicle = () => {
    if (!brand || !model) {
      Alert.alert('Missing info', 'Please select brand and model');
      return;
    }
    const v: Vehicle = {
      id: `${Date.now()}`,
      category,
      brand,
      model,
      regNumber: regNumber || 'TS00 XX 0000',
      connector,
      batteryKWh: Number(batteryKWh) || 0,
      fastCharge,
    };
    setVehicles((prev) => [v, ...prev]);
    setBrand('');
    setModel('');
    setRegNumber('');
    setConnector('Type2');
    setBatteryKWh('');
    setFastCharge(false);
  };

  const removeVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title} testID="vehicles-title">My Vehicles</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setCategory('2W')} style={[styles.toggleBtn, category === '2W' && styles.toggleActive]} activeOpacity={0.8} testID="toggle-2w">
          <Bike size={18} color={category === '2W' ? BRAND.colors.navy : BRAND.colors.slate} />
          <Text style={[styles.toggleText, category === '2W' && styles.toggleTextActive]}>2-Wheelers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('4W')} style={[styles.toggleBtn, category === '4W' && styles.toggleActive]} activeOpacity={0.8} testID="toggle-4w">
          <Car size={18} color={category === '4W' ? BRAND.colors.navy : BRAND.colors.slate} />
          <Text style={[styles.toggleText, category === '4W' && styles.toggleTextActive]}>4-Wheelers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
        {presets.map((p, idx) => (
          <TouchableOpacity key={`${p.brand}-${p.model}-${idx}`} style={styles.presetCard} onPress={() => onSelectPreset(p)} activeOpacity={0.85} testID={`preset-${idx}`}>
            <Text style={styles.presetTitle}>{p.brand}</Text>
            <Text style={styles.presetSubtitle}>{p.model}</Text>
            <View style={styles.presetMetaRow}>
              <Text style={styles.presetMeta}>{p.connector}</Text>
              <Text style={styles.presetMeta}>{p.batteryKWh} kWh</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add Vehicle</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Brand" placeholderTextColor={BRAND.colors.slate} value={brand} onChangeText={setBrand} testID="brand-input" />
          <TextInput style={styles.input} placeholder="Model" placeholderTextColor={BRAND.colors.slate} value={model} onChangeText={setModel} testID="model-input" />
        </View>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Reg Number (TS00 XX 0000)" placeholderTextColor={BRAND.colors.slate} value={regNumber} onChangeText={setRegNumber} testID="reg-input" />
          <TextInput style={styles.input} placeholder="Battery (kWh)" placeholderTextColor={BRAND.colors.slate} keyboardType="numeric" value={batteryKWh} onChangeText={setBatteryKWh} testID="battery-input" />
        </View>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Connector (Type2/CCS2/GB/T)" placeholderTextColor={BRAND.colors.slate} value={connector} onChangeText={(t) => setConnector((t as Vehicle['connector']) ?? 'Type2')} testID="connector-input" />
          <TextInput style={styles.input} placeholder="Fast Charge (true/false)" placeholderTextColor={BRAND.colors.slate} value={fastCharge ? 'true' : 'false'} onChangeText={(t) => setFastCharge(t.toLowerCase() === 'true')} testID="fastcharge-input" />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={addVehicle} activeOpacity={0.9} testID="add-vehicle">
          <Plus size={18} color={BRAND.colors.navy} />
          <Text style={styles.addBtnText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>Saved Vehicles</Text>
      {vehicles.map((v) => (
        <View key={v.id} style={styles.vehicleItem} testID={`vehicle-${v.id}`}>
          <View style={styles.vehicleLeft}>
            <View style={styles.vehicleIcon}>{v.category === '2W' ? <Bike size={20} color={BRAND.colors.green} /> : <Car size={20} color={BRAND.colors.green} />}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleTitle}>{v.brand} {v.model}</Text>
              <Text style={styles.vehicleMeta}>{v.regNumber} • {v.connector} • {v.batteryKWh} kWh</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
              <Pencil size={16} color={BRAND.colors.slate} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => removeVehicle(v.id)} activeOpacity={0.8}>
              <Trash2 size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND.colors.navy,
    marginVertical: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,14,39,0.06)',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.08)',
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: BRAND.colors.green,
  },
  toggleText: {
    marginLeft: 6,
    color: BRAND.colors.slate,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: BRAND.colors.navy,
  },
  presetRow: {
    paddingVertical: 8,
  },
  presetCard: {
    width: 160,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(10,14,39,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.08)',
    marginRight: 12,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.colors.navy,
  },
  presetSubtitle: {
    fontSize: 14,
    color: BRAND.colors.slate,
  },
  presetMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  presetMeta: {
    fontSize: 12,
    color: BRAND.colors.slate,
  },
  formCard: {
    backgroundColor: 'rgba(10,14,39,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.08)',
    borderRadius: 12,
    padding: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.colors.navy,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8 as any,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: BRAND.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.12)',
    color: BRAND.colors.navy,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6 as any,
    height: 48,
    borderRadius: 12,
    backgroundColor: BRAND.colors.green,
    marginTop: 4,
  },
  addBtnText: {
    color: BRAND.colors.navy,
    fontWeight: '700',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAND.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  vehicleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
    flex: 1,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,255,136,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.colors.navy,
  },
  vehicleMeta: {
    fontSize: 12,
    color: BRAND.colors.slate,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8 as any,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(10,14,39,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.colors.white,
  },
});
