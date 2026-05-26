import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NutritionItemType, NutritionMacros, NutritionMealType, NutritionSourceType } from '@/services/nutrition-log.types';

const FAVORITES_STORAGE_KEY = 'daely.nutrition.favorites.v1';

export interface FavoriteNutritionItem {
  key: string;
  name: string;
  brand?: string;
  source: NutritionSourceType;
  itemType: NutritionItemType;
  mealType: NutritionMealType;
  amount: number;
  amountUnit?: string;
  macros: NutritionMacros;
  notes?: string;
  verificationStatus?: string;
  confidenceScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteNutritionItemInput {
  name: string;
  brand?: string;
  source?: NutritionSourceType;
  itemType: NutritionItemType;
  mealType: NutritionMealType;
  amount?: number;
  amountUnit?: string;
  macros: NutritionMacros;
  notes?: string;
  verificationStatus?: string;
  confidenceScore?: number;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Number(value.toFixed(2)));
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(',', '.').trim());
    if (Number.isFinite(parsed)) {
      return Math.max(0, Number(parsed.toFixed(2)));
    }
  }

  return 0;
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeMacros(macros: Partial<NutritionMacros> | undefined): NutritionMacros {
  return {
    kcal: toNumber(macros?.kcal),
    protein: toNumber(macros?.protein),
    carbs: toNumber(macros?.carbs),
    fats: toNumber(macros?.fats),
  };
}

function normalizeSource(value: unknown): NutritionSourceType {
  if (value === 'barcode' || value === 'daely' || value === 'open_food_facts' || value === 'usda') {
    return value;
  }
  return 'manual';
}

function normalizeItemType(value: unknown): NutritionItemType {
  if (value === 'drink' || value === 'supplement') {
    return value;
  }
  return 'food';
}

function normalizeMealType(value: unknown): NutritionMealType {
  if (
    value === 'ontbijt' ||
    value === 'lunch' ||
    value === 'diner' ||
    value === 'snack' ||
    value === 'pre-workout' ||
    value === 'post-workout' ||
    value === 'supplement'
  ) {
    return value;
  }
  return 'snack';
}

export function buildFavoriteNutritionKey(item: {
  name: string;
  brand?: string;
  macros: NutritionMacros;
}): string {
  const name = item.name.trim().toLowerCase();
  const brand = (item.brand || '').trim().toLowerCase();
  const kcal = Number(toNumber(item.macros.kcal).toFixed(2));
  const protein = Number(toNumber(item.macros.protein).toFixed(2));
  const carbs = Number(toNumber(item.macros.carbs).toFixed(2));
  const fats = Number(toNumber(item.macros.fats).toFixed(2));
  return `${name}|${brand}|${kcal}|${protein}|${carbs}|${fats}`;
}

function normalizeFavorite(raw: Partial<FavoriteNutritionItem>): FavoriteNutritionItem | null {
  const name = toOptionalString(raw.name);
  if (!name) {
    return null;
  }

  const macros = normalizeMacros(raw.macros);
  const key = typeof raw.key === 'string' && raw.key.trim().length > 0
    ? raw.key.trim()
    : buildFavoriteNutritionKey({ name, brand: toOptionalString(raw.brand), macros });

  const nowIso = new Date().toISOString();

  return {
    key,
    name,
    brand: toOptionalString(raw.brand),
    source: normalizeSource(raw.source),
    itemType: normalizeItemType(raw.itemType),
    mealType: normalizeMealType(raw.mealType),
    amount: toNumber(raw.amount) > 0 ? toNumber(raw.amount) : 100,
    amountUnit: toOptionalString(raw.amountUnit),
    macros,
    notes: toOptionalString(raw.notes),
    verificationStatus: toOptionalString(raw.verificationStatus),
    confidenceScore: toNumber(raw.confidenceScore) > 0 ? toNumber(raw.confidenceScore) : undefined,
    createdAt: toOptionalString(raw.createdAt) || nowIso,
    updatedAt: toOptionalString(raw.updatedAt) || nowIso,
  };
}

async function readFavorites(): Promise<FavoriteNutritionItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map((item) => normalizeFavorite(item as Partial<FavoriteNutritionItem>))
      .filter((item): item is FavoriteNutritionItem => !!item)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return normalized;
  } catch (error) {
    console.warn('Failed to read nutrition favorites.', error);
    return [];
  }
}

async function saveFavorites(items: FavoriteNutritionItem[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}

export async function getFavoriteNutritionItems(): Promise<FavoriteNutritionItem[]> {
  return readFavorites();
}

export async function addFavoriteNutritionItem(input: FavoriteNutritionItemInput): Promise<FavoriteNutritionItem[]> {
  const nowIso = new Date().toISOString();
  const macros = normalizeMacros(input.macros);
  const key = buildFavoriteNutritionKey({
    name: input.name,
    brand: input.brand,
    macros,
  });

  const nextItem = normalizeFavorite({
    key,
    name: input.name,
    brand: input.brand,
    source: input.source || 'manual',
    itemType: input.itemType,
    mealType: input.mealType,
    amount: input.amount,
    amountUnit: input.amountUnit,
    macros,
    notes: input.notes,
    verificationStatus: input.verificationStatus,
    confidenceScore: input.confidenceScore,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  if (!nextItem) {
    return readFavorites();
  }

  const current = await readFavorites();
  const existingIndex = current.findIndex((item) => item.key === key);

  if (existingIndex >= 0) {
    const merged: FavoriteNutritionItem = {
      ...current[existingIndex],
      ...nextItem,
      createdAt: current[existingIndex].createdAt,
      updatedAt: nowIso,
    };

    const updated = [
      merged,
      ...current.filter((_, index) => index !== existingIndex),
    ];
    await saveFavorites(updated);
    return updated;
  }

  const updated = [nextItem, ...current].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await saveFavorites(updated);
  return updated;
}

export async function removeFavoriteNutritionItem(itemOrKey: string | { key: string }): Promise<void> {
  const key = typeof itemOrKey === 'string' ? itemOrKey : itemOrKey.key;
  const normalizedKey = key.trim();
  if (!normalizedKey) return;

  const current = await readFavorites();
  const filtered = current.filter((item) => item.key !== normalizedKey);
  await saveFavorites(filtered);
}

export async function isFavoriteNutritionItem(item: {
  key?: string;
  name: string;
  brand?: string;
  macros: NutritionMacros;
}): Promise<boolean> {
  const key = item.key && item.key.trim().length > 0
    ? item.key.trim()
    : buildFavoriteNutritionKey({ name: item.name, brand: item.brand, macros: item.macros });

  const current = await readFavorites();
  return current.some((favorite) => favorite.key === key);
}
