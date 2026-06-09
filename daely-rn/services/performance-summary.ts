import { getActivities, Activity, PersonalRecord } from './activity-storage';

export interface PerformanceSummary {
  totalActivities: number;
  totalWorkoutActivities: number;
  totalPersonalRecords: number;
  latestPersonalRecord?: PersonalRecord;
  latestWorkout?: Activity;
  recentPersonalRecords: PersonalRecord[];
}

export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  const activities = await getActivities();
  
  // Total activities
  const totalActivities = activities.length;
  
  // Total workout activities
  const totalWorkoutActivities = activities.filter(a => a.metrics?.workout).length;
  
  // Collect all personal records
  const allPersonalRecords: PersonalRecord[] = [];
  for (const activity of activities) {
    if (activity.metrics?.workout?.personalRecords) {
      allPersonalRecords.push(...activity.metrics.workout.personalRecords);
    }
  }
  
  const totalPersonalRecords = allPersonalRecords.length;
  
  // Sort by achievedAt descending
  allPersonalRecords.sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime());
  
  const latestPersonalRecord = allPersonalRecords[0];
  const recentPersonalRecords = allPersonalRecords.slice(0, 10);
  
  // Latest workout activity
  const workouts = activities.filter(a => a.metrics?.workout);
  workouts.sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
  const latestWorkout = workouts[0];
  
  return {
    totalActivities,
    totalWorkoutActivities,
    totalPersonalRecords,
    latestPersonalRecord,
    latestWorkout,
    recentPersonalRecords,
  };
}

export async function getRecentPersonalRecords(limit: number = 10): Promise<PersonalRecord[]> {
  const activities = await getActivities();
  const allPersonalRecords: PersonalRecord[] = [];
  
  for (const activity of activities) {
    if (activity.metrics?.workout?.personalRecords) {
      allPersonalRecords.push(...activity.metrics.workout.personalRecords);
    }
  }
  
  // Sort by achievedAt descending
  allPersonalRecords.sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime());
  
  return allPersonalRecords.slice(0, limit);
}