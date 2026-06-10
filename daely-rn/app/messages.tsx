import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, type Href, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from './components/AppHeader';
import SharedBottomNav from '@/components/SharedBottomNav';
import { getMessageThreads, joinGroup, type MessageThread, type MessageThreadType } from '@/services/messages-storage';

type FilterType = MessageThreadType | 'all';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Alles' },
  { key: 'group', label: 'Groepen' },
  { key: 'support', label: 'Support' },
  { key: 'coach', label: 'Coaches' },
  { key: 'community', label: 'Community' },
  { key: 'forwarded', label: 'Doorgestuurd' },
];

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

export default function MessagesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
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
    if (activeFilter === 'all') return true;
    return thread.type === activeFilter;
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

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <Pressable
              key={filter.key}
              style={[
                styles.filterChip,
                activeFilter === filter.key && { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.key ? { color: theme.titleColor } : { color: theme.subtitleColor },
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.filterChip, styles.newGroupButton, { backgroundColor: '#2563EB' }]}
            onPress={() => router.push('/messages/new-group' as Href)}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.newGroupButtonText}>Nieuw</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text>
          </View>
        ) : filteredThreads.length === 0 ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="message-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Geen berichten</Text>
          </View>
        ) : (
          <View style={styles.threadsList}>
            {filteredThreads.map((thread) => (
              <Pressable
                key={thread.id}
                style={[styles.threadCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push(`/messages/${thread.id}` as Href)}
              >
                <View style={styles.threadHeader}>
                  <View style={styles.threadTitleRow}>
                    <Text style={[styles.threadTitle, { color: theme.titleColor }]}>{thread.title}</Text>
                    {thread.unreadCount && thread.unreadCount > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: '#EF4444' }]}>
                        <Text style={styles.unreadCount}>{thread.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.threadTime, { color: theme.subtitleColor }]}>{formatTime(thread.updatedAt)}</Text>
                </View>

                <View style={styles.threadMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(thread.type) + '20' }]}>
                    <Text style={[styles.typeText, { color: getTypeBadgeColor(thread.type) }]}>
                      {getTypeLabel(thread.type)}
                    </Text>
                  </View>
                  {thread.isGroup && thread.memberCount !== undefined && (
                    <View style={styles.memberCountRow}>
                      <MaterialCommunityIcons name="account-group" size={12} color={theme.subtitleColor} />
                      <Text style={[styles.memberCount, { color: theme.subtitleColor }]}>
                        {thread.memberCount}
                      </Text>
                    </View>
                  )}
                  {thread.participantRole && !thread.isGroup && (
                    <Text style={[styles.participantRole, { color: theme.subtitleColor }]}>
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

                <Text style={[styles.lastMessage, { color: theme.subtitleColor }]} numberOfLines={2}>
                  {thread.lastMessage}
                </Text>

                {thread.linkedItemTitle && (
                  <View style={[styles.linkedItemCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <MaterialCommunityIcons name="share-outline" size={14} color={theme.subtitleColor} />
                    <Text style={[styles.linkedItemText, { color: theme.subtitleColor }]}>
                      {thread.linkedItemTitle}
                    </Text>
                  </View>
                )}
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  newGroupButton: {
    borderColor: '#2563EB',
  },
  newGroupButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
  threadsList: {
    gap: 12,
  },
  threadCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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