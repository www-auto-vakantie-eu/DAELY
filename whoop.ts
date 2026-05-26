const WHOOP_DEVELOPER_BASE = "https://api.prod.whoop.com/developer";
const WHOOP_OAUTH_BASE = "https://api.prod.whoop.com/oauth/oauth2";

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;
const WHOOP_REDIRECT_URI = process.env.WHOOP_REDIRECT_URI;
const WHOOP_SCOPES =
  process.env.WHOOP_SCOPES ||
  "read:profile read:body_measurement read:recovery read:sleep read:workout read:cycles";

function assertWhoopOAuthConfig() {
  if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET || !WHOOP_REDIRECT_URI) {
    throw new Error(
      "WHOOP OAuth config ontbreekt. Stel WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET en WHOOP_REDIRECT_URI in."
    );
  }
}

async function parseWhoopResponse(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`WHOOP API error ${res.status}: ${text || res.statusText}`);
  }

  return data;
}

export function getWhoopAuthorizeUrl(state: string, redirectUri?: string) {
  assertWhoopOAuthConfig();

  const effectiveRedirectUri = redirectUri?.trim() || WHOOP_REDIRECT_URI!;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: WHOOP_CLIENT_ID!,
    redirect_uri: effectiveRedirectUri,
    scope: WHOOP_SCOPES,
    state,
  });

  return `${WHOOP_OAUTH_BASE}/auth?${params.toString()}`;
}

export async function exchangeWhoopCodeForToken(code: string, redirectUri?: string) {
  assertWhoopOAuthConfig();

  const effectiveRedirectUri = redirectUri?.trim() || WHOOP_REDIRECT_URI!;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: WHOOP_CLIENT_ID!,
    client_secret: WHOOP_CLIENT_SECRET!,
    redirect_uri: effectiveRedirectUri,
  });

  const res = await fetch(`${WHOOP_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return parseWhoopResponse(res);
}

export async function refreshWhoopAccessToken(refreshToken: string) {
  assertWhoopOAuthConfig();

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: WHOOP_CLIENT_ID!,
    client_secret: WHOOP_CLIENT_SECRET!,
  });

  const res = await fetch(`${WHOOP_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return parseWhoopResponse(res);
}

async function whoopGet(path: string, accessToken: string, query?: Record<string, string | undefined>) {
  const url = new URL(`${WHOOP_DEVELOPER_BASE}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseWhoopResponse(res);
}

export async function getWhoopProfile(accessToken: string) {
  return whoopGet("/v2/user/profile/basic", accessToken);
}

export async function getWhoopBodyMeasurement(accessToken: string) {
  return whoopGet("/v2/user/measurement/body", accessToken);
}

export async function getWhoopRecoveryCollection(
  accessToken: string,
  query?: Record<string, string | undefined>
) {
  return whoopGet("/v2/recovery", accessToken, query);
}

export async function getWhoopSleepCollection(
  accessToken: string,
  query?: Record<string, string | undefined>
) {
  return whoopGet("/v2/activity/sleep", accessToken, query);
}

export async function getWhoopWorkoutCollection(
  accessToken: string,
  query?: Record<string, string | undefined>
) {
  return whoopGet("/v2/activity/workout", accessToken, query);
}
