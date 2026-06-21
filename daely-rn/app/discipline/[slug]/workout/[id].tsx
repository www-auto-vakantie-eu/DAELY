import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../../../constants/sport-disciplines';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { THEMES } from '@/constants/themes';

// Helper to get theme-aware Aurora tokens
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

  return {
    auroraGradient: isClassic
      ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
      : isForce
        ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6'])
        : isSahara
          ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
          : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
          : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
          : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
          : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
          : isCoral ? (currentTheme.gradients.aurora || ['#FFF7F3', '#FFEDE7', '#FFD6C9'])
          : (currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF']),
    auroraTitle: isClassic ? '#0F172A' : (currentTheme.colors.auroraTitle || (isZen ? '#FFFFFF' : isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : '#1E1B4B')),
    auroraSubtitle: isClassic ? '#475569' : (currentTheme.colors.auroraSubtitle || (isZen ? '#B0B0B0' : isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : isCoral ? '#A95B5B' : '#4A3A8C')),
    auroraHighlight: currentTheme.colors.auroraHighlight || (isZen ? '#E5E7EB' : isRetro ? '#E8622A' : isSahara ? '#E7C99B' : isForce ? '#EF4444' : isSapphire ? '#93C5FD' : isRuby ? '#E45A7A' : isCoral ? '#F9736B' : '#6B5B95'),
    auroraAccent: currentTheme.colors.auroraAccent || (isRetro ? '#C0392B' : isSahara ? '#C89B72' : isForce ? '#DC2626' : isSapphire ? '#3B82F6' : isRuby ? '#B8325A' : isCoral ? '#E85D75' : '#8B7CF6'),
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
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
        : isSahara
          ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
          : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
          : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
          : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
          : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
          : isCoral ? ['rgba(255, 214, 201, 0.20)', 'rgba(255, 214, 201, 0.08)']
          : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
          : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
          : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
          : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
          : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
          : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara
          ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
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
        : isSahara
          ? ['rgba(232, 208, 176, 0.38)', 'rgba(255, 255, 255, 0.05)']
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
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Coral Bloom soft glow flag
    useSoftCoralGlow: isCoral,
    useThinLines: isSapphire,
    // New calm gemstone tokens for Sapphire
    facetLarge: isSapphire ? (currentTheme.colors.facetLarge || 'rgba(147, 197, 253, 0.08)') : undefined,
    facetMedium: isSapphire ? (currentTheme.colors.facetMedium || 'rgba(96, 165, 250, 0.06)') : undefined,
    sapphireGlow: isSapphire ? (currentTheme.colors.sapphireGlow || 'rgba(59, 130, 246, 0.16)') : undefined,
  };
}

