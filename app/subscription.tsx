import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Zap, Star, Check, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/providers/theme-provider';
import { BRAND } from '@/constants/brand';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99,
      duration: 'month',
      features: [
        'Access to all charging stations',
        'Basic customer support',
        'Standard charging rates',
        'Mobile app access',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 199,
      duration: 'month',
      popular: true,
      savings: 'Save ₹50',
      features: [
        'All Basic features',
        'Priority booking',
        '10% discount on charging',
        'Premium customer support',
        'Advanced analytics',
        'Multiple vehicle profiles',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299,
      duration: 'month',
      savings: 'Save ₹100',
      features: [
        'All Premium features',
        'Unlimited priority booking',
        '20% discount on charging',
        'Dedicated account manager',
        'Custom charging plans',
        'API access for fleet management',
        'White-label solutions',
      ],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    try {
      // Mock subscription logic
      Alert.alert(
        'Subscription Confirmation',
        `You are about to subscribe to ${plan.name} plan for ₹${plan.price}/${plan.duration}. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Subscribe',
            onPress: () => {
              Alert.alert('Success!', 'Your subscription has been activated!');
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    }
  };

  const renderPlan = (plan: SubscriptionPlan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        {
          backgroundColor: colors.card,
          borderColor: selectedPlan === plan.id ? colors.primary : colors.border,
        },
        plan.popular && styles.popularPlan,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Star size={12} color={BRAND.colors.navy} fill={BRAND.colors.navy} />
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
        {plan.savings && (
          <Text style={[styles.savingsText, { color: colors.primary }]}>{plan.savings}</Text>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: colors.text }]}>₹{plan.price}</Text>
        <Text style={[styles.duration, { color: colors.subtext }]}>/{plan.duration}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: selectedPlan === plan.id ? colors.primary : colors.background,
            borderColor: colors.primary,
          },
        ]}
        onPress={() => handleSubscribe(plan.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.selectButtonText,
            {
              color: selectedPlan === plan.id ? BRAND.colors.navy : colors.primary,
            },
          ]}
        >
          {selectedPlan === plan.id ? 'Subscribe Now' : 'Select Plan'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.crownContainer}>
              <Crown size={32} color={BRAND.colors.navy} />
            </View>
            <Text style={styles.headerTitle}>Choose Your Plan</Text>
            <Text style={styles.headerSubtitle}>
              Unlock premium features and save on every charge
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.benefitsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Subscribe?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Zap size={20} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Priority access to charging stations
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Zap size={20} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Significant savings on charging costs
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Zap size={20} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Advanced features and analytics
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.plansSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Your Plan</Text>
          {plans.map(renderPlan)}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Cancel anytime. No hidden fees. 30-day money-back guarantee.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  crownContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(10, 14, 39, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND.colors.navy,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: BRAND.colors.navy,
    opacity: 0.8,
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  plansSection: {
    paddingHorizontal: 24,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    position: 'relative',
  },
  popularPlan: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND.colors.navy,
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 16,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  selectButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});