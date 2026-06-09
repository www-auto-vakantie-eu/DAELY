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
        colors: {
          ...base.colors,
          background: '#0F172A',
          backgroundAlt: '#111827',
          surface: '#1E293B',
          surfaceAlt: '#1F2937',
          card: '#111827',
          cardSoft: '#1E293B',
          text: '#F8FAFC',
          textMuted: '#CBD5E1',
          textInverse: '#0D0F1A',
          border: '#334155',
          divider: '#1E293B',
        },
        background: '#0F172A',
        card: '#111827',
        border: '#334155',
        titleColor: '#F8FAFC',
        subtitleColor: '#CBD5E1',
        navigation: {
          ...base.navigation,
          tabBarBackground: '#0F172A',
          headerBackground: '#111827',
          headerText: '#F8FAFC',
        },
        inputs: {
          ...base.inputs,
          background: '#1E293B',
          text: '#F8FAFC',
          placeholder: '#64748B',
          border: '#334155',
          focusedBorder: '#60A5FA',
        },
      }
    : base;

  if (!appSettings.highContrast) {
    return darkAdjusted;
  }

  return {
    ...darkAdjusted,
    colors: {
      ...darkAdjusted.colors,
      border: appSettings.darkMode ? '#FFFFFF' : '#0D0F1A',
      text: appSettings.darkMode ? '#FFFFFF' : '#000000',
      textMuted: appSettings.darkMode ? '#E2E8F0' : '#111827',
    },
    border: appSettings.darkMode ? '#FFFFFF' : '#0D0F1A',
    titleColor: appSettings.darkMode ? '#FFFFFF' : '#000000',
    subtitleColor: appSettings.darkMode ? '#E2E8F0' : '#111827',
    navigation: {
      ...darkAdjusted.navigation,
      tabBarActive: appSettings.darkMode ? '#FFFFFF' : '#000000',
      tabBarInactive: appSettings.darkMode ? '#94A3B8' : '#374151',
    },
  };
}
