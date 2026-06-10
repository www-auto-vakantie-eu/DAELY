import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { getMessageThreadById, addMessage, type MessageThread } from '@/services/messages-storage';

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

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case 'support':
      return '#F59E0B';
    case 'coach':
      return '#2563EB';
    case 'community':
      return '#10B981';
    case 'forwarded':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'support':
      return 'Support';
    case 'coach':
      return 'Coach';
    case 'community':
      return 'Community';
    case 'forwarded':
      return 'Doorgestuurd';
    default:
      return '';
  }
}

export default function MessageThreadScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [thread, setThread] = useState<MessageThread | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadThread = React.useCallback(async () => {
    setIsLoading(true);
    const loadedThread = await getMessageThreadById(id || '');
    setThread(loadedThread);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  async function handleSendMessage() {
    if (!messageText.trim() || !thread) return;

    const updatedThread = await addMessage(thread.id, messageText);
    if (updatedThread) {
      setThread(updatedThread);
      setMessageText('');
    }
  }

  if (isLoading) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.centerContent}>
            <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text>
          </View>
        </ScrollView>
        <SharedBottomNav activeTab="mijn" />
      </AppScreen>
    );
  }

  if (!thread) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="message-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Bericht niet gevonden</Text>
          </View>
        </ScrollView>
        <SharedBottomNav activeTab="mijn" />
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.threadHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.threadTitleRow}>
              <Text style={[styles.threadTitle, { color: theme.titleColor }]}>{thread.title}</Text>
            </View>
            <View style={styles.threadMeta}>
              <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(thread.type) + '20' }]}>
                <Text style={[styles.typeText, { color: getTypeBadgeColor(thread.type) }]}>
                  {getTypeLabel(thread.type)}
                </Text>
              </View>
              {thread.participantRole && (
                <Text style={[styles.participantRole, { color: theme.subtitleColor }]}>
                  {thread.participantRole}
                </Text>
              )}
            </View>
          </View>

          {thread.linkedItemTitle && (
            <View style={[styles.linkedItemBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="share-outline" size={18} color={theme.subtitleColor} />
              <View style={styles.linkedItemContent}>
                <Text style={[styles.linkedItemLabel, { color: theme.subtitleColor }]}>Gedeeld item</Text>
                <Text style={[styles.linkedItemTitle, { color: theme.titleColor }]}>{thread.linkedItemTitle}</Text>
              </View>
            </View>
          )}

          <View style={styles.messagesList}>
            {thread.messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.senderType === 'user'
                    ? [styles.userMessage, { backgroundColor: '#2563EB' }]
                    : [styles.otherMessage, { backgroundColor: theme.card, borderColor: theme.border }],
                ]}
              >
                <Text
                  style={[
                    styles.messageSender,
                    message.senderType === 'user' ? styles.userSender : { color: theme.subtitleColor },
                  ]}
                >
                  {message.senderName}
                </Text>
                <Text
                  style={[
                    styles.messageText,
                    message.senderType === 'user' ? { color: '#FFFFFF' } : { color: theme.titleColor },
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.senderType === 'user' ? { color: 'rgba(255,255,255,0.7)' } : { color: theme.subtitleColor },
                  ]}
                >
                  {formatTime(message.createdAt)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.titleColor }]}
            placeholder="Typ een bericht…"
            placeholderTextColor={theme.subtitleColor}
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: '#2563EB' }]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <SharedBottomNav activeTab="mijn" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
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
  threadHeader: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  threadTitleRow: {
    marginBottom: 8,
  },
  threadTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  threadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  linkedItemBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  linkedItemContent: {
    flex: 1,
  },
  linkedItemLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  linkedItemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  userSender: {
    color: 'rgba(255,255,255,0.9)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  bottomSpacer: {
    height: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});