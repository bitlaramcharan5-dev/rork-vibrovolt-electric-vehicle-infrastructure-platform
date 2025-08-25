import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Image, Text, View, StyleSheet } from 'react-native';
import { BRAND } from '@/constants/brand';
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/providers/auth-provider";
import { ChargingProvider } from "@/providers/charging-provider";
import { WalletProvider } from "@/providers/wallet-provider";
import { trpc, trpcClient } from "@/lib/trpc";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: colors.header,
      },
      headerTintColor: BRAND.colors.navy,
      headerTitleStyle: {
        fontWeight: '700',
      },
      headerTitleAlign: 'left',
      headerRight: () => (
        <View style={styles.headerRight} testID="headerRight">
          <Text style={[styles.appName, { color: BRAND.colors.navy }]}>{BRAND.name}</Text>
          <Image
            source={{ uri: BRAND.logoUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      ),
      headerLeft: () => <View style={{ width: 0 }} />,
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="station/[id]" options={{ 
        title: "Station Details",
        presentation: "card" 
      }} />
      <Stack.Screen name="booking/[id]" options={{ 
        title: "Book Charging Slot",
        presentation: "modal" 
      }} />
      <Stack.Screen name="charging-session" options={{ 
        title: "Charging Session",
        presentation: "fullScreenModal",
        headerShown: false
      }} />
      <Stack.Screen name="on-demand" options={{ 
        title: "On-Demand Charging",
        presentation: "modal" 
      }} />
      <Stack.Screen name="add-funds" options={{ 
        title: "Add Funds",
        presentation: "modal" 
      }} />
      <Stack.Screen name="vehicles" options={{ title: 'My Vehicles' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy & Security' }} />
      <Stack.Screen name="support" options={{ title: 'Help & Support' }} />
      <Stack.Screen name="chatbot" options={{ title: 'AI Assistant' }} />
      <Stack.Screen name="subscription" options={{ title: 'Subscription Plans' }} />
      <Stack.Screen name="achievements" options={{ title: 'Achievements' }} />
      <Stack.Screen name="need-charger" options={{ title: 'Request Charger' }} />
      <Stack.Screen name="emergency" options={{ 
        title: 'Emergency Services',
        presentation: 'fullScreenModal',
        headerShown: false
      }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    color: BRAND.colors.navy,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 1,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <AuthProvider>
              <WalletProvider>
                <ChargingProvider>
                  <ErrorBoundary>
                    <RootLayoutNav />
                  </ErrorBoundary>
                </ChargingProvider>
              </WalletProvider>
            </AuthProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
