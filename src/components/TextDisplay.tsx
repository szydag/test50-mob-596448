import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

interface TextDisplayProps {
  label: string;
  value: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  label,
  value,
  style,
  labelStyle,
  valueStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  valueContainer: {
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.secondary, // Slightly different background for display
  },
  value: {
    fontSize: 16,
    color: theme.text,
  },
});

export default TextDisplay;
