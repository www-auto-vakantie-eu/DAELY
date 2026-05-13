import { useAppContext } from '@/contexts/AppContext';

export function useUiPreferences() {
  const { appSettings } = useAppContext();

  const textScale =
    appSettings.textSize === 'extra' ? 1.18 : appSettings.textSize === 'groot' ? 1.1 : 1;

  const withTextScale = (size: number, lineHeight?: number) => ({
    fontSize: Math.round(size * textScale),
    ...(lineHeight ? { lineHeight: Math.round(lineHeight * textScale) } : {}),
  });

  const motionEnabled = !appSettings.reduceMotion;

  return {
    textScale,
    withTextScale,
    motionEnabled,
    highContrast: appSettings.highContrast,
  };
}
