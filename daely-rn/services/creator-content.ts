import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NutritionMeal } from '@/constants/nutrition-meals';
import type { WorkoutActivity } from '@/constants/workout-activities';

const STORAGE_KEYS = {
  posts: 'daely.creator.posts.v1',
  meals: 'daely.creator.publicMeals.v1',
  workouts: 'daely.creator.publicWorkouts.v1',
};

export type ModerationStatus = 'draft' | 'pending' | 'approved';

export interface CreatorPost {
  id: string;
  title: string;
  caption: string;
  createdAt: string;
  authorType: 'influencer';
  status: ModerationStatus;
}

export interface CreatorMealEntry {
  id: string;
  createdAt: string;
  authorType: 'influencer';
  status: ModerationStatus;
  meal: NutritionMeal;
}

export interface CreatorWorkoutEntry {
  id: string;
  createdAt: string;
  authorType: 'influencer';
  status: ModerationStatus;
  workout: WorkoutActivity;
}

export interface CreatorVisibilityOptions {
  includeUnapproved?: boolean;
}

async function readList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn('Failed to read creator-content key:', key, error);
    return [];
  }
}

async function writeList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function getCreatorPosts(): Promise<CreatorPost[]> {
  return readList<CreatorPost>(STORAGE_KEYS.posts);
}

export async function addCreatorPost(
  post: Omit<CreatorPost, 'id' | 'createdAt' | 'authorType' | 'status'>,
  status: ModerationStatus = 'pending'
): Promise<CreatorPost> {
  const current = await getCreatorPosts();
  const next: CreatorPost = {
    id: `creator-post-${Date.now()}`,
    title: post.title.trim(),
    caption: post.caption.trim(),
    createdAt: new Date().toISOString(),
    authorType: 'influencer',
    status,
  };
  await writeList(STORAGE_KEYS.posts, [next, ...current]);
  return next;
}

export async function approveCreatorPost(postId: string): Promise<void> {
  await setCreatorPostStatus(postId, 'approved');
}

export async function setCreatorPostStatus(postId: string, status: ModerationStatus): Promise<void> {
  const posts = await getCreatorPosts();
  const next = posts.map((post) => (post.id === postId ? { ...post, status } : post));
  await writeList(STORAGE_KEYS.posts, next);
}

export async function getCreatorMealEntries(): Promise<CreatorMealEntry[]> {
  return readList<CreatorMealEntry>(STORAGE_KEYS.meals);
}

export async function getPublicCreatorMeals(options?: CreatorVisibilityOptions): Promise<NutritionMeal[]> {
  const entries = await getCreatorMealEntries();
  const visible = options?.includeUnapproved ? entries : entries.filter((entry) => entry.status === 'approved');
  return visible.map((entry) => entry.meal);
}

export async function addPublicCreatorMeal(
  meal: Omit<NutritionMeal, 'id'>,
  status: ModerationStatus = 'pending'
): Promise<CreatorMealEntry> {
  const current = await getCreatorMealEntries();
  const mealWithId: NutritionMeal = {
    ...meal,
    id: `creator-meal-${Date.now()}`,
  };
  const next: CreatorMealEntry = {
    id: `creator-meal-entry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    authorType: 'influencer',
    status,
    meal: mealWithId,
  };
  await writeList(STORAGE_KEYS.meals, [next, ...current]);
  return next;
}

export async function approveCreatorMeal(entryId: string): Promise<void> {
  await setCreatorMealStatus(entryId, 'approved');
}

export async function setCreatorMealStatus(entryId: string, status: ModerationStatus): Promise<void> {
  const entries = await getCreatorMealEntries();
  const next = entries.map((entry) => (entry.id === entryId ? { ...entry, status } : entry));
  await writeList(STORAGE_KEYS.meals, next);
}

export async function getCreatorWorkoutEntries(): Promise<CreatorWorkoutEntry[]> {
  return readList<CreatorWorkoutEntry>(STORAGE_KEYS.workouts);
}

export async function getPublicCreatorWorkouts(options?: CreatorVisibilityOptions): Promise<WorkoutActivity[]> {
  const entries = await getCreatorWorkoutEntries();
  const visible = options?.includeUnapproved ? entries : entries.filter((entry) => entry.status === 'approved');
  return visible.map((entry) => entry.workout);
}

export async function addPublicCreatorWorkout(
  workout: Omit<WorkoutActivity, 'id'>,
  status: ModerationStatus = 'pending'
): Promise<CreatorWorkoutEntry> {
  const current = await getCreatorWorkoutEntries();
  const workoutWithId: WorkoutActivity = {
    ...workout,
    id: `creator-workout-${Date.now()}`,
  };
  const next: CreatorWorkoutEntry = {
    id: `creator-workout-entry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    authorType: 'influencer',
    status,
    workout: workoutWithId,
  };
  await writeList(STORAGE_KEYS.workouts, [next, ...current]);
  return next;
}

export async function approveCreatorWorkout(entryId: string): Promise<void> {
  await setCreatorWorkoutStatus(entryId, 'approved');
}

export async function setCreatorWorkoutStatus(entryId: string, status: ModerationStatus): Promise<void> {
  const entries = await getCreatorWorkoutEntries();
  const next = entries.map((entry) => (entry.id === entryId ? { ...entry, status } : entry));
  await writeList(STORAGE_KEYS.workouts, next);
}
