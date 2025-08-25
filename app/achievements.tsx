import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Zap, Calendar, Target, Award, Star, Flame, Leaf } from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';
import { BRAND } from '@/constants/brand';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface Streak {
  id: string;
  name: string;
  current: number;
  best: number;
  target: number;
  icon: React.ComponentType<any>;
  color: string;
}

export default function ChargingStreaksScreen() {
  const { colors } = useTheme();

  const streaks: Streak[] = [
    {
      id: '1',
      name: 'Daily Charging',
      current: 7,
      best: 15,
      target: 30,
      icon: Calendar,
      color: '#FF6B6B',
    },
    {
      id: '2',
      name: 'Green Energy',
      current: 12,
      best: 20,
      target: 25,
      icon: Leaf,
      color: '#4ECDC4',
    },
    {
      id: '3',
      name: 'Fast Charging',
      current: 5,
      best: 8,
      target: 10,
      icon: Zap,
      color: '#45B7D1',
    },
    {
      id: '4',
      name: 'Peak Hours',
      current: 3,
      best: 6,
      target: 15,
      icon: Flame,
      color: '#FFA726',
    },
  ];

  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Charge',
      description: 'Complete your first charging session',
      icon: Zap,
      earned: true,
      rarity: 'common',
      points: 50,
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Charge for 7 consecutive days',
      icon: Calendar,
      earned: true,
      rarity: 'rare',
      points: 200,
    },
    {
      id: '3',
      name: 'Eco Champion',
      description: 'Use 100% renewable energy for charging',
      icon: Leaf,
      earned: true,
      rarity: 'epic',
      points: 500,
    },
    {
      id: '4',
      name: 'Speed Demon',
      description: 'Complete 50 fast charging sessions',
      icon: Target,
      earned: false,
      progress: 32,
      maxProgress: 50,
      rarity: 'rare',
      points: 300,
    },
    {
      id: '5',
      name: 'Master Charger',
      description: 'Reach 1000 total charging sessions',
      icon: Trophy,
      earned: false,
      progress: 247,
      maxProgress: 1000,
      rarity: 'legendary',
      points: 1000,
    },
    {
      id: '6',
      name: 'Night Owl',
      description: 'Charge during off-peak hours 20 times',
      icon: Star,
      earned: false,
      progress: 8,
      maxProgress: 20,
      rarity: 'common',
      points: 150,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#95A5A6';
      case 'rare': return '#3498DB';
      case 'epic': return '#9B59B6';
      case 'legendary': return '#F39C12';
      default: return colors.subtext;
    }
  };

  const totalPoints = badges.filter(b => b.earned).reduce((sum, badge) => sum + badge.points, 0);

  const renderStreak = (streak: Streak) => (
    <View key={streak.id} style={[styles.streakCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.streakHeader}>
        <View style={[styles.streakIcon, { backgroundColor: `${streak.color}20` }]}>
          <streak.icon size={24} color={streak.color} />
        </View>
        <View style={styles.streakInfo}>
          <Text style={[styles.streakName, { color: colors.text }]}>{streak.name}</Text>
          <Text style={[styles.streakStats, { color: colors.subtext }]}>
            Best: {streak.best} days
          </Text>
        </View>
      </View>
      
      <View style={styles.streakProgress}>
        <Text style={[styles.currentStreak, { color: streak.color }]}>
          {streak.current} days
        </Text>
        <Text style={[styles.targetStreak, { color: colors.subtext }]}>
          Target: {streak.target}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[styles.progressFill, { 
            backgroundColor: streak.color,
            width: `${(streak.current / streak.target) * 100}%` 
          }]} 
        />
      </View>
    </View>
  );

  const renderBadge = (badge: Badge) => (
    <TouchableOpacity 
      key={badge.id} 
      style={[
        styles.badgeCard, 
        { 
          backgroundColor: colors.card, 
          borderColor: badge.earned ? getRarityColor(badge.rarity) : colors.border,
          opacity: badge.earned ? 1 : 0.7 
        }
      ]}
      activeOpacity={0.8}
    >
      <View style={[styles.badgeIcon, { 
        backgroundColor: badge.earned ? `${getRarityColor(badge.rarity)}20` : `${colors.subtext}20` 
      }]}>
        <badge.icon 
          size={32} 
          color={badge.earned ? getRarityColor(badge.rarity) : colors.subtext} 
        />
      </View>
      
      <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
      <Text style={[styles.badgeDescription, { color: colors.subtext }]} numberOfLines={2}>
        {badge.description}
      </Text>
      
      {badge.progress !== undefined && badge.maxProgress && (
        <View style={styles.badgeProgress}>
          <Text style={[styles.badgeProgressText, { color: colors.subtext }]}>
            {badge.progress}/{badge.maxProgress}
          </Text>
          <View style={styles.badgeProgressBar}>
            <View 
              style={[styles.badgeProgressFill, { 
                backgroundColor: getRarityColor(badge.rarity),
                width: `${(badge.progress / badge.maxProgress) * 100}%` 
              }]} 
            />
          </View>
        </View>
      )}
      
      <View style={styles.badgeFooter}>
        <Text style={[styles.badgePoints, { color: colors.primary }]}>
          +{badge.points} pts
        </Text>
        <Text style={[styles.badgeRarity, { color: getRarityColor(badge.rarity) }]}>
          {badge.rarity.toUpperCase()}
        </Text>
      </View>
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
            <View style={styles.trophyContainer}>
              <Trophy size={32} color={BRAND.colors.navy} />
            </View>
            <Text style={styles.headerTitle}>Achievements</Text>
            <Text style={styles.headerSubtitle}>
              Track your charging streaks and earn badges
            </Text>
            <View style={styles.pointsContainer}>
              <Award size={20} color={BRAND.colors.navy} />
              <Text style={styles.totalPoints}>{totalPoints.toLocaleString()} Points</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Streaks</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            Keep your momentum going!
          </Text>
          {streaks.map(renderStreak)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges Collection</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            {badges.filter(b => b.earned).length} of {badges.length} earned
          </Text>
          <View style={styles.badgesGrid}>
            {badges.map(renderBadge)}
          </View>
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
  trophyContainer: {
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
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 39, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  totalPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND.colors.navy,
    marginLeft: 8,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  streakCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakStats: {
    fontSize: 14,
  },
  streakProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentStreak: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  targetStreak: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  badgeProgress: {
    width: '100%',
    marginBottom: 12,
  },
  badgeProgressText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeProgressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  badgeProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  badgePoints: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeRarity: {
    fontSize: 10,
    fontWeight: '600',
  },
});