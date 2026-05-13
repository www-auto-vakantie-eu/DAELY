const FALLBACK_INVITE_CODES = ['DAELY-CREATOR-2026', 'DAELY-INFLUENCER-BETA'];

function getConfiguredInviteCodes(): string[] {
  const raw = process.env.EXPO_PUBLIC_INFLUENCER_INVITE_CODES ?? '';
  const fromEnv = raw
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

  if (fromEnv.length > 0) {
    return fromEnv;
  }

  return FALLBACK_INVITE_CODES;
}

export function validateInfluencerInviteCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;

  return getConfiguredInviteCodes().includes(normalized);
}
