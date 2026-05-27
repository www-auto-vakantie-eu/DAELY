import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

type PageHeaderProps = {
  title: string;
  showSettings?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
};

export default function PageHeader({
  title,
  showSettings = true,
  showSearch = true,
  showCart = true,
  onSettingsPress,
  onSearchPress,
  onCartPress,
}: PageHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <Text style={[styles.title, { color: theme.titleColor }]}>{title}</Text>
      <View style={styles.actionsRow}>
        {showSettings ? (
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onSettingsPress}
          >
            <MaterialCommunityIcons name="cog-outline" size={22} color={theme.titleColor} />
          </Pressable>
        ) : null}
        {showSearch ? (
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onSearchPress}
          >
            <MaterialCommunityIcons name="magnify" size={22} color={theme.titleColor} />
          </Pressable>
        ) : null}
        {showCart ? (
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onCartPress}
          >
            <MaterialCommunityIcons name="shopping-outline" size={22} color={theme.titleColor} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 68,
    lineHeight: 72,
    fontWeight: '900',
    letterSpacing: -2,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
});
