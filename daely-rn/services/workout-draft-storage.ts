import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUT_DRAFTS_STORAGE_KEY = 'daely.workout.drafts.v1';

export interface WorkoutDraft {
  id: string;
  disciplineId: string;
  workoutId?: string;
  workoutName?: string;
  programId?: string;
  programWeek?: number;
  programDay?: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restSecondsRemaining: number;
  isExerciseFlowComplete: boolean;
  exerciseLogs: any[];
  startedAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'discarded';
}

export async function saveWorkoutDraft(draft: WorkoutDraft): Promise<void> {
  try {
    const drafts = await getWorkoutDrafts();
    const existingIndex = drafts.findIndex(
      (d) => d.disciplineId === draft.disciplineId && 
      d.workoutId === draft.workoutId && 
      d.programId === draft.programId
    );

    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = updatedDraft;
    } else {
      drafts.unshift(updatedDraft);
    }

    await AsyncStorage.setItem(WORKOUT_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save workout draft:', error);
  }
}

export async function getWorkoutDrafts(): Promise<WorkoutDraft[]> {
  try {
    const raw = await AsyncStorage.getItem(WORKOUT_DRAFTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getWorkoutDraft(
  disciplineId: string,
  workoutId?: string,
  programId?: string
): Promise<WorkoutDraft | null> {
  try {
    const drafts = await getWorkoutDrafts();
    return drafts.find(
      (d) => d.disciplineId === disciplineId && 
      d.workoutId === workoutId && 
      d.programId === programId &&
      d.status === 'active'
    ) || null;
  } catch {
    return null;
  }
}

export async function getActiveWorkoutDraft(): Promise<WorkoutDraft | null> {
  try {
    const drafts = await getWorkoutDrafts();
    return drafts.find((d) => d.status === 'active') || null;
  } catch {
    return null;
  }
}

export async function hasActiveWorkoutDraft(
  disciplineId: string,
  workoutId?: string,
  programId?: string
): Promise<boolean> {
  const draft = await getWorkoutDraft(disciplineId, workoutId, programId);
  return draft !== null;
}

export async function clearWorkoutDraft(draftId: string): Promise<void> {
  try {
    const drafts = await getWorkoutDrafts();
    const filtered = drafts.filter((d) => d.id !== draftId);
    await AsyncStorage.setItem(WORKOUT_DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to clear workout draft:', error);
  }
}

export async function clearDraftForWorkout(
  disciplineId: string,
  workoutId?: string,
  programId?: string
): Promise<void> {
  try {
    const drafts = await getWorkoutDrafts();
    const filtered = drafts.filter(
      (d) => !(d.disciplineId === disciplineId && 
              d.workoutId === workoutId && 
              d.programId === programId)
    );
    await AsyncStorage.setItem(WORKOUT_DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to clear draft for workout:', error);
  }
}

export async function markDraftAsCompleted(draftId: string): Promise<void> {
  try {
    const drafts = await getWorkoutDrafts();
    const draftIndex = drafts.findIndex((d) => d.id === draftId);
    if (draftIndex >= 0) {
      drafts[draftIndex].status = 'completed';
      drafts[draftIndex].updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(WORKOUT_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    }
  } catch (error) {
    console.error('Failed to mark draft as completed:', error);
  }
}