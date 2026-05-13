type PushLocale = 'nl' | 'en';
type DayKey =
  | 'day1'
  | 'day2'
  | 'day3'
  | 'day4'
  | 'day5'
  | 'day6'
  | 'day7';
type SlotKey = 'slot1' | 'slot2' | 'slot3';

type LocalizedPushCopy = {
  nl: string;
  en: string;
};

type PushQuickWinsResource = {
  pushQuickWins: Record<DayKey, Record<SlotKey, LocalizedPushCopy>>;
};

import pushQuickWinsJson from '../data/i18n/push-quickwins.json';

const pushQuickWinsResource = pushQuickWinsJson as PushQuickWinsResource;

export type QuickWinPushDay = DayKey;
export type QuickWinPushSlot = SlotKey;
export type QuickWinPushLocale = PushLocale;

export function getQuickWinPushCopy(
  day: QuickWinPushDay,
  slot: QuickWinPushSlot,
  locale: QuickWinPushLocale = 'nl'
): string {
  const item = pushQuickWinsResource.pushQuickWins[day]?.[slot];
  if (!item) {
    return '';
  }

  return item[locale] ?? item.nl;
}

export function getQuickWinPushCopyForSettings(
  day: QuickWinPushDay,
  slot: QuickWinPushSlot,
  appLanguage: QuickWinPushLocale
): string {
  return getQuickWinPushCopy(day, slot, appLanguage);
}

export function getAllQuickWinPushes(locale: QuickWinPushLocale = 'nl'): Record<
  QuickWinPushDay,
  Record<QuickWinPushSlot, string>
> {
  return {
    day1: {
      slot1: getQuickWinPushCopy('day1', 'slot1', locale),
      slot2: getQuickWinPushCopy('day1', 'slot2', locale),
      slot3: getQuickWinPushCopy('day1', 'slot3', locale),
    },
    day2: {
      slot1: getQuickWinPushCopy('day2', 'slot1', locale),
      slot2: getQuickWinPushCopy('day2', 'slot2', locale),
      slot3: getQuickWinPushCopy('day2', 'slot3', locale),
    },
    day3: {
      slot1: getQuickWinPushCopy('day3', 'slot1', locale),
      slot2: getQuickWinPushCopy('day3', 'slot2', locale),
      slot3: getQuickWinPushCopy('day3', 'slot3', locale),
    },
    day4: {
      slot1: getQuickWinPushCopy('day4', 'slot1', locale),
      slot2: getQuickWinPushCopy('day4', 'slot2', locale),
      slot3: getQuickWinPushCopy('day4', 'slot3', locale),
    },
    day5: {
      slot1: getQuickWinPushCopy('day5', 'slot1', locale),
      slot2: getQuickWinPushCopy('day5', 'slot2', locale),
      slot3: getQuickWinPushCopy('day5', 'slot3', locale),
    },
    day6: {
      slot1: getQuickWinPushCopy('day6', 'slot1', locale),
      slot2: getQuickWinPushCopy('day6', 'slot2', locale),
      slot3: getQuickWinPushCopy('day6', 'slot3', locale),
    },
    day7: {
      slot1: getQuickWinPushCopy('day7', 'slot1', locale),
      slot2: getQuickWinPushCopy('day7', 'slot2', locale),
      slot3: getQuickWinPushCopy('day7', 'slot3', locale),
    },
  };
}
