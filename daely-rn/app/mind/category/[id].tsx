import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { MIND_PROGRAMS } from '@/constants/mind-programs';
import { THEMES } from '@/constants/themes';

// Helper to get theme-aware Aurora tokens (same as Today/Nutrition/Discipline)
function getAuroraTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';
  const isZen = currentTheme.id === 'zenInk';
  const isSapphire = currentTheme.id === 'sapphire';
  const isRuby = currentTheme.id === 'ruby';
  const isCoral = currentTheme.id === 'coralBloom';
  const isMarble = currentTheme.id === 'marble';
  const isBordeauxVelvet = currentTheme.id === 'bordeauxVelvet';
  const isChampagneRose = currentTheme.id === 'champagneRose';
  const isIvoryGold = currentTheme.id === 'ivoryGold';
  const isMineralGreen = currentTheme.id === 'mineralGreen';
  const isObsidianGold = currentTheme.id === 'obsidianGold';

  // Theme-aware gradient for card backgrounds
  const themeGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
      : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
      : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
      : isCoral ? (currentTheme.gradients.aurora || ['#FFF7F3', '#FFEDE7', '#FFD6C9'])
      : isMarble ? (currentTheme.gradients.aurora || ['#FFFFFF', '#F7F7F5', '#ECEDEA'])
      : isBordeauxVelvet ? (currentTheme.gradients.aurora || ['#2A0D16', '#3A1220', '#4A1A2A'])
      : isChampagneRose ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FAF0EA', '#F5E7D8'])
      : isIvoryGold ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF8E6', '#F5E7D0'])
      : isMineralGreen ? (currentTheme.gradients.aurora || ['#FFFFFF', '#EEF6F1', '#E0EDE4'])
      : isObsidianGold ? (currentTheme.gradients.aurora || ['#111111', '#181818', '#252525'])
      : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  // Sapphire-specific shape tokens
  const cardRadius = isSapphire ? (currentTheme.colors.cardRadius || 14) : isRetro ? 16 : isSahara ? 16 : isForce ? 16 : isZen ? 14 : 16;
  const cardBorderWidth = isSapphire ? (currentTheme.colors.cardBorderWidth || 1.5) : isRetro ? 1 : isSahara ? 1 : isForce ? 1 : isZen ? 1 : 1;
  const iconBubbleRadius = isSapphire ? (currentTheme.colors.iconBubbleRadius || 12) : isRetro ? 14 : isSahara ? 14 : isForce ? 14 : isZen ? 10 : 14;
  const shortcutRadius = isSapphire ? (currentTheme.colors.shortcutRadius || 12) : 16;

  return {
    auroraGradient: themeGradient,
    auroraTitle: isClassic ? '#0F172A' : (currentTheme.colors.auroraTitle || (isZen ? '#FFFFFF' : isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#111827' : isBordeauxVelvet ? '#FFF1F4' : isChampagneRose ? '#2A1F23' : isIvoryGold ? '#2A261C' : isMineralGreen ? '#163227' : isObsidianGold ? '#FFF7D6' : '#1E1B4B')),
    auroraSubtitle: isClassic ? '#475569' : (currentTheme.colors.auroraSubtitle || (isZen ? '#B0B0B0' : isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : isCoral ? '#A95B5B' : isMarble ? '#4B5563' : isBordeauxVelvet ? '#E8B8C2' : isChampagneRose ? '#7A5A62' : isIvoryGold ? '#6F6448' : isMineralGreen ? '#4D6B5C' : isObsidianGold ? '#C9B97A' : '#4A3A8C')),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : isSapphire ? (currentTheme.colors.glassLine1 || ['rgba(147, 197, 253, 0.04)', 'rgba(147, 197, 253, 0.01)'])
        : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
        : isCoral ? (currentTheme.gradients.auroraBlue || ['rgba(255, 177, 153, 0.32)', 'rgba(255, 214, 201, 0.16)'])
        : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
        : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
        : isCoral ? ['rgba(255, 214, 201, 0.20)', 'rgba(255, 214, 201, 0.08)']
        : isMarble ? ['#FFFFFF', '#F9EEF2']
        : isBordeauxVelvet ? ['#3A1220', '#4A1A2A']
        : isChampagneRose ? ['#FAF0EA', '#F5E7D8']
        : isIvoryGold ? ['#FFF8E6', '#F5E7D0']
        : isMineralGreen ? ['#EEF6F1', '#E0EDE4']
        : isObsidianGold ? ['#181818', '#252525']
        : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
        : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
        : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
        : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)'])
        : isZen ? (currentTheme.gradients.auroraRose || ['rgba(156, 163, 175, 0.14)', 'rgba(156, 163, 175, 0.05)'])
        : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
        : isRuby ? (currentTheme.gradients.auroraRose || ['rgba(184, 50, 90, 0.26)', 'rgba(228, 90, 122, 0.08)'])
        : isCoral ? (currentTheme.gradients.auroraRose || ['rgba(249, 115, 107, 0.30)', 'rgba(232, 93, 117, 0.12)'])
        : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
        : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
        : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : isSapphire ? (currentTheme.colors.glassGlow ? [currentTheme.colors.glassGlow, 'rgba(59, 130, 246, 0.005)'] : ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
      : isRuby ? (currentTheme.colors.rubyGlowBorder ? [currentTheme.colors.rubyGlowBorder, 'rgba(184, 50, 90, 0.08)'] : ['rgba(228, 90, 122, 0.24)', 'rgba(255, 228, 236, 0.08)'])
      : isCoral ? (currentTheme.colors.coralSoftGlow ? [currentTheme.colors.coralSoftGlow, 'rgba(249, 115, 107, 0.05)'] : ['rgba(255, 214, 201, 0.18)', 'rgba(255, 177, 153, 0.06)'])
      : isMarble ? (currentTheme.colors.marbleSoftHighlight ? [currentTheme.colors.marbleSoftHighlight, 'rgba(168, 162, 158, 0.04)'] : ['rgba(255, 255, 255, 0.78)', 'rgba(168, 162, 158, 0.04)'])
      : isBordeauxVelvet ? ['rgba(212, 175, 55, 0.24)', 'rgba(168, 50, 86, 0.10)']
      : isChampagneRose ? ['rgba(198, 161, 91, 0.24)', 'rgba(183, 110, 121, 0.10)']
      : isIvoryGold ? ['rgba(198, 161, 91, 0.24)', 'rgba(231, 211, 161, 0.10)']
      : isMineralGreen ? ['rgba(79, 124, 104, 0.24)', 'rgba(127, 166, 146, 0.10)']
      : isObsidianGold ? ['rgba(212, 175, 55, 0.24)', 'rgba(138, 106, 32, 0.10)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Coral Bloom soft glow flag
    useSoftCoralGlow: isCoral,
    // Marble soft vein flag
    useSoftMarbleVein: isMarble,
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.12)' : isSapphire ? (currentTheme.colors.glassBorder || 'rgba(147, 197, 253, 0.25)') : isRuby ? (currentTheme.colors.rubyGlowBorder || 'rgba(244, 167, 185, 0.22)') : isCoral ? (currentTheme.colors.coralGlowBorder || 'rgba(249, 115, 107, 0.22)') : isMarble ? (currentTheme.colors.marbleGlowBorder || 'rgba(107, 114, 128, 0.18)') : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : isSapphire ? (currentTheme.colors.glassShadow || 'rgba(59, 130, 246, 0.28)') : isRuby ? (currentTheme.colors.rubyGlowShadow || 'rgba(184, 50, 90, 0.24)') : isCoral ? (currentTheme.colors.coralGlowShadow || 'rgba(249, 115, 107, 0.20)') : isMarble ? (currentTheme.colors.marbleGlowShadow || 'rgba(107, 114, 128, 0.16)') : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? (currentTheme.colors.rubyIconBg || 'rgba(184, 50, 90, 0.14)') : isCoral ? (currentTheme.colors.coralIconBg || 'rgba(255, 177, 153, 0.24)') : isMarble ? (currentTheme.colors.marbleIconBg || 'rgba(245, 245, 244, 0.86)') : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : isSapphire ? 'rgba(147, 197, 253, 0.24)' : isRuby ? (currentTheme.colors.rubyIconBorder || 'rgba(244, 167, 185, 0.24)') : isCoral ? (currentTheme.colors.coralIconBorder || 'rgba(249, 115, 107, 0.26)') : isMarble ? (currentTheme.colors.marbleIconBorder || 'rgba(168, 162, 158, 0.24)') : undefined,
    // Category hero styling
    heroIconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? '#FFFFFF' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#FCA5A5' : isMarble ? '#6B7280' : '#8B5CF6',
    heroGradientColors: isClassic
      ? ['rgba(37, 99, 235, 0.05)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? ['rgba(220, 38, 38, 0.05)', 'rgba(220, 38, 38, 0.15)']
        : isSahara ? ['rgba(200, 155, 114, 0.05)', 'rgba(200, 155, 114, 0.15)']
        : isRetro ? ['rgba(194, 65, 12, 0.05)', 'rgba(194, 65, 12, 0.15)']
        : isZen ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.10)']
        : isSapphire ? ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.15)']
        : isRuby ? ['rgba(184, 50, 90, 0.05)', 'rgba(184, 50, 90, 0.15)']
        : isCoral ? ['rgba(249, 115, 107, 0.05)', 'rgba(249, 115, 107, 0.15)']
        : isMarble ? ['rgba(107, 114, 128, 0.05)', 'rgba(107, 114, 128, 0.15)']
        : ['rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.15)'],
    // Sapphire glass line flags
    useThinLines: isSapphire,
    // Sapphire shape tokens
    cardRadius,
    cardBorderWidth,
    iconBubbleRadius,
    shortcutRadius,
    // New calm gemstone tokens for Sapphire
    facetLarge: isSapphire ? (currentTheme.colors.facetLarge || 'rgba(147, 197, 253, 0.08)') : undefined,
    facetMedium: isSapphire ? (currentTheme.colors.facetMedium || 'rgba(96, 165, 250, 0.06)') : undefined,
    sapphireGlow: isSapphire ? (currentTheme.colors.sapphireGlow || 'rgba(59, 130, 246, 0.16)') : undefined,
  };
}

