import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { useRouter, type Href, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from './components/AppHeader';
import SharedBottomNav from '@/components/SharedBottomNav';
import { getMessageThreads, joinGroup, type MessageThread, type MessageThreadType } from '@/services/messages-storage';
import { THEMES } from '@/constants/themes';

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'nu';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}u`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

function getTypeBadgeColor(type: MessageThreadType): string {
  switch (type) {
    case 'support':
      return '#F59E0B';
    case 'coach':
      return '#2563EB';
    case 'community':
      return '#10B981';
    case 'forwarded':
      return '#8B5CF6';
    case 'group':
      return '#EC4899';
    default:
      return '#6B7280';
  }
}

function getTypeLabel(type: MessageThreadType): string {
  switch (type) {
    case 'support':
      return 'Support';
    case 'coach':
      return 'Coach';
    case 'community':
      return 'Community';
    case 'forwarded':
      return 'Doorgestuurd';
    case 'group':
      return 'Groep';
    default:
      return '';
  }
}

// Helper to get theme-aware Classic Glow tokens (same as Today/Nutrition/Discipline/Community/Workouts)
function getClassicGlowTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';

  return {
    isClassic,
    gradient: isClassic ? ['#FFFFFF', '#F8FBFF', '#EFF6FF'] : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'],
    titleColor: isClassic ? '#0F172A' : (currentTheme.colors.auroraTitle || '#1E1B4B'),
    subtitleColor: isClassic ? '#475569' : (currentTheme.colors.auroraSubtitle || '#4A3A8C'),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : undefined,
    // Secondary button color
    secondaryButtonColor: isClassic ? '#2563EB' : '#8B5CF6',
  };
}

export default function MessagesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { activeThemeId } = useAppContext();
  const { isClassic, gradient, titleColor, subtitleColor, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, shortcutBorderColor, shortcutShadowColor, secondaryButtonColor } = getClassicGlowTokens(activeThemeId);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadThreads();
    }, [])
  );

  async function loadThreads() {
    setIsLoading(true);
    const loadedThreads = await getMessageThreads();
    setThreads(loadedThreads);
    setIsLoading(false);
  }

  async function handleJoinGroup(groupId: string) {
    await joinGroup(groupId);
    loadThreads();
  }

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      thread.title.toLowerCase().includes(query) ||
      thread.participantName.toLowerCase().includes(query) ||
      (thread.participantRole?.toLowerCase().includes(query) ?? false) ||
      thread.lastMessage.toLowerCase().includes(query) ||
      thread.type.toLowerCase().includes(query) ||
      (thread.groupType?.toLowerCase().includes(query) ?? false) ||
      (thread.linkedItemTitle?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Berichten"
          subtitle="Coaches, support en community"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.primaryActionButton, { backgroundColor: '#2563EB' }]}
            onPress={() => router.push('/messages/new' as Href)}
          >
            <MaterialCommunityIcons name="message-plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Nieuw bericht</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.secondaryActionButton, { backgroundColor: secondaryButtonColor }]}
            onPress={() => router.push('/messages/new-group' as Href)}
          >
            <MaterialCommunityIcons name="account-multiple-plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Nieuwe groep</Text>
          </Pressable>
        </View>

        <View style={[styles.searchBar, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={subtitleColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: titleColor, backgroundColor: isClassic ? '#FFFFFF' : theme.card, borderColor: shortcutBorderColor }]}
            placeholder="Zoek in berichten…"
            placeholderTextColor={subtitleColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text>
          </View>
        ) : filteredThreads.length === 0 ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="message-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
              {searchQuery ? 'Geen gesprekken gevonden.' : 'Geen berichten'}
            </Text>
            {searchQuery && (
              <Text style={[styles.emptySubText, { color: theme.subtitleColor }]}>
                Probeer een andere zoekterm.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.threadsList}>
            {filteredThreads.map((thread) => (
              <Pressable
                key={thread.id}
                style={[styles.threadCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}
                onPress={() => router.push(`/messages/${thread.id}` as Href)}
              >
                <View style={styles.threadCardInner}>
                  {/* Background gradient - absolute full-cover */}
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.threadCardBackground}
                    pointerEvents="none"
                  >
                    {/* Top-left ribbon */}
                    <LinearGradient
                      colors={ribbonTop}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.threadRibbonTop}
                      pointerEvents="none"
                    />
                    {/* Mid-card ribbon */}
                    <LinearGradient
                      colors={ribbonMid}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.threadRibbonMid}
                      pointerEvents="none"
                    />
                    {/* Diagonal top-right ribbon */}
                    <LinearGradient
                      colors={ribbonBlue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.threadRibbonBlue}
                      pointerEvents="none"
                    />
                    {/* Diagonal bottom-left ribbon */}
                    <LinearGradient
                      colors={ribbonRose}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.threadRibbonRose}
                      pointerEvents="none"
                    />
                    {/* Right-side accent ribbon */}
                    <LinearGradient
                      colors={ribbonRight}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.threadRibbonRight}
                      pointerEvents="none"
                    />
                    {/* Soft white highlight overlay */}
                    <LinearGradient
                      colors={ribbonHighlight}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.threadRibbonHighlight}
                      pointerEvents="none"
                    />
                  </LinearGradient>
                  {/* Content layer - above background */}
                  <View style={styles.threadCardContent}>
                    <View style={styles.threadHeader}>
                      <View style={styles.threadTitleRow}>
                        <Text style={[styles.threadTitle, { color: titleColor }]}>{thread.title}</Text>
                        {thread.unreadCount && thread.unreadCount > 0 && (
                          <View style={[styles.unreadBadge, { backgroundColor: '#EF4444' }]}>
                            <Text style={styles.unreadCount}>{thread.unreadCount}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.threadTime, { color: subtitleColor }]}>{formatTime(thread.updatedAt)}</Text>
                    </View>

                    <View style={styles.threadMeta}>
                      <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(thread.type) + '20' }]}>
                        <Text style={[styles.typeText, { color: getTypeBadgeColor(thread.type) }]}>
                          {getTypeLabel(thread.type)}
                        </Text>
                      </View>
                      {thread.isGroup && thread.memberCount !== undefined && (
                        <View style={styles.memberCountRow}>
                          <MaterialCommunityIcons name="account-group" size={12} color={subtitleColor} />
                          <Text style={[styles.memberCount, { color: subtitleColor }]}>
                            {thread.memberCount}
                          </Text>
                        </View>
                      )}
                      {thread.participantRole && !thread.isGroup && (
                        <Text style={[styles.participantRole, { color: subtitleColor }]}>
                          {thread.participantRole}
                        </Text>
                      )}
                      {thread.isGroup && thread.joined === false && (
                        <Pressable
                          style={[styles.joinedBadge, { backgroundColor: '#10B981' }]}
                          onPress={() => handleJoinGroup(thread.id)}
                        >
                          <Text style={styles.joinedText}>Word lid</Text>
                        </Pressable>
                      )}
                    </View>

                    <Text style={[styles.lastMessage, { color: subtitleColor }]} numberOfLines={2}>
                      {thread.lastMessage}
                    </Text>

                    {thread.linkedItemTitle && (
                      <View style={[styles.linkedItemCard, { backgroundColor: isClassic ? '#F8FBFF' : theme.background, borderColor: shortcutBorderColor }]}>
                        <MaterialCommunityIcons name="share-outline" size={14} color={subtitleColor} />
                        <Text style={[styles.linkedItemText, { color: subtitleColor }]}>
                          {thread.linkedItemTitle}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="mijn" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryActionButton: {},
  secondaryActionButton: {},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  threadsList: {
    gap: 12,
  },
  threadCard: {
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  threadCardInner: {
    position: 'relative',
    overflow: 'hidden',
  },
  threadCardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  threadRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  threadRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  threadRibbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '25deg' }],
  },
  threadRibbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '-20deg' }],
  },
  threadRibbonRight: {
    position: 'absolute',
    top: '-6%',
    right: '-12%',
    width: '140%',
    height: '60%',
    transform: [{ rotate: '-5deg' }],
  },
  threadRibbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  threadCardContent: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  threadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  threadTime: {
    fontSize: 12,
  },
  threadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  participantRole: {
    fontSize: 12,
  },
  memberCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberCount: {
    fontSize: 12,
  },
  joinedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  joinedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  linkedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  linkedItemText: {
    fontSize: 12,
  },
  bottomSpacer: {
    height: 100,
  },
});