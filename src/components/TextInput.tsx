import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, TextInputProps as RNTextInputProps, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

interface CustomTextInputProps extends RNTextInputProps {
  label: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  style,
  inputStyle,
  labelStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <RNTextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.background,
  },
});

export default TextInput;
