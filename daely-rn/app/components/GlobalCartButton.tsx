import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';

export function GlobalCartButton() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.globalCartButtonWrap}>
      <Pressable
        style={({ pressed }) => [styles.settingsPill, pressed && styles.settingsPillPressed]}
        onPress={() => router.push('/(tabs)/cart')}
      >
        <MaterialCommunityIcons name="shopping-outline" size={22} color="#2563EB" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  globalCartButtonWrap: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 100,
    elevation: 10,
    pointerEvents: 'box-none',
  },
  settingsPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
