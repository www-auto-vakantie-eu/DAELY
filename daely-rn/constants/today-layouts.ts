export type TodayLayoutId =
  | 'daily-focus'
  | 'training-first'
  | 'performance'
  | 'wellness-recovery'
  | 'minimal-premium';

export const DEFAULT_TODAY_LAYOUT_ID: TodayLayoutId = 'daily-focus';

export const TODAY_LAYOUT_OPTIONS: Array<{
  id: TodayLayoutId;
  title: string;
  description: string;
}> = [
  {
    id: 'daily-focus',
    title: 'Daily Focus',
    description: 'Snel zien wat vandaag belangrijk is.',
  },
  {
    id: 'training-first',
    title: 'Training First',
    description: 'Training en workouts centraal.',
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Stats, progressie en doelen centraal.',
  },
  {
    id: 'wellness-recovery',
    title: 'Wellness Recovery',
    description: 'Herstel, mind en balans centraal.',
  },
  {
    id: 'minimal-premium',
    title: 'Minimal Premium',
    description: 'Rustige premium startpagina.',
  },
];

export function isTodayLayoutId(value: unknown): value is TodayLayoutId {
  return (
    value === 'daily-focus' ||
    value === 'training-first' ||
    value === 'performance' ||
    value === 'wellness-recovery' ||
    value === 'minimal-premium'
  );
}