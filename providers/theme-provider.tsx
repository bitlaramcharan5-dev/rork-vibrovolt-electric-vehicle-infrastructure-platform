import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BRAND } from '@/constants/brand';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  accent: string;
  border: string;
  tabBar: string;
  header: string;
}

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
  isDark: boolean;
}

const STORAGE_KEY = 'vibrovolt:theme';

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextValue>(() => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          setModeState(saved);
        }
      } catch (e) {
        console.log('Theme load error', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(err => console.log('Theme save error', err));
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const colors = useMemo<ThemeColors>(() => {
    if (mode === 'dark') {
      return {
        background: BRAND.colors.navy,
        card: 'rgba(255,255,255,0.05)',
        text: BRAND.colors.white,
        subtext: BRAND.colors.slate,
        primary: BRAND.colors.green,
        accent: BRAND.colors.greenDark,
        border: BRAND.colors.border,
        tabBar: BRAND.colors.white,
        header: BRAND.colors.white,
      };
    }
    return {
      background: BRAND.colors.white,
      card: 'rgba(10,14,39,0.04)',
      text: BRAND.colors.navy,
      subtext: BRAND.colors.slate,
      primary: BRAND.colors.green,
      accent: BRAND.colors.greenDark,
      border: 'rgba(10,14,39,0.08)',
      tabBar: BRAND.colors.white,
      header: BRAND.colors.white,
    };
  }, [mode]);

  const isDark = mode === 'dark';

  return {
    mode,
    colors,
    toggle,
    setMode,
    isDark,
  };
});