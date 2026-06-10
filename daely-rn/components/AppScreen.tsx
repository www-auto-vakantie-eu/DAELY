import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AppScreenProps {
  children: React.ReactNode;
  style?: any;
}

export function AppScreen({ children, style }: AppScreenProps) {
  return (
    <View style={[styles.screen, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
});