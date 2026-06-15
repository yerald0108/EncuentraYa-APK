import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows, Sizes } from '../theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar mipymes...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Feather
          name="search"
          size={18}
          color={Colors.neutral[500]}
          style={styles.searchIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral[400]}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearButton}
          >
            <Feather name="x-circle" size={18} color={Colors.neutral[400]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenPadding,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.xl,
    height: Sizes.inputHeight,
    paddingHorizontal: Spacing['4'],
    ...Shadows.md,
  },
  searchIcon: {
    marginRight: Spacing['2'],
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.md,
    color: Colors.neutral[900],
    height: '100%',
    padding: 0,
  },
  clearButton: {
    marginLeft: Spacing['2'],
    width: Sizes.touchTarget,
    height: Sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});