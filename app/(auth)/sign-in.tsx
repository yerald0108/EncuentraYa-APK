import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../src/theme/theme';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login — Fase 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.neutral[0] },
  text: { fontFamily: 'Inter_500Medium', fontSize: Typography.size.md, color: Colors.neutral[600] },
});