import { getActivities, Activity } from './activity-storage';

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