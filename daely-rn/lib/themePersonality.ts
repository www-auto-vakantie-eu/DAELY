import { THEMES } from '../constants/themes';
import type { AppTheme } from '../constants/themes';

export interface ThemePersonality {
  cardVariant: 'default' | 'dark-velvet' | 'rose-gold' | 'ivory-gold' | 'organic-green' | 'obsidian-dark';
  cardRadius: number;
  buttonRadius: number;
  borderWidth: number;
  borderStyle: 'solid' | 'hairline' | 'gold-rim' | 'none';
  shadowStyle: 'default' | 'deep' | 'soft' | 'natural' | 'dark-deep';
  glowStyle: 'none' | 'gold' | 'rose-gold' | 'ivory-gold' | 'green' | 'obsidian-gold';
  iconBubbleStyle: 'default' | 'dark-gold-rim' | 'rose-gold' | 'ivory-gold' | 'sage' | 'black-gold';
  overlayStyle: 'none' | 'velvet-glow' | 'rose-sheen' | 'gold-highlight' | 'nature-glow' | 'obsidian-rim';
  buttonTreatment: 'default' | 'pill-gold' | 'pill-rose' | 'rounded-ivory' | 'rounded-natural' | 'dark-gold';
  surfaceGradient: string[] | null;
  accentLineStyle: 'none' | 'gold-top' | 'rose-gold-top' | 'gold-hairline' | 'green-edge' | 'gold-rim';
  // Visual effect tokens
  overlayGradient: string[] | null;
  topBorderGradient: string[] | null;
  innerGlowColor: string | null;
  cardBackground: string | null;
  buttonBackground: string[] | null;
}

/**
 * Centrale helper om theme personality tokens op te halen
 * Geeft per thema een duidelijke visuele handtekening terug
 */
