import AsyncStorage from '@react-native-async-storage/async-storage';

const POST_COMMENTS_KEY = 'daely.post.comments.v1';

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export async function getCommentsForPost(postId: string): Promise<PostComment[]> {
  try {
    const stored = await AsyncStorage.getItem(POST_COMMENTS_KEY);
    if (!stored) {
      return [];
    }
    const allComments: PostComment[] = JSON.parse(stored);
    return allComments.filter((c) => c.postId === postId);
  } catch (error) {
    console.error('Error loading post comments:', error);
    return [];
  }
}

export async function addCommentToPost(
  postId: string,
  userId: string,
  userName: string,
  text: string
): Promise<PostComment | null> {
  try {
    const stored = await AsyncStorage.getItem(POST_COMMENTS_KEY);
    const allComments: PostComment[] = stored ? JSON.parse(stored) : [];

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId,
      userName,
      text,
      createdAt: new Date().toISOString(),
    };

    allComments.push(newComment);
    await AsyncStorage.setItem(POST_COMMENTS_KEY, JSON.stringify(allComments));

    return newComment;
  } catch (error) {
    console.error('Error adding comment to post:', error);
    return null;
  }
}