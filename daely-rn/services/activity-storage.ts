import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
  distanceMeters?: number;
  durationSeconds?: number;
  notes?: string;
}

export interface ActivityMetrics {
  workout?: {
    exercises?: WorkoutExercise[];
    rounds?: number;
    totalVolumeKg?: number;
    notes?: string;
  };
}

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
  metrics?: ActivityMetrics;
  createdAt: string;
}

const STORAGE_KEY = 'daely.tracker.activities.v1';

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) return undefined;
  return value;
}

function normalizeWorkoutExercise(value: unknown): WorkoutExercise | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== 'string' || typeof raw.name !== 'string') return null;
  if (typeof raw.sets !== 'number' || typeof raw.reps !== 'number') return null;

  return {
    id: raw.id,
    name: raw.name,
    sets: raw.sets,
    reps: raw.reps,
    weightKg: toOptionalNumber(raw.weightKg),
    distanceMeters: toOptionalNumber(raw.distanceMeters),
    durationSeconds: toOptionalNumber(raw.durationSeconds),
    notes: toOptionalString(raw.notes),
  };
}

function normalizeMetrics(value: unknown): ActivityMetrics | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const workoutRaw = raw.workout;
  if (!workoutRaw || typeof workoutRaw !== 'object') return undefined;

  const workoutRecord = workoutRaw as Record<string, unknown>;
  const exercises = Array.isArray(workoutRecord.exercises)
    ? workoutRecord.exercises
        .map((item) => normalizeWorkoutExercise(item))
        .filter((item): item is WorkoutExercise => item !== null)
    : undefined;

  const workout = {
    exercises,
    rounds: toOptionalNumber(workoutRecord.rounds),
    totalVolumeKg: toOptionalNumber(workoutRecord.totalVolumeKg),
    notes: toOptionalString(workoutRecord.notes),
  };

  if (!workout.exercises && workout.rounds === undefined && workout.totalVolumeKg === undefined && !workout.notes) {
    return undefined;
  }

  return { workout };
}

function normalizeActivities(value: unknown): Activity[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry): Activity | null => {
      if (!entry || typeof entry !== 'object') return null;
      const raw = entry as Record<string, unknown>;

      if (
        typeof raw.id !== 'string' ||
        typeof raw.disciplineId !== 'string' ||
        typeof raw.disciplineName !== 'string' ||
        typeof raw.trackingType !== 'string' ||
        typeof raw.startedAt !== 'string' ||
        typeof raw.endedAt !== 'string' ||
        typeof raw.durationSeconds !== 'number' ||
        raw.status !== 'completed' ||
        typeof raw.createdAt !== 'string'
      ) {
        return null;
      }

      return {
        id: raw.id,
        disciplineId: raw.disciplineId,
        disciplineName: raw.disciplineName,
        trackingType: raw.trackingType,
        startedAt: raw.startedAt,
        endedAt: raw.endedAt,
        durationSeconds: raw.durationSeconds,
        status: 'completed',
        notes: toOptionalString(raw.notes),
        metrics: normalizeMetrics(raw.metrics),
        createdAt: raw.createdAt,
      };
    })
    .filter((item): item is Activity => item !== null);
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
