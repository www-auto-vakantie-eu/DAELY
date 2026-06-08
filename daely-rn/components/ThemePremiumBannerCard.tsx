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
    'zen-ink': {
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
    'forest-breath': {
      // Base material: organic green with mist and depth
      gradientColors: ['#D1FAE5', '#A7F3D0', '#6EE7B7'],
      innerShadowColors: ['rgba(5, 150, 105, 0.05)', 'rgba(6, 78, 59, 0.04)', 'rgba(0,0,0,0.08)'],
      titleColor: '#064E3B',
      checkColor: '#064E3B',
      checkBg: 'rgba(255,255,255,0.92)',
      lineBaseColor: 'rgba(6, 78, 59, 0.15)',
      textShadowColor: 'rgba(5, 150, 105, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      primaryColor: '#059669',
      secondaryColor: '#34D399',
      atmosphereColor: 'rgba(5, 150, 105, 0.2)',
      motifColor: 'rgba(52, 211, 153, 0.28)',
      motionColor: 'rgba(5, 150, 105, 0.32)',
      textureColor: 'rgba(5, 150, 105, 0.08)',
      borderColor: 'rgba(5, 150, 105, 0.4)',
      lightingColor: 'rgba(167, 243, 208, 0.4)',
      accentGlowColor: 'rgba(52, 211, 153, 0.35)',
      // New layer properties
      materialColor: 'rgba(5, 150, 105, 0.06)',
      depthColor1: 'rgba(52, 211, 153, 0.08)',
      depthColor2: 'rgba(5, 150, 105, 0.12)',
      microColor: 'rgba(167, 243, 208, 0.2)',
      edgeColor: 'rgba(52, 211, 153, 0.3)',
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
    'pure-luxury': {
      // Base material: matte black with brushed gold
      gradientColors: ['#0A0A0A', '#0D0D0D', '#1A1A1A'],
      innerShadowColors: ['rgba(201,168,76,0.2)', 'rgba(201,168,76,0.1)', 'rgba(0,0,0,0.3)'],
      titleColor: '#E8C97A',
      checkColor: '#E8C97A',
      checkBg: 'rgba(0,0,0,0.5)',
      lineBaseColor: 'rgba(201, 168, 76, 0.2)',
      textShadowColor: 'rgba(201, 168, 76, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
      primaryColor: '#C9A84C',
      secondaryColor: '#FCD34D',
      atmosphereColor: 'rgba(201, 168, 76, 0.18)',
      motifColor: 'rgba(252, 211, 77, 0.28)',
      motionColor: 'rgba(201, 168, 76, 0.32)',
      textureColor: 'rgba(201, 168, 76, 0.08)',
      borderColor: 'rgba(201, 168, 76, 0.45)',
      lightingColor: 'rgba(252, 211, 77, 0.25)',
      accentGlowColor: 'rgba(201, 168, 76, 0.5)',
      // New layer properties
      materialColor: 'rgba(201, 168, 76, 0.1)',
      depthColor1: 'rgba(252, 211, 77, 0.12)',
      depthColor2: 'rgba(201, 168, 76, 0.18)',
      microColor: 'rgba(252, 211, 77, 0.3)',
      edgeColor: 'rgba(252, 211, 77, 0.4)',
    },
    'innovation': {
      // Base material: dark tech surface with cyan glow
      gradientColors: ['#0F172A', '#0A0F1E', '#111827'],
      innerShadowColors: ['rgba(0,245,160,0.18)', 'rgba(56, 189, 248, 0.08)', 'rgba(0,0,0,0.25)'],
      titleColor: '#E0FFF5',
      checkColor: '#0A0F1E',
      checkBg: 'rgba(0,245,160,0.35)',
      lineBaseColor: 'rgba(0, 245, 160, 0.2)',
      textShadowColor: 'rgba(0, 245, 160, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#00F5A0',
      secondaryColor: '#38BDF8',
      atmosphereColor: 'rgba(0, 245, 160, 0.15)',
      motifColor: 'rgba(56, 189, 248, 0.25)',
      motionColor: 'rgba(0, 245, 160, 0.32)',
      textureColor: 'rgba(0, 245, 160, 0.08)',
      borderColor: 'rgba(0, 245, 160, 0.45)',
      lightingColor: 'rgba(56, 189, 248, 0.2)',
      accentGlowColor: 'rgba(0, 245, 160, 0.5)',
      // New layer properties
      materialColor: 'rgba(0, 245, 160, 0.08)',
      depthColor1: 'rgba(56, 189, 248, 0.1)',
      depthColor2: 'rgba(0, 245, 160, 0.15)',
      microColor: 'rgba(56, 189, 248, 0.25)',
      edgeColor: 'rgba(0, 245, 160, 0.35)',
    },
    'pastel-calm': {
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
    'retro-sport': {
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
    'pulse': {
      // Base material: dark glass with lime energy
      gradientColors: ['#0D1A00', '#0A1A00', '#112200'],
      innerShadowColors: ['rgba(127,255,0,0.22)', 'rgba(127,255,0,0.1)', 'rgba(0,0,0,0.3)'],
      titleColor: '#ADFF2F',
      checkColor: '#0A1A00',
      checkBg: 'rgba(127,255,0,0.35)',
      lineBaseColor: 'rgba(127, 255, 0, 0.2)',
      textShadowColor: 'rgba(127, 255, 0, 0.7)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#84CC16',
      secondaryColor: '#A3E635',
      atmosphereColor: 'rgba(127, 255, 0, 0.22)',
      motifColor: 'rgba(163, 230, 53, 0.32)',
      motionColor: 'rgba(127, 255, 0, 0.38)',
      textureColor: 'rgba(127, 255, 0, 0.08)',
      borderColor: 'rgba(127, 255, 0, 0.5)',
      lightingColor: 'rgba(163, 230, 53, 0.2)',
      accentGlowColor: 'rgba(127, 255, 0, 0.5)',
      // New layer properties
      materialColor: 'rgba(127, 255, 0, 0.1)',
      depthColor1: 'rgba(163, 230, 53, 0.15)',
      depthColor2: 'rgba(127, 255, 0, 0.2)',
      microColor: 'rgba(163, 230, 53, 0.3)',
      edgeColor: 'rgba(163, 230, 53, 0.4)',
    },
    'rogue': {
      // Base material: dark charcoal with orange aggression
      gradientColors: ['#0A0800', '#0D0A00', '#1A1200'],
      innerShadowColors: ['rgba(255,106,0,0.25)', 'rgba(255,106,0,0.12)', 'rgba(0,0,0,0.35)'],
      titleColor: '#FFB347',
      checkColor: '#0D0A00',
      checkBg: 'rgba(255,106,0,0.35)',
      lineBaseColor: 'rgba(255, 106, 0, 0.22)',
      textShadowColor: 'rgba(255, 106, 0, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#FF6A00',
      secondaryColor: '#FB923C',
      atmosphereColor: 'rgba(255, 106, 0, 0.28)',
      motifColor: 'rgba(251, 146, 60, 0.38)',
      motionColor: 'rgba(255, 106, 0, 0.42)',
      textureColor: 'rgba(255, 106, 0, 0.1)',
      borderColor: 'rgba(255, 106, 0, 0.55)',
      lightingColor: 'rgba(251, 146, 60, 0.2)',
      accentGlowColor: 'rgba(255, 106, 0, 0.5)',
      // New layer properties
      materialColor: 'rgba(255, 106, 0, 0.12)',
      depthColor1: 'rgba(251, 146, 60, 0.15)',
      depthColor2: 'rgba(255, 106, 0, 0.22)',
      microColor: 'rgba(251, 146, 60, 0.35)',
      edgeColor: 'rgba(251, 146, 60, 0.45)',
    },
    'ember': {
      // Base material: warm dark with glowing embers
      gradientColors: ['#0A0300', '#0A0500', '#150900'],
      innerShadowColors: ['rgba(255,140,0,0.22)', 'rgba(255,140,0,0.1)', 'rgba(0,0,0,0.3)'],
      titleColor: '#FFD700',
      checkColor: '#0A0500',
      checkBg: 'rgba(255,140,0,0.35)',
      lineBaseColor: 'rgba(255, 140, 0, 0.2)',
      textShadowColor: 'rgba(255, 140, 0, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#F97316',
      secondaryColor: '#FB923C',
      atmosphereColor: 'rgba(255, 140, 0, 0.25)',
      motifColor: 'rgba(251, 146, 60, 0.35)',
      motionColor: 'rgba(255, 140, 0, 0.38)',
      textureColor: 'rgba(255, 140, 0, 0.08)',
      borderColor: 'rgba(255, 140, 0, 0.5)',
      lightingColor: 'rgba(251, 146, 60, 0.2)',
      accentGlowColor: 'rgba(255, 140, 0, 0.5)',
      // New layer properties
      materialColor: 'rgba(255, 140, 0, 0.1)',
      depthColor1: 'rgba(251, 146, 60, 0.12)',
      depthColor2: 'rgba(255, 140, 0, 0.18)',
      microColor: 'rgba(251, 146, 60, 0.3)',
      edgeColor: 'rgba(251, 146, 60, 0.4)',
    },
    'dune': {
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
  };
  return styles[themeId] || styles['default'];
}

function renderMaterialLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return <View style={[styles.glassMaterial, { backgroundColor: style.materialColor }]} />;
    case 'classic':
      return <View style={[styles.sportMaterial, { backgroundColor: style.materialColor }]} />;
    case 'zen-ink':
      return <View style={[styles.paperMaterial, { backgroundColor: style.materialColor }]} />;
    case 'forest-breath':
      return <View style={[styles.organicMaterial, { backgroundColor: style.materialColor }]} />;
    case 'force':
      return <View style={[styles.performanceMaterial, { backgroundColor: style.materialColor }]} />;
    case 'pure-luxury':
      return <View style={[styles.luxuryMaterial, { backgroundColor: style.materialColor }]} />;
    case 'innovation':
      return <View style={[styles.techMaterial, { backgroundColor: style.materialColor }]} />;
    case 'pastel-calm':
      return <View style={[styles.softMaterial, { backgroundColor: style.materialColor }]} />;
    case 'retro-sport':
      return <View style={[styles.vintageMaterial, { backgroundColor: style.materialColor }]} />;
    case 'pulse':
      return <View style={[styles.energyMaterial, { backgroundColor: style.materialColor }]} />;
    case 'rogue':
      return <View style={[styles.aggressiveMaterial, { backgroundColor: style.materialColor }]} />;
    case 'ember':
      return <View style={[styles.warmMaterial, { backgroundColor: style.materialColor }]} />;
    case 'dune':
      return <View style={[styles.sandMaterial, { backgroundColor: style.materialColor }]} />;
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
    case 'zen-ink':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'forest-breath':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'force':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'pure-luxury':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'innovation':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'pastel-calm':
      return (
        <LinearGradient colors={[style.depthColor1, 'transparent', style.depthColor2]} style={styles.depthGradientFull} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'retro-sport':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
      );
    case 'pulse':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'rogue':
      return (
        <LinearGradient colors={[style.depthColor1, style.depthColor2, 'transparent']} style={styles.depthGradientDiagonal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      );
    case 'ember':
      return (
        <LinearGradient colors={['transparent', style.depthColor1, style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
      );
    case 'dune':
      return (
        <>
          <LinearGradient colors={[style.depthColor1, 'transparent']} style={styles.depthGradientTop} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={['transparent', style.depthColor2]} style={styles.depthGradientBottom} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </>
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
    case 'zen-ink':
      return (
        <>
          <View style={[styles.inkWashLarge, { backgroundColor: style.motifColor }]} />
          <View style={[styles.inkWashSmall, { backgroundColor: style.motifColor }]} />
          <View style={[styles.asymmetricCircle, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.leafCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.leafFloating, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sunRay, { backgroundColor: style.motifColor }]} />
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
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.goldDiagonal, { backgroundColor: style.motifColor }]} />
          <View style={[styles.luxuryOrnament, { backgroundColor: style.motifColor }]} />
          <View style={[styles.goldParticle, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.circuitGrid, { backgroundColor: style.motifColor }]} />
          <View style={[styles.dataNode, { backgroundColor: style.motifColor }]} />
          <View style={[styles.techOrb, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <>
          <View style={[styles.pearlCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.softOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.calmDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'retro-sport':
      return (
        <>
          <View style={[styles.vintageStripeMain, { backgroundColor: style.motifColor }]} />
          <View style={[styles.vintageStripeSub, { backgroundColor: style.secondaryColor }]} />
          <View style={[styles.badgeRetro, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.heartbeatCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.pulseOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.rhythmDot, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.aggressionSlash, { backgroundColor: style.motifColor }]} />
          <View style={[styles.fireOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sparkRing, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'ember':
      return (
        <>
          <View style={[styles.warmthCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.emberOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.glowParticle, { backgroundColor: style.motifColor }]} />
        </>
      );
    case 'dune':
      return (
        <>
          <View style={[styles.duneCurve, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sunOrb, { backgroundColor: style.motifColor }]} />
          <View style={[styles.sandDot, { backgroundColor: style.motifColor }]} />
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
    case 'zen-ink':
      return (
        <>
          <View style={[styles.brushLineLong, { backgroundColor: style.motionColor }]} />
          <View style={[styles.brushLineShort, { backgroundColor: style.motionColor }]} />
          <View style={[styles.inkDot, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.breathWave, { backgroundColor: style.motionColor }]} />
          <View style={[styles.leafTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.natureParticle, { backgroundColor: style.motionColor }]} />
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
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.goldLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.shimmerLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.luxuryDot, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.circuitTrace, { backgroundColor: style.motionColor }]} />
          <View style={[styles.scanLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.techParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <>
          <View style={[styles.waveLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.bubbleTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.calmParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'retro-sport':
      return (
        <>
          <View style={[styles.racingLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.vintageDot, { backgroundColor: style.motionColor }]} />
          <View style={[styles.halftonePattern, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.ecgLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.pulseLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.energyParticlePulse, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.energySlash, { backgroundColor: style.motionColor }]} />
          <View style={[styles.fireLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.sparkParticleRogue, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'ember':
      return (
        <>
          <View style={[styles.heatTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.smokeLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.emberParticle, { backgroundColor: style.motionColor }]} />
        </>
      );
    case 'dune':
      return (
        <>
          <View style={[styles.windLine, { backgroundColor: style.motionColor }]} />
          <View style={[styles.duneTrail, { backgroundColor: style.motionColor }]} />
          <View style={[styles.sandParticle, { backgroundColor: style.motionColor }]} />
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
    case 'zen-ink':
      return (
        <View style={[styles.paperLight, { backgroundColor: style.lightingColor }]} />
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.sunRay1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.sunRay2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.impactLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.impactLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.goldShine1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.goldShine2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.techLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.techLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <>
          <View style={[styles.softLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.softLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'retro-sport':
      return (
        <View style={[styles.vintageLight, { backgroundColor: style.lightingColor }]} />
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.energyLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.energyLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.fireLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.fireLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'ember':
      return (
        <>
          <View style={[styles.emberLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.emberLight2, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'dune':
      return (
        <>
          <View style={[styles.sunLight1, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.sunLight2, { backgroundColor: style.lightingColor }]} />
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
    case 'zen-ink':
      return (
        <>
          <View style={[styles.microDotZen1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microLineZen, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.microDotForest1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotForest2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCurveForest, { backgroundColor: style.microColor }]} />
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
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.microGoldLine1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microGoldLine2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotLuxury, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.microNode1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microNode2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microCircuitLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <>
          <View style={[styles.microBubble1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microBubble2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSoftCurve, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'retro-sport':
      return (
        <>
          <View style={[styles.microDotRetro1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microDotRetro2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microRetroLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.microPulseDot1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microPulseDot2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microPulseLine, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.microRogueSlash1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microRogueSlash2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSpark, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'ember':
      return (
        <>
          <View style={[styles.microEmberDot1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microEmberDot2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microEmberTrail, { backgroundColor: style.microColor }]} />
        </>
      );
    case 'dune':
      return (
        <>
          <View style={[styles.microSandDot1, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSandDot2, { backgroundColor: style.microColor }]} />
          <View style={[styles.microSandCurve, { backgroundColor: style.microColor }]} />
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
    case 'zen-ink':
      return (
        <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
      );
    case 'retro-sport':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightBottom, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.edgeHighlightLeft, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.edgeHighlightDiagonal1, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightDiagonal2, { backgroundColor: style.edgeColor }]} />
        </>
      );
    case 'ember':
      return (
        <View style={[styles.edgeHighlightBottom, { backgroundColor: style.edgeColor }]} />
      );
    case 'dune':
      return (
        <>
          <View style={[styles.edgeHighlightTop, { backgroundColor: style.edgeColor }]} />
          <View style={[styles.edgeHighlightRight, { backgroundColor: style.edgeColor }]} />
        </>
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
    case 'zen-ink':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
        </View>
      );
    case 'forest-breath':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
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
    case 'pure-luxury':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'innovation':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'pastel-calm':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'retro-sport':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
        </View>
      );
    case 'pulse':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'rogue':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'ember':
      return (
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: style.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: style.accentGlowColor }]} />
        </View>
      );
    case 'dune':
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