export function getThemePersonality(themeId: string): ThemePersonality {
  const currentTheme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const themeIdSafe = currentTheme.id;

  // Bordeaux Velvet - donker fluweel / luxe wijnrood / champagne goud
  if (themeIdSafe === 'bordeauxVelvet') {
    return {
      cardVariant: 'dark-velvet',
      cardRadius: currentTheme.colors.cardRadius || 26,
      buttonRadius: currentTheme.colors.buttonRadius || 999,
      borderWidth: currentTheme.colors.cardBorderWidth || 1.2,
      borderStyle: 'gold-rim',
      shadowStyle: 'deep',
      glowStyle: 'gold',
      iconBubbleStyle: 'dark-gold-rim',
      overlayStyle: 'velvet-glow',
      buttonTreatment: 'pill-gold',
      surfaceGradient: ['#2A0D16', '#3A1220', '#4A1A2A'],
      accentLineStyle: 'gold-top',
      // Visual effects
      overlayGradient: ['rgba(212, 175, 55, 0.12)', 'rgba(168, 50, 86, 0.08)', 'rgba(212, 175, 55, 0.04)'],
      topBorderGradient: ['rgba(212, 175, 55, 0.6)', 'rgba(168, 50, 86, 0.4)'],
      innerGlowColor: 'rgba(212, 175, 55, 0.15)',
      cardBackground: '#2A0D16',
      buttonBackground: ['#7A1E3A', '#A83256', '#D4AF37'],
    };
  }

  // Champagne Rose - rose-gold / champagne / soft luxury
  if (themeIdSafe === 'champagneRose') {
    return {
      cardVariant: 'rose-gold',
      cardRadius: currentTheme.colors.cardRadius || 28,
      buttonRadius: currentTheme.colors.buttonRadius || 999,
      borderWidth: currentTheme.colors.cardBorderWidth || 1,
      borderStyle: 'hairline',
      shadowStyle: 'soft',
      glowStyle: 'rose-gold',
      iconBubbleStyle: 'rose-gold',
      overlayStyle: 'rose-sheen',
      buttonTreatment: 'pill-rose',
      surfaceGradient: ['#FFFFFF', '#FAF0EA', '#F5E7D8'],
      accentLineStyle: 'rose-gold-top',
      // Visual effects
      overlayGradient: ['rgba(216, 167, 177, 0.15)', 'rgba(242, 214, 201, 0.10)', 'rgba(216, 167, 177, 0.05)'],
      topBorderGradient: ['rgba(198, 161, 91, 0.5)', 'rgba(216, 167, 177, 0.3)'],
      innerGlowColor: 'rgba(242, 214, 201, 0.2)',
      cardBackground: '#FFFFFF',
      buttonBackground: ['#D8A7B1', '#C6A15B'],
    };
  }

  // Ivory Gold - clean luxury / ivoor / klassiek goud
  if (themeIdSafe === 'ivoryGold') {
    return {
      cardVariant: 'ivory-gold',
      cardRadius: currentTheme.colors.cardRadius || 22,
      buttonRadius: currentTheme.colors.buttonRadius || 18,
      borderWidth: currentTheme.colors.cardBorderWidth || 0.8,
      borderStyle: 'gold-rim',
      shadowStyle: 'default',
      glowStyle: 'ivory-gold',
      iconBubbleStyle: 'ivory-gold',
      overlayStyle: 'gold-highlight',
      buttonTreatment: 'rounded-ivory',
      surfaceGradient: ['#FFFFFF', '#FFF8E6', '#F5E7D0'],
      accentLineStyle: 'gold-hairline',
      // Visual effects
      overlayGradient: ['rgba(198, 161, 91, 0.12)', 'rgba(231, 211, 161, 0.08)', 'rgba(198, 161, 91, 0.04)'],
      topBorderGradient: ['rgba(198, 161, 91, 0.6)', 'rgba(231, 211, 161, 0.4)'],
      innerGlowColor: 'rgba(231, 211, 161, 0.15)',
      cardBackground: '#FFFFFF',
      buttonBackground: ['#C6A15B', '#E7D3A1'],
    };
  }

  // Mineral Green - natuurlijk / calm / wellness / organic
  if (themeIdSafe === 'mineralGreen') {
    return {
      cardVariant: 'organic-green',
      cardRadius: currentTheme.colors.cardRadius || 24,
      buttonRadius: currentTheme.colors.buttonRadius || 20,
      borderWidth: currentTheme.colors.cardBorderWidth || 1,
      borderStyle: 'hairline',
      shadowStyle: 'natural',
      glowStyle: 'green',
      iconBubbleStyle: 'sage',
      overlayStyle: 'nature-glow',
      buttonTreatment: 'rounded-natural',
      surfaceGradient: ['#FFFFFF', '#EEF6F1', '#E0EDE4'],
      accentLineStyle: 'green-edge',
      // Visual effects
      overlayGradient: ['rgba(79, 124, 104, 0.12)', 'rgba(127, 166, 146, 0.08)', 'rgba(79, 124, 104, 0.04)'],
      topBorderGradient: ['rgba(79, 124, 104, 0.5)', 'rgba(127, 166, 146, 0.3)'],
      innerGlowColor: 'rgba(127, 166, 146, 0.15)',
      cardBackground: '#FFFFFF',
      buttonBackground: ['#4F7C68', '#7FA692'],
    };
  }

  // Obsidian Gold - zwart/obsidian / high-end / goud op zwart
  if (themeIdSafe === 'obsidianGold') {
    return {
      cardVariant: 'obsidian-dark',
      cardRadius: currentTheme.colors.cardRadius || 18,
      buttonRadius: currentTheme.colors.buttonRadius || 16,
      borderWidth: currentTheme.colors.cardBorderWidth || 1,
      borderStyle: 'gold-rim',
      shadowStyle: 'dark-deep',
      glowStyle: 'obsidian-gold',
      iconBubbleStyle: 'black-gold',
      overlayStyle: 'obsidian-rim',
      buttonTreatment: 'dark-gold',
      surfaceGradient: ['#111111', '#181818', '#252525'],
      accentLineStyle: 'gold-rim',
      // Visual effects
      overlayGradient: ['rgba(212, 175, 55, 0.15)', 'rgba(138, 106, 32, 0.10)', 'rgba(212, 175, 55, 0.05)'],
      topBorderGradient: ['rgba(212, 175, 55, 0.7)', 'rgba(138, 106, 32, 0.5)'],
      innerGlowColor: 'rgba(212, 175, 55, 0.2)',
      cardBackground: '#111111',
      buttonBackground: ['#D4AF37', '#8A6A20'],
    };
  }

  // Veilige defaults voor bestaande thema's
  return {
    cardVariant: 'default',
    cardRadius: 16,
    buttonRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    shadowStyle: 'default',
    glowStyle: 'none',
    iconBubbleStyle: 'default',
    overlayStyle: 'none',
    buttonTreatment: 'default',
    surfaceGradient: null,
    accentLineStyle: 'none',
    // Visual effects
    overlayGradient: null,
    topBorderGradient: null,
    innerGlowColor: null,
    cardBackground: null,
    buttonBackground: null,
  };
}