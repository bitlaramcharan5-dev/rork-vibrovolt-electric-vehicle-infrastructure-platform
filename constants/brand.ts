export const BRAND = {
  name: 'VIBROVOLT' as const,
  colors: {
    navy: '#0A0E27' as const,
    navy2: '#10163A' as const,
    green: '#00FF88' as const,
    greenDark: '#00CC6F' as const,
    white: '#FFFFFF' as const,
    slate: '#8B92B9' as const,
    card: 'rgba(255, 255, 255, 0.05)' as const,
    border: 'rgba(255, 255, 255, 0.1)' as const,
  },
  logoUrl:
    'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/w06d4a2g9ev29bg8vjyqp',
} as const;

export type BrandColors = typeof BRAND.colors;
