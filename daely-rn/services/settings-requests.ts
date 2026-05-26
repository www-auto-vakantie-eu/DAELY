import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/services/api-base';

const STORAGE_KEY = 'daely.settings.requests.v1';

export type SettingsRequestType =
  | 'support-contact'
  | 'bug-report'
  | 'data-export'
  | 'data-deletion'
  | 'feedback-form';

export interface SettingsRequest {
  id: string;
  type: SettingsRequestType;
  createdAt: string;
  payload?: Record<string, string | boolean | number>;
  synced?: boolean;
}

export interface SubmitSettingsRequestOptions {
  forceLocal?: boolean;
}

const SYNC_TIMEOUT_MS = 5_000;
const RETRY_DELAYS_MS = [350, 900];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getStoredRequests(): Promise<SettingsRequest[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SettingsRequest[]) : [];
}

async function saveStoredRequests(requests: SettingsRequest[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

async function appendRequest(request: SettingsRequest): Promise<void> {
  const current = await getStoredRequests();
  current.unshift(request);
  await saveStoredRequests(current);
}

async function sendRequestToBackend(request: SettingsRequest): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/settings-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: request.id,
        type: request.type,
        payload: request.payload,
        createdAt: request.createdAt,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Settings request API failed: ${response.status}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function sendRequestWithRetry(request: SettingsRequest): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      await sendRequestToBackend(request);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  throw lastError;
}

export async function submitSettingsRequest(
  type: SettingsRequestType,
  payload?: Record<string, string | boolean | number>,
  options?: SubmitSettingsRequestOptions
): Promise<SettingsRequest> {
  const request: SettingsRequest = {
    id: `${type}-${Date.now()}`,
    type,
    createdAt: new Date().toISOString(),
    payload,
  };

  if (options?.forceLocal) {
    const localRequest = { ...request, synced: false };
    await appendRequest(localRequest);
    return localRequest;
  }

  try {
    await sendRequestWithRetry(request);
    const syncedRequest = { ...request, synced: true };
    await appendRequest(syncedRequest);
    return syncedRequest;
  } catch {
    const localRequest = { ...request, synced: false };
    await appendRequest(localRequest);
    return localRequest;
  }
}

export async function getSettingsRequests(): Promise<SettingsRequest[]> {
  return getStoredRequests();
}

function isQaSmokeRequest(request: SettingsRequest): boolean {
  const source = request.payload?.source;
  return source === 'qa-smoke';
}

export async function clearQaSmokeSettingsRequests(): Promise<number> {
  const requests = await getStoredRequests();
  const filtered = requests.filter((request) => !isQaSmokeRequest(request));
  await saveStoredRequests(filtered);
  return requests.length - filtered.length;
}

export async function syncPendingSettingsRequests(): Promise<{
  attempted: number;
  synced: number;
  failed: number;
  completedAt: string;
}> {
  const completedAt = new Date().toISOString();
  const requests = await getStoredRequests();
  const pending = requests.filter((item) => item.synced === false);

  if (pending.length === 0) {
    return { attempted: 0, synced: 0, failed: 0, completedAt };
  }

  const syncedIds = new Set<string>();

  for (const request of pending) {
    try {
      await sendRequestWithRetry(request);
      syncedIds.add(request.id);
    } catch {
      // Keep as pending for next retry window.
    }
  }

  if (syncedIds.size > 0) {
    const next = requests.map((item) =>
      syncedIds.has(item.id) ? { ...item, synced: true } : item
    );
    await saveStoredRequests(next);
  }

  return {
    attempted: pending.length,
    synced: syncedIds.size,
    failed: pending.length - syncedIds.size,
    completedAt,
  };
}
