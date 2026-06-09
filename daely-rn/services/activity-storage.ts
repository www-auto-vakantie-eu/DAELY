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

export interface WorkoutExerciseLog {
  id: string;
  exerciseId?: string;
  exerciseName: string;
  completed: boolean;
  sets?: {
    setNumber: number;
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
    completed?: boolean;
  }[];
  notes?: string;
}

export type SessionIntensity = 'laag' | 'gemiddeld' | 'hoog';
export type SessionFeeling = 'laag' | 'neutraal' | 'goed' | 'sterk';
export type MatchType = 'training' | 'wedstrijd';
export type ScoreType = 'racket' | 'golf' | 'other';
export type ScoreResult = 'gewonnen' | 'verloren' | 'gelijkspel' | 'n.v.t.';
export type SkillType = 'combat' | 'gymnastics' | 'parkour' | 'climbing' | 'other';
export type LapsStrokeType = 'vrije slag' | 'schoolslag' | 'rugslag' | 'vlinderslag' | 'wisselslag' | 'gemengd';
export type GpsPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export interface GpsRoutePoint {
  latitude: number;
  longitude: number;
  timestamp?: number;
  speedMps?: number;
}

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

export interface ScoreMetrics {
  scoreType?: ScoreType;
  opponent?: string;
  result?: ScoreResult;
  setsFor?: number;
  setsAgainst?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  holesPlayed?: number;
  strokes?: number;
  par?: number;
  handicap?: number;
  intensity?: SessionIntensity;
  notes?: string;
}

export interface SkillMetrics {
  skillType?: SkillType;
  level?: string;
  techniques?: string[];
  attempts?: number;
  successfulAttempts?: number;
  grade?: string;
  rounds?: number;
  intensity?: SessionIntensity;
  notes?: string;
}

export interface LapsMetrics {
  poolLengthMeters?: number;
  laps?: number;
  distanceMeters?: number;
  strokeType?: LapsStrokeType;
  pacePer100mSeconds?: number;
  intensity?: SessionIntensity;
  notes?: string;
}

export interface GpsMetrics {
  distanceMeters?: number;
  averageSpeedKmh?: number | null;
  maxSpeedKmh?: number | null;
  routePoints?: GpsRoutePoint[];
  locationPermissionStatus?: GpsPermissionStatus;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId?: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'duration';
  previousValue?: number;
  newValue: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  achievedAt: string;
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
    workoutExercises?: WorkoutExerciseLog[];
    completedExercisesCount?: number;
    totalExercisesCount?: number;
    rounds?: number;
    totalVolumeKg?: number;
    notes?: string;
    personalRecords?: PersonalRecord[];
  };
  session?: SessionMetrics;
  match?: MatchMetrics;
  score?: ScoreMetrics;
  skill?: SkillMetrics;
  laps?: LapsMetrics;
  gps?: GpsMetrics;
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
  workoutId?: string;
  workoutName?: string;
  programId?: string;
  programWeek?: number;
  programDay?: number;
  createdAt: string;
  updatedAt?: string;
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

function toOptionalScoreType(value: unknown): ScoreType | undefined {
  if (value === 'racket' || value === 'golf' || value === 'other') return value;
  return undefined;
}

function toOptionalScoreResult(value: unknown): ScoreResult | undefined {
  if (value === 'gewonnen' || value === 'verloren' || value === 'gelijkspel' || value === 'n.v.t.') return value;
  return undefined;
}

function toOptionalSkillType(value: unknown): SkillType | undefined {
  if (value === 'combat' || value === 'gymnastics' || value === 'parkour' || value === 'climbing' || value === 'other') return value;
  return undefined;
}

function toOptionalLapsStrokeType(value: unknown): LapsStrokeType | undefined {
  if (value === 'vrije slag' || value === 'schoolslag' || value === 'rugslag' || value === 'vlinderslag' || value === 'wisselslag' || value === 'gemengd') {
    return value;
  }
  return undefined;
}

function toOptionalGpsPermissionStatus(value: unknown): GpsPermissionStatus | undefined {
  if (value === 'granted' || value === 'denied' || value === 'undetermined' || value === 'unavailable') return value;
  return undefined;
}

