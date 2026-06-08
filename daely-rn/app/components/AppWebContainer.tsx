import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

interface AppWebContainerProps {
  children: React.ReactNode;
}

export default function AppWebContainer({ children }: AppWebContainerProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
});