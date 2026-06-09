
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import { SPORT_DISCIPLINES } from '../../constants/sport-disciplines';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import {
  saveActivity,
  type WorkoutExercise,
  type SessionIntensity,
  type SessionFeeling,
  type MatchType,
  type MatchPersonalStats,
  type ScoreResult,
  type ScoreType,
  type SkillType,
  type LapsStrokeType,
  type GpsRoutePoint,
  type GpsPermissionStatus,
} from 'services/activity-storage';
import { completeProgramWorkout } from '@/services/user-programs-storage';
import { getLastExercisePerformance, detectPersonalRecords } from '@/services/exercise-history';
import { getGpsTrackingService, type GpsTrackingState } from 'services/gps-tracking';
import {
  saveWorkoutDraft,
  getWorkoutDraft,
  clearDraftForWorkout,
  type WorkoutDraft,
} from '@/services/workout-draft-storage';

const SESSION_STATUS = {
  NOT_STARTED: 'Klaar',
  ACTIVE: 'Actief',
  PAUSED: 'Gepauzeerd',
  FINISHED: 'Afgerond',
} as const;

type SessionStatus = keyof typeof SESSION_STATUS;

const SESSION_INTENSITY_OPTIONS: SessionIntensity[] = ['laag', 'gemiddeld', 'hoog'];
const SESSION_FEELING_OPTIONS: SessionFeeling[] = ['laag', 'neutraal', 'goed', 'sterk'];
const MATCH_TYPE_OPTIONS: MatchType[] = ['training', 'wedstrijd'];
const SCORE_RESULT_OPTIONS: ScoreResult[] = ['gewonnen', 'verloren', 'gelijkspel', 'n.v.t.'];
const LAPS_STROKE_OPTIONS: LapsStrokeType[] = ['vrije slag', 'schoolslag', 'rugslag', 'vlinderslag', 'wisselslag', 'gemengd'];

type ExerciseDraft = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weightKg: string;
  notes: string;
};

function createExerciseDraft(): ExerciseDraft {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    sets: '',
    reps: '',
    weightKg: '',
    notes: '',
  };
}

