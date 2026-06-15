import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme/theme';

interface ErrorViewProps {
  title?:      string;
  subtitle?:   string;
  onRetry?:    () => void;
  compact?:    boolean; // versión pequeña para usar dentro de pantallas
}

export default function ErrorView({
  title    = 'Sin conexión',
  subtitle = 'Verifica tu conexión a internet e intenta de nuevo.',
  onRetry,
  compact  = false,
}: ErrorViewProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Feather name="wifi-off" size={18} color={Colors.error} />
        <Text style={styles.compactText}>{title}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.compactBtn}>
            <Text style={styles.compactBtnText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="wifi-off" size={40} color={Colors.neutral[300]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Feather name="refresh-cw" size={16} color={Colors.neutral[0]} />
          <Text style={styles.retryText}>Reintentar</Text>
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
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: Colors.neutral[100],
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
  retryBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    backgroundColor:   Colors.primary[500],
    paddingHorizontal: Spacing['6'],
    paddingVertical:   Spacing['3'],
    borderRadius:      Radius.button,
    marginTop:         Spacing['2'],
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[0],
  },

  // Versión compacta (badge flotante)
  compactContainer: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    backgroundColor:   Colors.neutral[0],
    paddingHorizontal: 16,
    paddingVertical:   10,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       Colors.error + '40',
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.10,
    shadowRadius:      6,
    elevation:         4,
  },
  compactText: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.sm,
    color:      Colors.error,
    flex:       1,
  },
  compactBtn: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    backgroundColor:   Colors.error + '15',
    borderRadius:      12,
  },
  compactBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      Colors.error,
  },
});