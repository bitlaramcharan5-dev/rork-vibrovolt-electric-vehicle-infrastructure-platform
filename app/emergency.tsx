import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Truck, Zap, MapPin, Clock, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/providers/theme-provider';
import { BRAND } from '@/constants/brand';

interface EmergencyService {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

export default function EmergencyScreen() {
  const { colors } = useTheme();
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Call VIBROVOLT Emergency Support?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL('tel:+911234567890');
          },
        },
      ]
    );
  };

  const handleMobileCharger = async () => {
    setIsRequesting(true);
    try {
      // Mock emergency request
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        'Mobile Charger Requested',
        'A mobile charging unit has been dispatched to your location. ETA: 25 minutes.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request mobile charger. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTowing = async () => {
    setIsRequesting(true);
    try {
      // Mock towing request
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        'Towing Service Requested',
        'A towing vehicle has been dispatched to your location. ETA: 35 minutes.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request towing service. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const emergencyServices: EmergencyService[] = [
    {
      id: 'call',
      title: 'Emergency Call',
      description: 'Call our 24/7 emergency support',
      icon: Phone,
      color: '#FF6B6B',
      action: handleEmergencyCall,
    },
    {
      id: 'mobile_charger',
      title: 'Mobile Charger',
      description: 'Request on-site charging service',
      icon: Zap,
      color: '#4ECDC4',
      action: handleMobileCharger,
    },
    {
      id: 'towing',
      title: 'Towing Service',
      description: 'Request vehicle towing assistance',
      icon: Truck,
      color: '#45B7D1',
      action: handleTowing,
    },
  ];

  const renderEmergencyService = (service: EmergencyService) => (
    <TouchableOpacity
      key={service.id}
      style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={service.action}
      disabled={isRequesting}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[`${service.color}20`, `${service.color}10`]}
        style={styles.serviceGradient}
      >
        <View style={[styles.serviceIcon, { backgroundColor: `${service.color}30` }]}>
          <service.icon size={32} color={service.color} />
        </View>
        <View style={styles.serviceContent}>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>{service.title}</Text>
          <Text style={[styles.serviceDescription, { color: colors.subtext }]}>
            {service.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.emergencyHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.emergencyIcon}>
          <Phone size={40} color={BRAND.colors.white} />
        </View>
        <Text style={styles.emergencyTitle}>Emergency Services</Text>
        <Text style={styles.emergencySubtitle}>
          Get immediate help when you need it most
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={[styles.locationTitle, { color: colors.text }]}>Current Location</Text>
          </View>
          <Text style={[styles.locationText, { color: colors.subtext }]}>
            Hitech City, Madhapur, Hyderabad
          </Text>
          <Text style={[styles.locationAccuracy, { color: colors.subtext }]}>
            Accurate to 5 meters
          </Text>
        </View>

        <View style={styles.servicesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Services</Text>
          {emergencyServices.map(renderEmergencyService)}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Clock size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.subtext }]}>
              Average response time: 20-30 minutes
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Phone size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.subtext }]}>
              24/7 Emergency Hotline: +91 1234 567 890
            </Text>
          </View>
        </View>
      </View>

      {isRequesting && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Processing your request...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyHeader: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  emergencyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND.colors.white,
    marginBottom: 8,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: BRAND.colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  locationCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationAccuracy: {
    fontSize: 12,
    opacity: 0.7,
  },
  servicesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  serviceCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoSection: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});