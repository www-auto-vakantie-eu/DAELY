import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Activity {
  id: string;
  disciplineId: string;
  disciplineName: string;
  trackingType: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  status: 'completed';
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'daely.tracker.activities.v1';

function normalizeActivities(value: unknown): Activity[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (a): a is Activity =>
      a && typeof a === 'object' &&
      typeof a.id === 'string' &&
      typeof a.disciplineId === 'string' &&
      typeof a.disciplineName === 'string' &&
      typeof a.trackingType === 'string' &&
      typeof a.startedAt === 'string' &&
      typeof a.endedAt === 'string' &&
      typeof a.durationSeconds === 'number' &&
      typeof a.status === 'string' &&
      typeof a.createdAt === 'string'
  );
}

export async function getActivities(): Promise<Activity[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return normalizeActivities(parsed);
  } catch (e) {
    return [];
  }
}

export async function saveActivity(activity: Activity): Promise<void> {
  const activities = await getActivities();
  if (activities.some(a => a.id === activity.id)) return; // prevent duplicate
  activities.unshift(activity);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

export async function deleteActivity(id: string): Promise<void> {
  const activities = await getActivities();
  const filtered = activities.filter(a => a.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