export default function DisciplineWorkoutDetailScreen() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { activeThemeId } = useAppContext();
  const { auroraGradient, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, useThinLines, facetLarge, facetMedium, sapphireGlow } = getAuroraTokens(activeThemeId);

  const workout = React.useMemo(() => {
    if (!id || !slug) return null;
    const disciplineContent = DISCIPLINE_CONTENT[slug as keyof typeof DISCIPLINE_CONTENT];
    if (disciplineContent?.workouts) {
      return disciplineContent.workouts.find((w: any) => w.id === id);
    }
    return null;
  }, [id, slug]);

  const discipline = React.useMemo(() => {
    if (!slug) return null;
    return SPORT_DISCIPLINES.find(d => d.id === slug);
  }, [slug]);

  // Determine ribbon styles based on theme
  const ribbonStyleTop = useThinLines ? styles.thinRibbonTop : styles.ribbonTop;
  const ribbonStyleMid = useThinLines ? styles.thinRibbonMid : styles.ribbonMid;
  const ribbonStyleBlue = useThinLines ? styles.thinRibbonBlue : styles.ribbonBlue;
  const ribbonStyleRose = useThinLines ? styles.thinRibbonRose : styles.ribbonRose;
  const ribbonStyleRight = useThinLines ? styles.thinRibbonRight : styles.ribbonRight;

  if (!workout) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.titleColor }]}>Workout niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Deze workout kon niet worden geladen.
          </Text>
        </View>
      </AppScreen>
    );
  }

  const handleStartWorkout = () => {
    router.push({
      pathname: '/tracker/[disciplineId]/start',
      params: {
        disciplineId: slug,
        workoutId: id,
      },
    });
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Workout Summary Card */}
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={auroraGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCardGradient}
            >
              {/* Top-left ribbon */}
              <LinearGradient
                colors={ribbonTop}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ribbonStyleTop}
              />
              {/* Mid-card ribbon */}
              <LinearGradient
                colors={ribbonMid}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ribbonStyleMid}
              />
              {/* Periwinkle ribbon */}
              <LinearGradient
                colors={ribbonBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ribbonStyleBlue}
              />
              {/* Purple-pink ribbon */}
              <LinearGradient
                colors={ribbonRose}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={ribbonStyleRose}
              />
              {/* Right-side accent ribbon */}
              <LinearGradient
                colors={ribbonRight}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ribbonStyleRight}
              />
              {/* Calm gemstone effects for Sapphire theme - max 3 layers */}
              {useThinLines && sapphireGlow && (
                <View style={[styles.sapphireGlowOverlay, { backgroundColor: sapphireGlow }]} />
              )}
              {useThinLines && facetLarge && (
                <View style={[styles.facetLarge, { backgroundColor: facetLarge }]} />
              )}
              {useThinLines && facetMedium && (
                <View style={[styles.facetMedium, { backgroundColor: facetMedium }]} />
              )}
              {/* Subtle glass border for Sapphire theme */}
              {useThinLines && (
                <View style={styles.glassBorderOverlay} />
              )}
              {/* Soft white highlight */}
              <LinearGradient
                colors={ribbonHighlight}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.ribbonHighlight}
              />
              {/* Content layer */}
              <View style={styles.summaryCardContent}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }]}>
                  <MaterialCommunityIcons name={workout.icon as any} size={40} color={auroraSubtitle} />
                </View>

                <Text style={[styles.workoutName, { color: auroraTitle }]}>
                  {workout.name}
                </Text>

                <Text style={[styles.muscle, { color: auroraSubtitle }]}>
                  {workout.muscle}
                </Text>

                <View style={styles.metaContainer}>
                  <View style={styles.metaChip}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={auroraSubtitle} />
                    <Text style={[styles.metaText, { color: auroraSubtitle }]}>
                      {workout.duration}
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialCommunityIcons name="dumbbell" size={16} color={auroraSubtitle} />
                    <Text style={[styles.metaText, { color: auroraSubtitle }]}>
                      {workout.exercises} oefeningen
                    </Text>
                  </View>
                </View>

                {discipline && (
                  <View style={styles.disciplineContainer}>
                    <Text style={[styles.label, { color: auroraHighlight }]}>Discipline</Text>
                    <Text style={[styles.disciplineName, { color: auroraTitle }]}>
                      {discipline.name}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          {/* Start Workout CTA */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[auroraHighlight, auroraAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start workout</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.card, borderColor: auroraGradient[0] }]}
            onPress={() => router.push({
              pathname: '/messages/share',
              params: {
                linkedItemType: 'workout',
                linkedItemId: id,
                linkedItemTitle: workout.name,
              },
            })}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="share-outline" size={20} color={auroraHighlight} />
            <Text style={[styles.shareButtonText, { color: auroraHighlight }]}>Deel via berichten</Text>
          </TouchableOpacity>

          {/* Exercise List Placeholder */}
          <View style={[styles.placeholderContainer, { backgroundColor: theme.card, borderColor: auroraGradient[0] }]}>
            <View style={[styles.placeholderIcon, { backgroundColor: auroraGradient[0] }]}>
              <MaterialCommunityIcons name="information-outline" size={32} color={auroraHighlight} />
            </View>
            <Text style={[styles.placeholderTitle, { color: theme.titleColor }]}>
              De exacte oefenlijst
            </Text>
            <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>
              De exacte oefenlijst wordt binnenkort gekoppeld aan deze workout.
            </Text>
          </View>
        </View>
        <SharedBottomNav activeTab="disciplines" />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardGradient: {
    position: 'relative',
    overflow: 'hidden',
    padding: 20,
  },
  summaryCardContent: {
    position: 'relative',
    zIndex: 1,
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.20)',
    opacity: 1,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  workoutName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  muscle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disciplineContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  disciplineName: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
    borderWidth: 1.5,
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});