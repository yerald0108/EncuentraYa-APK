import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MipymeCategoria, CATEGORIAS } from '../../types/mipyme.types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme/theme';

interface CategoryChipProps {
  categoria: MipymeCategoria | 'todos';
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({ categoria, selected, onPress }: CategoryChipProps) {
  const isTodos = categoria === 'todos';
  const config = isTodos
    ? { label: 'Todos', icon: 'grid', color: Colors.primary[500] }
    : CATEGORIAS[categoria];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        selected && { backgroundColor: config.color, borderColor: config.color },
        !selected && styles.chipInactive,
      ]}
    >
      <Feather
        name={config.icon as any}
        size={13}
        color={selected ? Colors.neutral[0] : Colors.neutral[600]}
      />
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing['3'],
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  chipInactive: {
    backgroundColor: Colors.neutral[0],
    borderColor: Colors.neutral[300],
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: Typography.size.sm,
    color: Colors.neutral[700],
  },
  labelSelected: {
    color: Colors.neutral[0],
    fontFamily: 'Inter_600SemiBold',
  },
});