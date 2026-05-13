import type { Challenge, Creator, Recipe } from '../../types';

export type CountryCode = 'NL' | 'FR' | 'BE' | 'DE' | 'ES' | 'GB' | 'US';
const DEFAULT_COUNTRY: CountryCode = 'NL';

const localeToCountry = (locale?: string): CountryCode => {
  const code = (locale || '').toLowerCase();
  if (code.includes('-fr')) return 'FR';
  if (code.includes('-be')) return 'BE';
  if (code.includes('-de')) return 'DE';
  if (code.includes('-es')) return 'ES';
  if (code.includes('-gb') || code.includes('-uk')) return 'GB';
  if (code.includes('-us')) return 'US';
  return 'NL';
};

const normalizeCountry = (value?: string | null): CountryCode => {
  const normalized = (value || '').trim().toUpperCase();
  const supported: CountryCode[] = ['NL', 'FR', 'BE', 'DE', 'ES', 'GB', 'US'];
  return supported.includes(normalized as CountryCode) ? (normalized as CountryCode) : DEFAULT_COUNTRY;
};

export const getPreferredCountry = (): CountryCode => {
  if (typeof window === 'undefined') {
    return DEFAULT_COUNTRY;
  }

  const storedCountry =
    window.localStorage.getItem('daely_account_country') ||
    window.localStorage.getItem('aura_account_country') ||
    window.localStorage.getItem('accountCountry');

  if (storedCountry) {
    return normalizeCountry(storedCountry);
  }

  return localeToCountry(window.navigator.language);
};

const withCountryParam = (url: string, country?: CountryCode) => {
  const value = country || getPreferredCountry();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}country=${encodeURIComponent(value)}`;
};

export interface CommunityEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  logo: string;
  image: string;
  description: string;
  stats: {
    participants: string;
    type: string;
    difficulty: string;
  };
}

export type PartnerCategory = 'supplements' | 'nutrition' | 'apparel' | 'memberships';

export interface PartnerItem {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: PartnerCategory;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed for ${url}`);
  }

  return response.json() as Promise<T>;
}

export const fetchCreators = (country?: CountryCode) => fetchJson<Creator[]>(withCountryParam('/api/content/creators', country));

export const fetchRecipes = (query?: string, country?: CountryCode) => {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return fetchJson<Recipe[]>(withCountryParam(`/api/content/recipes${params}`, country));
};

export const fetchEvents = (country?: CountryCode) => fetchJson<CommunityEvent[]>(withCountryParam('/api/content/events', country));

export const fetchChallenges = (country?: CountryCode) => fetchJson<Challenge[]>(withCountryParam('/api/content/challenges', country));

export const fetchPartners = (country?: CountryCode) => fetchJson<PartnerItem[]>(withCountryParam('/api/content/partners', country));