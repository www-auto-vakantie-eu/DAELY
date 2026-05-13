import { useAppContext } from '@/contexts/AppContext';
import { THEMES, AppTheme, ThemeId } from '@/constants/themes';

export function useTheme(): AppTheme {
  const { activeThemeId, appSettings } = useAppContext();
  const base = THEMES[(activeThemeId as ThemeId) ?? 'default'] ?? THEMES['default'];

  if (!appSettings.darkMode && !appSettings.highContrast) {
    return base;
  }

  const darkAdjusted: AppTheme = appSettings.darkMode
    ? {
        ...base,
        background: '#0F172A',
        card: '#111827',
        border: '#334155',
        titleColor: '#F8FAFC',
        subtitleColor: '#CBD5E1',
        tabBarActive: '#60A5FA',
        tabBarInactive: '#64748B',
      }
    : base;

  if (!appSettings.highContrast) {
    return darkAdjusted;
  }

  return {
    ...darkAdjusted,
    border: appSettings.darkMode ? '#FFFFFF' : '#0D0F1A',
    titleColor: appSettings.darkMode ? '#FFFFFF' : '#000000',
    subtitleColor: appSettings.darkMode ? '#E2E8F0' : '#111827',
    tabBarActive: appSettings.darkMode ? '#FFFFFF' : '#000000',
    tabBarInactive: appSettings.darkMode ? '#94A3B8' : '#374151',
  };
}