function toPositiveInt(value: string): number | null {
  const normalized = value.trim();
  if (normalized.length === 0) return null;
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function toOptionalPositiveNumber(value: string): number | undefined {
  const normalized = value.trim();
  if (normalized.length === 0) return undefined;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function toOptionalNonNegativeNumber(value: string): number | undefined {
  const normalized = value.trim();
  if (normalized.length === 0) return undefined;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

function toWorkoutExercise(draft: ExerciseDraft): WorkoutExercise | null {
  const name = draft.name.trim();
  const sets = toPositiveInt(draft.sets);
  const reps = toPositiveInt(draft.reps);
  if (!name || sets === null || reps === null) return null;

  return {
    id: draft.id,
    name,
    sets,
    reps,
    weightKg: toOptionalPositiveNumber(draft.weightKg),
    notes: draft.notes.trim().length > 0 ? draft.notes.trim() : undefined,
  };
}

function calculateTotalVolumeKg(exercises: WorkoutExercise[]): number | undefined {
  const total = exercises.reduce((sum, exercise) => {
    if (exercise.weightKg === undefined) return sum;
    return sum + exercise.sets * exercise.reps * exercise.weightKg;
  }, 0);

  return total > 0 ? total : undefined;
}

function calculateHaversineDistanceMeters(from: GpsRoutePoint, to: GpsRoutePoint): number {
  const earthRadiusMeters = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

function calculateRouteDistanceMeters(points: GpsRoutePoint[]): number | undefined {
  if (points.length < 2) return undefined;
  const total = points.slice(1).reduce((sum, point, index) => {
    return sum + calculateHaversineDistanceMeters(points[index], point);
  }, 0);
  return total > 0 ? total : undefined;
}

export default function StartActivityScreen() {
  const { disciplineId, workoutId, programId, week, day } = useLocalSearchParams<{
    disciplineId: string;
    programId?: string;
    week?: string;
    day?: string;
    workoutId?: string;
  }>();
  const discipline = SPORT_DISCIPLINES.find((d) => d.id === disciplineId);

  // Get workout context if workoutId is provided
  const workout = React.useMemo(() => {
    if (!workoutId || !disciplineId) return null;
    const disciplineContent = DISCIPLINE_CONTENT[disciplineId as keyof typeof DISCIPLINE_CONTENT];
    if (disciplineContent?.workouts) {
      return disciplineContent.workouts.find((w: any) => w.id === workoutId);
    }
    return null;
  }, [workoutId, disciplineId]);

  // Get exercises for the workout
  const workoutExercises = React.useMemo(() => {
    if (!workout || !disciplineId) return [];
    const disciplineContent = DISCIPLINE_CONTENT[disciplineId as keyof typeof DISCIPLINE_CONTENT];
    if (!disciplineContent?.exercises) return [];

    // Priority 1: Use workoutExercises if available
    if (workout.workoutExercises && workout.workoutExercises.length > 0) {
      const exerciseMap = new Map(disciplineContent.exercises.map(e => [e.id, e]));
      return workout.workoutExercises
        .map(we => exerciseMap.get(we.exerciseId))
        .filter((e): e is NonNullable<typeof e> => e !== undefined);
    }

    // Priority 2: Use exerciseIds if available
    if (workout.exerciseIds && workout.exerciseIds.length > 0) {
      const exerciseMap = new Map(disciplineContent.exercises.map(e => [e.id, e]));
      return workout.exerciseIds
        .map(id => exerciseMap.get(id))
        .filter((e): e is NonNullable<typeof e> => e !== undefined);
    }

    // Priority 3: Fallback to first X exercises from discipline (for backward compatibility)
    const exerciseCount = typeof workout.exercises === 'number' ? workout.exercises : 0;
    if (exerciseCount === 0) return [];

    return disciplineContent.exercises.slice(0, Math.min(exerciseCount, disciplineContent.exercises.length));
  }, [workout, disciplineId]);

  // Get workout exercise planning
  const workoutExercisePlanning = React.useMemo(() => {
    if (!workout?.workoutExercises) return [];
    const exerciseMap = new Map(workout.workoutExercises.map(we => [we.exerciseId, we]));
    return workoutExercises.map(ex => exerciseMap.get(ex.id)).filter((we): we is NonNullable<typeof we> => we !== undefined);
  }, [workout, workoutExercises]);

  // State for workout exercise logs
  const [exerciseLogs, setExerciseLogs] = React.useState<{
    id: string;
    exerciseId?: string;
    exerciseName: string;
    completed: boolean;
    executionMode?: 'strength' | 'bodyweight' | 'duration' | 'mixed';
    sets?: { setNumber: number; reps?: number; weightKg?: number; durationSeconds?: number; completed?: boolean }[];
    notes?: string;
    lastPerformance?: {
      exerciseId?: string;
      exerciseName: string;
      lastPerformedAt: string;
      lastSet?: {
        reps?: number;
        weightKg?: number;
        durationSeconds?: number;
      };
      sourceActivityId: string;
    } | null;
    planning?: {
      exerciseId: string;
      plannedSets?: number;
      targetReps?: string;
      targetDurationSeconds?: number;
      restSeconds?: number;
      plannedWeightKg?: number;
      targetWeightKg?: number;
      intensityLabel?: string;
      rpeTarget?: string;
      notes?: string;
    };
  }[]>([]);

  // Initialize exercise logs when workout changes
  React.useEffect(() => {
    const initializeExerciseLogs = async () => {
      if (workoutExercises.length > 0) {
        const logs = await Promise.all(workoutExercises.map(async (ex, index) => {
          const planning = workoutExercisePlanning[index];
          const plannedSets = planning?.plannedSets || 1;

          // Get last performance for prefill
          const lastPerformance = await getLastExercisePerformance(ex.id, ex.name);
          const prefilledWeight = lastPerformance?.lastSet?.weightKg;
          const prefilledReps = lastPerformance?.lastSet?.reps;
          const prefilledDuration = lastPerformance?.lastSet?.durationSeconds;

          // Use prescribed weight if available, otherwise use last performance
          const initialWeight = planning?.plannedWeightKg || planning?.targetWeightKg || prefilledWeight;
          const initialReps = prefilledReps;
          const initialDuration = planning?.targetDurationSeconds || prefilledDuration;

          // Determine execution mode
          const executionMode = getExerciseExecutionMode(planning, disciplineId);

          return {
            id: `log-${ex.id}`,
            exerciseId: ex.id,
            exerciseName: ex.name,
            completed: false,
            executionMode,
            sets: Array.from({ length: plannedSets }, (_, i) => ({
              setNumber: i + 1,
              reps: i === 0 ? initialReps : undefined,
              weightKg: i === 0 ? initialWeight : undefined,
              durationSeconds: i === 0 ? initialDuration : undefined,
              completed: false,
            })),
            lastPerformance: lastPerformance,
            planning: planning,
          };
        }));
        setExerciseLogs(logs);
      }
    };

    initializeExerciseLogs();
  }, [workoutExercises, workoutExercisePlanning, disciplineId]);

  // Guided workout flow state
  const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);
  const [currentSetIndex, setCurrentSetIndex] = React.useState(0);
  const [isResting, setIsResting] = React.useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = React.useState(0);
  const [isExerciseFlowComplete, setIsExerciseFlowComplete] = React.useState(false);
  const [isSavingActivity, setIsSavingActivity] = React.useState(false);
  const [draftLoaded, setDraftLoaded] = React.useState(false);
  const [personalRecords, setPersonalRecords] = React.useState<any[]>([]);

  // Helper: Determine exercise execution mode
  const getExerciseExecutionMode = (planning: {
    exerciseId: string;
    plannedSets?: number;
    targetReps?: string;
    targetDurationSeconds?: number;
    restSeconds?: number;
    plannedWeightKg?: number;
    targetWeightKg?: number;
    intensityLabel?: string;
    rpeTarget?: string;
    notes?: string;
  } | undefined, disciplineId: string): 'strength' | 'bodyweight' | 'duration' | 'mixed' => {
    // Duration-based if targetDurationSeconds exists and no clear targetReps
    if (planning?.targetDurationSeconds && !planning?.targetReps) {
      return 'duration';
    }
    // Mobility/yoga/pilates disciplines with duration
    if (planning?.targetDurationSeconds && ['mobiliteit', 'yoga', 'pilates'].includes(disciplineId)) {
      return 'duration';
    }
    // Bodyweight if targetReps exists but no weight needed
    if (planning?.targetReps && !planning?.plannedWeightKg && !planning?.targetWeightKg) {
      return 'bodyweight';
    }
    // Strength if reps/weight logical
    if (planning?.targetReps && (planning?.plannedWeightKg || planning?.targetWeightKg)) {
      return 'strength';
    }
    // Fallback
    return 'mixed';
  };

  // Reset guided flow state when workout changes
  React.useEffect(() => {
    if (workoutExercises.length > 0) {
      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestSecondsRemaining(0);
      setIsExerciseFlowComplete(false);
    }
  }, [workoutExercises]);

  // Rest timer effect
  React.useEffect(() => {
    let interval: number | null = null;
    if (isResting && restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restSecondsRemaining]);

  // Autosave workout draft
  React.useEffect(() => {
    if (!workoutId || !disciplineId || exerciseLogs.length === 0) return;

    const draft: WorkoutDraft = {
      id: `draft-${disciplineId}-${workoutId}-${programId || 'none'}`,
      disciplineId,
      workoutId,
      workoutName: workout?.name,
      programId,
      programWeek: week ? parseInt(week, 10) : undefined,
      programDay: day ? parseInt(day, 10) : undefined,
      currentExerciseIndex,
      currentSetIndex,
      isResting,
      restSecondsRemaining,
      isExerciseFlowComplete,
      exerciseLogs,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    saveWorkoutDraft(draft);
  }, [
    workoutId,
    disciplineId,
    programId,
    week,
    day,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    restSecondsRemaining,
    isExerciseFlowComplete,
    exerciseLogs,
    workout?.name,
  ]);

  // Restore draft on mount
  React.useEffect(() => {
    const restoreDraft = async () => {
      if (!workoutId || !disciplineId || draftLoaded) return;

      const draft = await getWorkoutDraft(disciplineId, workoutId, programId);
      if (!draft) {
        setDraftLoaded(true);
        return;
      }

      Alert.alert(
        'Workout hervatten?',
        'Je hebt nog een workout openstaan. Wil je doorgaan?',
        [
          { text: 'Opnieuw beginnen', style: 'destructive', onPress: async () => {
            await clearDraftForWorkout(disciplineId, workoutId, programId);
            setDraftLoaded(true);
          }},
          { text: 'Doorgaan', style: 'default', onPress: () => {
            // Restore state safely
            if (draft.exerciseLogs && draft.exerciseLogs.length === exerciseLogs.length) {
              setExerciseLogs(draft.exerciseLogs);
              setCurrentExerciseIndex(Math.min(draft.currentExerciseIndex, exerciseLogs.length - 1));
              setCurrentSetIndex(Math.min(draft.currentSetIndex, (draft.exerciseLogs[draft.currentExerciseIndex]?.sets?.length || 1) - 1));
              setIsResting(draft.isResting);
              setRestSecondsRemaining(draft.restSecondsRemaining);
              setIsExerciseFlowComplete(draft.isExerciseFlowComplete);
            }
            setDraftLoaded(true);
          }},
        ]
      );
    };

    restoreDraft();
  }, [workoutId, disciplineId, programId, exerciseLogs.length, draftLoaded]);

  // Handler: Complete current set
  const handleSetComplete = () => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets) return;

    // Mark current set as completed
    markCurrentSetCompleted();

    // Find next not-completed set
    const nextNotCompletedIndex = currentLog.sets.findIndex((set, index) => index > currentSetIndex && !set.completed);

    if (nextNotCompletedIndex !== -1) {
      // Move to next not-completed set
      const planning = currentLog.planning;
      const restSeconds = planning?.restSeconds;
      if (restSeconds && restSeconds > 0) {
        setIsResting(true);
        setRestSecondsRemaining(restSeconds);
      }
      setCurrentSetIndex(nextNotCompletedIndex);
    } else {
      // All sets completed, mark exercise as completed
      currentLog.completed = true;
      setExerciseLogs(updated);

      const isLastExercise = currentExerciseIndex === exerciseLogs.length - 1;

      if (isLastExercise) {
        setIsExerciseFlowComplete(true);
        return;
      }

      // Move to next exercise
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestSecondsRemaining(0);
    }
  };

  // Handler: Skip current exercise
  const handleSkipExercise = () => {
    const updated = [...exerciseLogs];
    updated[currentExerciseIndex].completed = true;
    setExerciseLogs(updated);

    const isLastExercise = currentExerciseIndex === exerciseLogs.length - 1;
    if (isLastExercise) {
      setIsExerciseFlowComplete(true);
    } else {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestSecondsRemaining(0);
    }
  };

  // Handler: Go to previous exercise
  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestSecondsRemaining(0);
    }
  };

  // Handler: Skip rest
  const handleSkipRest = () => {
    setIsResting(false);
    setRestSecondsRemaining(0);
  };

  // Helper: Update current exercise set with patch
  const updateCurrentExerciseSet = (setIndex: number, patch: Partial<{ reps?: number; weightKg?: number; durationSeconds?: number; completed?: boolean }>) => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets) return;
    currentLog.sets[setIndex] = { ...currentLog.sets[setIndex], ...patch };
    setExerciseLogs(updated);
  };

  // Helper: Add a new set to current exercise
  const addSetToCurrentExercise = () => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets) return;

    const lastSet = currentLog.sets[currentLog.sets.length - 1];
    currentLog.sets.push({
      setNumber: currentLog.sets.length + 1,
      reps: lastSet?.reps,
      weightKg: lastSet?.weightKg,
      durationSeconds: lastSet?.durationSeconds,
      completed: false,
    });
    setExerciseLogs(updated);
  };

  // Helper: Copy previous set to current exercise
  const copyPreviousSetToCurrentExercise = () => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets || currentLog.sets.length === 0) return;

    const lastSet = currentLog.sets[currentLog.sets.length - 1];
    currentLog.sets.push({
      setNumber: currentLog.sets.length + 1,
      reps: lastSet?.reps,
      weightKg: lastSet?.weightKg,
      durationSeconds: lastSet?.durationSeconds,
      completed: false,
    });
    setExerciseLogs(updated);
  };

  // Helper: Remove a set from current exercise
  const removeSetFromCurrentExercise = (setIndex: number) => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets || currentLog.sets.length <= 1) return;

    currentLog.sets.splice(setIndex, 1);
    // Renumber sets
    currentLog.sets.forEach((set, index) => {
      set.setNumber = index + 1;
    });
    // Adjust current set index if needed
    if (currentSetIndex >= currentLog.sets.length) {
      setCurrentSetIndex(currentLog.sets.length - 1);
    }
    setExerciseLogs(updated);
  };

  // Helper: Mark current set as completed
  const markCurrentSetCompleted = () => {
    const updated = [...exerciseLogs];
    const currentLog = updated[currentExerciseIndex];
    if (!currentLog.sets) return;

    currentLog.sets[currentSetIndex].completed = true;
    setExerciseLogs(updated);
  };

  const isWorkoutDiscipline = discipline?.trackingType === 'workout';
  const isSessionDiscipline = discipline?.trackingType === 'session';
  const isMatchDiscipline = discipline?.trackingType === 'match';
  const isScoreDiscipline = discipline?.trackingType === 'score';
  const isSkillDiscipline = discipline?.trackingType === 'skill';
  const isLapsDiscipline = discipline?.trackingType === 'laps';
  const isGpsDiscipline = discipline?.trackingType === 'gps';
  const isGpsTrackingAvailable = isGpsDiscipline;
  const gpsServiceRef = React.useRef(getGpsTrackingService());
  const gpsService = gpsServiceRef.current;
  const [gpsState, setGpsState] = useState<GpsTrackingState>(gpsService.getState());
  
  // Subscribe to GPS state changes
  // gpsService is stable (singleton via useRef), dependency is safe
  React.useEffect(() => {
    const unsubscribe = gpsService.subscribeToState(() => {
      setGpsState(gpsService.getState());
    });
    return unsubscribe;
  }, [gpsService]);
  const scoreType: ScoreType | undefined = discipline?.id === 'golf' ? 'golf' : discipline?.id === 'racketsporten' ? 'racket' : isScoreDiscipline ? 'other' : undefined;
  const skillType: SkillType | undefined =
    discipline?.id === 'judo'
      ? 'combat'
      : discipline?.id === 'turnen'
        ? 'gymnastics'
        : discipline?.id === 'parkour'
          ? 'parkour'
          : discipline?.id === 'klimmen'
            ? 'climbing'
            : isSkillDiscipline
              ? 'other'
              : undefined;

  const [status, setStatus] = useState<SessionStatus>('NOT_STARTED');
  const [seconds, setSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [sessionIntensity, setSessionIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [sessionFocusAreasInput, setSessionFocusAreasInput] = useState('');
  const [sessionFeelingBefore, setSessionFeelingBefore] = useState<SessionFeeling | undefined>(undefined);
  const [sessionFeelingAfter, setSessionFeelingAfter] = useState<SessionFeeling | undefined>(undefined);
  const [sessionNotes, setSessionNotes] = useState('');
  const [matchType, setMatchType] = useState<MatchType | undefined>(undefined);
  const [matchTeam, setMatchTeam] = useState('');
  const [matchOpponent, setMatchOpponent] = useState('');
  const [matchPosition, setMatchPosition] = useState('');
  const [matchScoreFor, setMatchScoreFor] = useState('');
  const [matchScoreAgainst, setMatchScoreAgainst] = useState('');
  const [matchGoals, setMatchGoals] = useState('');
  const [matchAssists, setMatchAssists] = useState('');
  const [matchPoints, setMatchPoints] = useState('');
  const [matchRebounds, setMatchRebounds] = useState('');
  const [matchBlocks, setMatchBlocks] = useState('');
  const [matchTackles, setMatchTackles] = useState('');
  const [matchIntensity, setMatchIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [matchNotes, setMatchNotes] = useState('');
  const [scoreOpponent, setScoreOpponent] = useState('');
  const [scoreResult, setScoreResult] = useState<ScoreResult | undefined>(undefined);
  const [scoreSetsFor, setScoreSetsFor] = useState('');
  const [scoreSetsAgainst, setScoreSetsAgainst] = useState('');
  const [scorePointsFor, setScorePointsFor] = useState('');
  const [scorePointsAgainst, setScorePointsAgainst] = useState('');
  const [scoreHolesPlayed, setScoreHolesPlayed] = useState('');
  const [scoreStrokes, setScoreStrokes] = useState('');
  const [scorePar, setScorePar] = useState('');
  const [scoreHandicap, setScoreHandicap] = useState('');
  const [scoreIntensity, setScoreIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [scoreNotes, setScoreNotes] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [skillTechniquesInput, setSkillTechniquesInput] = useState('');
  const [skillAttempts, setSkillAttempts] = useState('');
  const [skillSuccessfulAttempts, setSkillSuccessfulAttempts] = useState('');
  const [skillGrade, setSkillGrade] = useState('');
  const [skillRounds, setSkillRounds] = useState('');
  const [skillIntensity, setSkillIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [skillNotes, setSkillNotes] = useState('');
  const [lapsPoolLengthMeters, setLapsPoolLengthMeters] = useState('');
  const [lapsCount, setLapsCount] = useState('');
  const [lapsDistanceMeters, setLapsDistanceMeters] = useState('');
  const [lapsStrokeType, setLapsStrokeType] = useState<LapsStrokeType | undefined>(undefined);
  const [lapsIntensity, setLapsIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [lapsNotes, setLapsNotes] = useState('');
  const [gpsNotes, setGpsNotes] = useState('');
  const [gpsRoutePoints] = useState<GpsRoutePoint[]>([]);
  const [gpsPermissionStatus, setGpsPermissionStatus] = useState<GpsPermissionStatus | undefined>(undefined);
  const [exerciseDrafts, setExerciseDrafts] = useState<ExerciseDraft[]>([createExerciseDraft()]);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000) as unknown as number;
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = async () => {
    if (isGpsDiscipline) {
      const permission = await gpsService.requestPermission();
      setGpsPermissionStatus(permission);
      if (permission === 'granted') {
        const started = await gpsService.start();
        if (!started) {
          Alert.alert('GPS fout', 'Kon GPS tracking niet starten. Controleer je locatie-instellingen.');
          return;
        }
      } else {
        Alert.alert('Locatie toegang', 'Locatietoegang is vereist voor GPS tracking. Ga naar instellingen om dit toe te staan.');
        return;
      }
    }
    setStatus('ACTIVE');
    startTimer();
  };
  const handlePause = () => {
    if (isGpsDiscipline) {
      gpsService.pause();
    }
    setStatus('PAUSED');
    stopTimer();
  };
  const handleResume = () => {
    if (isGpsDiscipline) {
      gpsService.resume();
    }
    setStatus('ACTIVE');
    startTimer();
  };
  const handleStop = () => {
  // Check if there's workout progress that would be lost
  const hasProgress = exerciseLogs.some(log => log.completed || log.sets?.some(s => s.completed));
  
  if (hasProgress && workoutId && !isGpsDiscipline) {
    Alert.alert(
      'Workout nog niet opgeslagen',
      'Je hebt voortgang in je workout. Weet je zeker dat je wilt stoppen zonder op te slaan?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Doorgaan met workout',
          style: 'default',
        },
        {
          text: 'Stoppen zonder opslaan',
          style: 'destructive',
          onPress: async () => {
            if (isGpsDiscipline) {
              gpsService.stop();
            }
            setStatus('FINISHED');
            stopTimer();
            setIsResting(false);
            setRestSecondsRemaining(0);
            
            // Clear draft when stopping without saving
            if (workoutId && disciplineId) {
              await clearDraftForWorkout(disciplineId, workoutId, programId);
            }
          },
        },
      ]
    );
  } else {
    if (isGpsDiscipline) {
      gpsService.stop();
    }
    setStatus('FINISHED');
    stopTimer();
    setIsResting(false);
    setRestSecondsRemaining(0);
  }
};

  const handleAddExercise = () => {
    setExerciseDrafts((previous) => [...previous, createExerciseDraft()]);
  };

  const handleExerciseChange = (id: string, field: keyof ExerciseDraft, value: string) => {
    setExerciseDrafts((previous) =>
      previous.map((draft) => (draft.id === id ? { ...draft, [field]: value } : draft))
    );
  };

  const buildWorkoutExercises = (): WorkoutExercise[] | null => {
    const parsed = exerciseDrafts
      .map((draft) => toWorkoutExercise(draft))
      .filter((item): item is WorkoutExercise => item !== null);

    if (parsed.length === 0) {
      return null;
    }

    return parsed;
  };

  const buildSessionFocusAreas = (): string[] | undefined => {
    const areas = sessionFocusAreasInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return areas.length > 0 ? areas : undefined;
  };

  const buildMatchPersonalStats = (): MatchPersonalStats | undefined => {
    const stats: MatchPersonalStats = {
      goals: toOptionalNonNegativeNumber(matchGoals),
      assists: toOptionalNonNegativeNumber(matchAssists),
      points: toOptionalNonNegativeNumber(matchPoints),
      rebounds: toOptionalNonNegativeNumber(matchRebounds),
      blocks: toOptionalNonNegativeNumber(matchBlocks),
      tackles: toOptionalNonNegativeNumber(matchTackles),
    };

    if (
      stats.goals === undefined &&
      stats.assists === undefined &&
      stats.points === undefined &&
      stats.rebounds === undefined &&
      stats.blocks === undefined &&
      stats.tackles === undefined
    ) {
      return undefined;
    }

    return stats;
  };

  const buildSkillTechniques = (): string[] | undefined => {
    const techniques = skillTechniquesInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return techniques.length > 0 ? techniques : undefined;
  };

  const getComputedLapsDistanceMeters = (): number | undefined => {
    const poolLength = toOptionalNonNegativeNumber(lapsPoolLengthMeters);
    const laps = toOptionalNonNegativeNumber(lapsCount);
    if (poolLength === undefined || laps === undefined) return undefined;
    const distance = poolLength * laps;
    return distance > 0 ? distance : undefined;
  };

  React.useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const getStatusSubtitle = (value: SessionStatus) => {
    if (value === 'NOT_STARTED') return 'Klaar om je sessie te starten.';
    if (value === 'ACTIVE') return 'Sessie loopt. Blijf gefocust.';
    if (value === 'PAUSED') return 'Sessie gepauzeerd. Hervat wanneer je klaar bent.';
    return 'Sessie gestopt. Werk details af en sla op.';
  };

  if (!discipline) {
    return (
      <View style={styles.container}>
        <PageHeader title="Discipline niet gevonden" />
        <Text style={styles.fallback}>Deze discipline bestaat niet.</Text>
      </View>
    );
  }

  const workoutExercisesPreview = isWorkoutDiscipline ? buildWorkoutExercises() : null;
  const workoutVolumePreview = workoutExercisesPreview ? calculateTotalVolumeKg(workoutExercisesPreview) : undefined;
  const canSaveWorkout = !isWorkoutDiscipline || workoutExercisesPreview !== null;

  const handleSave = async () => {
    if (saving || saved || isSavingActivity || status !== 'FINISHED') return;
    setIsSavingActivity(true);

    const workoutExercises = isWorkoutDiscipline ? buildWorkoutExercises() : null;
    const workoutExerciseLogs = exerciseLogs.length > 0 ? exerciseLogs : undefined;
    if (isWorkoutDiscipline && !workoutExercises) {
      Alert.alert('Workout metrics ontbreken', 'Voeg minimaal een geldige oefening toe met naam, sets en reps.');
      return;
    }

    // Detect personal records
    let personalRecords = undefined;
    if (workoutExerciseLogs) {
      try {
        personalRecords = await detectPersonalRecords(workoutExerciseLogs);
        setPersonalRecords(personalRecords || []);
      } catch (error) {
        console.error('Failed to detect personal records:', error);
      }
    }

    const sessionFocusAreas = isSessionDiscipline ? buildSessionFocusAreas() : undefined;
    const matchPersonalStats = isMatchDiscipline ? buildMatchPersonalStats() : undefined;
    const skillTechniques = isSkillDiscipline ? buildSkillTechniques() : undefined;
    const computedLapsDistanceMeters = isLapsDiscipline ? getComputedLapsDistanceMeters() : undefined;
    const enteredLapsDistanceMeters = isLapsDiscipline ? toOptionalNonNegativeNumber(lapsDistanceMeters) : undefined;
    const resolvedLapsDistanceMeters = enteredLapsDistanceMeters ?? computedLapsDistanceMeters;
    const gpsDistanceMeters = isGpsDiscipline ? gpsState.distanceMeters : undefined;
    const gpsAverageSpeedKmh = isGpsDiscipline ? gpsState.averageSpeedKmh : undefined;
    const gpsMaxSpeedKmh = isGpsDiscipline ? gpsState.maxSpeedKmh : undefined;
    const resolvedGpsPermissionStatus = isGpsDiscipline
      ? gpsState.permissionStatus
      : undefined;
    const lapsPacePer100mSeconds =
      isLapsDiscipline && resolvedLapsDistanceMeters !== undefined && resolvedLapsDistanceMeters > 0
        ? seconds / (resolvedLapsDistanceMeters / 100)
        : undefined;

    setSaving(true);
    try {
      const now = new Date();
      const startedAt = new Date(now.getTime() - seconds * 1000);
      const totalVolumeKg = workoutExercises ? calculateTotalVolumeKg(workoutExercises) : undefined;
      await saveActivity({
        id: `${discipline.id}-${now.getTime()}`,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        trackingType: discipline.trackingType,
        startedAt: startedAt.toISOString(),
        endedAt: now.toISOString(),
        durationSeconds: seconds,
        status: 'completed',
        workoutId: workout?.id,
        workoutName: workout?.name,
        programId: programId,
        programWeek: week ? parseInt(week, 10) : undefined,
        programDay: day ? parseInt(day, 10) : undefined,
        metrics:
          isWorkoutDiscipline || isSessionDiscipline || isMatchDiscipline || isScoreDiscipline || isSkillDiscipline || isLapsDiscipline || isGpsDiscipline
            ? {
                workout:
                  isWorkoutDiscipline && workoutExercises
                    ? {
                        exercises: workoutExercises,
                        workoutExercises: workoutExerciseLogs,
                        completedExercisesCount: workoutExerciseLogs ? workoutExerciseLogs.filter(l => l.completed).length : undefined,
                        totalExercisesCount: workoutExerciseLogs ? workoutExerciseLogs.length : undefined,
                        totalVolumeKg,
                        notes: workoutNotes.trim().length > 0 ? workoutNotes.trim() : undefined,
                        personalRecords: personalRecords && personalRecords.length > 0 ? personalRecords : undefined,
                      }
                    : undefined,
                session: isSessionDiscipline
                  ? {
                      intensity: sessionIntensity,
                      focusAreas: sessionFocusAreas,
                      feelingBefore: sessionFeelingBefore,
                      feelingAfter: sessionFeelingAfter,
                      notes: sessionNotes.trim().length > 0 ? sessionNotes.trim() : undefined,
                    }
                  : undefined,
                match: isMatchDiscipline
                  ? {
                      matchType,
                      team: matchTeam.trim().length > 0 ? matchTeam.trim() : undefined,
                      opponent: matchOpponent.trim().length > 0 ? matchOpponent.trim() : undefined,
                      position: matchPosition.trim().length > 0 ? matchPosition.trim() : undefined,
                      scoreFor: toOptionalNonNegativeNumber(matchScoreFor),
                      scoreAgainst: toOptionalNonNegativeNumber(matchScoreAgainst),
                      personalStats: matchPersonalStats,
                      intensity: matchIntensity,
                      notes: matchNotes.trim().length > 0 ? matchNotes.trim() : undefined,
                    }
                  : undefined,
                score: isScoreDiscipline
                  ? {
                      scoreType,
                      opponent: scoreOpponent.trim().length > 0 ? scoreOpponent.trim() : undefined,
                      result: scoreResult,
                      setsFor: toOptionalNonNegativeNumber(scoreSetsFor),
                      setsAgainst: toOptionalNonNegativeNumber(scoreSetsAgainst),
                      pointsFor: toOptionalNonNegativeNumber(scorePointsFor),
                      pointsAgainst: toOptionalNonNegativeNumber(scorePointsAgainst),
                      holesPlayed: toOptionalNonNegativeNumber(scoreHolesPlayed),
                      strokes: toOptionalNonNegativeNumber(scoreStrokes),
                      par: toOptionalNonNegativeNumber(scorePar),
                      handicap: toOptionalNonNegativeNumber(scoreHandicap),
                      intensity: scoreIntensity,
                      notes: scoreNotes.trim().length > 0 ? scoreNotes.trim() : undefined,
                    }
                  : undefined,
                skill: isSkillDiscipline
                  ? {
                      skillType,
                      level: skillLevel.trim().length > 0 ? skillLevel.trim() : undefined,
                      techniques: skillTechniques,
                      attempts: toOptionalNonNegativeNumber(skillAttempts),
                      successfulAttempts: toOptionalNonNegativeNumber(skillSuccessfulAttempts),
                      grade: skillGrade.trim().length > 0 ? skillGrade.trim() : undefined,
                      rounds: toOptionalNonNegativeNumber(skillRounds),
                      intensity: skillIntensity,
                      notes: skillNotes.trim().length > 0 ? skillNotes.trim() : undefined,
                    }
                  : undefined,
                laps: isLapsDiscipline
                  ? {
                      poolLengthMeters: toOptionalNonNegativeNumber(lapsPoolLengthMeters),
                      laps: toOptionalNonNegativeNumber(lapsCount),
                      distanceMeters: resolvedLapsDistanceMeters,
                      strokeType: lapsStrokeType,
                      pacePer100mSeconds: lapsPacePer100mSeconds,
                      intensity: lapsIntensity,
                      notes: lapsNotes.trim().length > 0 ? lapsNotes.trim() : undefined,
                    }
                  : undefined,
                gps: isGpsDiscipline
                  ? {
                      distanceMeters: gpsDistanceMeters,
                      averageSpeedKmh: gpsAverageSpeedKmh,
                      maxSpeedKmh: gpsMaxSpeedKmh,
                      routePoints: gpsState.routePoints.length > 0 ? gpsState.routePoints : undefined,
                      locationPermissionStatus: resolvedGpsPermissionStatus,
                      notes: gpsNotes.trim().length > 0 ? gpsNotes.trim() : undefined,
                    }
                  : undefined,
              }
            : undefined,
        createdAt: now.toISOString(),
      });

      // Update program progress if this was a program workout
      if (programId && week && day && workout?.id && disciplineId) {
        try {
          await completeProgramWorkout({
            programId,
            disciplineSlug: disciplineId,
            workoutId: workout.id,
            week: parseInt(week, 10),
            day: parseInt(day, 10),
            activityId: `${discipline.id}-${now.getTime()}`,
          });
        } catch (error) {
          console.error('Failed to update program progress:', error);
          // Don't fail the save if program progress update fails
        }
      }

      setSaved(true);
      Alert.alert('Opgeslagen', 'Activiteit succesvol opgeslagen.');
      
      // Clear draft after successful save
      if (workoutId && disciplineId) {
        await clearDraftForWorkout(disciplineId, workoutId, programId);
      }
    } catch {
      Alert.alert('Fout', 'Opslaan mislukt. Probeer opnieuw.');
    } finally {
      setSaving(false);
      setIsSavingActivity(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <PageHeader title={`Start ${discipline.name}`} />

      <View style={styles.sessionHeaderCard}>
        <Text style={styles.sessionTitle}>{discipline.name}</Text>
        <Text style={styles.meta}>{discipline.category} · {discipline.trackingType}</Text>
        <View style={styles.statusPillWrap}>
          <Text style={styles.statusPill}>Status: {SESSION_STATUS[status]}</Text>
        </View>
        <Text style={styles.statusSubtitle}>{getStatusSubtitle(status)}</Text>

        {workout && (
          <View style={styles.workoutContextCard}>
            <Text style={styles.workoutContextTitle}>{workout.name}</Text>
            <Text style={styles.workoutContextMeta}>{workout.muscle} · {workout.duration} · {workout.level}</Text>
            <Text style={styles.workoutContextMeta}>{typeof workout.exercises === 'number' ? `${workout.exercises} oefeningen` : 'Oefeningenlijst beschikbaar'}</Text>
            {programId && week && day && (
              <Text style={styles.programContext}>Programma · Week {week} · Dag {day}</Text>
            )}
          </View>
        )}

        {workoutId && workoutExercises.length > 0 && exerciseLogs.length > 0 && !isGpsDiscipline && !isExerciseFlowComplete && (
          <View style={styles.exercisesSection}>
            <Text style={styles.exercisesTitle}>Oefeningen</Text>
            {/* Guided Flow - Current Exercise */}
            <View style={styles.guidedFlowCard}>
              <View style={styles.guidedFlowHeader}>
                <Text style={styles.guidedFlowProgress}>Oefening {currentExerciseIndex + 1} van {exerciseLogs.length}</Text>
                <Text style={styles.guidedFlowSetProgress}>Set {currentSetIndex + 1} van {exerciseLogs[currentExerciseIndex].sets?.length || 1}</Text>
              </View>

              <Text style={styles.guidedFlowExerciseName}>{exerciseLogs[currentExerciseIndex].exerciseName}</Text>

              {exerciseLogs[currentExerciseIndex].planning && (
                <View style={styles.guidedFlowPlanning}>
                  <Text style={styles.guidedFlowPlanningText}>
                    {exerciseLogs[currentExerciseIndex].planning.plannedSets} sets gepland
                  </Text>
                  {exerciseLogs[currentExerciseIndex].planning.targetReps && (
                    <Text style={styles.guidedFlowPlanningText}>
                      · Doel: {exerciseLogs[currentExerciseIndex].planning.targetReps} reps
                    </Text>
                  )}
                  {exerciseLogs[currentExerciseIndex].planning.targetDurationSeconds && (
                    <Text style={styles.guidedFlowPlanningText}>
                      · Doel: {exerciseLogs[currentExerciseIndex].planning.targetDurationSeconds} sec
                    </Text>
                  )}
                  {exerciseLogs[currentExerciseIndex].planning.restSeconds && (
                    <Text style={styles.guidedFlowPlanningText}>
                      · Rust: {exerciseLogs[currentExerciseIndex].planning.restSeconds} sec
                    </Text>
                  )}
                  {exerciseLogs[currentExerciseIndex].planning.notes && (
                    <Text style={styles.guidedFlowNotes}>{exerciseLogs[currentExerciseIndex].planning.notes}</Text>
                  )}
                </View>
              )}

              {exerciseLogs[currentExerciseIndex].lastPerformance && (
                <Text style={styles.guidedFlowLastPerformance}>
                  Laatste keer: {exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.weightKg ? `${exerciseLogs[currentExerciseIndex].lastPerformance.lastSet.weightKg} kg` : ''}
                  {exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.weightKg && exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.reps ? ' × ' : ''}
                  {exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.reps ? `${exerciseLogs[currentExerciseIndex].lastPerformance.lastSet.reps} reps` : ''}
                  {exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.durationSeconds && (exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.weightKg || exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.reps) ? ' · ' : ''}
                  {exerciseLogs[currentExerciseIndex].lastPerformance.lastSet?.durationSeconds ? `${exerciseLogs[currentExerciseIndex].lastPerformance.lastSet.durationSeconds} sec` : ''}
                </Text>
              )}

              {!isResting && exerciseLogs[currentExerciseIndex].sets && exerciseLogs[currentExerciseIndex].sets.length > 0 && (
                <View>
                  {exerciseLogs[currentExerciseIndex].sets.map((set, setIndex) => {
                    const isCurrentSet = setIndex === currentSetIndex;
                    const executionMode = exerciseLogs[currentExerciseIndex].executionMode;
                    const planning = exerciseLogs[currentExerciseIndex].planning;

                    // Determine which inputs to show based on executionMode
                    const showRepsInput = executionMode === 'strength' ||
                                          executionMode === 'bodyweight' ||
                                          executionMode === 'mixed' ||
                                          (executionMode === 'duration' && planning?.targetReps);

                    const showWeightInput = executionMode === 'strength' ||
                                            executionMode === 'mixed' ||
                                            (executionMode === 'bodyweight' && (set.weightKg !== undefined || planning?.plannedWeightKg || planning?.targetWeightKg));

                    const showDurationInput = executionMode === 'duration' || executionMode === 'mixed';

                    return (
                      <View
                        key={set.setNumber}
                        style={[
                          styles.guidedFlowSetRow,
                          isCurrentSet && styles.guidedFlowSetRowCurrent,
                        ]}
                      >
                        <View style={styles.guidedFlowSetNumber}>
                          <Text style={[styles.guidedFlowSetNumberText, isCurrentSet && styles.guidedFlowSetNumberTextCurrent]}>
                            {set.setNumber}
                          </Text>
                          {set.completed && (
                            <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                          )}
                        </View>
                        {showRepsInput && (
                          <TextInput
                            style={[styles.guidedFlowInput, isCurrentSet && styles.guidedFlowInputCurrent]}
                            placeholder="Reps"
                            keyboardType="number-pad"
                            value={set.reps?.toString() || ''}
                            onChangeText={(text) => {
                              updateCurrentExerciseSet(setIndex, { reps: text ? parseInt(text, 10) : undefined });
                            }}
                          />
                        )}
                        {showWeightInput && (
                          <TextInput
                            style={[styles.guidedFlowInput, isCurrentSet && styles.guidedFlowInputCurrent]}
                            placeholder="Kg"
                            keyboardType="number-pad"
                            value={set.weightKg?.toString() || ''}
                            onChangeText={(text) => {
                              updateCurrentExerciseSet(setIndex, { weightKg: text ? parseInt(text, 10) : undefined });
                            }}
                          />
                        )}
                        {showDurationInput && (
                          <TextInput
                            style={[styles.guidedFlowInput, isCurrentSet && styles.guidedFlowInputCurrent]}
                            placeholder="Sec"
                            keyboardType="number-pad"
                            value={set.durationSeconds?.toString() || ''}
                            onChangeText={(text) => {
                              updateCurrentExerciseSet(setIndex, { durationSeconds: text ? parseInt(text, 10) : undefined });
                            }}
                          />
                        )}
                        <TouchableOpacity
                          style={styles.guidedFlowSetDeleteButton}
                          onPress={() => removeSetFromCurrentExercise(setIndex)}
                          disabled={exerciseLogs[currentExerciseIndex].sets!.length <= 1}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={20}
                            color={exerciseLogs[currentExerciseIndex].sets!.length <= 1 ? '#D1D5DB' : '#EF4444'}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  <View style={styles.guidedFlowSetManagementButtons}>
                    <TouchableOpacity
                      style={styles.guidedFlowSetManagementButton}
                      onPress={addSetToCurrentExercise}
                    >
                      <MaterialCommunityIcons name="plus" size={18} color="#3B82F6" />
                      <Text style={styles.guidedFlowSetManagementButtonText}>+ Set</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.guidedFlowSetManagementButton}
                      onPress={copyPreviousSetToCurrentExercise}
                    >
                      <MaterialCommunityIcons name="content-copy" size={18} color="#3B82F6" />
                      <Text style={styles.guidedFlowSetManagementButtonText}>Kopieer vorige set</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {isResting && (
                <View style={styles.restTimerContainer}>
                  <Text style={styles.restTimerLabel}>Rusttijd</Text>
                  <Text style={styles.restTimerValue}>{formatTime(restSecondsRemaining)}</Text>
                  <TouchableOpacity style={styles.skipRestButton} onPress={handleSkipRest}>
                    <Text style={styles.skipRestButtonText}>Sla rust over</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!isResting && (
                <View style={styles.guidedFlowButtons}>
                  <TouchableOpacity
                    style={[styles.guidedFlowNavButton, currentExerciseIndex === 0 && styles.guidedFlowNavButtonDisabled]}
                    onPress={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                  >
                    <Text style={styles.guidedFlowNavButtonText}>Vorige oefening</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.guidedFlowCompleteButton} onPress={handleSetComplete}>
                    <Text style={styles.guidedFlowCompleteButtonText}>Set klaar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.guidedFlowSkipButton} onPress={handleSkipExercise}>
                    <Text style={styles.guidedFlowSkipButtonText}>Sla oefening over</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Compact Overview */}
            <View style={styles.compactOverview}>
              <Text style={styles.compactOverviewTitle}>Overzicht</Text>
              {exerciseLogs.map((log, index) => {
                const isCurrent = index === currentExerciseIndex;
                const isCompleted = log.completed;
                let statusColor = '#9CA3AF'; // todo
                if (isCompleted) statusColor = '#10B981';
                else if (isCurrent) statusColor = '#3B82F6';

                return (
                  <View key={log.id} style={[styles.compactOverviewItem, isCurrent && styles.compactOverviewItemCurrent]}>
                    <View style={[styles.compactOverviewDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.compactOverviewText, isCompleted && styles.compactOverviewTextCompleted]}>
                      {log.exerciseName}
                    </Text>
                    {isCurrent && <Text style={styles.compactOverviewBadge}>Huidig</Text>}
                    {isCompleted && <MaterialCommunityIcons name="check" size={16} color="#10B981" />}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Workout Complete Summary */}
        {workoutId && workoutExercises.length > 0 && exerciseLogs.length > 0 && !isGpsDiscipline && isExerciseFlowComplete && (
          <View style={styles.workoutCompleteCard}>
            <MaterialCommunityIcons name="trophy" size={48} color="#10B981" />
            <Text style={styles.workoutCompleteTitle}>Workout klaar</Text>
            <Text style={styles.workoutCompleteSubtitle}>Goed gedaan!</Text>
            <Text style={styles.workoutCompleteWorkoutName}>{workout?.name || 'Workout'}</Text>
            <Text style={styles.workoutCompleteStats}>
              {exerciseLogs.filter(l => l.completed).length} van {exerciseLogs.length} oefeningen voltooid
            </Text>
            <Text style={styles.workoutCompleteDuration}>
              Duur: {formatTime(seconds)}
            </Text>
            {programId && week && day && (
              <Text style={styles.workoutCompleteProgram}>
                Programma · Week {week} · Dag {day}
              </Text>
            )}
            {personalRecords && personalRecords.length > 0 && (
              <View style={styles.prSection}>
                <Text style={styles.prTitle}>Nieuwe PR&apos;s</Text>
                {personalRecords.slice(0, 3).map((pr) => (
                  <Text key={`${pr.exerciseName}-${pr.type}`} style={styles.prItem}>
                    {pr.exerciseName} · {pr.weightKg ? `${pr.weightKg} kg` : ''} {pr.reps ? `× ${pr.reps}` : ''} {pr.durationSeconds ? `${pr.durationSeconds}s` : ''}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={[styles.workoutCompleteSaveButton, isSavingActivity && styles.workoutCompleteSaveButtonDisabled]}
              onPress={handleSave}
              disabled={isSavingActivity || saving || saved || status !== 'FINISHED'}
            >
              <Text style={styles.workoutCompleteSaveButtonText}>
                {isSavingActivity ? 'Opslaan...' : 'Workout opslaan'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.workoutCompleteBackButton}
              onPress={() => {
                if (status !== 'FINISHED') {
                  Alert.alert(
                    'Workout nog niet afgerond',
                    'Je workout is nog niet gestopt. Wil je terugkeren naar de oefeningen?',
                    [
                      { text: 'Annuleren', style: 'cancel' },
                      {
                        text: 'Terug',
                        onPress: () => setIsExerciseFlowComplete(false),
                      },
                    ]
                  );
                }
              }}
            >
              <Text style={styles.workoutCompleteBackButtonText}>Terug naar oefeningen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Fallback to list view for GPS or when no workoutId */}
        {(!workoutId || isGpsDiscipline) && exerciseLogs.length > 0 && (
          <View style={styles.exercisesSection}>
            <Text style={styles.exercisesTitle}>Oefeningen</Text>
            {exerciseLogs.map((log, index) => {
              const planning = workoutExercisePlanning[index];
              return (
                <View key={log.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <TouchableOpacity onPress={() => {
                      const updated = [...exerciseLogs];
                      updated[index].completed = !updated[index].completed;
                      setExerciseLogs(updated);
                    }} style={styles.exerciseCheckbox}>
                      <MaterialCommunityIcons
                        name={log.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={24}
                        color={log.completed ? '#10B981' : '#6B7280'}
                      />
                    </TouchableOpacity>
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, log.completed && styles.exerciseNameCompleted]}>
                        {log.exerciseName}
                      </Text>
                      {planning && (
                        <Text style={styles.exercisePlanning}>
                          {planning.plannedSets} sets
                          {planning.targetReps && ` · ${planning.targetReps} reps`}
                          {planning.targetDurationSeconds && ` · ${planning.targetDurationSeconds} sec`}
                          {(planning.plannedWeightKg || planning.targetWeightKg) && ` · ${(planning.plannedWeightKg || planning.targetWeightKg)} kg`}
                          {planning.restSeconds && ` · ${planning.restSeconds} sec rust`}
                        </Text>
                      )}
                      {log.lastPerformance && !planning?.plannedWeightKg && !planning?.targetWeightKg && (
                        <Text style={styles.lastPerformanceText}>
                          Vorige keer: {log.lastPerformance.lastSet?.weightKg ? `${log.lastPerformance.lastSet.weightKg} kg` : ''}
                          {log.lastPerformance.lastSet?.weightKg && log.lastPerformance.lastSet?.reps ? ' × ' : ''}
                          {log.lastPerformance.lastSet?.reps ? `${log.lastPerformance.lastSet.reps} reps` : ''}
                          {log.lastPerformance.lastSet?.durationSeconds ? `${log.lastPerformance.lastSet.durationSeconds} sec` : ''}
                        </Text>
                      )}
                      {planning?.notes && (
                        <Text style={styles.exerciseNotes}>{planning.notes}</Text>
                      )}
                    </View>
                  </View>
                {log.sets && log.sets.length > 0 && (
                  <View style={styles.setsContainer}>
                    <Text style={styles.setsLabel}>Set 1</Text>
                    <TextInput
                      style={styles.setInput}
                      placeholder="Reps"
                      keyboardType="number-pad"
                      value={log.sets[0].reps?.toString() || ''}
                      onChangeText={(text) => {
                        const updated = [...exerciseLogs];
                        updated[index].sets![0].reps = text ? parseInt(text, 10) : undefined;
                        setExerciseLogs(updated);
                      }}
                    />
                    <TextInput
                      style={styles.setInput}
                      placeholder="Kg"
                      keyboardType="number-pad"
                      value={log.sets[0].weightKg?.toString() || ''}
                      onChangeText={(text) => {
                        const updated = [...exerciseLogs];
                        updated[index].sets![0].weightKg = text ? parseInt(text, 10) : undefined;
                        setExerciseLogs(updated);
                      }}
                    />
                  </View>
                )}
              </View>
              );
            })}
          </View>
        )}
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        {isGpsDiscipline && gpsState.isActive && (
          <View style={styles.gpsMetricsRow}>
            <View style={styles.gpsMetric}>
              <Text style={styles.gpsMetricLabel}>Afstand</Text>
              <Text style={styles.gpsMetricValue}>{Math.round(gpsState.distanceMeters)} m</Text>
            </View>
            <View style={styles.gpsMetric}>
              <Text style={styles.gpsMetricLabel}>Snelheid</Text>
              <Text style={styles.gpsMetricValue}>{gpsState.currentSpeedKmh !== null && !isNaN(gpsState.currentSpeedKmh) ? `${gpsState.currentSpeedKmh.toFixed(1)} km/u` : '--'}</Text>
            </View>
            <View style={styles.gpsMetric}>
              <Text style={styles.gpsMetricLabel}>Gem. pace</Text>
              <Text style={styles.gpsMetricValue}>{gpsState.averageSpeedKmh !== null && gpsState.averageSpeedKmh > 0 && !isNaN(gpsState.averageSpeedKmh) ? `${(60 / gpsState.averageSpeedKmh).toFixed(1)} min/km` : '--'}</Text>
            </View>
          </View>
        )}
      </View>

      {isWorkoutDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Workout tracker</Text>
          <Text style={styles.sectionSubtitle}>Voeg je oefeningen toe voor een volledige workout-opslag.</Text>

          {exerciseDrafts.map((exercise, index) => (
            <View key={exercise.id} style={styles.workoutExerciseCard}>
              <Text style={styles.exerciseTitle}>Oefening {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder="Oefeningnaam"
                value={exercise.name}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'name', value)}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Sets"
                  keyboardType="numeric"
                  value={exercise.sets}
                  onChangeText={(value) => handleExerciseChange(exercise.id, 'sets', value)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={exercise.reps}
                  onChangeText={(value) => handleExerciseChange(exercise.id, 'reps', value)}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Gewicht (kg) optioneel"
                keyboardType="decimal-pad"
                value={exercise.weightKg}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'weightKg', value)}
              />
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Notities optioneel"
                value={exercise.notes}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'notes', value)}
                multiline
              />
            </View>
          ))}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleAddExercise} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>+ Oefening toevoegen</Text>
          </TouchableOpacity>

          {workoutVolumePreview !== undefined ? (
            <Text style={styles.previewNote}>Totaal volume preview: {Math.round(workoutVolumePreview)} kg</Text>
          ) : null}

          {!canSaveWorkout ? (
            <Text style={styles.validationNote}>Nog geen geldige oefening. Vul minimaal naam, sets en reps in.</Text>
          ) : null}

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Algemene workout-notities optioneel"
            value={workoutNotes}
            onChangeText={setWorkoutNotes}
            multiline
          />
        </View>
      )}

      {isSessionDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Session tracker</Text>
          {discipline.privacyDefault === 'private' ? (
            <Text style={styles.privacyNote}>Deze activiteit staat standaard prive.</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionChip, sessionIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setSessionIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Focusgebieden</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. ademhaling, core, herstel"
            value={sessionFocusAreasInput}
            onChangeText={setSessionFocusAreasInput}
          />

          <Text style={styles.fieldLabel}>Gevoel voor</Text>
          <View style={styles.optionRow}>
            {SESSION_FEELING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`before-${option}`}
                style={[styles.optionChip, sessionFeelingBefore === option ? styles.optionChipActive : null]}
                onPress={() => setSessionFeelingBefore(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionFeelingBefore === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Gevoel na</Text>
          <View style={styles.optionRow}>
            {SESSION_FEELING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`after-${option}`}
                style={[styles.optionChip, sessionFeelingAfter === option ? styles.optionChipActive : null]}
                onPress={() => setSessionFeelingAfter(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionFeelingAfter === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notities optioneel"
            value={sessionNotes}
            onChangeText={setSessionNotes}
            multiline
          />
        </View>
      )}

      {isMatchDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Wedstrijd/training tracker</Text>

          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.optionRow}>
            {MATCH_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionChip, matchType === option ? styles.optionChipActive : null]}
                onPress={() => setMatchType(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, matchType === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Team</Text>
          <TextInput style={styles.input} placeholder="Team optioneel" value={matchTeam} onChangeText={setMatchTeam} />

          <Text style={styles.fieldLabel}>Tegenstander</Text>
          <TextInput style={styles.input} placeholder="Tegenstander optioneel" value={matchOpponent} onChangeText={setMatchOpponent} />

          <Text style={styles.fieldLabel}>Positie</Text>
          <TextInput style={styles.input} placeholder="Positie optioneel" value={matchPosition} onChangeText={setMatchPosition} />

          <Text style={styles.fieldLabel}>Score</Text>
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Voor"
              keyboardType="numeric"
              value={matchScoreFor}
              onChangeText={setMatchScoreFor}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Tegen"
              keyboardType="numeric"
              value={matchScoreAgainst}
              onChangeText={setMatchScoreAgainst}
            />
          </View>

          <Text style={styles.fieldLabel}>Persoonlijke stats</Text>
          <View style={styles.rowInputs}>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Goals" keyboardType="numeric" value={matchGoals} onChangeText={setMatchGoals} />
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Assists" keyboardType="numeric" value={matchAssists} onChangeText={setMatchAssists} />
          </View>
          <View style={styles.rowInputs}>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Points" keyboardType="numeric" value={matchPoints} onChangeText={setMatchPoints} />
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Rebounds" keyboardType="numeric" value={matchRebounds} onChangeText={setMatchRebounds} />
          </View>
          <View style={styles.rowInputs}>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Blocks" keyboardType="numeric" value={matchBlocks} onChangeText={setMatchBlocks} />
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Tackles" keyboardType="numeric" value={matchTackles} onChangeText={setMatchTackles} />
          </View>

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`match-intensity-${option}`}
                style={[styles.optionChip, matchIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setMatchIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, matchIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notities optioneel"
            value={matchNotes}
            onChangeText={setMatchNotes}
            multiline
          />
        </View>
      )}

      {isScoreDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Score tracker</Text>

          {scoreType === 'racket' ? (
            <>
              <Text style={styles.fieldLabel}>Tegenstander</Text>
              <TextInput style={styles.input} placeholder="Tegenstander" value={scoreOpponent} onChangeText={setScoreOpponent} />

              <Text style={styles.fieldLabel}>Resultaat</Text>
              <View style={styles.optionRow}>
                {SCORE_RESULT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionChip, scoreResult === option ? styles.optionChipActive : null]}
                    onPress={() => setScoreResult(option)}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.optionChipText, scoreResult === option ? styles.optionChipTextActive : null]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Sets</Text>
              <View style={styles.rowInputs}>
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Voor" keyboardType="numeric" value={scoreSetsFor} onChangeText={setScoreSetsFor} />
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Tegen" keyboardType="numeric" value={scoreSetsAgainst} onChangeText={setScoreSetsAgainst} />
              </View>

              <Text style={styles.fieldLabel}>Punten</Text>
              <View style={styles.rowInputs}>
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Voor" keyboardType="numeric" value={scorePointsFor} onChangeText={setScorePointsFor} />
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Tegen" keyboardType="numeric" value={scorePointsAgainst} onChangeText={setScorePointsAgainst} />
              </View>
            </>
          ) : null}

          {scoreType === 'golf' ? (
            <>
              <Text style={styles.fieldLabel}>Holes gespeeld</Text>
              <TextInput style={styles.input} placeholder="Holes" keyboardType="numeric" value={scoreHolesPlayed} onChangeText={setScoreHolesPlayed} />

              <Text style={styles.fieldLabel}>Slagen</Text>
              <TextInput style={styles.input} placeholder="Slagen" keyboardType="numeric" value={scoreStrokes} onChangeText={setScoreStrokes} />

              <Text style={styles.fieldLabel}>Par</Text>
              <TextInput style={styles.input} placeholder="Par" keyboardType="numeric" value={scorePar} onChangeText={setScorePar} />

              <Text style={styles.fieldLabel}>Handicap</Text>
              <TextInput style={styles.input} placeholder="Handicap optioneel" keyboardType="numeric" value={scoreHandicap} onChangeText={setScoreHandicap} />
            </>
          ) : null}

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`score-intensity-${option}`}
                style={[styles.optionChip, scoreIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setScoreIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, scoreIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Notities optioneel" value={scoreNotes} onChangeText={setScoreNotes} multiline />
        </View>
      )}

      {isSkillDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Skill tracker</Text>

          <Text style={styles.fieldLabel}>Niveau</Text>
          <TextInput style={styles.input} placeholder="Niveau/level optioneel" value={skillLevel} onChangeText={setSkillLevel} />

          <Text style={styles.fieldLabel}>Technieken</Text>
          <TextInput
            style={styles.input}
            placeholder="Meerdere technieken, gescheiden met komma"
            value={skillTechniquesInput}
            onChangeText={setSkillTechniquesInput}
          />

          <Text style={styles.fieldLabel}>Pogingen</Text>
          <TextInput style={styles.input} placeholder="Pogingen" keyboardType="numeric" value={skillAttempts} onChangeText={setSkillAttempts} />

          <Text style={styles.fieldLabel}>Succesvolle pogingen</Text>
          <TextInput
            style={styles.input}
            placeholder="Succesvolle pogingen"
            keyboardType="numeric"
            value={skillSuccessfulAttempts}
            onChangeText={setSkillSuccessfulAttempts}
          />

          <Text style={styles.fieldLabel}>Grade</Text>
          <TextInput style={styles.input} placeholder="Grade optioneel" value={skillGrade} onChangeText={setSkillGrade} />

          <Text style={styles.fieldLabel}>Rondes</Text>
          <TextInput style={styles.input} placeholder="Rondes optioneel" keyboardType="numeric" value={skillRounds} onChangeText={setSkillRounds} />

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`skill-intensity-${option}`}
                style={[styles.optionChip, skillIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setSkillIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, skillIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Notities optioneel" value={skillNotes} onChangeText={setSkillNotes} multiline />
        </View>
      )}

      {isLapsDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Zwem tracker</Text>

          <Text style={styles.fieldLabel}>Zwembadlengte (meters)</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. 25"
            keyboardType="numeric"
            value={lapsPoolLengthMeters}
            onChangeText={setLapsPoolLengthMeters}
          />

          <Text style={styles.fieldLabel}>Aantal banen</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. 40"
            keyboardType="numeric"
            value={lapsCount}
            onChangeText={setLapsCount}
          />

          <Text style={styles.fieldLabel}>Afstand (meters)</Text>
          <TextInput
            style={styles.input}
            placeholder="Wordt automatisch berekend als mogelijk"
            keyboardType="numeric"
            value={lapsDistanceMeters}
            onChangeText={setLapsDistanceMeters}
          />
          {getComputedLapsDistanceMeters() !== undefined ? (
            <Text style={styles.privacyNote}>Automatisch berekend: {Math.round(getComputedLapsDistanceMeters() ?? 0)} m</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Slagtype</Text>
          <View style={styles.optionRow}>
            {LAPS_STROKE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`laps-stroke-${option}`}
                style={[styles.optionChip, lapsStrokeType === option ? styles.optionChipActive : null]}
                onPress={() => setLapsStrokeType(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, lapsStrokeType === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`laps-intensity-${option}`}
                style={[styles.optionChip, lapsIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setLapsIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, lapsIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Notities optioneel" value={lapsNotes} onChangeText={setLapsNotes} multiline />
        </View>
      )}

      {isGpsDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>GPS tracker</Text>
          {!isGpsTrackingAvailable ? (
            <Text style={styles.privacyNote}>GPS tracking komt binnenkort beschikbaar.</Text>
          ) : null}
          {gpsPermissionStatus ? <Text style={styles.privacyNote}>Locatie permissie: {gpsPermissionStatus}</Text> : null}
          {calculateRouteDistanceMeters(gpsRoutePoints) !== undefined ? (
            <Text style={styles.privacyNote}>Berekende afstand: {Math.round(calculateRouteDistanceMeters(gpsRoutePoints) ?? 0)} m</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Notities optioneel" value={gpsNotes} onChangeText={setGpsNotes} multiline />
        </View>
      )}

      <View style={styles.buttonRow}>
        {status === 'NOT_STARTED' ? (
          <TouchableOpacity style={[styles.button, styles.primaryActionButton]} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : null}

        {(status === 'ACTIVE' || status === 'PAUSED') ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.secondaryActionButton]}
              onPress={status === 'ACTIVE' ? handlePause : handleResume}
            >
              <Text style={styles.buttonText}>{status === 'ACTIVE' ? 'Pauze' : 'Hervatten'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {status === 'FINISHED' ? (
        <>
          <Text style={styles.reviewText}>Controleer je gegevens en sla je activiteit op.</Text>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, (!canSaveWorkout || saved) ? styles.disabledButton : null, saved ? styles.savedButton : null]}
            onPress={handleSave}
            disabled={saving || saved || !canSaveWorkout}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              {saved ? 'Opgeslagen!' : saving ? 'Opslaan...' : 'Activiteit opslaan'}
            </Text>
          </TouchableOpacity>
          {!canSaveWorkout ? (
            <Text style={styles.validationNote}>Voeg minimaal een geldige oefening toe voordat je opslaat.</Text>
          ) : null}
        </>
      ) : null}
      {saved && <Text style={styles.successText}>Activiteit opgeslagen.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  fallback: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 32,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  sessionHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 26,
    color: '#0F172A',
    fontWeight: '800',
    marginBottom: 2,
  },
  statusPillWrap: {
    marginBottom: 8,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '800',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
  },
  workoutContextCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  workoutContextTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  workoutContextMeta: {
    fontSize: 13,
    color: '#15803D',
    marginBottom: 2,
  },
  programContext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    marginTop: 6,
  },
  exercisesSection: {
    marginTop: 16,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseCheckbox: {
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  exercisePlanning: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  exerciseNotes: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontStyle: 'italic',
  },
  lastPerformanceText: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
    fontStyle: 'italic',
  },
  setsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  setsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
    minWidth: 40,
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  timer: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  gpsMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    gap: 8,
  },
  gpsMetric: {
    alignItems: 'center',
  },
  gpsMetricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  gpsMetricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  metricsBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  workoutExerciseCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  notesInput: {
    minHeight: 42,
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  privacyNote: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  previewNote: {
    fontSize: 13,
    color: '#1D4ED8',
    marginBottom: 10,
  },
  validationNote: {
    fontSize: 13,
    color: '#B91C1C',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  optionChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  optionChipText: {
    fontSize: 13,
    color: '#374151',
  },
  optionChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 0,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryActionButton: {
    backgroundColor: '#2563EB',
  },
  secondaryActionButton: {
    backgroundColor: '#334155',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    marginTop: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  savedButton: {
    backgroundColor: '#22C55E',
  },
  successText: {
    color: '#22C55E',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  // Guided Flow Styles
  guidedFlowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  guidedFlowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  guidedFlowProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  guidedFlowSetProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  guidedFlowExerciseName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  guidedFlowPlanning: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  guidedFlowPlanningText: {
    fontSize: 13,
    color: '#166534',
  },
  guidedFlowNotes: {
    fontSize: 12,
    color: '#15803D',
    fontStyle: 'italic',
    marginTop: 4,
  },
  guidedFlowLastPerformance: {
    fontSize: 12,
    color: '#3B82F6',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  guidedFlowSetInput: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  guidedFlowSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  guidedFlowSetRowCurrent: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  guidedFlowSetNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 30,
  },
  guidedFlowSetNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  guidedFlowSetNumberTextCurrent: {
    color: '#3B82F6',
  },
  guidedFlowInputCurrent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
  },
  guidedFlowSetDeleteButton: {
    padding: 4,
  },
  guidedFlowSetManagementButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  guidedFlowSetManagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  guidedFlowSetManagementButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  guidedFlowInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  restTimerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginBottom: 16,
  },
  restTimerLabel: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
  },
  restTimerValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 12,
  },
  skipRestButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skipRestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  guidedFlowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  guidedFlowNavButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guidedFlowNavButtonDisabled: {
    opacity: 0.5,
  },
  guidedFlowNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  guidedFlowCompleteButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guidedFlowCompleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guidedFlowSkipButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guidedFlowSkipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  compactOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compactOverviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  compactOverviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  compactOverviewItemCurrent: {
    backgroundColor: '#EFF6FF',
  },
  compactOverviewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  compactOverviewText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  compactOverviewTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  compactOverviewBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  workoutCompleteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 20,
  },
  workoutCompleteTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 16,
  },
  workoutCompleteSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  workoutCompleteWorkoutName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  workoutCompleteStats: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
  },
  workoutCompleteDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  workoutCompleteProgram: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 8,
    fontWeight: '600',
  },
  prSection: {
    marginTop: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  prTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  prItem: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 4,
  },
  workoutCompleteSaveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
  },
  workoutCompleteSaveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  workoutCompleteSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  workoutCompleteBackButton: {
    marginTop: 12,
  },
  workoutCompleteBackButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
