import { Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radius } from '../../src/theme/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTabBarStore } from '../../src/stores/useTabBarStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = [
  { name: 'index',  icon: 'map'            as const, label: 'Mapa'      },
  { name: 'saved',  icon: 'bookmark'       as const, label: 'Guardados' },
  { name: 'chat',   icon: 'message-circle' as const, label: 'Chat'      },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets     = useSafeAreaInsets();
  const { tabBarAnim } = useTabBarStore();

  const bottomBase = Math.max(insets.bottom, 12) + 8;

  // Traducir hacia abajo cuando el sheet está abierto
  const tabBarTranslate = tabBarAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom:    bottomBase,
          transform: [{ translateY: tabBarTranslate }],
        },
      ]}
    >
      <View style={styles.bar}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type:               'tabPress',
              target:             state.routes[index]?.key,
              canPreventDefault:  true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <Feather
                name={tab.icon}
                size={22}
                color={isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.4)' },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left:     24,
    right:    24,
  },
  bar: {
    width:             '100%',
    height:            62,
    backgroundColor:   Colors.primary[500],
    borderRadius:      31,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-around',
    paddingHorizontal: 12,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 6 },
    shadowOpacity:     0.25,
    shadowRadius:      14,
    elevation:         12,
  },
  tabButton: {
    flex:           1,
    height:         62,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            3,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize:   11,
    letterSpacing: 0.1,
  },
});