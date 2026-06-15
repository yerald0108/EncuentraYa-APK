import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../src/theme/theme';

export default function MipymeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} color={Colors.primary[500]} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.title}>Detalle de mipyme</Text>
        <Text style={styles.subtitle}>ID: {id}</Text>
        <Text style={styles.note}>— Fase 3 —</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[0],
  },
  backButton: {
    margin: Spacing.screenPadding,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: Typography.size.xl,
    color: Colors.neutral[900],
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: Typography.size.md,
    color: Colors.neutral[600],
  },
  note: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.sm,
    color: Colors.neutral[400],
    marginTop: 8,
  },
});