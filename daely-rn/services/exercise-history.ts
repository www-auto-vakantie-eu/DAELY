import { getActivities, Activity, PersonalRecord } from './activity-storage';

export interface LastExercisePerformance {
  exerciseId?: string;
  exerciseName: string;
  lastPerformedAt: string;
  lastSet?: {
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
  };
  sourceActivityId: string;
}

export interface ExerciseStats {
  timesPerformed: number;
  lastPerformedAt: string | null;
  lastSet?: {
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
  };
  bestSet?: {
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
  };
}

export async function getLastExercisePerformance(
  exerciseId?: string,
  exerciseName?: string
): Promise<LastExercisePerformance | null> {
  const activities = await getActivities();
  
  // Search through activities for workout exercises
  for (const activity of activities) {
    const workoutExercises = activity.metrics?.workout?.workoutExercises;
    if (!workoutExercises) continue;

    for (const log of workoutExercises) {
      // Match by exerciseId first, then by exerciseName
      const idMatch = exerciseId && log.exerciseId === exerciseId;
      const nameMatch = !exerciseId && exerciseName && log.exerciseName === exerciseName;
      
      if (idMatch || nameMatch) {
        // Get the last completed set with data
        const lastCompletedSet = log.sets?.find(s => s.completed && (s.reps || s.weightKg || s.durationSeconds));
        
        return {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          lastPerformedAt: activity.endedAt,
          lastSet: lastCompletedSet ? {
            reps: lastCompletedSet.reps,
            weightKg: lastCompletedSet.weightKg,
            durationSeconds: lastCompletedSet.durationSeconds,
          } : undefined,
          sourceActivityId: activity.id,
        };
      }
    }
  }

  return null;
}

export async function getExerciseHistory(
  exerciseId?: string,
  exerciseName?: string
): Promise<LastExercisePerformance[]> {
  const activities = await getActivities();
  const history: LastExercisePerformance[] = [];

  for (const activity of activities) {
    const workoutExercises = activity.metrics?.workout?.workoutExercises;
    if (!workoutExercises) continue;

    for (const log of workoutExercises) {
      const idMatch = exerciseId && log.exerciseId === exerciseId;
      const nameMatch = !exerciseId && exerciseName && log.exerciseName === exerciseName;

      if (idMatch || nameMatch) {
        const lastCompletedSet = log.sets?.find(s => s.completed && (s.reps || s.weightKg || s.durationSeconds));

        history.push({
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          lastPerformedAt: activity.endedAt,
          lastSet: lastCompletedSet ? {
            reps: lastCompletedSet.reps,
            weightKg: lastCompletedSet.weightKg,
            durationSeconds: lastCompletedSet.durationSeconds,
          } : undefined,
          sourceActivityId: activity.id,
        });
      }
    }
  }

  return history;
}

