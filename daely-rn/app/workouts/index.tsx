import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { type Activity, getActivities } from '@/services/activity-storage';
import { getCustomWorkoutTemplates, type CustomWorkoutTemplate } from '@/services/custom-workout-storage';
import PageHeader from '../components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { THEMES } from '@/constants/themes';

const CATEGORIES = ['Kracht', 'Hyrox', 'Calisthenics', 'Mobiliteit', 'Conditie', 'Herstel'] as const;
const WORKOUT_TRACKING_TYPES = new Set(['fitness', 'crossfit', 'zwaargewicht', 'hyrox', 'calisthenics']);

const RECOMMENDED_WORKOUTS = [
  {
    title: 'Full body kracht',
    description: 'Gebalanceerde sessie met compound lifts en gecontroleerde opbouw.',
    level: 'Beginner',
    icon: 'dumbbell' as const,
  },
  {
    title: 'Hyrox engine',
    description: 'Conditionele blokken met functionele stations en pace-focus.',
    level: 'Intermediate',
    icon: 'run-fast' as const,
  },
  {
    title: 'Mobiliteit reset',
    description: 'Rustige flow voor herstel, range of motion en blessurepreventie.',
    level: 'Advanced',
    icon: 'yoga' as const,
  },
];

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.max(1, Math.round((totalSeconds % 3600) / 60));
  if (hours > 0) {
    return `${hours}u ${minutes}m`;
  }
  return `${minutes} min`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function toMetricsSummary(activity: Activity): string | null {
  const parts: string[] = [];
  const workout = activity.metrics?.workout;
  const session = activity.metrics?.session;

  if (workout?.rounds !== undefined) parts.push(`${workout.rounds} rondes`);
  if (workout?.exercises?.length) parts.push(`${workout.exercises.length} oefeningen`);
  if (workout?.totalVolumeKg !== undefined) parts.push(`${Math.round(workout.totalVolumeKg)} kg volume`);
  if (session?.intensity) parts.push(`Intensiteit: ${session.intensity}`);

  return parts.length > 0 ? parts.slice(0, 2).join(' • ') : null;
}

function isWorkoutActivity(activity: Activity): boolean {
  return WORKOUT_TRACKING_TYPES.has(activity.trackingType.trim().toLowerCase());
}

// Helper to get theme-aware Classic Glow tokens (same as Today/Nutrition/Discipline)
function getClassicGlowTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';

  return {
    isClassic,
    gradient: isClassic ? ['#FFFFFF', '#F8FBFF', '#EFF6FF'] : isForce ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']) : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF']) : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0']) : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'],
    titleColor: isClassic ? '#0F172A' : (currentTheme.colors.auroraTitle || (isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : '#1E1B4B')),
    subtitleColor: isClassic ? '#475569' : (currentTheme.colors.auroraSubtitle || (isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : '#4A3A8C')),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
        : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)'])
        : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : undefined,
  };
}

