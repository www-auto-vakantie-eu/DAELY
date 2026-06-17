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
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  force: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  pastelCalm: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  retroSport: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  saharaDune: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  aurora: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
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
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
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
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  venom: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
  },
  wave: {
    loginLogo: require('@/assets/images/logo.png'),
    launcherIcon: require('@/assets/images/icon.png'),
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
