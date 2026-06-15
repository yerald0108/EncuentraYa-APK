import { create } from 'zustand';
import { Animated } from 'react-native';

interface TabBarStore {
  tabBarAnim: Animated.Value;
  hideTabBar: () => void;
  showTabBar: () => void;
}

// Valor compartido — mismo objeto en toda la app
const sharedAnim = new Animated.Value(0);

export const useTabBarStore = create<TabBarStore>(() => ({
  tabBarAnim: sharedAnim,

  hideTabBar: () => {
    Animated.timing(sharedAnim, {
      toValue:  1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  },

  showTabBar: () => {
    Animated.timing(sharedAnim, {
      toValue:  0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  },
}));