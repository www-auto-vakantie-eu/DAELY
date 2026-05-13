import type { ThemeId } from '@/constants/themes';

interface ThemeBranding {
  loginLogo: number;
  launcherIcon: number;
}

export const THEME_BRANDING: Record<ThemeId, ThemeBranding> = {
  default: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  classic: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  'zen-ink': {
    loginLogo: require('@/assets/images/theme-zen.ink-logo.png'),
    launcherIcon: require('@/assets/images/theme-zen.ink-logo.png'),
  },
  'forest-breath': {
    loginLogo: require('@/assets/images/theme-forest-breath-logo.png'),
    launcherIcon: require('@/assets/images/theme-forest-breath-logo.png'),
  },
  force: {
    loginLogo: require('@/assets/images/theme-force-logo.png'),
    launcherIcon: require('@/assets/images/theme-force-logo.png'),
  },
  'pure-luxury': {
    loginLogo: require('@/assets/images/theme-pure-luxury-logo.png'),
    launcherIcon: require('@/assets/images/theme-pure-luxury-logo.png'),
  },
  innovation: {
    loginLogo: require('@/assets/images/theme-innovation-logo.png'),
    launcherIcon: require('@/assets/images/theme-innovation-logo.png'),
  },
  'pastel-calm': {
    loginLogo: require('@/assets/images/theme-pastel-calm-logo.png'),
    launcherIcon: require('@/assets/images/theme-pastel-calm-logo.png'),
  },
  'retro-sport': {
    loginLogo: require('@/assets/images/theme-retro-sport-logo.png'),
    launcherIcon: require('@/assets/images/theme-retro-sport-logo.png'),
  },
  pulse: {
    loginLogo: require('@/assets/images/theme-pulse-logo.png'),
    launcherIcon: require('@/assets/images/theme-pulse-logo.png'),
  },
  rogue: {
    loginLogo: require('@/assets/images/theme-rogue-logo.png'),
    launcherIcon: require('@/assets/images/theme-rogue-logo.png'),
  },
  dune: {
    loginLogo: require('@/assets/images/theme-dune-logo.png'),
    launcherIcon: require('@/assets/images/theme-dune-logo.png'),
  },
  ember: {
    loginLogo: require('@/assets/images/theme-ember-logo.png'),
    launcherIcon: require('@/assets/images/theme-ember-logo.png'),
  },
};

export function getThemeLoginLogo(themeId: string): number {
  const branding = THEME_BRANDING[themeId as ThemeId] ?? THEME_BRANDING.default;
  return branding.loginLogo;
}

export function getThemeLauncherIcon(themeId: string): number {
  const branding = THEME_BRANDING[themeId as ThemeId] ?? THEME_BRANDING.default;
  return branding.launcherIcon;
}
