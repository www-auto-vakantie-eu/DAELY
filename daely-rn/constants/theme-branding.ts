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
  zenInk: {
    loginLogo: require('@/assets/images/theme-zen.ink-logo.png'),
    launcherIcon: require('@/assets/images/theme-zen.ink-logo.png'),
  },
  force: {
    loginLogo: require('@/assets/images/theme-force-logo.png'),
    launcherIcon: require('@/assets/images/theme-force-logo.png'),
  },
  pastelCalm: {
    loginLogo: require('@/assets/images/theme-pastel-calm-logo.png'),
    launcherIcon: require('@/assets/images/theme-pastel-calm-logo.png'),
  },
  retroSport: {
    loginLogo: require('@/assets/images/theme-retro-sport-logo.png'),
    launcherIcon: require('@/assets/images/theme-retro-sport-logo.png'),
  },
  saharaDune: {
    loginLogo: require('@/assets/images/theme-dune-logo.png'),
    launcherIcon: require('@/assets/images/theme-dune-logo.png'),
  },
  aurora: {
    loginLogo: require('@/assets/images/theme-innovation-logo.png'),
    launcherIcon: require('@/assets/images/theme-innovation-logo.png'),
  },
  ruby: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  coralBloom: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  marble: {
    loginLogo: require('@/assets/images/theme-pure-luxury-logo.png'),
    launcherIcon: require('@/assets/images/theme-pure-luxury-logo.png'),
  },
  sapphire: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  purpleStorm: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  volcanicAsh: {
    loginLogo: require('@/assets/images/theme-ember-logo.png'),
    launcherIcon: require('@/assets/images/theme-ember-logo.png'),
  },
  venom: {
    loginLogo: require('@/assets/images/theme-rogue-logo.png'),
    launcherIcon: require('@/assets/images/theme-rogue-logo.png'),
  },
  wave: {
    loginLogo: require('@/assets/images/theme-pulse-logo.png'),
    launcherIcon: require('@/assets/images/theme-pulse-logo.png'),
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
