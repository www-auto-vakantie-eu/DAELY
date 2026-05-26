import Constants from 'expo-constants';

const DEFAULT_API_PORT = '8085';
const DEFAULT_API_BASE_URL = `http://localhost:${DEFAULT_API_PORT}`;

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function getConfiguredApiBaseUrl(): string {
  const primary = process.env.EXPO_PUBLIC_API_URL;
  if (typeof primary === 'string' && primary.trim().length > 0) {
    return stripTrailingSlash(primary.trim());
  }

  const secondary = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (typeof secondary === 'string' && secondary.trim().length > 0) {
    return stripTrailingSlash(secondary.trim());
  }

  return DEFAULT_API_BASE_URL;
}

function getExpoLanHost(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost ||
    '';

  if (typeof hostUri !== 'string' || hostUri.length === 0) {
    return '';
  }

  const hostSegment = hostUri.includes('://')
    ? (() => {
        try {
          return new URL(hostUri).host;
        } catch {
          return hostUri;
        }
      })()
    : hostUri;

  return hostSegment.split('/')[0]?.split(':')[0] ?? '';
}

export function resolveApiBaseUrl(): string {
  const configured = getConfiguredApiBaseUrl();

  if (!configured) {
    throw new Error('Unable to determine API base URL. Set EXPO_PUBLIC_API_URL or EXPO_PUBLIC_API_BASE_URL.');
  }

  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error(
      `Invalid API base URL "${configured}". Expected an absolute http(s) URL in EXPO_PUBLIC_API_URL or EXPO_PUBLIC_API_BASE_URL.`
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported API protocol "${parsed.protocol}" in base URL "${configured}".`);
  }

  const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  if (!isLocalhost) {
    return stripTrailingSlash(parsed.toString());
  }

  const lanHost = getExpoLanHost();
  if (!lanHost) {
    return stripTrailingSlash(parsed.toString());
  }

  const port = parsed.port || DEFAULT_API_PORT;
  return `${parsed.protocol}//${lanHost}:${port}`;
}

export const API_BASE_URL = resolveApiBaseUrl();

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
