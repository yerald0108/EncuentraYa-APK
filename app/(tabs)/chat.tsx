import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../src/theme/theme';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat General</Text>
      </View>
      <View style={styles.center}>
        <View style={styles.iconContainer}>
          <Feather name="message-circle" size={48} color={Colors.primary[200]} />
        </View>
        <Text style={styles.emptyTitle}>Próximamente</Text>
        <Text style={styles.emptyText}>
          Aquí podrás chatear con otros usuarios y dueños de mipymes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: Typography.size.xl,
    color: Colors.neutral[900],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['10'],
    paddingBottom: 80,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['4'],
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: Typography.size.lg,
    color: Colors.neutral[800],
    marginBottom: Spacing['2'],
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.base,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
  },
});