export type CountryCode = 'NL' | 'FR' | 'BE' | 'DE' | 'ES' | 'GB' | 'US';
export type CountryOrAll = CountryCode | 'ALL';
export type CreatorBadge = 'VERIFIED' | 'PRO' | 'ELITE' | 'COACH';

import { COMMUNITY_CREATORS } from '@/constants/community-creators';
import { PARTNERS } from '@/constants/partners';

export interface CommunityCreator {
  id: string;
  name: string;
  specialty: string;
  badge: CreatorBadge;
  image: string;
  followers: number;
  posts: number;
  bio: string;
  country: CountryCode;
}

export interface PartnerBrand {
  id: string;
  name: string;
  category: string;
  group: 'Kleding' | 'Voeding' | 'Supplementen' | 'Lidmaatschappen';
  summary: string;
  image: string;
  discountLabel: string;
  discountCode: string;
  offerUrl: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Hyrox' | 'Obstacle' | 'Running' | 'Other';
  accent: string;
  logoUrl: string;
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8081').replace(/\/$/, '');

const buildUrl = (path: string, country: CountryCode) => {
  const separator = path.includes('?') ? '&' : '?';
  return `${API_BASE_URL}${path}${separator}country=${encodeURIComponent(country)}`;
};

const parseFollowers = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;

  const v = value.trim().toUpperCase();
  if (v.endsWith('M')) {
    const n = Number.parseFloat(v.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1_000_000) : 0;
  }
  if (v.endsWith('K')) {
    const n = Number.parseFloat(v.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1_000) : 0;
  }

