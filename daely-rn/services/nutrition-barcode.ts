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

export interface BarcodeNutritionProduct {
  name: string;
  brand?: string;
  barcode: string;
  imageUrl?: string;
  source?: 'daely' | 'open_food_facts' | 'usda' | 'manual';
  verificationStatus?: string;
  confidenceScore?: number;
  itemType?: 'food' | 'drink' | 'supplement';
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  sugar: number;
  salt: number;
  servingSize: number;
  servingUnit: string;
}

function toNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Number(value.toFixed(2)));
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value.replace(',', '.').trim());
      if (Number.isFinite(parsed)) return Math.max(0, Number(parsed.toFixed(2)));
    }
  }

  return 0;
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function lookupBarcodeProduct(barcode: string): Promise<BarcodeNutritionProduct | null> {
  const cleaned = barcode.replace(/\s+/g, '');
  if (!/^\d{8,14}$/.test(cleaned)) {
    throw new Error('Ongeldige barcode.');
  }

  let sourceHint: BarcodeNutritionProduct['source'] | undefined = 'daely';
  let response = await fetch(`${API_BASE_URL}/api/nutrition/products/barcode/${encodeURIComponent(cleaned)}`);
  if (response.status === 404) {
    sourceHint = 'open_food_facts';
    response = await fetch(`${API_BASE_URL}/api/nutrition/barcode/${encodeURIComponent(cleaned)}`);
  }
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let details = 'Barcode opzoeken mislukt.';
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') {
        details = body.error;
      }
    } catch {
      // keep fallback message
    }
    throw new Error(details);
  }

  const data = (await response.json()) as Record<string, unknown>;
  const nutrients = ((data.nutrients as Record<string, unknown>) || {}) as Record<string, unknown>;

  const sourceRaw = toOptionalString(data.source);
  const normalizedSource: BarcodeNutritionProduct['source'] = sourceRaw === 'open_food_facts' || sourceRaw === 'usda'
    ? sourceRaw
    : sourceRaw === 'user'
      ? 'manual'
      : sourceRaw === 'admin' || sourceRaw === 'brand'
        ? 'daely'
      : sourceHint;

  const itemType = toOptionalString(data.itemType);
  const normalizedItemType: BarcodeNutritionProduct['itemType'] = itemType === 'drink' || itemType === 'supplement' ? itemType : 'food';

  const perUnit = toOptionalString(nutrients.perUnit);
  const servingUnit = perUnit === '100ml' ? 'ml' : perUnit === 'serving' ? 'portie' : perUnit === '100g' ? 'gram' : undefined;

  return {
    name: typeof data.name === 'string' && data.name.trim().length > 0 ? data.name.trim() : 'Onbekend product',
    brand: toOptionalString(data.brand),
    barcode: typeof data.barcode === 'string' && data.barcode.trim().length > 0 ? data.barcode.trim() : cleaned,
    imageUrl: toOptionalString(data.imageUrl),
    source: normalizedSource,
    verificationStatus: toOptionalString(data.verificationStatus),
    confidenceScore: (() => {
      const score = toNumber(data.confidenceScore);
      return score > 0 ? score : undefined;
    })(),
    itemType: normalizedItemType,
    kcal: toNumber(data.kcal, nutrients.kcal),
    protein: toNumber(data.protein, nutrients.protein),
    carbs: toNumber(data.carbs, nutrients.carbs),
    fats: toNumber(data.fats, nutrients.fats),
    sugar: toNumber(data.sugar, nutrients.sugar),
    salt: toNumber(data.salt, nutrients.salt),
    servingSize: (() => {
      const serving = toNumber(data.servingSize, nutrients.servingSize);
      return serving > 0 ? serving : 100;
    })(),
    servingUnit: toOptionalString(data.servingUnit) || servingUnit || 'gram',
  };
}