export async function getExerciseStats(
  exerciseId?: string,
  exerciseName?: string
): Promise<ExerciseStats> {
  const activities = await getActivities();
  const history: LastExercisePerformance[] = [];

  for (const activity of activities) {
    const workoutExercises = activity.metrics?.workout?.workoutExercises;
    if (!workoutExercises) continue;

    for (const log of workoutExercises) {
      const idMatch = exerciseId && log.exerciseId === exerciseId;
      const nameMatch = !exerciseId && exerciseName && log.exerciseName === exerciseName;

      if (idMatch || nameMatch) {
        const lastCompletedSet = log.sets?.find(s => s.completed && (s.reps || s.weightKg || s.durationSeconds));

        history.push({
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          lastPerformedAt: activity.endedAt,
          lastSet: lastCompletedSet ? {
            reps: lastCompletedSet.reps,
            weightKg: lastCompletedSet.weightKg,
            durationSeconds: lastCompletedSet.durationSeconds,
          } : undefined,
          sourceActivityId: activity.id,
        });
      }
    }
  }

  if (history.length === 0) {
    return {
      timesPerformed: 0,
      lastPerformedAt: null,
    };
  }

  // Sort by date descending
  history.sort((a, b) => new Date(b.lastPerformedAt).getTime() - new Date(a.lastPerformedAt).getTime());

  // Last set
  const lastSet = history[0].lastSet;

  // Find best set
  let bestSet: {
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
  } | undefined;

  for (const entry of history) {
    if (!entry.lastSet) continue;

    const set = entry.lastSet;

    if (!bestSet) {
      bestSet = set;
      continue;
    }

    // For weight exercises: highest weightKg, if equal then highest reps
    if (set.weightKg !== undefined && bestSet.weightKg !== undefined) {
      if (set.weightKg > bestSet.weightKg) {
        bestSet = set;
      } else if (set.weightKg === bestSet.weightKg && set.reps !== undefined && bestSet.reps !== undefined) {
        if (set.reps > bestSet.reps) {
          bestSet = set;
        }
      }
    }
    // For bodyweight without weight: highest reps
    else if (set.reps !== undefined && bestSet.reps !== undefined) {
      if (set.reps > bestSet.reps) {
        bestSet = set;
      }
    }
    // For duration exercises: highest durationSeconds
    else if (set.durationSeconds !== undefined && bestSet.durationSeconds !== undefined) {
      if (set.durationSeconds > bestSet.durationSeconds) {
        bestSet = set;
      }
    }
  }

  return {
    timesPerformed: history.length,
    lastPerformedAt: history[0].lastPerformedAt,
    lastSet,
    bestSet,
  };
}

export async function detectPersonalRecords(
  workoutExerciseLogs: any[]
): Promise<PersonalRecord[]> {
  const records: PersonalRecord[] = [];
  const activities = await getActivities();
  const now = new Date().toISOString();

  for (const log of workoutExerciseLogs) {
    if (!log.exerciseName) continue;

    // Get historical best set for this exercise
    const stats = await getExerciseStats(log.exerciseId, log.exerciseName);
    const historicalBestSet = stats.bestSet;

    // Check all completed sets in this workout
    if (!log.sets || log.sets.length === 0) continue;

    for (const set of log.sets) {
      if (!set.completed) continue;

      const hasWeight = set.weightKg !== undefined && set.weightKg > 0;
      const hasReps = set.reps !== undefined && set.reps > 0;
      const hasDuration = set.durationSeconds !== undefined && set.durationSeconds > 0;

      // Weight PR: higher weightKg than historical best
      if (hasWeight && hasReps) {
        const historicalWeight = historicalBestSet?.weightKg ?? 0;
        if (set.weightKg > historicalWeight) {
          records.push({
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            type: 'weight',
            previousValue: historicalWeight > 0 ? historicalWeight : undefined,
            newValue: set.weightKg,
            reps: set.reps,
            weightKg: set.weightKg,
            achievedAt: now,
          });
        }
        // Equal weight but more reps
        else if (set.weightKg === historicalWeight && historicalBestSet?.reps !== undefined) {
          if (set.reps > historicalBestSet.reps) {
            records.push({
              exerciseId: log.exerciseId,
              exerciseName: log.exerciseName,
              type: 'weight',
              previousValue: historicalWeight,
              newValue: set.weightKg,
              reps: set.reps,
              weightKg: set.weightKg,
              achievedAt: now,
            });
          }
        }
      }
      // Reps PR (bodyweight, no weight)
      else if (hasReps && !hasWeight) {
        const historicalReps = historicalBestSet?.reps ?? 0;
        if (set.reps > historicalReps) {
          records.push({
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            type: 'reps',
            previousValue: historicalReps > 0 ? historicalReps : undefined,
            newValue: set.reps,
            reps: set.reps,
            achievedAt: now,
          });
        }
      }
      // Duration PR
      else if (hasDuration) {
        const historicalDuration = historicalBestSet?.durationSeconds ?? 0;
        if (set.durationSeconds > historicalDuration) {
          records.push({
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            type: 'duration',
            previousValue: historicalDuration > 0 ? historicalDuration : undefined,
            newValue: set.durationSeconds,
            durationSeconds: set.durationSeconds,
            achievedAt: now,
          });
        }
      }
    }
  }

  return records;
}