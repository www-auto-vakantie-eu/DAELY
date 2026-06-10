import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  rightActions?: React.ReactNode;
};

export default function AppHeader({
  title,
  subtitle,
  showSettings = true,
  showSearch,
  showCart = false,
  onSettingsPress,
  onSearchPress,
  onCartPress,
  rightActions,
}: AppHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.titleColor }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>{subtitle}</Text>}
      </View>
      <View style={styles.actionsRow}>
        {rightActions}
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
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
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