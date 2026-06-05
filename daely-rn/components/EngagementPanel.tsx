import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import {
  getLikesCount,
  getCommentsForItem,
  toggleLike,
  addComment,
  deleteComment,
  hasUserLiked,
  type Comment,
} from '@/services/engagement';

interface EngagementPanelProps {
  feedItemId: string;
  onClose: () => void;
  visible: boolean;
}

const CURRENT_USER_ID = 'current-user-default'; // Placeholder: replace with actual authenticated user ID
const CURRENT_USER_NAME = 'You';
const CURRENT_USER_AVATAR = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80';

export function EngagementPanel({ feedItemId, onClose, visible }: EngagementPanelProps) {
  const theme = useTheme();
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const loadEngagement = async () => {
      const [count, isLiked, commentList] = await Promise.all([
        getLikesCount(feedItemId),
        hasUserLiked(feedItemId, CURRENT_USER_ID),
        getCommentsForItem(feedItemId),
      ]);
      setLikeCount(count);
      setHasLiked(isLiked);
      setComments(commentList);
    };

    loadEngagement();
  }, [feedItemId, visible]);

  const handleLike = async () => {
    const newHasLiked = await toggleLike(feedItemId, CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR);
    setHasLiked(newHasLiked);
    setLikeCount((prev) => (newHasLiked ? prev + 1 : prev - 1));
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    setLoading(true);
    try {
      const comment = await addComment(
        feedItemId,
        CURRENT_USER_ID,
        CURRENT_USER_NAME,
        newCommentText,
        CURRENT_USER_AVATAR
      );
      setComments((prev) => [comment, ...prev]);
      setNewCommentText('');
    } catch {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteComment(commentId);
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-down" size={24} color={theme.titleColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Engagement</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Likes Stats */}
          <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="heart" size={20} color="#EF4444" />
                <Text style={[styles.statValue, { color: theme.titleColor }]}>{likeCount}</Text>
                <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Likes</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="comment-multiple" size={20} color="#3B82F6" />
                <Text style={[styles.statValue, { color: theme.titleColor }]}>{comments.length}</Text>
                <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Comments</Text>
              </View>
            </View>

            <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
              <Pressable
                style={[styles.actionButton, hasLiked && styles.actionButtonActive]}
                onPress={handleLike}
              >
                <MaterialCommunityIcons
                  name={hasLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={hasLiked ? '#EF4444' : theme.subtitleColor}
                />
                <Text style={[styles.actionText, { color: hasLiked ? '#EF4444' : theme.subtitleColor }]}>
                  {hasLiked ? 'Liked' : 'Like'}
                </Text>
              </Pressable>

              <Pressable style={styles.actionButton}>
                <MaterialCommunityIcons name="share-outline" size={18} color={theme.subtitleColor} />
                <Text style={[styles.actionText, { color: theme.subtitleColor }]}>Share</Text>
              </Pressable>
            </View>
          </View>

          {/* Add Comment */}
          <View style={[styles.commentInputSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Add Comment</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.titleColor }]}
                placeholder="Share your thoughts..."
                placeholderTextColor={theme.subtitleColor}
                multiline
                numberOfLines={3}
                value={newCommentText}
                onChangeText={setNewCommentText}
                editable={!loading}
              />
            </View>
            <Pressable
              style={[styles.submitButton, !newCommentText.trim() || loading ? styles.submitButtonDisabled : null]}
              onPress={handleAddComment}
              disabled={!newCommentText.trim() || loading}
            >
              <MaterialCommunityIcons
                name={loading ? 'progress-clock' : 'send'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.submitButtonText}>{loading ? 'Posting...' : 'Post Comment'}</Text>
            </Pressable>
          </View>

          {/* Comments List */}
          <View>
            <Text style={[styles.sectionTitle, { color: theme.titleColor, marginBottom: 12 }]}>
              Comments ({comments.length})
            </Text>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  style={[styles.commentCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAuthor}>
                      <Text style={[styles.commentName, { color: theme.titleColor }]}>{comment.userName}</Text>
                      <Text style={[styles.commentTime, { color: theme.subtitleColor }]}>
                        {new Date(comment.createdAt).toLocaleDateString('nl-NL', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    {comment.userId === CURRENT_USER_ID && (
                      <Pressable
                        onPress={() => handleDeleteComment(comment.id)}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons name="trash-can-outline" size={16} color="#EF4444" />
                      </Pressable>
                    )}
                  </View>

                  <Text style={[styles.commentText, { color: theme.titleColor }]}>{comment.text}</Text>

                  <View style={styles.commentFooter}>
                    <Pressable style={styles.commentLikeButton}>
                      <MaterialCommunityIcons name="heart-outline" size={14} color={theme.subtitleColor} />
                      <Text style={[styles.commentLikeText, { color: theme.subtitleColor }]}>
                        {comment.likes}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="comment-outline" size={28} color={theme.subtitleColor} />
                <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>
                  Noch keine Kommentare. Sei der Erste!
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  statsCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: 20,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  statItem: { alignItems: 'center', gap: 6 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  divider: { width: 1, backgroundColor: '#E5E7EB' },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    marginHorizontal: 12,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  actionButtonActive: {},
  actionText: { fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  commentInputSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  inputWrap: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  input: { fontSize: 14, fontWeight: '500' },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: { backgroundColor: '#93C5FD' },
  submitButtonText: { color: '#FFFFFF', fontWeight: '700' },
  commentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  commentAuthor: { gap: 2 },
  commentName: { fontSize: 13, fontWeight: '700' },
  commentTime: { fontSize: 11, fontWeight: '500' },
  commentText: { fontSize: 13, fontWeight: '500', lineHeight: 18, marginBottom: 8 },
  commentFooter: { flexDirection: 'row', gap: 8 },
  commentLikeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentLikeText: { fontSize: 11, fontWeight: '600' },
  emptyState: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: { fontSize: 13, fontWeight: '500' },
  bottomSpacer: { height: 40 },
});