export default function WorkoutsIndexScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeThemeId } = useAppContext();
  const { isClassic, gradient, titleColor, subtitleColor, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, shortcutBorderColor, shortcutShadowColor, shortcutIconBg, shortcutIconBorder } = getClassicGlowTokens(activeThemeId);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number] | null>(null);
  const [placeholderMessage, setPlaceholderMessage] = useState<string | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkoutTemplate[]>([]);

  useEffect(() => {
    let isMounted = true;

    getActivities()
      .then((items) => {
        if (!isMounted) return;
        const sorted = [...items].sort(
          (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime(),
        );
        setActivities(sorted.filter(isWorkoutActivity));
      })
      .catch(() => {
        if (!isMounted) return;
        setActivities([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCustomWorkoutTemplates()
      .then((templates) => {
        if (!isMounted) return;
        setCustomWorkouts(templates);
      })
      .catch(() => {
        if (!isMounted) return;
        setCustomWorkouts([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const recentWorkouts = useMemo(() => activities.slice(0, 3), [activities]);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Workouts"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.heroCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}>
          <View style={styles.heroCardInner}>
            {/* Background gradient - absolute full-cover */}
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCardBackground}
              pointerEvents="none"
            >
              {/* Top-left ribbon */}
              <LinearGradient
                colors={ribbonTop}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonTop}
                pointerEvents="none"
              />
              {/* Mid-card ribbon */}
              <LinearGradient
                colors={ribbonMid}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonMid}
                pointerEvents="none"
              />
              {/* Diagonal top-right ribbon */}
              <LinearGradient
                colors={ribbonBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonBlue}
                pointerEvents="none"
              />
              {/* Diagonal bottom-left ribbon */}
              <LinearGradient
                colors={ribbonRose}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.ribbonRose}
                pointerEvents="none"
              />
              {/* Right-side accent ribbon */}
              <LinearGradient
                colors={ribbonRight}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonRight}
                pointerEvents="none"
              />
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
            <View style={styles.heroCardContent}>
              <Text style={[styles.heroTitle, { color: titleColor }]}>Jouw workouts</Text>
              <Text style={[styles.heroText, { color: subtitleColor }]}>
                Vind trainingen, bouw routines en start direct je sessie.
              </Text>
            </View>
          </View>
        </View>

        {placeholderMessage ? (
          <View style={[styles.placeholderNotice, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.placeholderNoticeText, { color: theme.titleColor }]}>{placeholderMessage}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Snelle acties</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <Pressable
            style={[styles.actionCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}
            onPress={() => router.push('/tracker')}
          >
            <View style={styles.actionCardInner}>
              {/* Background gradient - absolute full-cover */}
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardBackground}
                pointerEvents="none"
              >
                {/* Top-left ribbon */}
                <LinearGradient
                  colors={ribbonTop}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonTop}
                  pointerEvents="none"
                />
                {/* Mid-card ribbon */}
                <LinearGradient
                  colors={ribbonMid}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonMid}
                  pointerEvents="none"
                />
                {/* Diagonal top-right ribbon */}
                <LinearGradient
                  colors={ribbonBlue}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonBlue}
                  pointerEvents="none"
                />
                {/* Diagonal bottom-left ribbon */}
                <LinearGradient
                  colors={ribbonRose}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionRibbonRose}
                  pointerEvents="none"
                />
                {/* Soft white highlight overlay */}
                <LinearGradient
                  colors={ribbonHighlight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionRibbonHighlight}
                  pointerEvents="none"
                />
              </LinearGradient>
              {/* Content layer - above background */}
              <View style={styles.actionCardContent}>
                <View style={[styles.actionIconBubble, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                  <MaterialCommunityIcons name="play-circle-outline" size={22} color={titleColor} />
                </View>
                <Text style={[styles.actionTitle, { color: titleColor }]}>Start activiteit</Text>
                <Text style={[styles.actionSubtitle, { color: subtitleColor }]}>Open DAELY Tracker</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}
            onPress={() => router.push('/activities')}
          >
            <View style={styles.actionCardInner}>
              {/* Background gradient - absolute full-cover */}
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardBackground}
                pointerEvents="none"
              >
                {/* Top-left ribbon */}
                <LinearGradient
                  colors={ribbonTop}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonTop}
                  pointerEvents="none"
                />
                {/* Mid-card ribbon */}
                <LinearGradient
                  colors={ribbonMid}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonMid}
                  pointerEvents="none"
                />
                {/* Diagonal top-right ribbon */}
                <LinearGradient
                  colors={ribbonBlue}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonBlue}
                  pointerEvents="none"
                />
                {/* Diagonal bottom-left ribbon */}
                <LinearGradient
                  colors={ribbonRose}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionRibbonRose}
                  pointerEvents="none"
                />
                {/* Soft white highlight overlay */}
                <LinearGradient
                  colors={ribbonHighlight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionRibbonHighlight}
                  pointerEvents="none"
                />
              </LinearGradient>
              {/* Content layer - above background */}
              <View style={styles.actionCardContent}>
                <View style={[styles.actionIconBubble, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                  <MaterialCommunityIcons name="history" size={22} color={titleColor} />
                </View>
                <Text style={[styles.actionTitle, { color: titleColor }]}>Bekijk activiteiten</Text>
                <Text style={[styles.actionSubtitle, { color: subtitleColor }]}>Zie je workout-log</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}
            onPress={() => setPlaceholderMessage('Workout schema\'s komen binnenkort.')}
          >
            <View style={styles.actionCardInner}>
              {/* Background gradient - absolute full-cover */}
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardBackground}
                pointerEvents="none"
              >
                {/* Top-left ribbon */}
                <LinearGradient
                  colors={ribbonTop}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonTop}
                  pointerEvents="none"
                />
                {/* Mid-card ribbon */}
                <LinearGradient
                  colors={ribbonMid}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonMid}
                  pointerEvents="none"
                />
                {/* Diagonal top-right ribbon */}
                <LinearGradient
                  colors={ribbonBlue}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionRibbonBlue}
                  pointerEvents="none"
                />
                {/* Diagonal bottom-left ribbon */}
                <LinearGradient
                  colors={ribbonRose}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionRibbonRose}
                  pointerEvents="none"
                />
                {/* Soft white highlight overlay */}
                <LinearGradient
                  colors={ribbonHighlight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionRibbonHighlight}
                  pointerEvents="none"
                />
              </LinearGradient>
              {/* Content layer - above background */}
              <View style={styles.actionCardContent}>
                <View style={[styles.actionIconBubble, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                  <MaterialCommunityIcons name="calendar-plus" size={22} color={titleColor} />
                </View>
                <Text style={[styles.actionTitle, { color: titleColor }]}>Maak workout schema</Text>
                <Text style={[styles.actionSubtitle, { color: subtitleColor }]}>Binnenkort</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Workout categorieen</Text>
        </View>
        <View style={styles.categoriesWrap}>
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active ? (isClassic ? '#2563EB' : theme.titleColor) : (isClassic ? '#FFFFFF' : theme.card),
                    borderColor: active ? (isClassic ? '#2563EB' : theme.titleColor) : shortcutBorderColor,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryLabel, { color: active ? '#FFFFFF' : titleColor }]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {customWorkouts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Mijn workouts</Text>
            </View>
            {customWorkouts.map((template) => (
              <Pressable
                key={template.id}
                style={[styles.customWorkoutCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.customWorkoutTop}>
                  <View style={styles.customWorkoutLeft}>
                    <Text style={[styles.customWorkoutTitle, { color: theme.titleColor }]}>
                      {template.title}
                    </Text>
                    {template.goal && (
                      <Text style={[styles.customWorkoutGoal, { color: theme.subtitleColor }]}>
                        {template.goal}
                      </Text>
                    )}
                    <Text style={[styles.customWorkoutMeta, { color: theme.subtitleColor }]}>
                      {template.exercises.length} oefeningen
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="dumbbell" size={24} color="#2563EB" />
                </View>
              </Pressable>
            ))}
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recente workout-activiteiten</Text>
        </View>
        {recentWorkouts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen workouts opgeslagen.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}> 
              Start je eerste workout met DAELY Tracker.
            </Text>
          </View>
        ) : (
          recentWorkouts.map((activity) => {
            const summary = toMetricsSummary(activity);
            return (
              <Pressable
                key={activity.id}
                style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() =>
                  router.push({
                    pathname: '/activities/[id]',
                    params: { id: activity.id },
                  })
                }
              >
                <View style={styles.activityTop}>
                  <Text style={[styles.activityName, { color: theme.titleColor }]} numberOfLines={1}>
                    {activity.disciplineName}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
                </View>
                <Text style={[styles.activityMeta, { color: theme.subtitleColor }]}> 
                  {formatDuration(activity.durationSeconds)} • {formatDate(activity.endedAt)}
                </Text>
                {summary ? (
                  <Text style={[styles.activitySummary, { color: theme.subtitleColor }]} numberOfLines={2}>
                    {summary}
                  </Text>
                ) : null}
              </Pressable>
            );
          })
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Aanbevolen workouts</Text>
        </View>
        <View style={styles.recommendationsWrap}>
          {RECOMMENDED_WORKOUTS.map((item) => (
            <View
              key={item.title}
              style={[styles.recommendationCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={styles.recommendationTop}>
                <MaterialCommunityIcons name={item.icon} size={20} color={theme.titleColor} />
                <Text style={[styles.levelPill, { color: theme.subtitleColor }]}>Niveau: {item.level}</Text>
              </View>
              <Text style={[styles.recommendationTitle, { color: theme.titleColor }]}>{item.title}</Text>
              <Text style={[styles.recommendationDescription, { color: theme.subtitleColor }]}> 
                {item.description}
              </Text>
              <Pressable
                style={[styles.viewButton, { borderColor: theme.border }]}
                onPress={() => setPlaceholderMessage('Workout schema\'s komen binnenkort.')}
              >
                <Text style={[styles.viewButtonLabel, { color: theme.titleColor }]}>Bekijken</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="disciplines" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  heroCardInner: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroCardBackground: {
    ...StyleSheet.absoluteFillObject,
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
  heroCardContent: {
    position: 'relative',
    zIndex: 1,
    padding: 18,
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  placeholderNotice: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  placeholderNoticeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  quickActionsGrid: {
    gap: 10,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 90,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardInner: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 90,
  },
  actionCardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  actionRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  actionRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  actionRibbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '25deg' }],
  },
  actionRibbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '-20deg' }],
  },
  actionRibbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionCardContent: {
    position: 'relative',
    zIndex: 1,
    padding: 14,
    gap: 5,
  },
  actionIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  customWorkoutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  customWorkoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customWorkoutLeft: {
    flex: 1,
  },
  customWorkoutTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  customWorkoutGoal: {
    fontSize: 13,
    marginBottom: 4,
  },
  customWorkoutMeta: {
    fontSize: 13,
  },
  activityCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  activityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  activityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  activityMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  activitySummary: {
    fontSize: 13,
    lineHeight: 19,
  },
  recommendationsWrap: {
    gap: 10,
  },
  recommendationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  recommendationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelPill: {
    fontSize: 12,
    fontWeight: '700',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recommendationDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  viewButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 24,
  },
});
