import AsyncStorage from '@react-native-async-storage/async-storage';
import { Program, DISCIPLINE_CONTENT } from '@/constants/discipline-content';

const USER_ENROLLMENTS_STORAGE_KEY = 'daely.user.enrollments.v1';

export interface NextProgramWorkout {
  enrollment: UserProgramEnrollment;
  program: Program;
  disciplineSlug: string;
  week: number;
  day: number;
  workout?: any;
  completedCount: number;
  totalPlannedWorkouts: number;
  progressPercentage: number;
}

export interface UserProgramEnrollment {
  id: string;
  programId: string;
  programName: string;
  disciplineSlug: string;
  sourceType: 'daely' | 'coach' | 'influencer';
  creatorId?: string;
  creatorName?: string;
  creatorRole?: string;
  accessType: 'included' | 'paid';
  priceLabel?: string;
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  purchasedAt?: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts?: {
    workoutId: string;
    week: number;
    day: number;
    completedAt: string;
    activityId?: string;
  }[];
  totalPlannedWorkouts?: number;
  completedCount?: number;
  progressPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export async function getUserPrograms(): Promise<UserProgramEnrollment[]> {
  const raw = await AsyncStorage.getItem(USER_ENROLLMENTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function enrollInProgram(
  program: Program,
  disciplineSlug: string,
  sourceType: 'daely' | 'coach' | 'influencer',
  accessType: 'included' | 'paid'
): Promise<UserProgramEnrollment> {
  const currentEnrollments = await getUserPrograms();

  // Check if already enrolled
  const existingEnrollment = currentEnrollments.find(
    (e) => e.programId === program.id && e.disciplineSlug === disciplineSlug
  );

  if (existingEnrollment) {
    return existingEnrollment;
  }

  const now = new Date().toISOString();
  const enrollment: UserProgramEnrollment = {
    id: `enrollment-${Date.now()}`,
    programId: program.id,
    programName: program.name,
    disciplineSlug,
    sourceType,
    creatorId: program.creatorId,
    creatorName: program.creatorName,
    creatorRole: program.creatorRole,
    accessType,
    priceLabel: program.priceLabel,
    status: 'active',
    startedAt: now,
    purchasedAt: accessType === 'paid' ? now : undefined,
    currentWeek: 1,
    currentDay: 1,
    createdAt: now,
    updatedAt: now,
  };

  await AsyncStorage.setItem(
    USER_ENROLLMENTS_STORAGE_KEY,
    JSON.stringify([enrollment, ...currentEnrollments])
  );

  return enrollment;
}

export async function removeUserProgram(enrollmentId: string): Promise<void> {
  const currentEnrollments = await getUserPrograms();
  const filtered = currentEnrollments.filter((e) => e.id !== enrollmentId);
  await AsyncStorage.setItem(USER_ENROLLMENTS_STORAGE_KEY, JSON.stringify(filtered));
}

export async function isProgramOwned(
  programId: string,
  disciplineSlug: string
): Promise<boolean> {
  const enrollments = await getUserPrograms();
  return enrollments.some(
    (e) => e.programId === programId && e.disciplineSlug === disciplineSlug
  );
}

export async function getUserProgramByProgramId(
  programId: string,
  disciplineSlug: string
): Promise<UserProgramEnrollment | null> {
  const enrollments = await getUserPrograms();
  return (
    enrollments.find(
      (e) => e.programId === programId && e.disciplineSlug === disciplineSlug
    ) || null
  );
}

export async function completeProgramWorkout(params: {
  programId: string;
  disciplineSlug: string;
  workoutId: string;
  week: number;
  day: number;
  activityId?: string;
}): Promise<void> {
  const currentEnrollments = await getUserPrograms();
  const enrollmentIndex = currentEnrollments.findIndex(
    (e) => e.programId === params.programId && e.disciplineSlug === params.disciplineSlug
  );

  if (enrollmentIndex === -1) {
    return; // Enrollment not found, do nothing
  }

  const enrollment = currentEnrollments[enrollmentIndex];
  const completedWorkouts = enrollment.completedWorkouts || [];

  // Check if this workout is already completed
  const alreadyCompleted = completedWorkouts.some(
    (w) => w.workoutId === params.workoutId && w.week === params.week && w.day === params.day
  );

  if (alreadyCompleted) {
    return; // Already completed, do nothing
  }

  // Add completed workout
  const newCompletedWorkout = {
    workoutId: params.workoutId,
    week: params.week,
    day: params.day,
    completedAt: new Date().toISOString(),
    activityId: params.activityId,
  };

  const updatedCompletedWorkouts = [...completedWorkouts, newCompletedWorkout];

  // Update currentWeek/currentDay to next uncompleted day
  let nextWeek = enrollment.currentWeek;
  let nextDay = enrollment.currentDay + 1;

  // Simple logic: move to next day, wrap to next week if needed
  // In a real implementation, this would use the program's actual structure
  if (nextDay > 7) { // Assuming 7 days per week max
    nextDay = 1;
    nextWeek += 1;
  }

  // Calculate progress
  const totalPlannedWorkouts = enrollment.totalPlannedWorkouts || updatedCompletedWorkouts.length + 10;
  const completedCount = updatedCompletedWorkouts.length;
  const progressPercentage = Math.round((completedCount / totalPlannedWorkouts) * 100);

  // Update enrollment
  const updatedEnrollment: UserProgramEnrollment = {
    ...enrollment,
    completedWorkouts: updatedCompletedWorkouts,
    currentWeek: nextWeek,
    currentDay: nextDay,
    totalPlannedWorkouts,
    completedCount,
    progressPercentage,
    updatedAt: new Date().toISOString(),
  };

  currentEnrollments[enrollmentIndex] = updatedEnrollment;

  await AsyncStorage.setItem(
    USER_ENROLLMENTS_STORAGE_KEY,
    JSON.stringify(currentEnrollments)
  );
}

export async function getNextProgramWorkout(): Promise<NextProgramWorkout | null> {
  const enrollments = await getUserPrograms();
  const activeEnrollments = enrollments.filter((e) => e.status === 'active');

  if (activeEnrollments.length === 0) {
    return null;
  }

  // Use the most recently updated active enrollment
  const enrollment = activeEnrollments.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

  // Get program from DISCIPLINE_CONTENT
  const disciplineContent = DISCIPLINE_CONTENT[enrollment.disciplineSlug as keyof typeof DISCIPLINE_CONTENT];
  if (!disciplineContent || !disciplineContent.programs) {
    return null;
  }

  const program = disciplineContent.programs.find((p) => p.id === enrollment.programId);
  if (!program) {
    return null;
  }

  // Calculate which workout to show based on currentWeek/currentDay
  const week = enrollment.currentWeek;
  const day = enrollment.currentDay;
  const daysPerWeek = program.daysPerWeek || 3;
  const workoutIndex = (week - 1) * daysPerWeek + (day - 1);

  const workout = program.workoutIds && workoutIndex < program.workoutIds.length
    ? disciplineContent.workouts.find((w) => w.id === program.workoutIds![workoutIndex])
    : undefined;

  const completedCount = enrollment.completedCount || 0;
  const totalPlannedWorkouts = enrollment.totalPlannedWorkouts || daysPerWeek * program.weeks;
  const progressPercentage = enrollment.progressPercentage || Math.round((completedCount / totalPlannedWorkouts) * 100);

  return {
    enrollment,
    program,
    disciplineSlug: enrollment.disciplineSlug,
    week,
    day,
    workout,
    completedCount,
    totalPlannedWorkouts,
    progressPercentage,
  };
}