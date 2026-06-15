import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme/theme';

interface SettingRowProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, onPress }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconContainer}>
          <Feather name={icon} size={18} color={Colors.primary[500]} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Feather name="chevron-right" size={18} color={Colors.neutral[400]} />
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <View style={styles.content}>
        {/* Sección general */}
        <Text style={styles.sectionLabel}>GENERAL</Text>
        <View style={styles.card}>
          <SettingRow icon="map-pin" label="Ciudad" value="La Habana" />
          <View style={styles.divider} />
          <SettingRow icon="bell" label="Notificaciones" />
          <View style={styles.divider} />
          <SettingRow icon="globe" label="Idioma" value="Español" />
        </View>

        {/* Sección app */}
        <Text style={styles.sectionLabel}>APLICACIÓN</Text>
        <View style={styles.card}>
          <SettingRow icon="info" label="Acerca de EcuentraYa" />
          <View style={styles.divider} />
          <SettingRow icon="star" label="Calificar la app" />
          <View style={styles.divider} />
          <SettingRow icon="share-2" label="Compartir app" />
        </View>

        {/* Versión */}
        <Text style={styles.version}>EcuentraYa v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing['6'],
    paddingBottom: 100,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: Typography.size.xs,
    color: Colors.neutral[500],
    letterSpacing: 1,
    marginBottom: Spacing['2'],
    marginLeft: Spacing['1'],
  },
  card: {
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.lg,
    marginBottom: Spacing['6'],
    ...Shadows.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['4'],
    minHeight: 52,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  rowIconContainer: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: Typography.size.base,
    color: Colors.neutral[800],
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  rowValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.base,
    color: Colors.neutral[500],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginLeft: Spacing['4'] + 34 + Spacing['3'],
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.sm,
    color: Colors.neutral[400],
    textAlign: 'center',
    marginTop: Spacing['2'],
  },
});