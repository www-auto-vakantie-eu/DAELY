import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '@/constants/themes';

interface ThemePremiumBannerCardProps {
  theme: AppTheme;
  isActive: boolean;
  onPress: () => void;
}

export function ThemePremiumBannerCard({ theme, isActive, onPress }: ThemePremiumBannerCardProps) {
  const themeStyle = getThemeStyle(theme.id);

  return (
    <Pressable
      style={[
        styles.card,
        isActive && styles.cardActive,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={themeStyle.gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Layer 1: Base material gradient */}

        {/* Layer 2: Atmosphere - inner shadow for material depth */}
        <LinearGradient
          colors={themeStyle.innerShadowColors}
          style={styles.innerShadow}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Layer 2: Atmosphere - top gloss highlight */}
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
          style={styles.topGloss}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Layer 3: Material texture simulation */}
        {renderMaterialLayer(theme.id, themeStyle)}

        {/* Layer 4: Depth gradient layer */}
        {renderDepthLayer(theme.id, themeStyle)}

        {/* Layer 5: Theme-specific motifs */}
        {renderMotifLayer(theme.id, themeStyle)}

        {/* Layer 6: Motion and detail layer */}
        {renderMotionLayer(theme.id, themeStyle)}

        {/* Layer 7: Micro details */}
        {renderMicroDetails(theme.id, themeStyle)}

        {/* Layer 8: Lighting effects */}
        {renderLightingLayer(theme.id, themeStyle)}

        {/* Layer 9: Edge highlights */}
        {renderEdgeHighlight(theme.id, themeStyle)}

        {/* Layer 10: UI polish - title */}
        <Text style={[styles.title, { color: themeStyle.titleColor, textShadowColor: themeStyle.textShadowColor, textShadowOffset: themeStyle.textShadowOffset, textShadowRadius: themeStyle.textShadowRadius }]}>
          {theme.name}
        </Text>

        {/* Layer 10: UI polish - accent line */}
        {renderAccentLine(theme.id, themeStyle, theme)}

        {/* Layer 10: UI polish - inner border */}
        {renderInnerBorder(theme.id, themeStyle)}

        {/* Layer 11: Selected state */}
        {renderSelectedState(theme.id, themeStyle, isActive, theme)}
      </LinearGradient>

      {/* Premium outer shadow */}
      <View style={styles.outerShadow} />

      {/* Selected ambient glow */}
      {isActive && (
        <View style={[styles.selectedGlow, { backgroundColor: theme.tabBarActive }]} />
      )}
    </Pressable>
  );
}

