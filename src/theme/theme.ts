// ============================================================
// ENCUENTRAYA — SISTEMA DE DISEÑO GLOBAL
// Todos los valores visuales de la app viven aquí.
// NUNCA uses colores, tamaños o tipografías fuera de este archivo.
// ============================================================

import { Platform } from 'react-native';

// ─────────────────────────────────────────────
// PALETA DE COLORES
// Inspirada en la identidad cubana: azul profundo,
// rojo bandera y blanco limpio.
// ─────────────────────────────────────────────
export const Colors = {
  // Primario — Azul marino cubano (logo, botones CTA, pins del mapa)
  primary: {
    50:  '#E8EEF5',
    100: '#C5D4E6',
    200: '#9FB7D4',
    300: '#7899C2',
    400: '#5A82B5',
    500: '#1A3A5C', // ← color base de la app
    600: '#163350',
    700: '#112B43',
    800: '#0D2236',
    900: '#081829',
  },

  // Secundario — Rojo bandera cubana (accents, badges activos)
  secondary: {
    50:  '#FDECEA',
    100: '#F9C9C4',
    200: '#F5A39B',
    300: '#F07D72',
    400: '#EC5F53',
    500: '#CC2936', // ← rojo cubano
    600: '#B52430',
    700: '#9C1F29',
    800: '#831922',
    900: '#6A1219',
  },

  // Neutros — Grises para textos, fondos, bordes
  neutral: {
    0:   '#FFFFFF',
    50:  '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },

  // Estados semánticos
  success: '#2D9B5A',
  warning: '#F59E0B',
  error:   '#DC2626',
  info:    '#3B82F6',

  // Transparencias útiles
  overlay:      'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(0, 0, 0, 0.15)',

  // Específicos de UI
  mapBackground: '#E8F0F7',
  cardShadow:    'rgba(26, 58, 92, 0.12)',
} as const;

// ─────────────────────────────────────────────
// TIPOGRAFÍA
// System fonts con Inter como preferida.
// ─────────────────────────────────────────────
export const Typography = {
  // Familias
  fontFamily: {
    regular:  Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter_400Regular',
    medium:   Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter_500Medium',
    semiBold: Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter_600SemiBold',
    bold:     Platform.OS === 'ios' ? 'SF Pro Display' : 'Inter_700Bold',
  },

  // Escala de tamaños
  size: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Alturas de línea (line height)
  lineHeight: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.75,
  },

  // Pesos
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semiBold: '600' as const,
    bold:     '700' as const,
  },
} as const;

// ─────────────────────────────────────────────
// ESPACIADO — Sistema 4pt base
// ─────────────────────────────────────────────
export const Spacing = {
  '0':   0,
  '1':   4,
  '2':   8,
  '3':   12,
  '4':   16,
  '5':   20,
  '6':   24,
  '7':   28,
  '8':   32,
  '10':  40,
  '12':  48,
  '16':  64,
  // Específicos de layout
  screenPadding:   16,
  cardPadding:     16,
  sectionGap:      24,
  itemGap:         12,
} as const;

// ─────────────────────────────────────────────
// BORDES Y RADIOS
// ─────────────────────────────────────────────
export const Radius = {
  none:  0,
  sm:    4,
  md:    8,
  lg:    12,
  xl:    16,
  '2xl': 20,
  full:  9999,
  // Específicos
  card:   12,
  button: 10,
  badge:  20,
  input:  10,
  mapPin: 8,
} as const;

// ─────────────────────────────────────────────
// SOMBRAS — Coherentes entre iOS y Android
// ─────────────────────────────────────────────
export const Shadows = {
  none: {
    shadowColor:   'transparent',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius:  0,
    elevation:     0,
  },
  sm: {
    shadowColor:   Colors.cardShadow,
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius:  3,
    elevation:     2,
  },
  md: {
    shadowColor:   Colors.cardShadow,
    shadowOffset:  { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius:  6,
    elevation:     4,
  },
  lg: {
    shadowColor:   Colors.cardShadow,
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius:  12,
    elevation:     8,
  },
  mapCard: {
    shadowColor:   'rgba(0,0,0,0.20)',
    shadowOffset:  { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius:  8,
    elevation:     10,
  },
} as const;

// ─────────────────────────────────────────────
// DIMENSIONES MÍNIMAS DE INTERACCIÓN
// WCAG: mínimo 44x44pt para targets táctiles
// ─────────────────────────────────────────────
export const Sizes = {
  touchTarget:    44,
  buttonHeight:   50,
  buttonHeightSm: 38,
  inputHeight:    52,
  tabBarHeight:   64,
  headerHeight:   56,
  cardImageHeight: 160,
  mapPinSize:     44,
  avatarSm:       32,
  avatarMd:       44,
  avatarLg:       64,
} as const;

// ─────────────────────────────────────────────
// ANIMACIONES
// ─────────────────────────────────────────────
export const Animation = {
  duration: {
    fast:    150,
    normal:  250,
    slow:    400,
  },
  easing: {
    standard: 'ease-in-out',
    enter:    'ease-out',
    exit:     'ease-in',
  },
} as const;

// ─────────────────────────────────────────────
// EXPORT UNIFICADO
// ─────────────────────────────────────────────
export const Theme = {
  colors:    Colors,
  typography: Typography,
  spacing:   Spacing,
  radius:    Radius,
  shadows:   Shadows,
  sizes:     Sizes,
  animation: Animation,
} as const;

export type ThemeType = typeof Theme;
export default Theme;