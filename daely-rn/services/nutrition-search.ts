import Constants from 'expo-constants';

const RAW_API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8085').replace(/\/$/, '');

function resolveApiBaseUrl(): string {
  const localhostMatch = RAW_API_BASE_URL.match(/^https?:\/\/(localhost|127\.0\.0\.1)(?::(\d+))?$/i);
  if (!localhostMatch) {
    return RAW_API_BASE_URL;
  }

  const fallbackPort = localhostMatch[2] ?? '8085';
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost ||
    '';

  const host = typeof hostUri === 'string' && hostUri.length > 0 ? hostUri.split(':')[0] : '';
  if (!host) {
    return RAW_API_BASE_URL;
  }

  return `http://${host}:${fallbackPort}`;
}

const API_BASE_URL = resolveApiBaseUrl();

export type NutritionSearchSource = 'daely' | 'open_food_facts' | 'usda';
export type NutritionSearchItemType = 'food' | 'drink' | 'supplement';

export interface NutritionSearchResult {
  externalId: string;
  source: NutritionSearchSource;
  originSource?: 'user' | 'open_food_facts' | 'usda' | 'brand' | 'admin';
  name: string;
  brand?: string;
  barcode?: string;
  itemType: NutritionSearchItemType;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
  salt: number;
  sodium: number;
  servingSize: number;
  servingUnit: string;
  imageUrl?: string;
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

function toStringOptional(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeItemType(value: unknown): NutritionSearchItemType {
  return value === 'drink' || value === 'supplement' ? value : 'food';
}

function sanitizeSource(value: unknown): NutritionSearchSource {
  return value === 'open_food_facts' || value === 'usda' ? value : 'daely';
}

export async function searchNutrition(query: string): Promise<NutritionSearchResult[]> {
  const normalized = query.trim();
  if (normalized.length < 3) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/nutrition/search?query=${encodeURIComponent(normalized)}`);
  if (!response.ok) {
    let message = 'Zoeken naar voeding mislukt.';
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') {
        message = body.error;
      }
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      externalId: toStringOptional(item.externalId) || `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      source: sanitizeSource(item.source),
      originSource: (() => {
        const raw = toStringOptional(item.originSource);
        if (raw === 'user' || raw === 'open_food_facts' || raw === 'usda' || raw === 'brand' || raw === 'admin') {
          return raw;
        }
        return undefined;
      })(),
      name: toStringOptional(item.name) || 'Onbekend product',
      brand: toStringOptional(item.brand),
      barcode: toStringOptional(item.barcode),
      itemType: sanitizeItemType(item.itemType),
      kcal: toNumber(item.kcal),
      protein: toNumber(item.protein),
      carbs: toNumber(item.carbs),
      fats: toNumber(item.fats),
      sugar: toNumber(item.sugar),
      salt: toNumber(item.salt),
      sodium: toNumber(item.sodium),
      servingSize: (() => {
        const value = toNumber(item.servingSize);
        return value > 0 ? value : 100;
      })(),
      servingUnit: toStringOptional(item.servingUnit) || 'gram',
      imageUrl: toStringOptional(item.imageUrl),
      verificationStatus: toStringOptional(item.verificationStatus),
      confidenceScore: (() => {
        const score = toNumber(item.confidenceScore);
        return score > 0 ? score : undefined;
      })(),
    }))
    .slice(0, 20);
}
