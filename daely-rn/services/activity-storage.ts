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

export type SessionIntensity = 'laag' | 'gemiddeld' | 'hoog';
export type SessionFeeling = 'laag' | 'neutraal' | 'goed' | 'sterk';
export type MatchType = 'training' | 'wedstrijd';

export interface MatchPersonalStats {
  goals?: number;
  assists?: number;
  points?: number;
  rebounds?: number;
  blocks?: number;
  tackles?: number;
}

export interface MatchMetrics {
  matchType?: MatchType;
  opponent?: string;
  team?: string;
  position?: string;
  scoreFor?: number;
  scoreAgainst?: number;
  personalStats?: MatchPersonalStats;
  intensity?: SessionIntensity;
  notes?: string;
}

export interface SessionMetrics {
  intensity?: SessionIntensity;
  focusAreas?: string[];
  feelingBefore?: SessionFeeling;
  feelingAfter?: SessionFeeling;
  notes?: string;
}

export interface ActivityMetrics {
  workout?: {
    exercises?: WorkoutExercise[];
    rounds?: number;
    totalVolumeKg?: number;
    notes?: string;
  };
  session?: SessionMetrics;
  match?: MatchMetrics;
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

function toOptionalSessionIntensity(value: unknown): SessionIntensity | undefined {
  if (value === 'laag' || value === 'gemiddeld' || value === 'hoog') return value;
  return undefined;
}

function toOptionalSessionFeeling(value: unknown): SessionFeeling | undefined {
  if (value === 'laag' || value === 'neutraal' || value === 'goed' || value === 'sterk') return value;
  return undefined;
}

function toOptionalMatchType(value: unknown): MatchType | undefined {
  if (value === 'training' || value === 'wedstrijd') return value;
  return undefined;
}

function toOptionalNonNegativeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value < 0) return undefined;
  return value;
}

function normalizeFocusAreas(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
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
  const sessionRaw = raw.session;
  const matchRaw = raw.match;

  let workout: ActivityMetrics['workout'];
  if (workoutRaw && typeof workoutRaw === 'object') {
    const workoutRecord = workoutRaw as Record<string, unknown>;
    const exercises = Array.isArray(workoutRecord.exercises)
      ? workoutRecord.exercises
          .map((item) => normalizeWorkoutExercise(item))
          .filter((item): item is WorkoutExercise => item !== null)
      : undefined;

    const normalizedWorkout = {
      exercises,
      rounds: toOptionalNumber(workoutRecord.rounds),
      totalVolumeKg: toOptionalNumber(workoutRecord.totalVolumeKg),
      notes: toOptionalString(workoutRecord.notes),
    };

    if (normalizedWorkout.exercises || normalizedWorkout.rounds !== undefined || normalizedWorkout.totalVolumeKg !== undefined || normalizedWorkout.notes) {
      workout = normalizedWorkout;
    }
  }

  let session: SessionMetrics | undefined;
  if (sessionRaw && typeof sessionRaw === 'object') {
    const sessionRecord = sessionRaw as Record<string, unknown>;
    const normalizedSession: SessionMetrics = {
      intensity: toOptionalSessionIntensity(sessionRecord.intensity),
      focusAreas: normalizeFocusAreas(sessionRecord.focusAreas),
      feelingBefore: toOptionalSessionFeeling(sessionRecord.feelingBefore),
      feelingAfter: toOptionalSessionFeeling(sessionRecord.feelingAfter),
      notes: toOptionalString(sessionRecord.notes),
    };

    if (
      normalizedSession.intensity !== undefined ||
      normalizedSession.focusAreas !== undefined ||
      normalizedSession.feelingBefore !== undefined ||
      normalizedSession.feelingAfter !== undefined ||
      normalizedSession.notes !== undefined
    ) {
      session = normalizedSession;
    }
  }

  let match: MatchMetrics | undefined;
  if (matchRaw && typeof matchRaw === 'object') {
    const matchRecord = matchRaw as Record<string, unknown>;

    let personalStats: MatchPersonalStats | undefined;
    if (matchRecord.personalStats && typeof matchRecord.personalStats === 'object') {
      const statsRecord = matchRecord.personalStats as Record<string, unknown>;
      const normalizedStats: MatchPersonalStats = {
        goals: toOptionalNonNegativeNumber(statsRecord.goals),
        assists: toOptionalNonNegativeNumber(statsRecord.assists),
        points: toOptionalNonNegativeNumber(statsRecord.points),
        rebounds: toOptionalNonNegativeNumber(statsRecord.rebounds),
        blocks: toOptionalNonNegativeNumber(statsRecord.blocks),
        tackles: toOptionalNonNegativeNumber(statsRecord.tackles),
      };

      if (
        normalizedStats.goals !== undefined ||
        normalizedStats.assists !== undefined ||
        normalizedStats.points !== undefined ||
        normalizedStats.rebounds !== undefined ||
        normalizedStats.blocks !== undefined ||
        normalizedStats.tackles !== undefined
      ) {
        personalStats = normalizedStats;
      }
    }

    const normalizedMatch: MatchMetrics = {
      matchType: toOptionalMatchType(matchRecord.matchType),
      opponent: toOptionalString(matchRecord.opponent),
      team: toOptionalString(matchRecord.team),
      position: toOptionalString(matchRecord.position),
      scoreFor: toOptionalNonNegativeNumber(matchRecord.scoreFor),
      scoreAgainst: toOptionalNonNegativeNumber(matchRecord.scoreAgainst),
      personalStats,
      intensity: toOptionalSessionIntensity(matchRecord.intensity),
      notes: toOptionalString(matchRecord.notes),
    };

    if (
      normalizedMatch.matchType !== undefined ||
      normalizedMatch.opponent !== undefined ||
      normalizedMatch.team !== undefined ||
      normalizedMatch.position !== undefined ||
      normalizedMatch.scoreFor !== undefined ||
      normalizedMatch.scoreAgainst !== undefined ||
      normalizedMatch.personalStats !== undefined ||
      normalizedMatch.intensity !== undefined ||
      normalizedMatch.notes !== undefined
    ) {
      match = normalizedMatch;
    }
  }

  if (!workout && !session && !match) return undefined;
  return { workout, session, match };
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