  const n = Number.parseInt(v.replace(/\D+/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

const mapBadge = (level: unknown): CreatorBadge => {
  const value = typeof level === 'string' ? level.toLowerCase() : '';
  if (value === 'verified') return 'VERIFIED';
  if (value === 'pro') return 'PRO';
  if (value === 'elite') return 'ELITE';
  return 'COACH';
};

const mapPartnerGroup = (category: unknown): PartnerBrand['group'] => {
  switch (category) {
    case 'supplements':
      return 'Supplementen';
    case 'nutrition':
      return 'Voeding';
    case 'memberships':
      return 'Lidmaatschappen';
    default:
      return 'Kleding';
  }
};

const mapEventType = (value: unknown): CommunityEvent['type'] => {
  const type = typeof value === 'string' ? value.toLowerCase() : '';
  if (type.includes('hyrox')) return 'Hyrox';
  if (type.includes('obstacle') || type.includes('ocr')) return 'Obstacle';
  if (type.includes('running') || type.includes('run')) return 'Running';
  return 'Other';
};

const eventAccent = (type: CommunityEvent['type']) => {
  switch (type) {
    case 'Hyrox':
      return '#06B6D4';
    case 'Obstacle':
      return '#8B5CF6';
    case 'Running':
      return '#F97316';
    default:
      return '#22C55E';
  }
};

async function fetchJson<T>(path: string, country: CountryCode): Promise<T> {
  const response = await fetch(buildUrl(path, country));
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

const COUNTRY_TO_CITY: Record<CountryCode, string> = {
  NL: 'Amsterdam',
  FR: 'Paris',
  BE: 'Antwerpen',
  DE: 'Berlin',
  ES: 'Barcelona',
  GB: 'London',
  US: 'Austin',
};

const COUNTRY_EVENT_PREFIX: Record<CountryCode, string> = {
  NL: 'NL',
  FR: 'FR',
  BE: 'BE',
  DE: 'DE',
  ES: 'ES',
  GB: 'UK',
  US: 'US',
};

const FALLBACK_EVENT_TEMPLATES = [
  { type: 'Hyrox' as const, title: 'Hyrox Open', month: 3, day: 14, logoUrl: 'https://logo.clearbit.com/hyrox.com' },
  { type: 'Running' as const, title: 'City 10K', month: 4, day: 7, logoUrl: 'https://logo.clearbit.com/worldathletics.org' },
  { type: 'Obstacle' as const, title: 'Obstacle Race Series', month: 4, day: 20, logoUrl: 'https://logo.clearbit.com/spartan.com' },
];

const fallbackCreatorsForCountry = (country: CountryCode): CommunityCreator[] => {
  const offset = country.charCodeAt(0) + country.charCodeAt(1);
  return COMMUNITY_CREATORS.map((creator, index) => {
    const followerBoost = (offset % 7) * 1200 + index * 160;
    return {
      id: creator.id, // Gebruik alleen de creator.id zonder landprefix
      name: creator.name,
      specialty: creator.specialty,
      badge: creator.badge,
      image: creator.image,
      followers: creator.followers + followerBoost,
      posts: creator.posts,
      bio: creator.bio,
      country,
    };
  }).slice(0, 10);
};

const fallbackPartnersForCountry = (country: CountryCode): PartnerBrand[] => {
  const code = country.toLowerCase();
  return PARTNERS.map((partner) => ({
    id: `${partner.id}-${code}`,
    name: partner.name,
    category: partner.category,
    group: partner.group === 'Supplementen' || partner.group === 'Voeding' ? partner.group : 'Kleding',
    summary: partner.summary,
    image: partner.image,
    discountLabel: partner.discountLabel,
    discountCode: `${partner.discountCode}-${country}`,
    offerUrl: partner.offerUrl,
  }));
};

const fallbackEventsForCountry = (country: CountryCode): CommunityEvent[] => {
  const city = COUNTRY_TO_CITY[country];
  const prefix = COUNTRY_EVENT_PREFIX[country];
  const year = new Date().getFullYear();

  return FALLBACK_EVENT_TEMPLATES.map((template, index) => {
    const eventDate = new Date(year, template.month, template.day + index).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return {
      id: `${prefix}-${template.type.toLowerCase()}-${index + 1}`,
      title: `${template.title} ${prefix}`,
      date: eventDate,
      location: city,
      type: template.type,
      accent: eventAccent(template.type),
      logoUrl: template.logoUrl,
    };
  });
};

export const fetchCommunityCreators = async (country: CountryCode): Promise<CommunityCreator[]> => {
  try {
    if (country === 'ALL') {
      // Haal alle landen op (voorbeeld: combineer alle landen lokaal)
      const allCountries: CountryCode[] = ['NL', 'FR', 'BE', 'DE', 'ES', 'GB', 'US'];
      let allCreators: CommunityCreator[] = [];
      for (const c of allCountries) {
        const creators = await fetchCommunityCreators(c);
        allCreators = allCreators.concat(creators);
      }
      return allCreators;
    }
    const data = await fetchJson<any[]>('/api/content/creators', country);
    return data.map((creator) => ({
      id: String(creator.id),
      name: String(creator.name || ''),
      specialty: String(creator.specialty || ''),
      badge: mapBadge(creator.level),
      image: String(creator.image || ''),
      followers: parseFollowers(creator.followers),
      posts: Number.isFinite(Number(creator.active_subscribers)) ? Number(creator.active_subscribers) : 0,
      bio: String(creator.bio || ''),
      country,
    }));
  } catch (error) {
    console.warn('Falling back to local community creators:', error);
    return fallbackCreatorsForCountry(country as CountryCode);
  }
};

export const fetchCommunityPartners = async (country: CountryCode): Promise<PartnerBrand[]> => {
  try {
    if (country === 'ALL') {
      const allCountries: CountryCode[] = ['NL', 'FR', 'BE', 'DE', 'ES', 'GB', 'US'];
      let allPartners: PartnerBrand[] = [];
      for (const c of allCountries) {
        const partners = await fetchCommunityPartners(c);
        allPartners = allPartners.concat(partners);
      }
      return allPartners;
    }
    const data = await fetchJson<any[]>('/api/content/partners', country);
    return data.map((partner) => ({
      id: String(partner.id),
      name: String(partner.name || ''),
      category: String(partner.category || ''),
      group: mapPartnerGroup(partner.category),
      summary: 'Automatische partnerkorting voor DAELY-leden.',
      image: String(partner.domain ? `https://logo.clearbit.com/${partner.domain}` : ''),
      discountLabel: '10% korting',
      discountCode: 'DAELY-10',
      offerUrl: String(partner.url || ''),
    }));
  } catch (error) {
    console.warn('Falling back to local partner brands:', error);
    return fallbackPartnersForCountry(country as CountryCode);
  }
};

export const fetchCommunityEvents = async (country: CountryCode): Promise<CommunityEvent[]> => {
  try {
    if (country === 'ALL') {
      const allCountries: CountryCode[] = ['NL', 'FR', 'BE', 'DE', 'ES', 'GB', 'US'];
      let allEvents: CommunityEvent[] = [];
      for (const c of allCountries) {
        const events = await fetchCommunityEvents(c);
        allEvents = allEvents.concat(events);
      }
      return allEvents;
    }
    const data = await fetchJson<any[]>('/api/content/events', country);
    return data.map((event) => {
      const type = mapEventType(event.type);
      return {
        id: String(event.id),
        title: String(event.name || ''),
        date: String(event.date || ''),
        location: String(event.location || ''),
        type,
        accent: eventAccent(type),
        logoUrl: String(event.logo || ''),
      };
    });
  } catch (error) {
    console.warn('Falling back to local community events:', error);
    return fallbackEventsForCountry(country as CountryCode);
  }
};
