import { Tabs } from "expo-router";
import { Map, Zap, Wallet, User } from "lucide-react-native";
import React from "react";
import { Platform, Dimensions } from "react-native";
import { BRAND } from "@/constants/brand";
import { useTheme } from "@/providers/theme-provider";

const { height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND.colors.navy,
        tabBarInactiveTintColor: BRAND.colors.slate,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.select({
            ios: isSmallScreen ? 78 : 88,
            android: isSmallScreen ? 56 : 60,
            default: 60,
          }),
          paddingBottom: Platform.select({
            ios: isSmallScreen ? 18 : 28,
            android: isSmallScreen ? 6 : 8,
            default: 8,
          }),
          paddingTop: isSmallScreen ? 6 : 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: BRAND.colors.navy,
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Map size={isSmallScreen ? 20 : 24} color={color} />,
          tabBarLabelStyle: {
            fontSize: isSmallScreen ? 10 : 12,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="charging"
        options={{
          title: "Charging",
          tabBarIcon: ({ color }) => <Zap size={isSmallScreen ? 20 : 24} color={color} />,
          tabBarLabelStyle: {
            fontSize: isSmallScreen ? 10 : 12,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <Wallet size={isSmallScreen ? 20 : 24} color={color} />,
          tabBarLabelStyle: {
            fontSize: isSmallScreen ? 10 : 12,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={isSmallScreen ? 20 : 24} color={color} />,
          tabBarLabelStyle: {
            fontSize: isSmallScreen ? 10 : 12,
            fontWeight: '500',
          },
        }}
      />
    </Tabs>
  );
}
