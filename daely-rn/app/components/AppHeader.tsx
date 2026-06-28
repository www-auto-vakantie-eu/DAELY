import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showSettings?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showMessages?: boolean;
  unreadMessagesCount?: number;
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onMessagesPress?: () => void;
  rightActions?: React.ReactNode;
};

export default function AppHeader({
  title,
  subtitle,
  showSettings = true,
  showSearch,
  showCart = false,
  showMessages = false,
  unreadMessagesCount = 0,
  onSettingsPress,
  onSearchPress,
  onCartPress,
  onMessagesPress,
  rightActions,
}: AppHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
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
        {showMessages ? (
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onMessagesPress}
          >
            <MaterialCommunityIcons name="message-text-outline" size={22} color={theme.titleColor} />
            {unreadMessagesCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}</Text>
              </View>
            )}
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
  logoContainer: {
    flexShrink: 0,
    marginLeft: -16,
  },
  logo: {
    height: 50,
    width: 150,
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
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});