import 'react-native-gesture-handler'; // Required for React Navigation
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme';
import { Platform } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} backgroundColor={theme.primary} />
      <AppNavigator />
    </>
  );
}
