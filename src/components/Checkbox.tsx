import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  checkboxSize?: number;
  checkboxColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
  disabled = false,
  style,
  labelStyle,
  checkboxSize = 24,
  checkboxColor = theme.primary,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { width: checkboxSize, height: checkboxSize, borderColor: checkboxColor },
          checked && { backgroundColor: checkboxColor, borderColor: checkboxColor },
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && <Icon name="check" size={checkboxSize * 0.75} color="#FFFFFF" />}
      </View>
      <Text style={[styles.label, labelStyle, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxDisabled: {
    opacity: 0.6,
    backgroundColor: '#E0E0E0',
    borderColor: '#B0B0B0',
  },
  label: {
    fontSize: 16,
    color: theme.text,
  },
  labelDisabled: {
    opacity: 0.6,
  },
});

export default Checkbox;
