import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIAS, MipymeCategoria } from '../types/mipyme.types';
import { Colors, Radius, Shadows } from '../theme/theme';

interface MapPinProps {
  categoria: MipymeCategoria;
  selected?: boolean;
}

export default function MapPin({ categoria, selected = false }: MapPinProps) {
  const config = CATEGORIAS[categoria];
  const pinColor = selected ? Colors.secondary[500] : config.color;
  const size = selected ? 48 : 40;
  const iconSize = selected ? 20 : 16;

  return (
    <View style={[styles.wrapper, { width: size, height: size + 8 }]}>
      {/* Burbuja del pin */}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: pinColor,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: selected ? 3 : 2,
            borderColor: Colors.neutral[0],
          },
          selected ? Shadows.lg : Shadows.md,
        ]}
      >
        <Feather name={config.icon as any} size={iconSize} color={Colors.neutral[0]} />
      </View>
      {/* Punta del pin */}
      <View
        style={[
          styles.tail,
          {
            borderTopColor: pinColor,
            borderTopWidth: 8,
            borderLeftWidth: 5,
            borderRightWidth: 5,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    width: 0,
    height: 0,
  },
});