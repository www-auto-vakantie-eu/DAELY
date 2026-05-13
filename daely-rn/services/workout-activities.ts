import AsyncStorage from '@react-native-async-storage/async-storage';

import { WORKOUT_ACTIVITIES, type WorkoutActivity } from '@/constants/workout-activities';

const STORAGE_KEY = 'daely.workout.activities.v1';

function normalizeActivities(value: unknown): WorkoutActivity[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is WorkoutActivity => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<WorkoutActivity>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.type === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.date === 'string' &&
      typeof candidate.dateIso === 'string' &&
      typeof candidate.icon === 'string' &&
      typeof candidate.accentColor === 'string' &&
      Array.isArray(candidate.metrics) &&
      Array.isArray(candidate.splits) &&
      Array.isArray(candidate.heartRateData) &&
      typeof candidate.description === 'string' &&
      typeof candidate.image === 'string'
    );
  });
}

export async function getStoredWorkoutActivities(): Promise<WorkoutActivity[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(WORKOUT_ACTIVITIES));
      return WORKOUT_ACTIVITIES;
    }

    const parsed = JSON.parse(raw) as unknown;
    const normalized = normalizeActivities(parsed);

    if (normalized.length === 0) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(WORKOUT_ACTIVITIES));
      return WORKOUT_ACTIVITIES;
    }

    return normalized;
  } catch (error) {
    console.warn('Failed to load stored workout activities, using defaults.', error);
    return WORKOUT_ACTIVITIES;
  }
}

export async function saveWorkoutActivities(activities: WorkoutActivity[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

export async function removeStoredWorkoutActivitiesByIdPrefix(prefix: string): Promise<number> {
  const activities = await getStoredWorkoutActivities();
  const filtered = activities.filter((activity) => !activity.id.startsWith(prefix));
  await saveWorkoutActivities(filtered);
  return activities.length - filtered.length;
}
