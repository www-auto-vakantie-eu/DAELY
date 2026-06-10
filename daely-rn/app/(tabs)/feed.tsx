// ...alle imports bovenaan...
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, RefreshControl, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { getCommunitFeed, formatFeedDate, type FeedItem, type FeedItemType } from '@/services/community-feed';
import { getCommentsForPost, addCommentToPost, type PostComment } from '@/services/post-comments-storage';

const FILTER_OPTIONS: FeedItemType[] = ['post', 'meal', 'workout'];

export default function CommunityFeedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FeedItemType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [commentsByPostId, setCommentsByPostId] = useState<Record<string, PostComment[]>>({});
  const [commentInputByPostId, setCommentInputByPostId] = useState<Record<string, string>>({});
  const [expandedCommentsByPostId, setExpandedCommentsByPostId] = useState<Record<string, boolean>>({});

  const loadFeed = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const items = await getCommunitFeed({
        includeUnapproved: false,
        limit: 100,
        sortBy,
      });
      setFeedItems(items);

      // Apply filter
      if (selectedFilter === 'all') {
        setFilteredItems(items);
      } else {
        setFilteredItems(items.filter((item) => item.type === selectedFilter));
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFilter, sortBy]);

  const loadCommentsForPost = useCallback(async (postId: string) => {
    const comments = await getCommentsForPost(postId);
    setCommentsByPostId((prev) => ({ ...prev, [postId]: comments }));
  }, []);

  const toggleComments = useCallback(async (postId: string) => {
    setExpandedCommentsByPostId((prev) => {
      const isExpanded = prev[postId];
      const newState = { ...prev, [postId]: !isExpanded };
      
      // Load comments when expanding
      if (!isExpanded) {
        loadCommentsForPost(postId);
      }
      
      return newState;
    });
  }, [loadCommentsForPost]);

  const handleCommentSubmit = useCallback(async (postId: string) => {
    const text = commentInputByPostId[postId]?.trim();
    if (!text) return;

    const newComment = await addCommentToPost(postId, 'user', 'Jij', text);
    if (newComment) {
      setCommentInputByPostId((prev) => ({ ...prev, [postId]: '' }));
      loadCommentsForPost(postId);
    }
  }, [commentInputByPostId, loadCommentsForPost]);

  const renderCommentsSection = (postId: string) => {
    const isExpanded = expandedCommentsByPostId[postId];
    const comments = commentsByPostId[postId] || [];

    return (
      <>
        <Pressable
          style={styles.replyButton}
          onPress={() => toggleComments(postId)}
        >
          <MaterialCommunityIcons name="comment-outline" size={16} color={theme.subtitleColor} />
          <Text style={[styles.replyButtonText, { color: theme.subtitleColor }]}>
            Reageren {comments.length > 0 && `· ${comments.length}`}
          </Text>
        </Pressable>

        {isExpanded && (
          <View style={[styles.commentsSection, { borderTopColor: theme.border }]}>
            {comments.length === 0 ? (
              <Text style={[styles.noCommentsText, { color: theme.subtitleColor }]}>
                Nog geen reacties.
              </Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={[styles.commentItem, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.commentUser, { color: theme.titleColor }]}>{comment.userName}</Text>
                  <Text style={[styles.commentText, { color: theme.subtitleColor }]}>{comment.text}</Text>
                </View>
              ))
            )}

            <View style={styles.commentInputRow}>
              <TextInput
                style={[styles.commentInput, { backgroundColor: theme.background, color: theme.titleColor, borderColor: theme.border }]}
                placeholder="Schrijf een reactie…"
                placeholderTextColor={theme.subtitleColor}
                value={commentInputByPostId[postId] || ''}
                onChangeText={(text) => setCommentInputByPostId((prev) => ({ ...prev, [postId]: text }))}
                multiline
              />
              <Pressable
                style={[styles.commentSubmitButton, { backgroundColor: '#2563EB' }]}
                onPress={() => handleCommentSubmit(postId)}
              >
                <Text style={styles.commentSubmitButtonText}>Plaats</Text>
              </Pressable>
            </View>
          </View>
        )}
      </>
    );
  };

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredItems(feedItems);
    } else {
      setFilteredItems(feedItems.filter((item) => item.type === selectedFilter));
    }
  }, [selectedFilter, feedItems]);

  const renderFeedItem = (item: FeedItem) => {
    if (item.type === 'post') {
      return (
        <View key={item.id} style={[styles.feedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.authorInfo}>
              <Image source={{ uri: item.authorImage }} style={styles.authorAvatar} />
              <View style={styles.authorDetails}>
                <Text style={[styles.authorName, { color: theme.titleColor }]}>{item.authorName}</Text>
                <Text style={[styles.timestamp, { color: theme.subtitleColor }]}>{formatFeedDate(item.createdAt)}</Text>
              </View>
            </View>
            <View style={[styles.authorBadge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.authorBadgeText}>Creator</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.postTitle, { color: theme.titleColor }]}>{item.title}</Text>
            <Text style={[styles.postCaption, { color: theme.subtitleColor }]} numberOfLines={3}>
              {item.caption}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.engagement}>
              <MaterialCommunityIcons name="heart-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.engagementText, { color: theme.subtitleColor }]}>{item.engagementCount}</Text>
            </View>
            <Pressable
              style={styles.forwardButton}
              onPress={() => router.push({
                pathname: '/messages/share',
                params: {
                  linkedItemType: 'post',
                  linkedItemId: item.id,
                  linkedItemTitle: item.title || 'Feedpost',
                },
              })}
            >
              <MaterialCommunityIcons name="share-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.forwardButtonText, { color: theme.subtitleColor }]}>Doorsturen</Text>
            </Pressable>
          </View>
          {renderCommentsSection(item.id)}
        </View>
      );
    }

    if (item.type === 'meal') {
      return (
        <View key={item.id} style={[styles.feedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.authorInfo}>
              <Image source={{ uri: item.authorImage }} style={styles.authorAvatar} />
              <View style={styles.authorDetails}>
                <Text style={[styles.authorName, { color: theme.titleColor }]}>{item.authorName}</Text>
                <Text style={[styles.timestamp, { color: theme.subtitleColor }]}>{formatFeedDate(item.createdAt)}</Text>
              </View>
            </View>
            <View style={[styles.authorBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.authorBadgeText}>Meal</Text>
            </View>
          </View>

          <View style={styles.mealContent}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={[styles.mealTitle, { color: theme.titleColor }]}>{item.title}</Text>
              <Text style={[styles.mealType, { color: theme.subtitleColor }]}>{item.mealType}</Text>
              <View style={styles.macroRow}>
                <View style={styles.macroBox}>
                  <Text style={[styles.macroValue, { color: theme.titleColor }]}>{item.kcal}</Text>
                  <Text style={[styles.macroLabel, { color: theme.subtitleColor }]}>kcal</Text>
                </View>
                <View style={styles.macroBox}>
                  <Text style={[styles.macroValue, { color: theme.titleColor }]}>{item.protein}g</Text>
                  <Text style={[styles.macroLabel, { color: theme.subtitleColor }]}>protein</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.engagement}>
              <MaterialCommunityIcons name="heart-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.engagementText, { color: theme.subtitleColor }]}>{item.engagementCount}</Text>
            </View>
            <Pressable
              style={styles.forwardButton}
              onPress={() => router.push({
                pathname: '/messages/share',
                params: {
                  linkedItemType: 'post',
                  linkedItemId: item.id,
                  linkedItemTitle: item.title || 'Feedpost',
                },
              })}
            >
              <MaterialCommunityIcons name="share-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.forwardButtonText, { color: theme.subtitleColor }]}>Doorsturen</Text>
            </Pressable>
          </View>
          {renderCommentsSection(item.id)}
        </View>
      );
    }

    if (item.type === 'workout') {
      return (
        <View key={item.id} style={[styles.feedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.authorInfo}>
              <Image source={{ uri: item.authorImage }} style={styles.authorAvatar} />
              <View style={styles.authorDetails}>
                <Text style={[styles.authorName, { color: theme.titleColor }]}>{item.authorName}</Text>
                <Text style={[styles.timestamp, { color: theme.subtitleColor }]}>{formatFeedDate(item.createdAt)}</Text>
              </View>
            </View>
            <View style={[styles.authorBadge, { backgroundColor: `${item.accentColor}20` }]}>
              <Text style={[styles.authorBadgeText, { color: item.accentColor }]}>Workout</Text>
            </View>
          </View>

          <View style={styles.workoutContent}>
            <View style={[styles.workoutIconBox, { backgroundColor: `${item.accentColor}15` }]}>
              <MaterialCommunityIcons name={item.icon as any} size={28} color={item.accentColor} />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutTitle, { color: theme.titleColor }]}>{item.title}</Text>
              <Text style={[styles.workoutMeta, { color: theme.subtitleColor }]}>
                {item.workoutType} · {item.duration}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.engagement}>
              <MaterialCommunityIcons name="heart-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.engagementText, { color: theme.subtitleColor }]}>{item.engagementCount}</Text>
            </View>
            <Pressable
              style={styles.forwardButton}
              onPress={() => router.push({
                pathname: '/messages/share',
                params: {
                  linkedItemType: 'post',
                  linkedItemId: item.id,
                  linkedItemTitle: item.title || 'Feedpost',
                },
              })}
            >
              <MaterialCommunityIcons name="share-outline" size={16} color={theme.subtitleColor} />
              <Text style={[styles.forwardButtonText, { color: theme.subtitleColor }]}>Doorsturen</Text>
            </Pressable>
          </View>
          {renderCommentsSection(item.id)}
        </View>
      );
    }
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadFeed(true)} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.titleColor }]}>Feed.</Text>
            <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Alles van je community.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/athlete')}>
            <MaterialCommunityIcons name="cog-outline" size={20} color={theme.titleColor} />
          </Pressable>
        </View>

        {/* Controls */}
        <View style={styles.controlsSection}>
          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {(['all', ...FILTER_OPTIONS] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              const label =
                filter === 'all'
                  ? 'Alles'
                  : filter === 'post'
                    ? 'Posts'
                    : filter === 'meal'
                      ? 'Gerechten'
                      : 'Workouts';

              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    isSelected
                      ? { backgroundColor: '#2563EB' }
                      : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterChipText, { color: isSelected ? '#FFFFFF' : theme.subtitleColor }]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Sort Toggle */}
          <View style={styles.sortRow}>
            <Text style={[styles.sortLabel, { color: theme.subtitleColor }]}>Sorteren op:</Text>
            <Pressable
              style={[styles.sortButton, sortBy === 'recent' ? styles.sortButtonActive : {}]}
              onPress={() => setSortBy('recent')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'recent' ? styles.sortButtonTextActive : {}]}>Recent</Text>
            </Pressable>
            <Pressable
              style={[styles.sortButton, sortBy === 'popular' ? styles.sortButtonActive : {}]}
              onPress={() => setSortBy('popular')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'popular' ? styles.sortButtonTextActive : {}]}>Popular</Text>
            </Pressable>
          </View>
        </View>

        {/* Feed Items */}
        {loading ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="progress-clock" size={40} color={theme.titleColor} />
            <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Feed laden...</Text>
          </View>
        ) : filteredItems.length > 0 ? (
          <View style={styles.feedContainer}>{filteredItems.map((item) => renderFeedItem(item))}</View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="inbox-multiple-outline" size={40} color={theme.subtitleColor} />
            <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen content in deze feed.</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { fontSize: 48, fontWeight: '900', letterSpacing: -1.5 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  controlsSection: { marginBottom: 20 },
  filterScroll: { marginBottom: 12 },
  filterChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sortLabel: { fontSize: 12, fontWeight: '600' },
  sortButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  sortButtonActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  sortButtonText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  sortButtonTextActive: { color: '#FFFFFF' },
  feedContainer: { gap: 12 },
  feedCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  authorInfo: { flexDirection: 'row', gap: 10, flex: 1 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20 },
  authorDetails: { justifyContent: 'center', flex: 1 },
  authorName: { fontSize: 14, fontWeight: '700' },
  timestamp: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  authorBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  authorBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D7874' },
  cardContent: { marginBottom: 10 },
  postTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  postCaption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  mealContent: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  mealImage: { width: 80, height: 80, borderRadius: 12 },
  mealInfo: { flex: 1 },
  mealTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  mealType: { fontSize: 11, fontWeight: '500', marginBottom: 6 },
  macroRow: { flexDirection: 'row', gap: 8 },
  macroBox: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  macroValue: { fontSize: 12, fontWeight: '700' },
  macroLabel: { fontSize: 10, fontWeight: '500', marginTop: 1 },
  workoutContent: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'center' },
  workoutIconBox: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  workoutInfo: { flex: 1 },
  workoutTitle: { fontSize: 14, fontWeight: '700' },
  workoutMeta: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  engagement: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  engagementText: { fontSize: 12, fontWeight: '600' },
  forwardButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 4 },
  forwardButtonText: { fontSize: 12, fontWeight: '600' },
  replyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 4, marginTop: 8 },
  replyButtonText: { fontSize: 12, fontWeight: '600' },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  noCommentsText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  commentItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
  },
  commentSubmitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  commentSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  moreButton: { padding: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyStateText: { fontSize: 14, fontWeight: '500' },
  bottomSpacer: { height: 40 },
});
