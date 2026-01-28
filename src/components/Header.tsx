import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
  color?: string;
  leftButtonIcon?: string;
  onLeftButtonPress?: () => void;
  rightButtonIcon?: string;
  onRightButtonPress?: () => void;
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;

const Header: React.FC<HeaderProps> = ({
  title,
  color = theme.primary,
  leftButtonIcon,
  onLeftButtonPress,
  rightButtonIcon,
  onRightButtonPress,
}) => {
  const navigation = useNavigation();

  const handleLeftPress = onLeftButtonPress || (navigation.canGoBack() ? () => navigation.goBack() : undefined);
  const resolvedLeftIcon = leftButtonIcon || (navigation.canGoBack() ? 'arrow-back' : undefined);

  return (
    <View style={[styles.headerContainer, { backgroundColor: color, paddingTop: STATUSBAR_HEIGHT }]}>
      <View style={styles.leftSection}>
        {resolvedLeftIcon && handleLeftPress && (
          <TouchableOpacity onPress={handleLeftPress} style={styles.iconButton}>
            <Icon name={resolvedLeftIcon} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleSection}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.rightSection}>
        {rightButtonIcon && onRightButtonPress && (
          <TouchableOpacity onPress={onRightButtonPress} style={styles.iconButton}>
            <Icon name={rightButtonIcon} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 56 + STATUSBAR_HEIGHT, // Default AppBar height + status bar
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1,
  },
  leftSection: {
    width: 40, // Reserve space for back button
    justifyContent: 'center',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40, // Reserve space for right button
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconButton: {
    padding: 5,
  },
});

export default Header;
