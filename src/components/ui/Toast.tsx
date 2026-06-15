import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible:  boolean;
  message:  string;
  type?:    ToastType;
  duration?: number;
  onHide:   () => void;
}

const TOAST_CONFIG: Record<ToastType, {
  icon:            React.ComponentProps<typeof Feather>['name'];
  backgroundColor: string;
  textColor:       string;
}> = {
  success: {
    icon:            'check-circle',
    backgroundColor: Colors.success,
    textColor:       Colors.neutral[0],
  },
  error: {
    icon:            'alert-circle',
    backgroundColor: Colors.error,
    textColor:       Colors.neutral[0],
  },
  info: {
    icon:            'info',
    backgroundColor: Colors.primary[500],
    textColor:       Colors.neutral[0],
  },
};

export default function Toast({
  visible,
  message,
  type     = 'success',
  duration = 2200,
  onHide,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const insets     = useSafeAreaInsets();
  const config     = TOAST_CONFIG[type];

  useEffect(() => {
    if (visible) {
      // Entrar
      Animated.parallel([
        Animated.spring(translateY, {
          toValue:         0,
          tension:         70,
          friction:        10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue:         1,
          duration:        200,
          useNativeDriver: true,
        }),
      ]).start();

      // Salir después de `duration`
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue:         -80,
            duration:        280,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue:         0,
            duration:        280,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top:             insets.top + 12,
          backgroundColor: config.backgroundColor,
          transform:       [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Feather name={config.icon} size={18} color={config.textColor} />
      <Text style={[styles.message, { color: config.textColor }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:          'absolute',
    left:              Spacing.screenPadding,
    right:             Spacing.screenPadding,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    paddingHorizontal: 16,
    paddingVertical:   12,
    borderRadius:      Radius.xl,
    zIndex:            9999,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 4 },
    shadowOpacity:     0.20,
    shadowRadius:      8,
    elevation:         8,
  },
  message: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.sm,
    flex:       1,
  },
});