function normalizeGpsRoutePoints(value: unknown): GpsRoutePoint[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const points = value
    .map((entry): GpsRoutePoint | null => {
      if (!entry || typeof entry !== 'object') return null;
      const raw = entry as Record<string, unknown>;
      const latitude = toOptionalNumber(raw.latitude);
      const longitude = toOptionalNumber(raw.longitude);
      if (latitude === undefined || longitude === undefined) return null;

      return {
        latitude,
        longitude,
        timestamp: toOptionalNumber(raw.timestamp),
        speedMps: toOptionalNumber(raw.speedMps),
      };
    })
    .filter((point): point is GpsRoutePoint => point !== null);

  return points.length > 0 ? points : undefined;
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
  const scoreRaw = raw.score;
  const skillRaw = raw.skill;
  const lapsRaw = raw.laps;
  const gpsRaw = raw.gps;

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

  let score: ScoreMetrics | undefined;
  if (scoreRaw && typeof scoreRaw === 'object') {
    const scoreRecord = scoreRaw as Record<string, unknown>;
    const normalizedScore: ScoreMetrics = {
      scoreType: toOptionalScoreType(scoreRecord.scoreType),
      opponent: toOptionalString(scoreRecord.opponent),
      result: toOptionalScoreResult(scoreRecord.result),
      setsFor: toOptionalNonNegativeNumber(scoreRecord.setsFor),
      setsAgainst: toOptionalNonNegativeNumber(scoreRecord.setsAgainst),
      pointsFor: toOptionalNonNegativeNumber(scoreRecord.pointsFor),
      pointsAgainst: toOptionalNonNegativeNumber(scoreRecord.pointsAgainst),
      holesPlayed: toOptionalNonNegativeNumber(scoreRecord.holesPlayed),
      strokes: toOptionalNonNegativeNumber(scoreRecord.strokes),
      par: toOptionalNonNegativeNumber(scoreRecord.par),
      handicap: toOptionalNumber(scoreRecord.handicap),
      intensity: toOptionalSessionIntensity(scoreRecord.intensity),
      notes: toOptionalString(scoreRecord.notes),
    };

    if (
      normalizedScore.scoreType !== undefined ||
      normalizedScore.opponent !== undefined ||
      normalizedScore.result !== undefined ||
      normalizedScore.setsFor !== undefined ||
      normalizedScore.setsAgainst !== undefined ||
      normalizedScore.pointsFor !== undefined ||
      normalizedScore.pointsAgainst !== undefined ||
      normalizedScore.holesPlayed !== undefined ||
      normalizedScore.strokes !== undefined ||
      normalizedScore.par !== undefined ||
      normalizedScore.handicap !== undefined ||
      normalizedScore.intensity !== undefined ||
      normalizedScore.notes !== undefined
    ) {
      score = normalizedScore;
    }
  }

  let skill: SkillMetrics | undefined;
  if (skillRaw && typeof skillRaw === 'object') {
    const skillRecord = skillRaw as Record<string, unknown>;
    const normalizedSkill: SkillMetrics = {
      skillType: toOptionalSkillType(skillRecord.skillType),
      level: toOptionalString(skillRecord.level),
      techniques: normalizeFocusAreas(skillRecord.techniques),
      attempts: toOptionalNonNegativeNumber(skillRecord.attempts),
      successfulAttempts: toOptionalNonNegativeNumber(skillRecord.successfulAttempts),
      grade: toOptionalString(skillRecord.grade),
      rounds: toOptionalNonNegativeNumber(skillRecord.rounds),
      intensity: toOptionalSessionIntensity(skillRecord.intensity),
      notes: toOptionalString(skillRecord.notes),
    };

    if (
      normalizedSkill.skillType !== undefined ||
      normalizedSkill.level !== undefined ||
      normalizedSkill.techniques !== undefined ||
      normalizedSkill.attempts !== undefined ||
      normalizedSkill.successfulAttempts !== undefined ||
      normalizedSkill.grade !== undefined ||
      normalizedSkill.rounds !== undefined ||
      normalizedSkill.intensity !== undefined ||
      normalizedSkill.notes !== undefined
    ) {
      skill = normalizedSkill;
    }
  }

  let laps: LapsMetrics | undefined;
  if (lapsRaw && typeof lapsRaw === 'object') {
    const lapsRecord = lapsRaw as Record<string, unknown>;
    const normalizedLaps: LapsMetrics = {
      poolLengthMeters: toOptionalNonNegativeNumber(lapsRecord.poolLengthMeters),
      laps: toOptionalNonNegativeNumber(lapsRecord.laps),
      distanceMeters: toOptionalNonNegativeNumber(lapsRecord.distanceMeters),
      strokeType: toOptionalLapsStrokeType(lapsRecord.strokeType),
      pacePer100mSeconds: toOptionalNonNegativeNumber(lapsRecord.pacePer100mSeconds),
      intensity: toOptionalSessionIntensity(lapsRecord.intensity),
      notes: toOptionalString(lapsRecord.notes),
    };

    if (
      normalizedLaps.poolLengthMeters !== undefined ||
      normalizedLaps.laps !== undefined ||
      normalizedLaps.distanceMeters !== undefined ||
      normalizedLaps.strokeType !== undefined ||
      normalizedLaps.pacePer100mSeconds !== undefined ||
      normalizedLaps.intensity !== undefined ||
      normalizedLaps.notes !== undefined
    ) {
      laps = normalizedLaps;
    }
  }

  let gps: GpsMetrics | undefined;
  if (gpsRaw && typeof gpsRaw === 'object') {
    const gpsRecord = gpsRaw as Record<string, unknown>;
    const normalizedGps: GpsMetrics = {
      distanceMeters: toOptionalNonNegativeNumber(gpsRecord.distanceMeters),
      averageSpeedKmh: toOptionalNonNegativeNumber(gpsRecord.averageSpeedKmh),
      maxSpeedKmh: toOptionalNonNegativeNumber(gpsRecord.maxSpeedKmh),
      routePoints: normalizeGpsRoutePoints(gpsRecord.routePoints),
      locationPermissionStatus: toOptionalGpsPermissionStatus(gpsRecord.locationPermissionStatus),
      notes: toOptionalString(gpsRecord.notes),
    };

    if (
      normalizedGps.distanceMeters !== undefined ||
      normalizedGps.averageSpeedKmh !== undefined ||
      normalizedGps.maxSpeedKmh !== undefined ||
      normalizedGps.routePoints !== undefined ||
      normalizedGps.locationPermissionStatus !== undefined ||
      normalizedGps.notes !== undefined
    ) {
      gps = normalizedGps;
    }
  }

  if (!workout && !session && !match && !score && !skill && !laps && !gps) return undefined;
  return { workout, session, match, score, skill, laps, gps };
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
        updatedAt: toOptionalString(raw.updatedAt),
      };
    })
    .filter((item): item is Activity => item !== null);
}

export interface UpdateActivityInput {
  notes?: string;
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

export async function updateActivity(activityId: string, updates: UpdateActivityInput): Promise<void> {
  const activities = await getActivities();
  const next = activities.map((activity) => {
    if (activity.id !== activityId) return activity;

    return {
      ...activity,
      notes: updates.notes,
      updatedAt: new Date().toISOString(),
    };
  });

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
