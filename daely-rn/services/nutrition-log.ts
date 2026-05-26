import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  CreateNutritionLogInput,
  NutritionDailyTotals,
  NutritionItemType,
  NutritionLogEntry,
  NutritionMealType,
  NutritionMacros,
  NutritionSourceType,
  UpdateNutritionLogInput,
} from '@/services/nutrition-log.types';

const STORAGE_KEY = 'daely.nutrition.logs.v1';

const ITEM_TYPES: NutritionItemType[] = ['food', 'drink', 'supplement'];
const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const SOURCE_TYPES: NutritionSourceType[] = ['manual', 'barcode', 'daely', 'open_food_facts', 'usda'];

function toNonNegativeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Number(value.toFixed(2)));
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(',', '.').trim();
    if (cleaned.length === 0) return 0;
    const parsed = Number.parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Number(parsed.toFixed(2)));
    }
  }

  return 0;
}

function toOptionalTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureType<T extends string>(value: unknown, allowed: T[], field: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new Error(`Invalid ${field}`);
  }

  return value as T;
}

function createEntryId(): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `nutrition-${Date.now()}-${random}`;
}

function isValidIsoDate(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function sanitizeMacros(macros: Partial<NutritionMacros> | undefined): NutritionMacros {
  return {
    kcal: toNonNegativeNumber(macros?.kcal),
    protein: toNonNegativeNumber(macros?.protein),
    carbs: toNonNegativeNumber(macros?.carbs),
    fats: toNonNegativeNumber(macros?.fats),
  };
}

export function buildDayKey(dateInput: Date | string): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    const fallback = new Date();
    return `${fallback.getFullYear()}-${`${fallback.getMonth() + 1}`.padStart(2, '0')}-${`${fallback.getDate()}`.padStart(2, '0')}`;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateNutritionInput(input: CreateNutritionLogInput): void {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name) {
    throw new Error('Name is required');
  }

  ensureType(input.itemType, ITEM_TYPES, 'itemType');
  ensureType(input.mealType, MEAL_TYPES, 'mealType');

  const macros = sanitizeMacros(input.macros);
  if (!Number.isFinite(macros.kcal) || !Number.isFinite(macros.protein) || !Number.isFinite(macros.carbs) || !Number.isFinite(macros.fats)) {
    throw new Error('Macros must be valid numbers');
  }
}

export function normalizeNutritionEntry(entry: Partial<NutritionLogEntry>): NutritionLogEntry {
  const nowIso = new Date().toISOString();
  const loggedAt = typeof entry.loggedAt === 'string' && isValidIsoDate(entry.loggedAt) ? entry.loggedAt : nowIso;
  const createdAt = typeof entry.createdAt === 'string' && isValidIsoDate(entry.createdAt) ? entry.createdAt : nowIso;

  const source = typeof entry.source === 'string' && SOURCE_TYPES.includes(entry.source as NutritionSourceType)
    ? (entry.source as NutritionSourceType)
    : 'manual';

  return {
    id: typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : createEntryId(),
    createdAt,
    loggedAt,
    dayKey: typeof entry.dayKey === 'string' && entry.dayKey.trim() ? entry.dayKey : buildDayKey(loggedAt),
    source,
    itemType: ensureType(entry.itemType, ITEM_TYPES, 'itemType'),
    mealType: ensureType(entry.mealType, MEAL_TYPES, 'mealType'),
    name: (entry.name || '').trim(),
    brand: toOptionalTrimmedString(entry.brand),
    amount: entry.amount === undefined ? undefined : toNonNegativeNumber(entry.amount),
    amountUnit: toOptionalTrimmedString(entry.amountUnit),
    macros: sanitizeMacros(entry.macros),
    notes: toOptionalTrimmedString(entry.notes),
    isSynced: false,
  };
}

export function groupNutritionLogsByDay(entries: NutritionLogEntry[]): Record<string, NutritionLogEntry[]> {
  return entries.reduce<Record<string, NutritionLogEntry[]>>((accumulator, entry) => {
    if (!accumulator[entry.dayKey]) {
      accumulator[entry.dayKey] = [];
    }
    accumulator[entry.dayKey].push(entry);
    return accumulator;
  }, {});
}

export async function getNutritionLogs(): Promise<NutritionLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized: NutritionLogEntry[] = [];

    for (const item of parsed) {
      try {
        const normalizedItem = normalizeNutritionEntry(item as Partial<NutritionLogEntry>);
        if (normalizedItem.name) {
          normalized.push(normalizedItem);
        }
      } catch {
        // Skip invalid entries to keep storage resilient.
      }
    }

    return normalized.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  } catch (error) {
    console.warn('Failed to load nutrition logs from storage.', error);
    return [];
  }
}

export async function saveNutritionLogs(entries: NutritionLogEntry[]): Promise<void> {
  const normalized = entries.map((entry) => normalizeNutritionEntry(entry));
  normalized.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export async function addNutritionLog(input: CreateNutritionLogInput): Promise<NutritionLogEntry> {
  validateNutritionInput(input);

  const nowIso = new Date().toISOString();
  const loggedAt = typeof input.loggedAt === 'string' && isValidIsoDate(input.loggedAt) ? input.loggedAt : nowIso;

  const nextEntry = normalizeNutritionEntry({
    id: createEntryId(),
    createdAt: nowIso,
    loggedAt,
    dayKey: buildDayKey(loggedAt),
    source: input.source || 'manual',
    itemType: input.itemType,
    mealType: input.mealType,
    name: input.name,
    brand: input.brand,
    amount: input.amount,
    amountUnit: input.amountUnit,
    macros: input.macros,
    notes: input.notes,
    isSynced: false,
  });

  const current = await getNutritionLogs();
  const updated = [nextEntry, ...current];
  await saveNutritionLogs(updated);

  return nextEntry;
}

export async function updateNutritionLog(id: string, patch: UpdateNutritionLogInput): Promise<void> {
  const current = await getNutritionLogs();
  const next = current.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    const merged: Partial<NutritionLogEntry> = {
      ...entry,
      ...patch,
      macros: {
        ...entry.macros,
        ...(patch.macros || {}),
      },
      isSynced: false,
    };

    const normalized = normalizeNutritionEntry(merged);

    if (!normalized.name) {
      throw new Error('Name is required');
    }

    return normalized;
  });

  await saveNutritionLogs(next);
}

export async function deleteNutritionLog(id: string): Promise<void> {
  const current = await getNutritionLogs();
  const filtered = current.filter((entry) => entry.id !== id);
  await saveNutritionLogs(filtered);
}

export async function getNutritionLogsForDay(dayKey: string): Promise<NutritionLogEntry[]> {
  const allEntries = await getNutritionLogs();
  return allEntries
    .filter((entry) => entry.dayKey === dayKey)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
}

export async function getNutritionDailyTotals(dayKey: string): Promise<NutritionDailyTotals> {
  const entries = await getNutritionLogsForDay(dayKey);

  const totals = entries.reduce<NutritionDailyTotals>(
    (accumulator, entry) => ({
      ...accumulator,
      kcal: Number((accumulator.kcal + entry.macros.kcal).toFixed(2)),
      protein: Number((accumulator.protein + entry.macros.protein).toFixed(2)),
      carbs: Number((accumulator.carbs + entry.macros.carbs).toFixed(2)),
      fats: Number((accumulator.fats + entry.macros.fats).toFixed(2)),
      itemCount: accumulator.itemCount + 1,
    }),
    {
      dayKey,
      kcal: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      itemCount: 0,
    }
  );

  return totals;
}
