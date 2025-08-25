import React, { useCallback, useMemo, useState } from 'react';
import { ImageBackground, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { BRAND } from '@/constants/brand';
import { Station } from '@/types/station';
import { router } from 'expo-router';

interface HyderabadMapProps {
  stations: Station[];
}

export default function HyderabadMap({ stations }: HyderabadMapProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  const bgUrl = useMemo(
    () =>
      'https://staticmap.openstreetmap.de/staticmap.php?center=17.3850,78.4867&zoom=11&size=1200x600&maptype=mapnik',
    []
  );

  return (
    <View style={styles.card} onLayout={onLayout} testID="hyderabad-map">
      <ImageBackground
        source={{ uri: bgUrl }}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        {size &&
          stations.map((s) => {
            const x = (s.markerX ?? 0.5) * size.width;
            const y = (s.markerY ?? 0.5) * size.height;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => router.push(`/station/${s.id}` as any)}
                activeOpacity={0.8}
                style={[styles.marker, { left: x - 10, top: y - 10 }]}
                testID={`marker-${s.id}`}
              >
                <MapPin size={18} color={BRAND.colors.green} />
                <View style={styles.markerLabelWrap}>
                  <Text style={styles.markerLabel} numberOfLines={1}>
                    {s.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND.colors.border,
  },
  bg: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: BRAND.colors.navy2,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,14,39,0.25)',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerLabelWrap: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    maxWidth: 180,
  },
  markerLabel: {
    color: BRAND.colors.white,
    fontSize: 10,
  },
});
