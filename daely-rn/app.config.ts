import type { ExpoConfig } from 'expo/config';

type ThemeVariant =
  | 'default'
  | 'classic'
  | 'zen-ink'
  | 'forest-breath'
  | 'force'
  | 'pure-luxury'
  | 'innovation'
  | 'pastel-calm'
  | 'retro-sport'
  | 'pulse'
  | 'rogue';

const THEME_ICON_MAP: Record<ThemeVariant, string> = {
  default: './assets/images/logo.png',
  classic: './assets/images/logo.png',
  'zen-ink': './assets/images/logo.png',
  'forest-breath': './assets/images/logo.png',
  force: './assets/images/logo.png',
  'pure-luxury': './assets/images/logo.png',
  innovation: './assets/images/logo.png',
  'pastel-calm': './assets/images/logo.png',
  'retro-sport': './assets/images/logo.png',
  pulse: './assets/images/logo.png',
  rogue: './assets/images/logo.png',
};

const themeVariant = (process.env.THEME_VARIANT as ThemeVariant | undefined) ?? 'default';
const selectedIcon = THEME_ICON_MAP[themeVariant] ?? THEME_ICON_MAP.default;

const config: ExpoConfig = {
  name: 'daely-rn',
  slug: 'daely-rn',
  version: '1.0.0',
  orientation: 'portrait',
  icon: selectedIcon,
  scheme: 'daelyrn',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.daely.app',
    icon: selectedIcon,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'DAELY gebruikt je locatie om je hardlooproute, afstand en tempo tijdens een activiteit te meten.',
    },
  },
  android: {
    package: 'com.daely.app',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: selectedIcon,
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: '14bbaac1-4dc2-4a7b-98c5-d3f826e4ceab',
    },
    themeVariant,
  },
};

export default config;
