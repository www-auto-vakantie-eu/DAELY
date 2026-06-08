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

        {/* Layer 2: Atmosphere - ambient glow */}
        {renderAtmosphereGlow(theme.id, themeStyle)}

        {/* Layer 3: Motif - theme-specific shapes that match meaning */}
        {renderMotifLayer(theme.id, themeStyle)}

        {/* Layer 4: Motion/detail - lines, curves, particles, strokes */}
        {renderMotionLayer(theme.id, themeStyle)}

        {/* Layer 4: Material/texture simulation */}
        {renderTextureLayer(theme.id, themeStyle)}

        {/* Layer 5: Lighting - theme-specific light effects */}
        {renderLightingLayer(theme.id, themeStyle)}

        {/* Layer 5: UI polish - title */}
        <Text style={[styles.title, { color: themeStyle.titleColor, textShadowColor: themeStyle.textShadowColor, textShadowOffset: themeStyle.textShadowOffset, textShadowRadius: themeStyle.textShadowRadius }]}>
          {theme.name}
        </Text>

        {/* Layer 5: UI polish - accent line */}
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLineBase, { backgroundColor: themeStyle.lineBaseColor }]} />
          <View style={[styles.accentLineFill, { backgroundColor: theme.tabBarActive }]} />
          <View style={[styles.accentLineGlow, { backgroundColor: themeStyle.accentGlowColor }]} />
        </View>

        {/* Layer 5: UI polish - inner border */}
        {renderInnerBorder(theme.id, themeStyle)}

        {/* Layer 5: UI polish - selected state */}
        {isActive && (
          <View style={[styles.checkRing, { borderColor: theme.tabBarActive, backgroundColor: themeStyle.checkBg }]}>
            <View style={[styles.checkCircle, { backgroundColor: theme.tabBarActive }]}>
              <MaterialCommunityIcons name="check" size={16} color={themeStyle.checkColor} />
            </View>
          </View>
        )}
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
    },
    'classic': {
      // Base material: deep navy performance with blue glow
      gradientColors: ['#1E3A8A', '#1D4ED8', '#2563EB'],
      innerShadowColors: ['rgba(0,0,0,0.35)', 'rgba(59, 130, 246, 0.15)', 'rgba(0,0,0,0.1)'],
      titleColor: '#FFFFFF',
      checkColor: '#FFFFFF',
      checkBg: 'rgba(0,0,0,0.4)',
      lineBaseColor: 'rgba(255,255,255,0.18)',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      primaryColor: '#3B82F6',
      secondaryColor: '#60A5FA',
      atmosphereColor: 'rgba(59, 130, 246, 0.35)',
      motifColor: 'rgba(96, 165, 250, 0.4)',
      motionColor: 'rgba(59, 130, 246, 0.5)',
      textureColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(96, 165, 250, 0.5)',
      lightingColor: 'rgba(147, 197, 253, 0.3)',
      accentGlowColor: 'rgba(59, 130, 246, 0.5)',
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
    },
  };
  return styles[themeId] || styles['default'];
}

function renderAtmosphereGlow(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, top: -20, left: 20 }]} />;
    case 'classic':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -25, right: -15 }]} />;
    case 'zen-ink':
      return null;
    case 'forest-breath':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, top: -15, left: -10 }]} />;
    case 'force':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -30, left: -20 }]} />;
    case 'pure-luxury':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, top: -25, right: -20 }]} />;
    case 'innovation':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -20, right: -15 }]} />;
    case 'pastel-calm':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, top: -15, right: -10 }]} />;
    case 'retro-sport':
      return null;
    case 'pulse':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -25, left: -15 }]} />;
    case 'rogue':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -30, right: -20 }]} />;
    case 'ember':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, bottom: -25, right: -18 }]} />;
    case 'dune':
      return <View style={[styles.atmosphereGlow, { backgroundColor: style.atmosphereColor, top: -20, right: -15 }]} />;
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

function renderTextureLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return <View style={[styles.glassTexture, { backgroundColor: style.textureColor }]} />;
    case 'classic':
      return <View style={[styles.sportTexture, { backgroundColor: style.textureColor }]} />;
    case 'zen-ink':
      return <View style={[styles.paperTexture, { backgroundColor: style.textureColor }]} />;
    case 'forest-breath':
      return <View style={[styles.leafTexture, { backgroundColor: style.textureColor }]} />;
    case 'force':
      return <View style={[styles.gritTexture, { backgroundColor: style.textureColor }]} />;
    case 'pure-luxury':
      return <View style={[styles.metallicTexture, { backgroundColor: style.textureColor }]} />;
    case 'innovation':
      return <View style={[styles.gridTexture, { backgroundColor: style.textureColor }]} />;
    case 'pastel-calm':
      return <View style={[styles.pearlTexture, { backgroundColor: style.textureColor }]} />;
    case 'retro-sport':
      return <View style={[styles.fabricTexture, { backgroundColor: style.textureColor }]} />;
    case 'pulse':
      return <View style={[styles.glassDarkTexture, { backgroundColor: style.textureColor }]} />;
    case 'rogue':
      return <View style={[styles.metallicDarkTexture, { backgroundColor: style.textureColor }]} />;
    case 'ember':
      return <View style={[styles.smokeTexture, { backgroundColor: style.textureColor }]} />;
    case 'dune':
      return <View style={[styles.grainTexture, { backgroundColor: style.textureColor }]} />;
    default:
      return null;
  }
}

function renderLightingLayer(themeId: string, style: any) {
  switch (themeId) {
    case 'default':
      return (
        <>
          <View style={[styles.diagonalLight, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.topLightGlow, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'classic':
      return (
        <>
          <View style={[styles.blueLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.edgeLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'zen-ink':
      return (
        <>
          <View style={[styles.paperLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.subtleLightEdge, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'forest-breath':
      return (
        <>
          <View style={[styles.greenLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.leafLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'force':
      return (
        <>
          <View style={[styles.redLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.powerLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pure-luxury':
      return (
        <>
          <View style={[styles.goldLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.shimmerEffect, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'innovation':
      return (
        <>
          <View style={[styles.cyanLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.techLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pastel-calm':
      return (
        <>
          <View style={[styles.pastelLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.softLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'retro-sport':
      return (
        <>
          <View style={[styles.vintageLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.stripeLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'pulse':
      return (
        <>
          <View style={[styles.limeLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.energyLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'rogue':
      return (
        <>
          <View style={[styles.orangeLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.fireLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'ember':
      return (
        <>
          <View style={[styles.warmLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.heatLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    case 'dune':
      return (
        <>
          <View style={[styles.sunLightGlow, { backgroundColor: style.lightingColor }]} />
          <View style={[styles.sandLight, { backgroundColor: style.lightingColor }]} />
        </>
      );
    default:
      return null;
  }
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
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 2,
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
  // Lighting effects
  diagonalLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 2,
    transform: [{ rotate: '-25deg' }],
    opacity: 0.6,
  },
  topLightGlow: {
    position: 'absolute',
    top: -10,
    left: 20,
    width: 80,
    height: 40,
    borderRadius: 20,
    opacity: 0.4,
  },
  blueLightGlow: {
    position: 'absolute',
    bottom: -15,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  edgeLight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 3,
    height: '100%',
    opacity: 0.4,
  },
  paperLightGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  subtleLightEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 2,
    height: '100%',
    opacity: 0.2,
  },
  greenLightGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.5,
  },
  leafLight: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 25,
    height: 25,
    borderRadius: 13,
    opacity: 0.4,
  },
  redLightGlow: {
    position: 'absolute',
    bottom: -20,
    left: -15,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.5,
  },
  powerLight: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.4,
  },
  goldLightGlow: {
    position: 'absolute',
    top: -18,
    right: -18,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.4,
  },
  shimmerEffect: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 60,
    height: 1,
    opacity: 0.6,
  },
  cyanLightGlow: {
    position: 'absolute',
    bottom: -15,
    right: -12,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  techLight: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.4,
  },
  pastelLightGlow: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.5,
  },
  softLight: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 35,
    height: 35,
    borderRadius: 18,
    opacity: 0.4,
  },
  vintageLightGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.4,
  },
  stripeLight: {
    position: 'absolute',
    top: 35,
    left: 25,
    width: 40,
    height: 2,
    opacity: 0.5,
  },
  limeLightGlow: {
    position: 'absolute',
    bottom: -18,
    left: -15,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  energyLight: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 25,
    height: 25,
    borderRadius: 13,
    opacity: 0.5,
  },
  orangeLightGlow: {
    position: 'absolute',
    bottom: -20,
    right: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.5,
  },
  fireLight: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.4,
  },
  warmLightGlow: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 95,
    height: 95,
    borderRadius: 48,
    opacity: 0.5,
  },
  heatLight: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 22,
    height: 22,
    borderRadius: 11,
    opacity: 0.4,
  },
  sunLightGlow: {
    position: 'absolute',
    top: -15,
    right: -12,
    width: 85,
    height: 85,
    borderRadius: 43,
    opacity: 0.5,
  },
  sandLight: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.4,
  },
});