function getThemeStyle(themeId: string) {
  const styles: Record<string, any> = {
    'default': {
      // Base material: clean modern glass with blue-green energy flow
      gradientColors: ['#F8FAFC', '#F0F9FF', '#E0F2FE'],
      innerShadowColors: ['rgba(37, 99, 235, 0.03)', 'rgba(16, 185, 129, 0.02)', 'rgba(0,0,0,0.04)'],
      titleColor: '#0F172A',
      checkColor: '#0F172A',
      checkBg: 'rgba(255,255,255,0.95)',
      lineBaseColor: 'rgba(37, 99, 235, 0.12)',
      textShadowColor: 'rgba(37, 99, 235, 0.15)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#2563EB',
      secondaryColor: '#10B981',
      atmosphereColor: 'rgba(37, 99, 235, 0.12)',
      motifColor: 'rgba(16, 185, 129, 0.18)',
      motionColor: 'rgba(37, 99, 235, 0.22)',
      textureColor: 'rgba(37, 99, 235, 0.05)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      lightingColor: 'rgba(255,255,255,0.4)',
      accentGlowColor: 'rgba(16, 185, 129, 0.3)',
      // New layer properties
      materialColor: 'rgba(37, 99, 235, 0.03)',
      depthColor1: 'rgba(16, 185, 129, 0.05)',
      depthColor2: 'rgba(37, 99, 235, 0.08)',
      microColor: 'rgba(37, 99, 235, 0.15)',
      edgeColor: 'rgba(16, 185, 129, 0.2)',
    },
    'classic': {
      // Base material: clean white with DAELY blue accents
      gradientColors: ['#FFFFFF', '#F8FAFC', '#F1F5F9'],
      innerShadowColors: ['rgba(37, 99, 235, 0.04)', 'rgba(59, 130, 246, 0.02)', 'rgba(0,0,0,0.03)'],
      titleColor: '#0F172A',
      checkColor: '#0F172A',
      checkBg: 'rgba(255,255,255,0.95)',
      lineBaseColor: 'rgba(37, 99, 235, 0.15)',
      textShadowColor: 'rgba(37, 99, 235, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#2563EB',
      secondaryColor: '#3B82F6',
      atmosphereColor: 'rgba(37, 99, 235, 0.12)',
      motifColor: 'rgba(59, 130, 246, 0.18)',
      motionColor: 'rgba(37, 99, 235, 0.25)',
      textureColor: 'rgba(37, 99, 235, 0.04)',
      borderColor: 'rgba(37, 99, 235, 0.3)',
      lightingColor: 'rgba(59, 130, 246, 0.35)',
      accentGlowColor: 'rgba(37, 99, 235, 0.4)',
      // New layer properties
      materialColor: 'rgba(37, 99, 235, 0.03)',
      depthColor1: 'rgba(59, 130, 246, 0.05)',
      depthColor2: 'rgba(37, 99, 235, 0.08)',
      microColor: 'rgba(59, 130, 246, 0.2)',
      edgeColor: 'rgba(37, 99, 235, 0.3)',
    },
    'zenInk': {
      // Base material: off-white paper with ink texture
      gradientColors: ['#FAFAFA', '#F5F5F5', '#EBEBEB'],
      innerShadowColors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.03)', 'rgba(0,0,0,0.08)'],
      titleColor: '#1A1A1A',
      checkColor: '#1A1A1A',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(0,0,0,0.1)',
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
      primaryColor: '#2D2D2D',
      secondaryColor: '#4A4A4A',
      atmosphereColor: 'rgba(0,0,0,0.06)',
      motifColor: 'rgba(0,0,0,0.08)',
      motionColor: 'rgba(0,0,0,0.12)',
      textureColor: 'rgba(0,0,0,0.04)',
      borderColor: 'rgba(0,0,0,0.15)',
      lightingColor: 'rgba(255,255,255,0.5)',
      accentGlowColor: 'rgba(0,0,0,0.15)',
      // New layer properties
      materialColor: 'rgba(0,0,0,0.02)',
      depthColor1: 'rgba(0,0,0,0.04)',
      depthColor2: 'rgba(0,0,0,0.06)',
      microColor: 'rgba(0,0,0,0.08)',
      edgeColor: 'rgba(0,0,0,0.1)',
    },
    'force': {
      // Base material: dark performance surface with red accents
      gradientColors: ['#1F2937', '#111827', '#0F172A'],
      innerShadowColors: ['rgba(220,38,38,0.25)', 'rgba(220,38,38,0.12)', 'rgba(0,0,0,0.2)'],
      titleColor: '#FCA5A5',
      checkColor: '#1F2937',
      checkBg: 'rgba(220,38,38,0.35)',
      lineBaseColor: 'rgba(220, 38, 38, 0.2)',
      textShadowColor: 'rgba(220, 38, 38, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#DC2626',
      secondaryColor: '#F87171',
      atmosphereColor: 'rgba(220, 38, 38, 0.28)',
      motifColor: 'rgba(248, 113, 113, 0.38)',
      motionColor: 'rgba(220, 38, 38, 0.42)',
      textureColor: 'rgba(220, 38, 38, 0.1)',
      borderColor: 'rgba(220, 38, 38, 0.5)',
      lightingColor: 'rgba(248, 113, 113, 0.2)',
      accentGlowColor: 'rgba(220, 38, 38, 0.5)',
      // New layer properties
      materialColor: 'rgba(220, 38, 38, 0.1)',
      depthColor1: 'rgba(248, 113, 113, 0.12)',
      depthColor2: 'rgba(220, 38, 38, 0.18)',
      microColor: 'rgba(248, 113, 113, 0.3)',
      edgeColor: 'rgba(248, 113, 113, 0.4)',
    },
    'pastelCalm': {
      // Base material: soft pastel with airy feel
      gradientColors: ['#F5F3FF', '#F0EEFF', '#E6E3FF'],
      innerShadowColors: ['rgba(139, 92, 246, 0.04)', 'rgba(139, 92, 246, 0.02)', 'rgba(0,0,0,0.06)'],
      titleColor: '#4A3A8C',
      checkColor: '#4A3A8C',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(74, 58, 140, 0.15)',
      textShadowColor: 'rgba(139, 92, 246, 0.15)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#8B5CF6',
      secondaryColor: '#C4B5FD',
      atmosphereColor: 'rgba(139, 92, 246, 0.15)',
      motifColor: 'rgba(196, 181, 253, 0.22)',
      motionColor: 'rgba(139, 92, 246, 0.25)',
      textureColor: 'rgba(139, 92, 246, 0.06)',
      borderColor: 'rgba(139, 92, 246, 0.35)',
      lightingColor: 'rgba(196, 181, 253, 0.4)',
      accentGlowColor: 'rgba(139, 92, 246, 0.3)',
      // New layer properties
      materialColor: 'rgba(139, 92, 246, 0.05)',
      depthColor1: 'rgba(196, 181, 253, 0.08)',
      depthColor2: 'rgba(139, 92, 246, 0.12)',
      microColor: 'rgba(196, 181, 253, 0.2)',
      edgeColor: 'rgba(196, 181, 253, 0.25)',
    },
    'retroSport': {
      // Base material: vintage cream with navy/red
      gradientColors: ['#FFFBF5', '#F5F0E8', '#EDE8E0'],
      innerShadowColors: ['rgba(27, 46, 107, 0.05)', 'rgba(192, 57, 43, 0.03)', 'rgba(0,0,0,0.08)'],
      titleColor: '#1B2E6B',
      checkColor: '#1B2E6B',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(27, 46, 107, 0.15)',
      textShadowColor: 'rgba(27, 46, 107, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#1B2E6B',
      secondaryColor: '#C0392B',
      atmosphereColor: 'rgba(27, 46, 107, 0.1)',
      motifColor: 'rgba(192, 57, 43, 0.18)',
      motionColor: 'rgba(27, 46, 107, 0.22)',
      textureColor: 'rgba(27, 46, 107, 0.06)',
      borderColor: 'rgba(27, 46, 107, 0.3)',
      lightingColor: 'rgba(255,255,255,0.4)',
      accentGlowColor: 'rgba(192, 57, 43, 0.25)',
      // New layer properties
      materialColor: 'rgba(27, 46, 107, 0.05)',
      depthColor1: 'rgba(192, 57, 43, 0.08)',
      depthColor2: 'rgba(27, 46, 107, 0.12)',
      microColor: 'rgba(192, 57, 43, 0.15)',
      edgeColor: 'rgba(27, 46, 107, 0.2)',
    },
    'saharaDune': {
      // Base material: warm sand with sun glow
      gradientColors: ['#FFFBF0', '#FDF6EC', '#FAF0E6'],
      innerShadowColors: ['rgba(200, 155, 114, 0.08)', 'rgba(139, 90, 43, 0.04)', 'rgba(0,0,0,0.08)'],
      titleColor: '#8B5A2B',
      checkColor: '#8B5A2B',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(139, 90, 43, 0.15)',
      textShadowColor: 'rgba(200, 155, 114, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#C89B72',
      secondaryColor: '#FCD34D',
      atmosphereColor: 'rgba(200, 155, 114, 0.18)',
      motifColor: 'rgba(252, 211, 77, 0.25)',
      motionColor: 'rgba(200, 155, 114, 0.28)',
      textureColor: 'rgba(200, 155, 114, 0.08)',
      borderColor: 'rgba(200, 155, 114, 0.4)',
      lightingColor: 'rgba(252, 211, 77, 0.3)',
      accentGlowColor: 'rgba(200, 155, 114, 0.35)',
      // New layer properties
      materialColor: 'rgba(200, 155, 114, 0.06)',
      depthColor1: 'rgba(252, 211, 77, 0.1)',
      depthColor2: 'rgba(200, 155, 114, 0.14)',
      microColor: 'rgba(252, 211, 77, 0.22)',
      edgeColor: 'rgba(200, 155, 114, 0.3)',
    },
    'aurora': {
      // Base material: northern lights with green/purple
      gradientColors: ['#0F172A', '#1E1B4B', '#312E81'],
      innerShadowColors: ['rgba(34, 211, 238, 0.15)', 'rgba(168, 85, 247, 0.1)', 'rgba(0,0,0,0.25)'],
      titleColor: '#A5F3FC',
      checkColor: '#0F172A',
      checkBg: 'rgba(34, 211, 238, 0.35)',
      lineBaseColor: 'rgba(34, 211, 238, 0.2)',
      textShadowColor: 'rgba(34, 211, 238, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#22D3EE',
      secondaryColor: '#A855F7',
      atmosphereColor: 'rgba(34, 211, 238, 0.18)',
      motifColor: 'rgba(168, 85, 247, 0.28)',
      motionColor: 'rgba(34, 211, 238, 0.32)',
      textureColor: 'rgba(34, 211, 238, 0.08)',
      borderColor: 'rgba(34, 211, 238, 0.45)',
      lightingColor: 'rgba(168, 85, 247, 0.25)',
      accentGlowColor: 'rgba(34, 211, 238, 0.5)',
      materialColor: 'rgba(34, 211, 238, 0.08)',
      depthColor1: 'rgba(168, 85, 247, 0.1)',
      depthColor2: 'rgba(34, 211, 238, 0.15)',
      microColor: 'rgba(168, 85, 247, 0.25)',
      edgeColor: 'rgba(34, 211, 238, 0.35)',
    },
    'ruby': {
      // Base material: deep red with luxury feel
      gradientColors: ['#450A0A', '#7F1D1D', '#991B1B'],
      innerShadowColors: ['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.12)', 'rgba(0,0,0,0.3)'],
      titleColor: '#FCA5A5',
      checkColor: '#450A0A',
      checkBg: 'rgba(239, 68, 68, 0.35)',
      lineBaseColor: 'rgba(239, 68, 68, 0.2)',
      textShadowColor: 'rgba(239, 68, 68, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#EF4444',
      secondaryColor: '#F87171',
      atmosphereColor: 'rgba(239, 68, 68, 0.25)',
      motifColor: 'rgba(248, 113, 113, 0.35)',
      motionColor: 'rgba(239, 68, 68, 0.4)',
      textureColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      lightingColor: 'rgba(248, 113, 113, 0.2)',
      accentGlowColor: 'rgba(239, 68, 68, 0.5)',
      materialColor: 'rgba(239, 68, 68, 0.1)',
      depthColor1: 'rgba(248, 113, 113, 0.12)',
      depthColor2: 'rgba(239, 68, 68, 0.18)',
      microColor: 'rgba(248, 113, 113, 0.3)',
      edgeColor: 'rgba(248, 113, 113, 0.4)',
    },
    'coralBloom': {
      // Base material: warm coral with soft pink
      gradientColors: ['#FFF5F5', '#FFE4E6', '#FECDD3'],
      innerShadowColors: ['rgba(244, 114, 182, 0.08)', 'rgba(236, 72, 153, 0.04)', 'rgba(0,0,0,0.06)'],
      titleColor: '#831843',
      checkColor: '#831843',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(236, 72, 153, 0.15)',
      textShadowColor: 'rgba(244, 114, 182, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#F472B6',
      secondaryColor: '#EC4899',
      atmosphereColor: 'rgba(244, 114, 182, 0.18)',
      motifColor: 'rgba(236, 72, 153, 0.25)',
      motionColor: 'rgba(244, 114, 182, 0.28)',
      textureColor: 'rgba(244, 114, 182, 0.08)',
      borderColor: 'rgba(244, 114, 182, 0.4)',
      lightingColor: 'rgba(251, 207, 232, 0.4)',
      accentGlowColor: 'rgba(244, 114, 182, 0.35)',
      materialColor: 'rgba(244, 114, 182, 0.06)',
      depthColor1: 'rgba(251, 207, 232, 0.1)',
      depthColor2: 'rgba(244, 114, 182, 0.14)',
      microColor: 'rgba(251, 207, 232, 0.22)',
      edgeColor: 'rgba(244, 114, 182, 0.3)',
    },
    'marble': {
      // Base material: elegant white marble with gray veins
      gradientColors: ['#FAFAFA', '#F5F5F4', '#E7E5E4'],
      innerShadowColors: ['rgba(120, 113, 108, 0.06)', 'rgba(87, 83, 78, 0.03)', 'rgba(0,0,0,0.08)'],
      titleColor: '#292524',
      checkColor: '#292524',
      checkBg: 'rgba(255,255,255,0.95)',
      lineBaseColor: 'rgba(120, 113, 108, 0.15)',
      textShadowColor: 'rgba(120, 113, 108, 0.15)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#78716C',
      secondaryColor: '#A8A29E',
      atmosphereColor: 'rgba(120, 113, 108, 0.12)',
      motifColor: 'rgba(168, 162, 158, 0.18)',
      motionColor: 'rgba(120, 113, 108, 0.22)',
      textureColor: 'rgba(120, 113, 108, 0.06)',
      borderColor: 'rgba(120, 113, 108, 0.3)',
      lightingColor: 'rgba(255,255,255,0.5)',
      accentGlowColor: 'rgba(168, 162, 158, 0.25)',
      materialColor: 'rgba(120, 113, 108, 0.05)',
      depthColor1: 'rgba(168, 162, 158, 0.08)',
      depthColor2: 'rgba(120, 113, 108, 0.12)',
      microColor: 'rgba(168, 162, 158, 0.2)',
      edgeColor: 'rgba(168, 162, 158, 0.25)',
    },
    'sapphire': {
      // Base material: deep blue with royal elegance
      gradientColors: ['#0C4A6E', '#075985', '#0369A1'],
      innerShadowColors: ['rgba(56, 189, 248, 0.18)', 'rgba(14, 165, 233, 0.1)', 'rgba(0,0,0,0.25)'],
      titleColor: '#E0F2FE',
      checkColor: '#0C4A6E',
      checkBg: 'rgba(56, 189, 248, 0.35)',
      lineBaseColor: 'rgba(56, 189, 248, 0.2)',
      textShadowColor: 'rgba(56, 189, 248, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#38BDF8',
      secondaryColor: '#0EA5E9',
      atmosphereColor: 'rgba(56, 189, 248, 0.2)',
      motifColor: 'rgba(14, 165, 233, 0.3)',
      motionColor: 'rgba(56, 189, 248, 0.35)',
      textureColor: 'rgba(56, 189, 248, 0.08)',
      borderColor: 'rgba(56, 189, 248, 0.5)',
      lightingColor: 'rgba(14, 165, 233, 0.25)',
      accentGlowColor: 'rgba(56, 189, 248, 0.5)',
      materialColor: 'rgba(56, 189, 248, 0.1)',
      depthColor1: 'rgba(14, 165, 233, 0.12)',
      depthColor2: 'rgba(56, 189, 248, 0.18)',
      microColor: 'rgba(14, 165, 233, 0.3)',
      edgeColor: 'rgba(56, 189, 248, 0.4)',
    },
    'purpleStorm': {
      // Base material: dark purple with electric energy
      gradientColors: ['#1E1B4B', '#312E81', '#4338CA'],
      innerShadowColors: ['rgba(192, 132, 252, 0.2)', 'rgba(167, 139, 250, 0.12)', 'rgba(0,0,0,0.3)'],
      titleColor: '#E9D5FF',
      checkColor: '#1E1B4B',
      checkBg: 'rgba(192, 132, 252, 0.35)',
      lineBaseColor: 'rgba(192, 132, 252, 0.22)',
      textShadowColor: 'rgba(192, 132, 252, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#C084FC',
      secondaryColor: '#A78BFA',
      atmosphereColor: 'rgba(192, 132, 252, 0.25)',
      motifColor: 'rgba(167, 139, 250, 0.35)',
      motionColor: 'rgba(192, 132, 252, 0.4)',
      textureColor: 'rgba(192, 132, 252, 0.1)',
      borderColor: 'rgba(192, 132, 252, 0.55)',
      lightingColor: 'rgba(167, 139, 250, 0.2)',
      accentGlowColor: 'rgba(192, 132, 252, 0.5)',
      materialColor: 'rgba(192, 132, 252, 0.12)',
      depthColor1: 'rgba(167, 139, 250, 0.15)',
      depthColor2: 'rgba(192, 132, 252, 0.22)',
      microColor: 'rgba(167, 139, 250, 0.35)',
      edgeColor: 'rgba(167, 139, 250, 0.45)',
    },
    'volcanicAsh': {
      // Base material: dark gray with ash texture
      gradientColors: ['#18181B', '#27272A', '#3F3F46'],
      innerShadowColors: ['rgba(161, 161, 170, 0.15)', 'rgba(113, 113, 122, 0.1)', 'rgba(0,0,0,0.3)'],
      titleColor: '#E4E4E7',
      checkColor: '#18181B',
      checkBg: 'rgba(161, 161, 170, 0.35)',
      lineBaseColor: 'rgba(161, 161, 170, 0.2)',
      textShadowColor: 'rgba(161, 161, 170, 0.4)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#A1A1AA',
      secondaryColor: '#71717A',
      atmosphereColor: 'rgba(161, 161, 170, 0.2)',
      motifColor: 'rgba(113, 113, 122, 0.3)',
      motionColor: 'rgba(161, 161, 170, 0.35)',
      textureColor: 'rgba(161, 161, 170, 0.1)',
      borderColor: 'rgba(161, 161, 170, 0.45)',
      lightingColor: 'rgba(113, 113, 122, 0.2)',
      accentGlowColor: 'rgba(161, 161, 170, 0.4)',
      materialColor: 'rgba(161, 161, 170, 0.1)',
      depthColor1: 'rgba(113, 113, 122, 0.12)',
      depthColor2: 'rgba(161, 161, 170, 0.18)',
      microColor: 'rgba(113, 113, 122, 0.3)',
      edgeColor: 'rgba(113, 113, 122, 0.4)',
    },
    'venom': {
      // Base material: toxic green with danger feel
      gradientColors: ['#052E16', '#14532D', '#166534'],
      innerShadowColors: ['rgba(74, 222, 128, 0.2)', 'rgba(34, 197, 94, 0.12)', 'rgba(0,0,0,0.35)'],
      titleColor: '#BBF7D0',
      checkColor: '#052E16',
      checkBg: 'rgba(74, 222, 128, 0.35)',
      lineBaseColor: 'rgba(74, 222, 128, 0.22)',
      textShadowColor: 'rgba(74, 222, 128, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#4ADE80',
      secondaryColor: '#22C55E',
      atmosphereColor: 'rgba(74, 222, 128, 0.25)',
      motifColor: 'rgba(34, 197, 94, 0.35)',
      motionColor: 'rgba(74, 222, 128, 0.4)',
      textureColor: 'rgba(74, 222, 128, 0.1)',
      borderColor: 'rgba(74, 222, 128, 0.55)',
      lightingColor: 'rgba(34, 197, 94, 0.2)',
      accentGlowColor: 'rgba(74, 222, 128, 0.5)',
      materialColor: 'rgba(74, 222, 128, 0.12)',
      depthColor1: 'rgba(34, 197, 94, 0.15)',
      depthColor2: 'rgba(74, 222, 128, 0.22)',
      microColor: 'rgba(34, 197, 94, 0.35)',
      edgeColor: 'rgba(34, 197, 94, 0.45)',
    },
    'wave': {
      // Base material: ocean blue with water feel
      gradientColors: ['#0C4A6E', '#0369A1', '#0284C7'],
      innerShadowColors: ['rgba(125, 211, 252, 0.18)', 'rgba(56, 189, 248, 0.1)', 'rgba(0,0,0,0.25)'],
      titleColor: '#E0F2FE',
      checkColor: '#0C4A6E',
      checkBg: 'rgba(125, 211, 252, 0.35)',
      lineBaseColor: 'rgba(125, 211, 252, 0.2)',
      textShadowColor: 'rgba(125, 211, 252, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#7DD3FC',
      secondaryColor: '#38BDF8',
      atmosphereColor: 'rgba(125, 211, 252, 0.18)',
      motifColor: 'rgba(56, 189, 248, 0.28)',
      motionColor: 'rgba(125, 211, 252, 0.32)',
      textureColor: 'rgba(125, 211, 252, 0.08)',
      borderColor: 'rgba(125, 211, 252, 0.45)',
      lightingColor: 'rgba(56, 189, 248, 0.2)',
      accentGlowColor: 'rgba(125, 211, 252, 0.5)',
      materialColor: 'rgba(125, 211, 252, 0.08)',
      depthColor1: 'rgba(56, 189, 248, 0.1)',
      depthColor2: 'rgba(125, 211, 252, 0.15)',
      microColor: 'rgba(56, 189, 248, 0.25)',
      edgeColor: 'rgba(125, 211, 252, 0.35)',
    },
  };
  return styles[themeId] || styles['default'];
}

function renderMaterialLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return <View style={[styles.glassMaterial, { backgroundColor: style.materialColor }]} />;
    case 'classic':
      return <View style={[styles.sportMaterial, { backgroundColor: style.materialColor }]} />;
    case 'zenInk':
      return <View style={[styles.paperMaterial, { backgroundColor: style.materialColor }]} />;
    case 'force':
      return <View style={[styles.performanceMaterial, { backgroundColor: style.materialColor }]} />;
    case 'pastelCalm':
      return <View style={[styles.softMaterial, { backgroundColor: style.materialColor }]} />;
    case 'retroSport':
      return <View style={[styles.vintageMaterial, { backgroundColor: style.materialColor }]} />;
    case 'saharaDune':
      return <View style={[styles.sandMaterial, { backgroundColor: style.materialColor }]} />;
    case 'aurora':
      return <View style={[styles.glassMaterial, { backgroundColor: style.materialColor }]} />;
    case 'ruby':
      return <View style={[styles.performanceMaterial, { backgroundColor: style.materialColor }]} />;
    case 'coralBloom':
      return <View style={[styles.softMaterial, { backgroundColor: style.materialColor }]} />;
    case 'marble':
      return <View style={[styles.paperMaterial, { backgroundColor: style.materialColor }]} />;
    case 'sapphire':
      return <View style={[styles.glassMaterial, { backgroundColor: style.materialColor }]} />;
    case 'purpleStorm':
      return <View style={[styles.techMaterial, { backgroundColor: style.materialColor }]} />;
    case 'volcanicAsh':
      return <View style={[styles.performanceMaterial, { backgroundColor: style.materialColor }]} />;
    case 'venom':
      return <View style={[styles.organicMaterial, { backgroundColor: style.materialColor }]} />;
    case 'wave':
      return <View style={[styles.glassMaterial, { backgroundColor: style.materialColor }]} />;
    default:
      return null;
  }
}

function renderDepthLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'classic':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'zenInk':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'force':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'pastelCalm':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'retroSport':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'saharaDune':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'aurora':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'ruby':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'coralBloom':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'marble':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'sapphire':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'purpleStorm':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'volcanicAsh':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'venom':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'wave':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    default:
      return null;
  }
}

function renderMotifLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.diagonalHighlight, { backgroundColor: style.motifColor }]} />
          <View style={[styles.energyOrb, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.motionArcLarge, { backgroundColor: style.motifColor }]} />
          <View style={[styles.motionArcSmall, { backgroundColor: style.motifColor }]} />
          <View style={[styles.glowDotClassic, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'zenInk':
      return (
        <>
          <View style={[styles.inkWashLarge, { backgroundColor: style.motifColor }]} />
          <View style={[styles.inkWashSmall, { backgroundColor: style.motifColor }]} />
          <View style={[styles.asymmetricCircle, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.powerDiagonal, { backgroundColor: style.motifColor }]} />
          <View style={[styles.impactRing, { backgroundColor: style.motifColor }]} />
          <View style={[styles.forceGlow, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'pastelCalm':
      return (
        <>
          <View style={[styles.pearlCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.softOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.calmDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'retroSport':
      return (
        <>
          <View style={[styles.vintageStripeMain, { backgroundColor: style.motifColor }]} />
          <View style={[styles.vintageStripeSub, { backgroundColor: style.secondaryColor }]} />
          <View style={[styles.badgeRetro, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'saharaDune':
      return (
        <>
          <View style={[styles.duneCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sunOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sandDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'aurora':
      return (
        <>
          <View style={[styles.diagonalHighlight, { backgroundColor: style.motifColor }]} />
          <View style={[styles.energyOrb, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'ruby':
      return (
        <>
          <View style={[styles.powerDiagonal, { backgroundColor: style.motifColor }]} />
          <View style={[styles.impactRing, { backgroundColor: style.motifColor }]} />
          <View style={[styles.forceGlow, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'coralBloom':
      return (
        <>
          <View style={[styles.pearlCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.softOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.calmDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'marble':
      return (
        <>
          <View style={[styles.inkWashLarge, { backgroundColor: style.motifColor }]} />
          <View style={[styles.inkWashSmall, { backgroundColor: style.motifColor }]} />
          <View style={[styles.asymmetricCircle, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'sapphire':
      return (
        <>
          <View style={[styles.circuitGrid, { backgroundColor: style.motifColor }]} />
          <View style={[styles.dataNode, { backgroundColor: style.motifColor }]} />
          <View style={[styles.techOrb, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'purpleStorm':
      return (
        <>
          <View style={[styles.circuitGrid, { backgroundColor: style.motifColor }]} />
          <View style={[styles.dataNode, { backgroundColor: style.motifColor }]} />
          <View style={[styles.techOrb, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'volcanicAsh':
      return (
        <>
          <View style={[styles.powerDiagonal, { backgroundColor: style.motifColor }]} />
          <View style={[styles.impactRing, { backgroundColor: style.motifColor }]} />
          <View style={[styles.forceGlow, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'venom':
      return (
        <>
          <View style={[styles.leafCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.leafFloating, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sunRay, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'wave':
      return (
        <>
          <View style={[styles.pearlCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.softOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.calmDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    default:
      return null;
  }
}

function renderMotionLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.speedLineDiagonal, { backgroundColor: style.motionColor }]} />
          <View style={[styles.brandLine, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.speedLineHorizontal, { backgroundColor: style.motionColor }]} />
          <View style={[styles.sportLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.energyParticleClassic, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'zenInk':
      return (
        <>
          <View style={[styles.brushLineLong, { backgroundColor: style.motionColor }]} />
          <View style={[styles.brushLineShort, { backgroundColor: style.motionColor }]} />
          <View style={[styles.inkDot, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.diagonalCut, { backgroundColor: style.motionColor }]} />
          <View style={[styles.powerLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.impactParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'pastelCalm':
      return (
        <>
          <View style={[styles.waveLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.bubbleTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.calmParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'retroSport':
      return (
        <>
          <View style={[styles.racingLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.vintageDot, { backgroundColor: style.motionColor }]} />
          <View style={[styles.halftonePattern, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'saharaDune':
      return (
        <>
          <View style={[styles.windLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.duneTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.sandParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'aurora':
      return (
        <>
          <View style={[styles.circuitTrace, { backgroundColor: style.motionColor }]} />
          <View style={[styles.scanLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.techParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'ruby':
      return (
        <>
          <View style={[styles.diagonalCut, { backgroundColor: style.motionColor }]} />
          <View style={[styles.powerLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.impactParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'coralBloom':
      return (
        <>
          <View style={[styles.waveLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.bubbleTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.calmParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'marble':
      return (
        <>
          <View style={[styles.brushLineLong, { backgroundColor: style.motionColor }]} />
          <View style={[styles.brushLineShort, { backgroundColor: style.motionColor }]} />
          <View style={[styles.inkDot, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'sapphire':
      return (
        <>
          <View style={[styles.circuitTrace, { backgroundColor: style.motionColor }]} />
          <View style={[styles.scanLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.techParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'purpleStorm':
      return (
        <>
          <View style={[styles.circuitTrace, { backgroundColor: style.motionColor }]} />
          <View style={[styles.scanLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.techParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'volcanicAsh':
      return (
        <>
          <View style={[styles.diagonalCut, { backgroundColor: style.motionColor }]} />
          <View style={[styles.powerLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.impactParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'venom':
      return (
        <>
          <View style={[styles.breathWave, { backgroundColor: style.motionColor }]} />
          <View style={[styles.leafTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.natureParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'wave':
      return (
        <>
          <View style={[styles.waveLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.bubbleTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.calmParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    default:
      return null;
  }
}

function renderLightingLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.lightRay1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.lightRay2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.stadiumLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.stadiumLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'zenInk':
      return (
        <View style={[styles.paperLight, { backgroundColor: style.lightingColor }]} />
      );
    case 'force':
      return (
        <>
          <View style={[styles.impactLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.impactLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pastelCalm':
      return (
        <>
          <View style={[styles.softLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.softLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'retroSport':
      return (
        <View style={[styles.vintageLight, { backgroundColor: style.lightingColor }]} />
      );
    case 'saharaDune':
      return (
        <>
          <View style={[styles.sunLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.sunLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'aurora':
      return (
        <>
          <View style={[styles.techLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.techLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'ruby':
      return (
        <>
          <View style={[styles.impactLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.impactLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'coralBloom':
      return (
        <>
          <View style={[styles.softLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.softLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'marble':
      return (
        <View style={[styles.paperLight, { backgroundColor: style.lightingColor }]} />
      );
    case 'sapphire':
      return (
        <>
          <View style={[styles.techLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.techLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'purpleStorm':
      return (
        <>
          <View style={[styles.techLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.techLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'volcanicAsh':
      return (
        <>
          <View style={[styles.impactLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.impactLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'venom':
      return (
        <>
          <View style={[styles.sunRay1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.sunRay2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'wave':
      return (
        <>
          <View style={[styles.softLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.softLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    default:
      return null;
  }
}

function renderMicroDetails(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.microDot1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDot2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microLine1, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.microDotClassic1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotClassic2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microLineClassic, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'zenInk':
      return (
        <>
          <View style={[styles.microDotZen1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microLineZen, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.microSlash1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSlash2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotForce, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'pastelCalm':
      return (
        <>
          <View style={[styles.microBubble1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microBubble2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSoftCurve, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'retroSport':
      return (
        <>
          <View style={[styles.microDotRetro1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotRetro2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microRetroLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'saharaDune':
      return (
        <>
          <View style={[styles.microSandDot1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSandDot2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSandCurve, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'aurora':
      return (
        <>
          <View style={[styles.microNode1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microNode2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCircuitLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'ruby':
      return (
        <>
          <View style={[styles.microSlash1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSlash2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotForce, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'coralBloom':
      return (
        <>
          <View style={[styles.microBubble1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microBubble2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSoftCurve, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'marble':
      return (
        <>
          <View style={[styles.microDotZen1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microLineZen, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'sapphire':
      return (
        <>
          <View style={[styles.microNode1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microNode2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCircuitLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'purpleStorm':
      return (
        <>
          <View style={[styles.microNode1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microNode2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCircuitLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'volcanicAsh':
      return (
        <>
          <View style={[styles.microSlash1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSlash2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotForce, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'venom':
      return (
        <>
          <View style={[styles.microDotForest1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotForest2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCurveForest, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'wave':
      return (
        <>
          <View style={[styles.microBubble1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microBubble2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSoftCurve, { backgroundColor: style.microColor }]} />
        </>
      );
    default:
      return null;
  }
}

function renderEdgeHighlight(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightBottom, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'zenInk':
      return (
        <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
      );
    case 'force':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'pastelCalm':
      return (
        <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
      );
    case 'retroSport':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightBottom, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'saharaDune':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'aurora':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'ruby':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'coralBloom':
      return (
        <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
      );
    case 'marble':
      return (
        <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
      );
    case 'sapphire':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'purpleStorm':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'volcanicAsh':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'venom':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'wave':
      return (
        <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
      );
    default:
      return null;
  }
}

function renderAccentLine(themeId: string, style: any, theme: AppTheme) {
  switch (themeId) {
    case 'default':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'classic':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'zenInk':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
        </View>
      );
    case 'force':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'pastelCalm':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'retroSport':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
        </View>
      );
    case 'saharaDune':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'aurora':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'ruby':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'coralBloom':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'marble':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'sapphire':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'purpleStorm':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'volcanicAsh':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'venom':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'wave':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    default:
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
        </View>
      );
  }
}

function renderSelectedState(themeId: string, style: any, isActive: boolean, theme: AppTheme) {
  if (!isActive) return null;
  
  return (
    <View style={[styles.checkRing, { borderColor: theme.tabBarActive, backgroundColor: style.checkBg }]}>
      <View style={[styles.checkCircle, { backgroundColor: theme.tabBarActive }]}>
        <MaterialCommunityIcons name="check" size={16} color={style.checkColor} />
      </View>
    </View>
  );
}

function renderInnerBorder(themeId: string, style: any) {
  return (
    <View style={[styles.innerBorder, { borderColor: style.borderColor }]} />
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 148,
    borderRadius: 32,
    marginBottom: 16,
    position: 'relative',
  },
  cardActive: {
    transform: [{ scale: 1.01 }],
  },
  gradient: {
    flex: 1,
    borderRadius: 32,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  topGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    borderRadius: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    zIndex: 10,
  },
  accentLineContainer: {
    position: 'absolute',
    bottom: 22,
    left: 24,
    right: 24,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  accentLineBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
  },
  accentLineFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '55%',
    borderRadius: 2,
  },
  accentLineGlow: {
    position: 'absolute',
    top: -2,
    left: 0,
    bottom: -2,
    width: '55%',
    borderRadius: 4,
    opacity: 0.5,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  checkRing: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    pointerEvents: 'none',
  },
  selectedGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 34,
    opacity: 0.2,
    pointerEvents: 'none',
  },
  // Atmosphere glows
  atmosphereGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  // Default motifs
  diagonalHighlight: {
    position: 'absolute',
    top: 20,
    left: 15,
    width: 80,
    height: 3,
    transform: [{ rotate: '-15deg' }],
  },
  energyOrb: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 45,
    height: 45,
    borderRadius: 23,
  },
  // Default motion
  speedLineDiagonal: {
    position: 'absolute',
    top: 35,
    left: 25,
    width: 55,
    height: 2,
    transform: [{ rotate: '-10deg' }],
  },
  brandLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
  },
  // Default texture
  glassTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  // Classic motifs
  motionArcLarge: {
    position: 'absolute',
    top: 25,
    left: 20,
    width: 80,
    height: 40,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  motionArcSmall: {
    position: 'absolute',
    top: 35,
    left: 35,
    width: 55,
    height: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  glowDotClassic: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Classic motion
  speedLineHorizontal: {
    position: 'absolute',
    top: 38,
    left: 100,
    width: 50,
    height: 2,
  },
  sportLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  energyParticleClassic: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Classic texture
  sportTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  // Zen Ink motifs
  inkWashLarge: {
    position: 'absolute',
    top: 10,
    left: -25,
    width: 130,
    height: 85,
    borderRadius: 65,
  },
  inkWashSmall: {
    position: 'absolute',
    bottom: 20,
    right: -30,
    width: 110,
    height: 70,
    borderRadius: 55,
  },
  asymmetricCircle: {
    position: 'absolute',
    top: 38,
    right: 25,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  // Zen Ink motion
  brushLineLong: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 50,
    height: 2,
  },
  brushLineShort: {
    position: 'absolute',
    top: 45,
    left: 32,
    width: 38,
    height: 1.5,
  },
  inkDot: {
    position: 'absolute',
    bottom: 35,
    left: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Zen Ink texture
  paperTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  // Forest Breath motifs
  leafCurve: {
    position: 'absolute',
    top: -20,
    left: -15,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  leafFloating: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  sunRay: {
    position: 'absolute',
    top: 15,
    left: 25,
    width: 2,
    height: 60,
    transform: [{ rotate: '20deg' }],
  },
  // Forest Breath motion
  breathWave: {
    position: 'absolute',
    bottom: 20,
    left: 22,
    width: 90,
    height: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  leafTrail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
  },
  natureParticle: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Forest Breath texture
  leafTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  // Force motifs
  powerDiagonal: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 70,
    height: 3,
    transform: [{ rotate: '45deg' }],
  },
  impactRing: {
    position: 'absolute',
    top: -25,
    left: 25,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  forceGlow: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  // Force motion
  diagonalCut: {
    position: 'absolute',
    top: 38,
    left: 35,
    width: 60,
    height: 2,
    transform: [{ rotate: '-35deg' }],
  },
  powerLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
  },
  impactParticle: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  // Force texture
  gritTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  // Pure Luxury motifs
  goldDiagonal: {
    position: 'absolute',
    top: 32,
    left: 22,
    width: 80,
    height: 2,
  },
  luxuryOrnament: {
    position: 'absolute',
    top: 20,
    right: 22,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  goldParticle: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Pure Luxury motion
  goldLine: {
    position: 'absolute',
    top: 15,
    left: 25,
    width: 55,
    height: 1,
  },
  shimmerLine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 2,
    height: '100%',
  },
  luxuryDot: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Pure Luxury texture
  metallicTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  // Innovation motifs
  circuitGrid: {
    position: 'absolute',
    top: 22,
    left: 20,
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  dataNode: {
    position: 'absolute',
    top: 42,
    right: 25,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  techOrb: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Innovation motion
  circuitTrace: {
    position: 'absolute',
    top: 28,
    left: 80,
    width: 45,
    height: 2,
  },
  scanLine: {
    position: 'absolute',
    top: 35,
    left: 22,
    width: 30,
    height: 1,
  },
  techParticle: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  // Innovation texture
  gridTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  // Pastel Calm motifs
  pearlCurve: {
    position: 'absolute',
    top: -18,
    right: 22,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  softOrb: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  calmDot: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Pastel Calm motion
  waveLine: {
    position: 'absolute',
    top: 28,
    left: 25,
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  bubbleTrail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
  },
  calmParticle: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  // Pastel Calm texture
  pearlTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  // Retro Sport motifs
  vintageStripeMain: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 65,
    height: 5,
  },
  vintageStripeSub: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 42,
    height: 4,
  },
  badgeRetro: {
    position: 'absolute',
    bottom: 32,
    right: 28,
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  // Retro Sport motion
  racingLine: {
    position: 'absolute',
    top: 35,
    left: 90,
    width: 35,
    height: 2,
  },
  vintageDot: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  halftonePattern: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Retro Sport texture
  fabricTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  // Pulse motifs
  heartbeatCurve: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    width: 35,
    height: 2,
  },
  pulseOrb: {
    position: 'absolute',
    top: -28,
    left: 22,
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  rhythmDot: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Pulse motion
  ecgLine: {
    position: 'absolute',
    bottom: 25,
    left: 58,
    width: 25,
    height: 2,
  },
  pulseLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  energyParticlePulse: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Pulse texture
  glassDarkTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  // Rogue motifs
  aggressionSlash: {
    position: 'absolute',
    top: 28,
    left: 25,
    width: 65,
    height: 3,
    transform: [{ rotate: '40deg' }],
  },
  fireOrb: {
    position: 'absolute',
    bottom: -30,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  sparkRing: {
    position: 'absolute',
    top: 26,
    right: 26,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  // Rogue motion
  energySlash: {
    position: 'absolute',
    bottom: 22,
    left: 30,
    width: 60,
    height: 3,
  },
  fireLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
  },
  sparkParticleRogue: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  // Rogue texture
  metallicDarkTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
  // Ember motifs
  warmthCurve: {
    position: 'absolute',
    bottom: 18,
    right: 32,
    width: 55,
    height: 3,
  },
  emberOrb: {
    position: 'absolute',
    top: -25,
    right: -22,
    width: 135,
    height: 135,
    borderRadius: 68,
  },
  glowParticle: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Ember motion
  heatTrail: {
    position: 'absolute',
    bottom: 20,
    right: 35,
    width: 50,
    height: 2,
  },
  smokeLine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 2,
    height: '100%',
  },
  emberParticle: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Ember texture
  smokeTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  // Dune motifs
  duneCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    borderRadius: 32,
  },
  sunOrb: {
    position: 'absolute',
    top: -22,
    right: 28,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  sandDot: {
    position: 'absolute',
    top: 32,
    right: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Dune motion
  windLine: {
    position: 'absolute',
    top: 28,
    left: 22,
    width: 45,
    height: 2,
  },
  duneTrail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
  },
  sandParticle: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Dune texture
  grainTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.28,
  },
  // New material layers
  glassMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  sportMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  paperMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  organicMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  performanceMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  luxuryMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  techMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  softMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  vintageMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  energyMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  aggressiveMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  warmMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  sandMaterial: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  // Depth gradient layers
  depthGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.6,
  },
  depthGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.6,
  },
  depthGradientFull: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  depthGradientDiagonal: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  // Micro details
  microDot1: {
    position: 'absolute',
    top: 25,
    left: 30,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  microDot2: {
    position: 'absolute',
    top: 40,
    right: 35,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.4,
  },
  microLine1: {
    position: 'absolute',
    top: 55,
    left: 45,
    width: 25,
    height: 1,
    opacity: 0.5,
  },
  microDotClassic1: {
    position: 'absolute',
    top: 22,
    left: 25,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.7,
  },
  microDotClassic2: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  microLineClassic: {
    position: 'absolute',
    top: 45,
    right: 45,
    width: 30,
    height: 1,
    opacity: 0.6,
  },
  microDotZen1: {
    position: 'absolute',
    top: 35,
    right: 35,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
  },
  microLineZen: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    width: 20,
    height: 1,
    opacity: 0.3,
  },
  microDotForest1: {
    position: 'absolute',
    top: 20,
    left: 28,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.6,
  },
  microDotForest2: {
    position: 'absolute',
    bottom: 35,
    right: 32,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  microCurveForest: {
    position: 'absolute',
    top: 50,
    right: 40,
    width: 30,
    height: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    opacity: 0.5,
  },
  microSlash1: {
    position: 'absolute',
    top: 30,
    left: 35,
    width: 40,
    height: 2,
    transform: [{ rotate: '35deg' }],
    opacity: 0.7,
  },
  microSlash2: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 35,
    height: 2,
    transform: [{ rotate: '-25deg' }],
    opacity: 0.5,
  },
  microDotForce: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  microGoldLine1: {
    position: 'absolute',
    top: 35,
    left: 30,
    width: 35,
    height: 1,
    opacity: 0.5,
  },
  microGoldLine2: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    width: 25,
    height: 1,
    opacity: 0.4,
  },
  microDotLuxury: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.6,
  },
  microNode1: {
    position: 'absolute',
    top: 22,
    left: 32,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.7,
  },
  microNode2: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  microCircuitLine: {
    position: 'absolute',
    top: 45,
    left: 40,
    width: 28,
    height: 1,
    opacity: 0.6,
  },
  microBubble1: {
    position: 'absolute',
    top: 25,
    left: 35,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  microBubble2: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.3,
  },
  microSoftCurve: {
    position: 'absolute',
    top: 50,
    right: 45,
    width: 25,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.4,
  },
  microDotRetro1: {
    position: 'absolute',
    top: 28,
    left: 28,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.5,
  },
  microDotRetro2: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  microRetroLine: {
    position: 'absolute',
    top: 42,
    left: 35,
    width: 30,
    height: 2,
    opacity: 0.5,
  },
  microPulseDot1: {
    position: 'absolute',
    top: 22,
    left: 30,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.7,
  },
  microPulseDot2: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  microPulseLine: {
    position: 'absolute',
    top: 38,
    right: 35,
    width: 25,
    height: 2,
    opacity: 0.6,
  },
  microRogueSlash1: {
    position: 'absolute',
    top: 28,
    left: 32,
    width: 45,
    height: 2,
    transform: [{ rotate: '40deg' }],
    opacity: 0.7,
  },
  microRogueSlash2: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    width: 38,
    height: 2,
    transform: [{ rotate: '-30deg' }],
    opacity: 0.5,
  },
  microSpark: {
    position: 'absolute',
    top: 32,
    right: 32,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  microEmberDot1: {
    position: 'absolute',
    top: 25,
    left: 28,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.6,
  },
  microEmberDot2: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  microEmberTrail: {
    position: 'absolute',
    bottom: 25,
    right: 35,
    width: 20,
    height: 2,
    opacity: 0.5,
  },
  microSandDot1: {
    position: 'absolute',
    top: 30,
    left: 35,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.5,
  },
  microSandDot2: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  microSandCurve: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 40,
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    opacity: 0.4,
  },
  // Light layer elements
  lightRay1: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 80,
    height: 1,
    opacity: 0.4,
  },
  lightRay2: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    width: 60,
    height: 1,
    opacity: 0.3,
  },
  stadiumLight1: {
    position: 'absolute',
    top: 15,
    left: 20,
    width: 70,
    height: 2,
    opacity: 0.5,
  },
  stadiumLight2: {
    position: 'absolute',
    bottom: 20,
    right: 25,
    width: 55,
    height: 2,
    opacity: 0.4,
  },
  paperLight: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.3,
  },
  sunRay1: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 2,
    height: 50,
    opacity: 0.4,
  },
  sunRay2: {
    position: 'absolute',
    top: 20,
    left: 35,
    width: 2,
    height: 35,
    opacity: 0.3,
  },
  sunLight1: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 2,
    height: 50,
    opacity: 0.4,
  },
  sunLight2: {
    position: 'absolute',
    top: 20,
    left: 35,
    width: 2,
    height: 35,
    opacity: 0.3,
  },
  impactLight1: {
    position: 'absolute',
    top: 20,
    left: 25,
    width: 60,
    height: 2,
    transform: [{ rotate: '45deg' }],
    opacity: 0.6,
  },
  impactLight2: {
    position: 'absolute',
    bottom: 25,
    right: 30,
    width: 50,
    height: 2,
    transform: [{ rotate: '-35deg' }],
    opacity: 0.4,
  },
  goldShine1: {
    position: 'absolute',
    top: 12,
    left: 18,
    width: 75,
    height: 1,
    opacity: 0.5,
  },
  goldShine2: {
    position: 'absolute',
    bottom: 18,
    right: 22,
    width: 55,
    height: 1,
    opacity: 0.4,
  },
  techLight1: {
    position: 'absolute',
    top: 18,
    left: 22,
    width: 65,
    height: 1,
    opacity: 0.5,
  },
  techLight2: {
    position: 'absolute',
    bottom: 22,
    right: 28,
    width: 45,
    height: 1,
    opacity: 0.4,
  },
  softLight1: {
    position: 'absolute',
    top: 15,
    left: 25,
    width: 55,
    height: 1,
    opacity: 0.4,
  },
  softLight2: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 40,
    height: 1,
    opacity: 0.3,
  },
  vintageLight: {
    position: 'absolute',
    top: 20,
    left: 30,
    width: 50,
    height: 2,
    opacity: 0.4,
  },
  energyLight1: {
    position: 'absolute',
    top: 22,
    left: 28,
    width: 70,
    height: 1,
    opacity: 0.6,
  },
  energyLight2: {
    position: 'absolute',
    bottom: 28,
    right: 32,
    width: 55,
    height: 1,
    opacity: 0.5,
  },
  fireLight1: {
    position: 'absolute',
    top: 25,
    left: 30,
    width: 60,
    height: 2,
    transform: [{ rotate: '40deg' }],
    opacity: 0.6,
  },
  fireLight2: {
    position: 'absolute',
    bottom: 30,
    right: 35,
    width: 50,
    height: 2,
    transform: [{ rotate: '-30deg' }],
    opacity: 0.4,
  },
  emberLight1: {
    position: 'absolute',
    top: 20,
    left: 25,
    width: 55,
    height: 1,
    opacity: 0.5,
  },
  emberLight2: {
    position: 'absolute',
    bottom: 25,
    right: 30,
    width: 45,
    height: 1,
    opacity: 0.4,
  },
  // Edge highlights
  edgeHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.4,
  },
  edgeHighlightBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.4,
  },
  edgeHighlightLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 2,
    opacity: 0.3,
  },
  edgeHighlightRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 2,
    opacity: 0.3,
  },
  edgeHighlightDiagonal1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 2,
    transform: [{ rotate: '45deg' }],
    opacity: 0.4,
  },
  edgeHighlightDiagonal2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 100,
    height: 2,
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
});