import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme/theme';

interface EmptyStateProps {
  icon:       React.ComponentProps<typeof Feather>['name'];
  title:      string;
  subtitle:   string;
  actionLabel?: string;
  onAction?:  () => void;
  compact?:   boolean;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactIconContainer}>
          <Feather name={icon} size={20} color={Colors.primary[300]} />
        </View>
        <View style={styles.compactTextContainer}>
          <Text style={styles.compactTitle}>{title}</Text>
          <Text style={styles.compactSubtitle}>{subtitle}</Text>
        </View>
        {onAction && actionLabel && (
          <TouchableOpacity onPress={onAction} style={styles.compactBtn}>
            <Text style={styles.compactBtnText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={40} color={Colors.primary[200]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onAction && actionLabel && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onAction}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Versión completa
  container: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: Spacing['8'],
    paddingBottom:     80,
    gap:               Spacing['3'],
  },
  iconContainer: {
    width:           88,
    height:          88,
    borderRadius:    44,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    Spacing['2'],
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.xl,
    color:      Colors.neutral[800],
    textAlign:  'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[500],
    textAlign:  'center',
    lineHeight: 24,
  },
  actionBtn: {
    backgroundColor:   Colors.primary[500],
    paddingHorizontal: Spacing['6'],
    paddingVertical:   Spacing['3'],
    borderRadius:      Radius.button,
    marginTop:         Spacing['2'],
  },
  actionBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[0],
  },

  // Versión compacta (flotante sobre el mapa)
  compactContainer: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    backgroundColor:   Colors.neutral[0],
    paddingHorizontal: 16,
    paddingVertical:   12,
    borderRadius:      20,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.10,
    shadowRadius:      6,
    elevation:         4,
  },
  compactIconContainer: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
  },
  compactTextContainer: {
    flex: 1,
    gap:  2,
  },
  compactTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.sm,
    color:      Colors.neutral[800],
  },
  compactSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[500],
  },
  compactBtn: {
    paddingHorizontal: 10,
    paddingVertical:   5,
    backgroundColor:   Colors.primary[50],
    borderRadius:      12,
  },
  compactBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      Colors.primary[500],
  },
});