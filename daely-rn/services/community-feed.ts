import { getCreatorPosts, getCreatorMealEntries, getCreatorWorkoutEntries } from '@/services/creator-content';
import { getStoredWorkoutActivities } from '@/services/workout-activities';
import type { CreatorPost, CreatorMealEntry, CreatorWorkoutEntry } from '@/services/creator-content';
import type { WorkoutActivity } from '@/constants/workout-activities';

export type FeedItemType = 'post' | 'meal' | 'workout';

export interface BaseFeedItem {
  id: string;
  type: FeedItemType;
  authorId: string;
  authorName: string;
  authorImage: string;
  authorBadge?: string;
  authorType: 'creator' | 'user';
  createdAt: string;
  engagementCount: number;
  isApproved: boolean;
}

export interface PostFeedItem extends BaseFeedItem {
  type: 'post';
  data: CreatorPost;
  title: string;
  caption: string;
  image?: string;
}

export interface MealFeedItem extends BaseFeedItem {
  type: 'meal';
  data: CreatorMealEntry['meal'];
  title: string;
  kcal: number;
  protein: number;
  image: string;
  mealType: string;
}

export interface WorkoutFeedItem extends BaseFeedItem {
  type: 'workout';
  data: WorkoutActivity;
  title: string;
  duration: string;
  workoutType: string;
  icon: string;
  accentColor: string;
}

export type FeedItem = PostFeedItem | MealFeedItem | WorkoutFeedItem;

export async function getCommunitFeed(options?: {
  includeUnapproved?: boolean;
  limit?: number;
  sortBy?: 'recent' | 'popular';
}): Promise<FeedItem[]> {
  const includeUnapproved = options?.includeUnapproved ?? false;
  const limit = options?.limit ?? 50;
  const sortBy = options?.sortBy ?? 'recent';

  // Fetch all content
  const [creatorPosts, creatorMeals, creatorWorkouts, userWorkouts] = await Promise.all([
    getCreatorPosts(),
    getCreatorMealEntries(),
    getCreatorWorkoutEntries(),
    getStoredWorkoutActivities(),
  ]);

  const feedItems: FeedItem[] = [];

  // Add creator posts
  creatorPosts.forEach((post) => {
    if (!includeUnapproved && post.status !== 'approved') return;

    const item: PostFeedItem = {
      id: post.id,
      type: 'post',
      authorId: `creator-${post.id}`,
      authorName: 'Creator Post',
      authorImage: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80',
      authorType: 'creator',
      createdAt: post.createdAt,
      engagementCount: Math.floor(Math.random() * 500),
      isApproved: post.status === 'approved',
      data: post,
      title: post.title,
      caption: post.caption,
    };
    feedItems.push(item);
  });

  // Add creator meals
  creatorMeals.forEach((entry) => {
    if (!includeUnapproved && entry.status !== 'approved') return;

    const meal = entry.meal;
    const item: MealFeedItem = {
      id: entry.id,
      type: 'meal',
      authorId: `creator-meal-${entry.id}`,
      authorName: 'Creator Meal',
      authorImage: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80',
      authorType: 'creator',
      createdAt: entry.createdAt,
      engagementCount: Math.floor(Math.random() * 300),
      isApproved: entry.status === 'approved',
      data: meal,
      title: meal.title,
      kcal: meal.kcal,
      protein: meal.protein,
      image: meal.image,
      mealType: meal.mealType || 'Lunch',
    };
    feedItems.push(item);
  });

  // Add creator workouts
  creatorWorkouts.forEach((entry) => {
    if (!includeUnapproved && entry.status !== 'approved') return;

    const workout = entry.workout;
    const durationMetric = workout.metrics.find((m) => m.label === 'Duur');
    const item: WorkoutFeedItem = {
      id: entry.id,
      type: 'workout',
      authorId: `creator-workout-${entry.id}`,
      authorName: 'Creator Workout',
      authorImage: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80',
      authorType: 'creator',
      createdAt: entry.createdAt,
      engagementCount: Math.floor(Math.random() * 400),
      isApproved: entry.status === 'approved',
      data: workout,
      title: workout.title,
      duration: durationMetric?.value || 'Onbekend',
      workoutType: workout.type,
      icon: workout.icon,
      accentColor: workout.accentColor,
    };
    feedItems.push(item);
  });

  // Add user workouts
  userWorkouts.forEach((workout) => {
    const sportMetric = workout.metrics.find((m) => m.label === 'Sport');
    const durationMetric = workout.metrics.find((m) => m.label === 'Duur');

    const item: WorkoutFeedItem = {
      id: workout.id,
      type: 'workout',
      authorId: `user-${workout.id}`,
      authorName: 'My Workout',
      authorImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
      authorType: 'user',
      createdAt: workout.dateIso,
      engagementCount: 0,
      isApproved: true,
      data: workout,
      title: workout.title,
      duration: durationMetric?.value || 'Onbekend',
      workoutType: sportMetric?.value || workout.type,
      icon: workout.icon,
      accentColor: workout.accentColor,
    };
    feedItems.push(item);
  });

  // Sort
  if (sortBy === 'recent') {
    feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'popular') {
    feedItems.sort((a, b) => b.engagementCount - a.engagementCount);
  }

  // Limit
  return feedItems.slice(0, limit);
}

export async function getFeedItemsByType(
  type: FeedItemType,
  options?: {
    includeUnapproved?: boolean;
    limit?: number;
  }
): Promise<FeedItem[]> {
  const allItems = await getCommunitFeed(options);
  return allItems.filter((item) => item.type === type);
}

export function formatFeedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins}m geleden`;
  if (diffHours < 24) return `${diffHours}u geleden`;
  if (diffDays < 7) return `${diffDays}d geleden`;

  return date.toLocaleDateString('nl-NL', {
    month: 'short',
    day: 'numeric',
  });
}
