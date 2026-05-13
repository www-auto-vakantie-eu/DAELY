import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  likes: 'daely.engagement.likes.v1',
  comments: 'daely.engagement.comments.v1',
};

export interface Like {
  id: string;
  feedItemId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  feedItemId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
}

async function readList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn('Failed to read engagement key:', key, error);
    return [];
  }
}

async function writeList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

// LIKES
export async function getLikesForItem(feedItemId: string): Promise<Like[]> {
  const allLikes = await readList<Like>(STORAGE_KEYS.likes);
  return allLikes.filter((like) => like.feedItemId === feedItemId);
}

export async function getLikesCount(feedItemId: string): Promise<number> {
  const likes = await getLikesForItem(feedItemId);
  return likes.length;
}

export async function hasUserLiked(feedItemId: string, userId: string): Promise<boolean> {
  const likes = await getLikesForItem(feedItemId);
  return likes.some((like) => like.userId === userId);
}

export async function toggleLike(
  feedItemId: string,
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<boolean> {
  const allLikes = await readList<Like>(STORAGE_KEYS.likes);
  const existingIndex = allLikes.findIndex(
    (like) => like.feedItemId === feedItemId && like.userId === userId
  );

  if (existingIndex >= 0) {
    // Remove like
    allLikes.splice(existingIndex, 1);
    await writeList(STORAGE_KEYS.likes, allLikes);
    return false;
  } else {
    // Add like
    const newLike: Like = {
      id: `like-${Date.now()}`,
      feedItemId,
      userId,
      userName,
      userAvatar,
      createdAt: new Date().toISOString(),
    };
    allLikes.push(newLike);
    await writeList(STORAGE_KEYS.likes, allLikes);
    return true;
  }
}

// COMMENTS
export async function getCommentsForItem(feedItemId: string): Promise<Comment[]> {
  const allComments = await readList<Comment>(STORAGE_KEYS.comments);
  const itemComments = allComments.filter((comment) => comment.feedItemId === feedItemId);
  // Sort by newest first
  return itemComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getCommentsCount(feedItemId: string): Promise<number> {
  const comments = await getCommentsForItem(feedItemId);
  return comments.length;
}

export async function addComment(
  feedItemId: string,
  userId: string,
  userName: string,
  text: string,
  userAvatar?: string
): Promise<Comment> {
  const allComments = await readList<Comment>(STORAGE_KEYS.comments);
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    feedItemId,
    userId,
    userName,
    text: text.trim(),
    userAvatar,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  allComments.push(newComment);
  await writeList(STORAGE_KEYS.comments, allComments);
  return newComment;
}

export async function deleteComment(commentId: string): Promise<void> {
  const allComments = await readList<Comment>(STORAGE_KEYS.comments);
  const filtered = allComments.filter((comment) => comment.id !== commentId);
  await writeList(STORAGE_KEYS.comments, filtered);
}

export async function likeComment(commentId: string): Promise<void> {
  const allComments = await readList<Comment>(STORAGE_KEYS.comments);
  const comment = allComments.find((c) => c.id === commentId);
  if (comment) {
    comment.likes += 1;
    await writeList(STORAGE_KEYS.comments, allComments);
  }
}

export async function unlikeComment(commentId: string): Promise<void> {
  const allComments = await readList<Comment>(STORAGE_KEYS.comments);
  const comment = allComments.find((c) => c.id === commentId);
  if (comment && comment.likes > 0) {
    comment.likes -= 1;
    await writeList(STORAGE_KEYS.comments, allComments);
  }
}

// Get engagement totals
export async function getEngagementTotals(feedItemId: string): Promise<{
  likes: number;
  comments: number;
}> {
  const [likes, comments] = await Promise.all([
    getLikesCount(feedItemId),
    getCommentsCount(feedItemId),
  ]);
  return { likes, comments };
}
