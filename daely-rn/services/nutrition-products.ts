import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const RAW_API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8085').replace(/\/$/, '');
const CONTRIBUTOR_ID_STORAGE_KEY = 'daely.nutrition.contributor.id.v1';

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

export type ProductItemType = 'food' | 'drink' | 'supplement';

export interface ProductNutrientsInput {
  perUnit?: '100g' | '100ml' | 'serving';
  kcal?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  sugar?: number;
  salt?: number;
  sodium?: number;
  fiber?: number;
  caffeine?: number;
  creatine?: number;
}

export interface NutritionProductSummary {
  id: number;
  barcode?: string;
  name: string;
  brand?: string;
  itemType: ProductItemType;
  confidenceScore: number;
  verificationStatus: 'unverified' | 'community_verified' | 'label_verified' | 'admin_verified' | 'brand_verified';
  nutrients: {
    perUnit: '100g' | '100ml' | 'serving';
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
    sugar: number;
    salt: number;
    sodium: number;
    fiber: number;
    caffeine: number;
    creatine: number;
  };
}

export interface ContributeNutritionProductInput {
  submittedBarcode?: string;
  submittedName: string;
  submittedBrand?: string;
  submittedCountry?: string;
  submittedLanguage?: string;
  submittedItemType: ProductItemType;
  submittedNutritionJson: ProductNutrientsInput;
  submittedImageUrl?: string;
  submittedLabelImageUrl?: string;
  source?: 'user' | 'open_food_facts' | 'usda' | 'brand' | 'admin';
}

function normalizeNumber(value: unknown): number {
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

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

async function getAnonymousNutritionContributorId(): Promise<string> {
  const existing = await AsyncStorage.getItem(CONTRIBUTOR_ID_STORAGE_KEY);
  if (existing && existing.trim().length > 0) {
    return existing.trim();
  }

  const next = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(CONTRIBUTOR_ID_STORAGE_KEY, next);
  return next;
}

function parseProductSummary(raw: Record<string, unknown>): NutritionProductSummary {
  const nutrientsRaw = (raw.nutrients as Record<string, unknown>) || {};

  return {
    id: Number(raw.id),
    barcode: optionalString(raw.barcode),
    name: optionalString(raw.name) || 'Onbekend product',
    brand: optionalString(raw.brand),
    itemType: (optionalString(raw.itemType) as ProductItemType) || 'food',
    confidenceScore: normalizeNumber(raw.confidenceScore),
    verificationStatus:
      (optionalString(raw.verificationStatus) as NutritionProductSummary['verificationStatus']) || 'unverified',
    nutrients: {
      perUnit: (optionalString(nutrientsRaw.perUnit) as '100g' | '100ml' | 'serving') || '100g',
      kcal: normalizeNumber(nutrientsRaw.kcal),
      protein: normalizeNumber(nutrientsRaw.protein),
      carbs: normalizeNumber(nutrientsRaw.carbs),
      fats: normalizeNumber(nutrientsRaw.fats),
      sugar: normalizeNumber(nutrientsRaw.sugar),
      salt: normalizeNumber(nutrientsRaw.salt),
      sodium: normalizeNumber(nutrientsRaw.sodium),
      fiber: normalizeNumber(nutrientsRaw.fiber),
      caffeine: normalizeNumber(nutrientsRaw.caffeine),
      creatine: normalizeNumber(nutrientsRaw.creatine),
    },
  };
}

export async function searchNutritionProducts(query: string): Promise<NutritionProductSummary[]> {
  const normalized = query.trim();
  if (!normalized) return [];

  const response = await fetch(`${API_BASE_URL}/api/nutrition/products/search?query=${encodeURIComponent(normalized)}`);
  if (!response.ok) {
    throw new Error('Product zoeken mislukt.');
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(parseProductSummary)
    .slice(0, 20);
}

export async function contributeNutritionProduct(input: ContributeNutritionProductInput): Promise<{ contributionId: number; status: string }> {
  const anonymousUserId = await getAnonymousNutritionContributorId();

  const safeNutrients: ProductNutrientsInput = {
    perUnit: input.submittedNutritionJson.perUnit || 'serving',
    kcal: normalizeNumber(input.submittedNutritionJson.kcal),
    protein: normalizeNumber(input.submittedNutritionJson.protein),
    carbs: normalizeNumber(input.submittedNutritionJson.carbs),
    fats: normalizeNumber(input.submittedNutritionJson.fats),
    sugar: normalizeNumber(input.submittedNutritionJson.sugar),
    salt: normalizeNumber(input.submittedNutritionJson.salt),
    sodium: normalizeNumber(input.submittedNutritionJson.sodium),
    fiber: normalizeNumber(input.submittedNutritionJson.fiber),
    caffeine: normalizeNumber(input.submittedNutritionJson.caffeine),
    creatine: normalizeNumber(input.submittedNutritionJson.creatine),
  };

  const response = await fetch(`${API_BASE_URL}/api/nutrition/products/contribute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anonymousUserId,
      submittedBarcode: optionalString(input.submittedBarcode),
      submittedName: input.submittedName,
      submittedBrand: optionalString(input.submittedBrand),
      submittedCountry: optionalString(input.submittedCountry),
      submittedLanguage: optionalString(input.submittedLanguage),
      submittedItemType: input.submittedItemType,
      submittedNutritionJson: safeNutrients,
      submittedImageUrl: optionalString(input.submittedImageUrl),
      submittedLabelImageUrl: optionalString(input.submittedLabelImageUrl),
      source: input.source || 'user',
    }),
  });

  if (!response.ok) {
    let message = 'Bijdrage versturen mislukt.';
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

  const body = (await response.json()) as Record<string, unknown>;
  return {
    contributionId: Number(body.contributionId || 0),
    status: typeof body.status === 'string' ? body.status : 'pending',
  };
}

export async function reportNutritionProduct(
  productId: number,
  reason: string,
  correctedValuesJson?: ProductNutrientsInput,
): Promise<{ reportId: number; status: string }> {
  const anonymousUserId = await getAnonymousNutritionContributorId();

  const response = await fetch(`${API_BASE_URL}/api/nutrition/products/${productId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anonymousUserId,
      reason: reason.trim(),
      correctedValuesJson: correctedValuesJson || {},
    }),
  });

  if (!response.ok) {
    let message = 'Melding versturen mislukt.';
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

  const body = (await response.json()) as Record<string, unknown>;
  return {
    reportId: Number(body.reportId || 0),
    status: typeof body.status === 'string' ? body.status : 'open',
  };
}