// Helper component for gradient cards with Soft Aurora Ribbon style
function MindAuroraCard({ children, style, cardRadius }: { children: React.ReactNode, style?: any, cardRadius?: number }) {
  const { activeThemeId } = useAppContext();
  const { auroraGradient, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, shortcutBorderColor, shortcutShadowColor, useThinLines, facetLarge, facetMedium, sapphireGlow } = getAuroraTokens(activeThemeId);
  const isMarble = activeThemeId === 'marble';

  const ribbonStyleTop = useThinLines ? styles.thinRibbonTop : styles.ribbonTop;
  const ribbonStyleMid = useThinLines ? styles.thinRibbonMid : styles.ribbonMid;
  const ribbonStyleBlue = useThinLines ? styles.thinRibbonBlue : styles.ribbonBlue;
  const ribbonStyleRose = useThinLines ? styles.thinRibbonRose : styles.ribbonRose;
  const ribbonStyleRight = useThinLines ? styles.thinRibbonRight : styles.ribbonRight;

  return (
    <View style={[styles.premiumCardWrapper, style, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor, borderRadius: cardRadius || 16 }]}>
      {/* Background gradient layer - absolute full-cover */}
      <LinearGradient
        colors={auroraGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumCardBackground}
        pointerEvents="none"
      >
        {/* Top-left ribbon */}
        <LinearGradient
          colors={ribbonTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleTop}
          pointerEvents="none"
        />
        {/* Mid-card ribbon */}
        <LinearGradient
          colors={ribbonMid}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleMid}
          pointerEvents="none"
        />
        {/* Diagonal top-right ribbon */}
        <LinearGradient
          colors={ribbonBlue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleBlue}
          pointerEvents="none"
        />
        {/* Diagonal bottom-left ribbon */}
        <LinearGradient
          colors={ribbonRose}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={ribbonStyleRose}
          pointerEvents="none"
        />
        {/* Right-side accent ribbon */}
        <LinearGradient
          colors={ribbonRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleRight}
          pointerEvents="none"
        />
        {/* Marble premium stone texture - only for Marble theme */}
        {isMarble && (
          <>
            {/* Main diagonal vein */}
            <LinearGradient
              colors={['rgba(55, 65, 81, 0.22)', 'rgba(55, 65, 81, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: -20,
                left: -40,
                width: 200,
                height: 3,
                transform: [{ rotate: '-15deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Secondary vein */}
            <LinearGradient
              colors={['rgba(120, 113, 108, 0.18)', 'rgba(120, 113, 108, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 60,
                right: -30,
                width: 140,
                height: 2,
                transform: [{ rotate: '12deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Third soft vein */}
            <LinearGradient
              colors={['rgba(168, 162, 158, 0.16)', 'rgba(168, 162, 158, 0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                bottom: -15,
                left: 40,
                width: 120,
                height: 2,
                transform: [{ rotate: '8deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Pearl highlight */}
            <View
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 180,
                height: 140,
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        {/* Calm gemstone effects for Sapphire theme - max 3 layers */}
        {useThinLines && sapphireGlow && (
          <View style={[styles.sapphireGlowOverlay, { backgroundColor: sapphireGlow }]} pointerEvents="none" />
        )}
        {useThinLines && facetLarge && (
          <View style={[styles.facetLarge, { backgroundColor: facetLarge }]} pointerEvents="none" />
        )}
        {useThinLines && facetMedium && (
          <View style={[styles.facetMedium, { backgroundColor: facetMedium }]} pointerEvents="none" />
        )}
        {/* Subtle glass border for Sapphire theme */}
        {useThinLines && (
          <View style={styles.glassBorderOverlay} pointerEvents="none" />
        )}
        {/* Soft white highlight overlay */}
        <LinearGradient
          colors={ribbonHighlight}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.ribbonHighlight}
          pointerEvents="none"
        />
      </LinearGradient>
      {/* Content layer - above background */}
      <View style={styles.premiumCardContent}>
        {children}
      </View>
    </View>
  );
}

export default function MindCategoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { activeThemeId } = useAppContext();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { auroraTitle, auroraSubtitle, heroIconColor, heroGradientColors, shortcutIconBg, shortcutIconBorder, cardRadius } = getAuroraTokens(activeThemeId);

  const getCategoryName = (id: string | undefined): string => {
    if (!id) return 'Mind';
    const categoryNames: Record<string, string> = {
      prime: 'Prime',
      breathing: 'Ademhaling',
      focus: 'Focus',
      recovery: 'Herstel',
      sleep: 'Slaap',
      mindset: 'Mindset',
      'sport-performance': 'Sport Performance',
      meditations: 'Bekende meditaties',
      moments: 'DAELY Moments',
    };
    return categoryNames[id] || 'Mind';
  };

  const categoryName = getCategoryName(categoryId);

  // Get display-only mock meditation cards with safe program IDs where applicable
  const getMockMeditations = (id: string | undefined) => {
    const mockData: Record<string, { title: string; subtitle: string; duration: string; type: string; programId?: string }[]> = {
      prime: [
        { title: 'DAELY Prime Reset', subtitle: 'Start je dag met energie en focus', duration: '10 min', type: 'Prime', programId: 'tony-robbins-priming' },
        { title: 'Morning Activation', subtitle: 'Start je dag met rustige focus', duration: '5 min', type: 'Prime' },
        { title: 'Start Your Day Calm', subtitle: 'Begin de dag kalm en gefocust', duration: '5 min', type: 'Prime' },
        { title: 'Energy Breath Start', subtitle: 'Activeer je energie', duration: '5 min', type: 'Prime' },
        { title: 'Intentie van de Dag', subtitle: 'Zet je intentie voor vandaag', duration: '10 min', type: 'Prime' },
        { title: 'Mentale Reset Ochtend', subtitle: 'Reset je geest voor de dag', duration: '5 min', type: 'Prime' },
        { title: 'Ready for Today', subtitle: 'Kom klaar voor de dag', duration: '5 min', type: 'Prime' },
      ],
      breathing: [
        { title: 'Wim Hof Methode', subtitle: 'Gecontroleerde ademhaling', duration: '14 min', type: 'Ademhaling', programId: 'wim-hof-method' },
        { title: 'Box Breathing', subtitle: 'Gestructureerde ademhaling', duration: '5 min', type: 'Ademhaling' },
        { title: 'Stress Reset Ademhaling', subtitle: 'Verlaag spanning met ademhaling', duration: '12 min', type: 'Ademhaling', programId: 'stress-reset-breathing' },
        { title: 'Ademruimte na inspanning', subtitle: 'Herstelademhaling', duration: '5 min', type: 'Ademhaling' },
        { title: 'Rustige buikademhaling', subtitle: 'Kalmeer je zenuwstelsel', duration: '10 min', type: 'Ademhaling' },
        { title: '4-7-8 Ademhaling', subtitle: 'Ontspanningstechniek', duration: '5 min', type: 'Ademhaling' },
        { title: 'Pre-training Breath Control', subtitle: 'Focus voor training', duration: '5 min', type: 'Ademhaling' },
      ],
      focus: [
        { title: 'Laser Focus Flow', subtitle: 'Mentale activatie voor concentratie', duration: '10 min', type: 'Focus', programId: 'laser-focus-flow' },
        { title: 'Tony Robbins - Priming', subtitle: 'Energieke visualisatie en focus', duration: '11 min', type: 'Focus', programId: 'tony-robbins-priming' },
        { title: 'Deep Work Entry', subtitle: 'Diepe focus voor werk', duration: '10 min', type: 'Focus' },
        { title: 'Focus voor training', subtitle: 'Mentale voorbereiding', duration: '5 min', type: 'Focus' },
        { title: 'Concentratie Reset', subtitle: 'Herstel van focus', duration: '5 min', type: 'Focus' },
        { title: 'Mind Clear Start', subtitle: 'Maak je hoofd leeg', duration: '5 min', type: 'Focus' },
        { title: 'Afleiding Loslaten', subtitle: 'Elimineer afleidingen', duration: '10 min', type: 'Focus' },
      ],
      recovery: [
        { title: 'Calm Recovery Bodyscan', subtitle: 'Herstelgerichte bodyscan', duration: '15 min', type: 'Herstel', programId: 'calm-recovery-bodyscan' },
        { title: 'Post-Workout Body Scan', subtitle: 'Ontspan na training', duration: '10 min', type: 'Herstel' },
        { title: 'Spierontspanning', subtitle: 'Laat spanning los', duration: '10 min', type: 'Herstel' },
        { title: 'Rustige Herstel Reset', subtitle: 'Reset na inspanning', duration: '10 min', type: 'Herstel' },
        { title: 'Ademhaling na inspanning', subtitle: 'Herstelademhaling', duration: '5 min', type: 'Herstel' },
        { title: 'Recovery Mind Reset', subtitle: 'Mentale herstel', duration: '5 min', type: 'Herstel' },
        { title: 'Body Scan Deep Reset', subtitle: 'Diepe lichaamsherstel', duration: '15 min', type: 'Herstel' },
      ],
      sleep: [
        { title: 'Deep Sleep Winddown', subtitle: 'Avondroutine voor betere slaap', duration: '20 min', type: 'Slaap', programId: 'deep-sleep-winddown' },
        { title: 'Vishen Lakhiani - 6 Phase', subtitle: 'Gestructureerde meditatie', duration: '21 min', type: 'Slaap', programId: 'vishen-lakhiani-6-phase' },
        { title: 'Slaapvoorbereiding', subtitle: 'Voorbereiding op slaap', duration: '10 min', type: 'Slaap' },
        { title: 'Rustige Nacht Reset', subtitle: 'Avondreset', duration: '10 min', type: 'Slaap' },
        { title: 'Body Relax Sleep', subtitle: 'Lichaamsontspanning', duration: '15 min', type: 'Slaap' },
        { title: 'Ademhaling voor slaap', subtitle: 'Slaapademhaling', duration: '10 min', type: 'Slaap' },
        { title: 'Deep Rest Meditation', subtitle: 'Diepe rust', duration: '15 min', type: 'Slaap' },
      ],
      mindset: [
        { title: 'Over Mindset', subtitle: 'Basis voor discipline en doelen', duration: '', type: 'Mindset', isIntro: true },
        { title: 'Calm Confidence', subtitle: 'Mentale voorbereiding met rust', duration: '10 min', type: 'Mindset', programId: 'confidence-primer' },
        { title: 'Discipline Check-In', subtitle: 'Train je focus en wilskracht', duration: '10 min', type: 'Mindset' },
        { title: 'Mentale Kracht', subtitle: 'Versterk je mentale kracht', duration: '10 min', type: 'Mindset' },
        { title: 'Zelfvertrouwen Reset', subtitle: 'Veranker zelfvertrouwen', duration: '10 min', type: 'Mindset' },
        { title: 'Winnaarsfocus', subtitle: 'Focus op resultaat', duration: '10 min', type: 'Mindset' },
        { title: 'Motivatie Herpakken', subtitle: 'Herstel je motivatie', duration: '10 min', type: 'Mindset' },
      ],
      'sport-performance': [
        { title: 'Confidence Primer', subtitle: 'Korte mentale activatie', duration: '8 min', type: 'Sport', programId: 'confidence-primer' },
        { title: 'Pre-Game Calm', subtitle: 'Kalm voor de wedstrijd', duration: '5 min', type: 'Sport' },
        { title: 'Competition Focus', subtitle: 'Focus op de wedstrijd', duration: '10 min', type: 'Sport' },
        { title: 'Pressure Reset', subtitle: 'Blijf kalm onder druk', duration: '5 min', type: 'Sport' },
        { title: 'Visualisatie voor prestatie', subtitle: 'Visualiseer je prestatie', duration: '10 min', type: 'Sport' },
        { title: 'Race Day Mindset', subtitle: 'Mentale voorbereiding', duration: '10 min', type: 'Sport' },
        { title: 'Training Readiness', subtitle: 'Klaar voor training', duration: '5 min', type: 'Sport' },
      ],
      meditations: [
        { title: 'Vishen Lakhiani - 6 Phase', subtitle: 'Gestructureerde meditatie', duration: '21 min', type: 'Meditatie', programId: 'vishen-lakhiani-6-phase' },
        { title: 'Classic Mindfulness', subtitle: 'Traditionele aandachttraining', duration: '10 min', type: 'Meditatie' },
        { title: 'Body Scan Meditation', subtitle: 'Systeematische lichaamsbewustzijn', duration: '15 min', type: 'Meditatie' },
        { title: 'Loving Kindness', subtitle: 'Compassie meditatie', duration: '10 min', type: 'Meditatie' },
        { title: 'Open Awareness', subtitle: 'Open aandacht', duration: '10 min', type: 'Meditatie' },
        { title: 'Walking Meditation', subtitle: 'Bewustzijn in beweging', duration: '15 min', type: 'Meditatie' },
        { title: 'Breath Awareness', subtitle: 'Ademhalingsbewustzijn', duration: '10 min', type: 'Meditatie' },
      ],
      moments: [
        { title: '1 Minute Reset', subtitle: 'Snelle reset', duration: '1 min', type: 'Moment' },
        { title: '3 Minute Calm', subtitle: 'Korte rust', duration: '3 min', type: 'Moment' },
        { title: 'Snelle Ademruimte', subtitle: 'Ademreset', duration: '2 min', type: 'Moment' },
        { title: 'Voor een Meeting', subtitle: 'Voorbereiding', duration: '3 min', type: 'Moment' },
        { title: 'Na je Training', subtitle: 'Herstelreset', duration: '3 min', type: 'Moment' },
        { title: 'Tussen Twee Taken', subtitle: 'Overgang', duration: '2 min', type: 'Moment' },
        { title: 'Mini Mind Reset', subtitle: 'Korte reset', duration: '5 min', type: 'Moment' },
      ],
    };
    return mockData[id] || [];
  };

  const mockMeditations = getMockMeditations(categoryId);

  // Handle card press - navigate to detail page if program exists
  const handleCardPress = (programId?: string) => {
    if (programId) {
      const programExists = MIND_PROGRAMS.find(p => p.id === programId);
      if (programExists) {
        router.push(`/mind/${programId}`);
      }
    }
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Category Hero Card */}
          <View style={[styles.categoryHeroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <LinearGradient
              colors={heroGradientColors}
              style={styles.heroGradient}
            >
              <View style={[styles.categoryIconBadge, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                <MaterialCommunityIcons name="meditation" size={32} color={heroIconColor} />
              </View>
            </LinearGradient>
            <Text style={[styles.categoryTitle, { color: auroraTitle }]}>{categoryName}</Text>
            <Text style={[styles.categorySubtitle, { color: auroraSubtitle }]}>
              {categoryId === 'prime' && 'Start je dag met energie, focus en intentie'}
              {categoryId === 'breathing' && 'Ademhalingsoefeningen voor rust, controle en focus'}
              {categoryId === 'focus' && 'Train je concentratie voor werk, studie en sport'}
              {categoryId === 'recovery' && 'Ontspan bewust na training of een drukke dag'}
              {categoryId === 'sleep' && 'Rustige routines om je avond af te bouwen'}
              {categoryId === 'mindset' && 'Werk aan discipline, vertrouwen en consistentie'}
              {categoryId === 'sport-performance' && 'Mentale voorbereiding voor training en wedstrijd'}
              {categoryId === 'meditations' && 'Klassieke meditatievormen voor structuur en rust'}
              {categoryId === 'moments' && 'Korte resets van 1, 3 of 5 minuten'}
              {!categoryId && 'Ontspan je geest en verbeter je welzijn'}
            </Text>
          </View>

          {/* Mindset intro card */}
          {categoryId === 'mindset' && (
            <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.introTitle, { color: auroraTitle }]}>Over Mindset</Text>
              <Text style={[styles.introText, { color: auroraSubtitle }]}>
                Jouw mindset is de basis voor alles wat je doet. Het bepaalt hoe je omgaat met uitdagingen, hoe je jouw doelen nastreeft en hoe je terugkomt na tegenslagen.
              </Text>
            </View>
          )}

          {/* Meditation Cards */}
          {mockMeditations.map((meditation, index) => {
            if (meditation.isIntro) {
              return (
                <MindAuroraCard key={index}>
                  <View style={[styles.thumbnailFallback, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                    <MaterialCommunityIcons name="information" size={24} color={auroraSubtitle} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: auroraTitle }]}>{meditation.title}</Text>
                    <Text style={[styles.cardSubtitle, { color: auroraSubtitle }]}>{meditation.subtitle}</Text>
                  </View>
                </MindAuroraCard>
              );
            }

            const hasProgramId = meditation.programId && MIND_PROGRAMS.find(p => p.id === meditation.programId);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleCardPress(meditation.programId)}
              >
                <MindAuroraCard cardRadius={cardRadius}>
                  <View style={[styles.thumbnailFallback, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                    <MaterialCommunityIcons name="play-circle" size={24} color={heroIconColor} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: auroraTitle }]}>{meditation.title}</Text>
                    <Text style={[styles.cardSubtitle, { color: auroraSubtitle }]}>{meditation.subtitle}</Text>
                    <View style={styles.cardMeta}>
                      {meditation.duration && (
                        <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                          <MaterialCommunityIcons name="clock-outline" size={12} color={auroraSubtitle} />
                          <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{meditation.duration}</Text>
                        </View>
                      )}
                    <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <Text style={[styles.metaTagText, { color: heroIconColor }]}>{meditation.type}</Text>
                    </View>
                    {!hasProgramId && (
                      <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                        <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>Binnenkort</Text>
                      </View>
                    )}
                  </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={auroraSubtitle} />
                </MindAuroraCard>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="mind" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  categoryHeroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    minHeight: 180,
    maxHeight: 240,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  categoryIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  categorySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  introCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  premiumCardWrapper: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    width: '100%',
  },
  premiumCardBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 22,
    overflow: 'hidden',
  },
  premiumCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
    zIndex: 1,
    width: '100%',
    gap: 14,
  },
  ribbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  ribbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  ribbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '25deg' }],
  },
  ribbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '-20deg' }],
  },
  ribbonRight: {
    position: 'absolute',
    top: '-6%',
    right: '-12%',
    width: '140%',
    height: '60%',
    transform: [{ rotate: '-5deg' }],
  },
  ribbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Thin ribbon styles for Sapphire theme
  thinRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '15deg' }],
  },
  thinRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '180%',
    height: '1px',
    transform: [{ rotate: '-10deg' }],
  },
  thinRibbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '25deg' }],
  },
  thinRibbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '-20deg' }],
  },
  thinRibbonRight: {
    position: 'absolute',
    top: '-6%',
    right: '-12%',
    width: '180%',
    height: '1px',
    transform: [{ rotate: '-5deg' }],
  },
  // Calm gemstone styles for Sapphire theme
  sapphireGlowOverlay: {
    position: 'absolute',
    top: '0%',
    right: '0%',
    width: '30%',
    height: '30%',
    borderRadius: 20,
    opacity: 1,
  },
  facetLarge: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '50%',
    height: '40%',
    borderTopLeftRadius: 20,
    opacity: 1,
  },
  facetMedium: {
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '40%',
    height: '35%',
    borderBottomRightRadius: 18,
    opacity: 1,
  },
  glassBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.20)',
    opacity: 1,
  },
  thumbnailFallback: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meditationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meditationSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meditationDuration: {
    fontSize: 13,
  },
  meditationRightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  meditationTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  meditationTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 120,
  },
});