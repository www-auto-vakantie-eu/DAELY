import AsyncStorage from '@react-native-async-storage/async-storage';
import { Program } from '@/constants/discipline-content';

const USER_ENROLLMENTS_STORAGE_KEY = 'daely.user.enrollments.v1';

export interface UserProgramEnrollment {
  id: string;
  programId: string;
  disciplineSlug: string;
  sourceType: 'daely' | 'coach' | 'influencer';
  creatorId?: string;
  creatorName?: string;
  accessType: 'included' | 'paid';
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  purchasedAt?: string;
  currentWeek: number;
  currentDay: number;
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
    disciplineSlug,
    sourceType,
    creatorId: program.creatorId,
    creatorName: program.creatorName,
    accessType,
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