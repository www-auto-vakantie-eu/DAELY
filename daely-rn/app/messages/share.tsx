import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import SharedBottomNav from '@/components/SharedBottomNav';
import { getMessageThreads, shareItemToThread, type MessageThread, type LinkedItemType } from '@/services/messages-storage';

export default function ShareMessageScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    linkedItemType?: string;
    linkedItemId?: string;
    linkedItemTitle?: string;
  }>();
  
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const linkedItemType = params.linkedItemType as LinkedItemType;
  const linkedItemId = params.linkedItemId || '';
  const linkedItemTitle = params.linkedItemTitle || '';

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    setIsLoading(true);
    const loadedThreads = await getMessageThreads();
    // Filter to only show threads user is joined to (for groups) and all direct threads
    const filteredThreads = loadedThreads.filter((t) => {
      if (t.isGroup) {
        return t.joined === true;
      }
      return true;
    });
    setThreads(filteredThreads);
    setIsLoading(false);
  }

  async function handleShareThread(thread: MessageThread) {
    const updatedThread = await shareItemToThread(
      thread.id,
      linkedItemType,
      linkedItemId,
      linkedItemTitle,
      `${linkedItemTitle} gedeeld`
    );

    if (updatedThread) {
      router.push(`/messages/${thread.id}` as Href);
    }
  }

  function getThreadBadgeColor(type: string): string {
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

  function getThreadLabel(type: string): string {
    switch (type) {
      case 'support':
        return 'Support';
      case 'coach':
        return 'Coach';
      case 'community':
        return 'Sporter';
      case 'forwarded':
        return 'Doorgestuurd';
      case 'group':
        return 'Groep';
      default:
        return '';
    }
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Deel via berichten"
          subtitle="Kies waar je dit item wilt delen"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
        />

        {linkedItemTitle && (
          <View style={[styles.itemPreview, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="share-outline" size={20} color={theme.subtitleColor} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemType, { color: theme.subtitleColor }]}>
                {linkedItemType?.toUpperCase()}
              </Text>
              <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{linkedItemTitle}</Text>
            </View>
          </View>
        )}

        {isLoading ? (
          <View style={styles.centerContent}>
            <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text>
          </View>
        ) : threads.length === 0 ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="message-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Geen gesprekken</Text>
          </View>
        ) : (
          <View style={styles.threadsList}>
            {threads.map((thread) => (
              <Pressable
                key={thread.id}
                style={[styles.threadCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleShareThread(thread)}
              >
                <View style={styles.threadHeader}>
                  <View style={styles.threadTitleRow}>
                    <Text style={[styles.threadTitle, { color: theme.titleColor }]}>{thread.title}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: getThreadBadgeColor(thread.type) + '20' }]}>
                      <Text style={[styles.typeText, { color: getThreadBadgeColor(thread.type) }]}>
                        {getThreadLabel(thread.type)}
                      </Text>
                    </View>
                  </View>
                </View>
                {thread.participantRole && !thread.isGroup && (
                  <Text style={[styles.participantRole, { color: theme.subtitleColor }]}>
                    {thread.participantRole}
                  </Text>
                )}
                {thread.isGroup && thread.memberCount !== undefined && (
                  <View style={styles.memberCountRow}>
                    <MaterialCommunityIcons name="account-group" size={14} color={theme.subtitleColor} />
                    <Text style={[styles.memberCount, { color: theme.subtitleColor }]}>
                      {thread.memberCount} leden
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
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemType: {
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
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
    gap: 8,
  },
  threadCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  threadHeader: {
    marginBottom: 4,
  },
  threadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
    fontSize: 13,
    marginTop: 4,
  },
  memberCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  memberCount: {
    fontSize: 13,
  },
  bottomSpacer: {
    height: 100,
  },
});