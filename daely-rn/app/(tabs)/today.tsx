import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ImageBackground, useWindowDimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { ACTIVITY_TYPE_LABELS } from '@/constants/workout-activities';

function formatTodayLabel(): string {
  const now = new Date();
  return now.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

const WEEK_TREND = [58, 72, 64, 81, 75, 88, 70];

const MACRO_DISTRIBUTION = [
  { label: 'Eiwit', value: 72, color: '#3B82F6' },
  { label: 'Koolhydraten', value: 64, color: '#10B981' },
  { label: 'Vetten', value: 51, color: '#F59E0B' },
];

const TODAY_SWIPES = [
  {
    title: 'Welkom terug ...',
    subtitle: 'Vandaag ligt er weer een sterke sessie voor je klaar.',
    badge: 'DAELY TODAY',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Hydrateer slim',
    subtitle: 'Je hydratatie staat op 71%. Nog 2 glazen tot je dagdoel.',
    badge: 'FOCUS',
    image:
      'https://images.unsplash.com/photo-1532634896-26909d0d4b6b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Mindset momentum',
    subtitle: 'Pak 8 minuten ademhaling voor maximale focus.',
    badge: 'MIND',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function TodayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const todayLabel = formatTodayLabel();
  const { workoutActivities, isAppHydrated } = useAppContext();
  const heroSlideWidth = Math.max(width - 32, 280);
  const todayIsoDate = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const mo = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${mo}-${day}`;
  }, []);
  const todayWorkouts = useMemo(
    () => workoutActivities.filter((a) => a.dateIso.startsWith(todayIsoDate)),
    [workoutActivities, todayIsoDate],
  );

  const handleStartWorkout = () => {
    if (todayWorkouts.length > 0) {
      router.push(`/workouts/${todayWorkouts[0].id}` as any);
    } else {
      router.push('/workouts');
    }
  };

  const handleHeroScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / heroSlideWidth);
    setActiveHeroSlide(Math.min(Math.max(nextIndex, 0), TODAY_SWIPES.length - 1));
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.titleColor }]}>Vandaag.</Text>
          <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>{todayLabel.toUpperCase()}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.settingsPill,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed ? styles.settingsPillPressed : null,
            ]}
            onPress={() => router.push('/workouts/calendar')}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={20} color={theme.titleColor} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingsPill,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed ? styles.settingsPillPressed : null,
            ]}
            onPress={() => router.push('/(tabs)/athlete')}
          >
            <MaterialCommunityIcons name="cog-outline" size={20} color={theme.titleColor} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingsPill,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed ? styles.settingsPillPressed : null,
            ]}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <MaterialCommunityIcons name="shopping-outline" size={20} color={theme.titleColor} />
          </Pressable>
        </View>
      </View>

      <View style={styles.heroCarouselWrap}>
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToInterval={heroSlideWidth}
          snapToAlignment="start"
          onMomentumScrollEnd={handleHeroScrollEnd}
          contentContainerStyle={styles.heroCarouselContent}
        >
          {TODAY_SWIPES.map((slide) => (
            <ImageBackground
              key={slide.title}
              source={{ uri: slide.image }}
              imageStyle={styles.heroSlideImage}
              style={[styles.heroSlideCard, { width: heroSlideWidth }]}
            >
              <View style={styles.heroSlideOverlay}>
                <Text style={styles.heroSlideBadge}>{slide.badge}</Text>
                <Text style={styles.heroSlideTitle}>{slide.title}</Text>
                <Text style={styles.heroSlideSubtitle}>{slide.subtitle}</Text>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>
        <View style={styles.heroDotsRow}>
          {TODAY_SWIPES.map((slide, index) => (
            <View
              key={`${slide.title}-dot`}
              style={[styles.heroDot, index === activeHeroSlide ? styles.heroDotActive : null]}
            />
          ))}
        </View>
      </View>

      <View style={styles.heroButtonWrap}>
        <Pressable
          style={styles.heroButton}
          onPress={handleStartWorkout}
        >
          <MaterialCommunityIcons name="play-circle-outline" size={22} color="#fff" />
          <Text style={styles.heroButtonText}>
            Start Workout{todayWorkouts.length > 0 ? ' (gepland)' : ''}
          </Text>
        </Pressable>
      </View>

      <View style={styles.quickKeysWrap}>
        <Pressable style={[styles.quickKeyButton, { backgroundColor: '#0EA5E9' }]} onPress={() => router.push('/nutrition/scan')}>
          <MaterialCommunityIcons name="barcode-scan" size={16} color="#FFFFFF" />
          <Text style={styles.quickKeyText}>Barcode Scannen</Text>
        </Pressable>
        <Pressable style={[styles.quickKeyButton, { backgroundColor: '#16A34A' }]} onPress={() => router.push('/nutrition/add')}>
          <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.quickKeyText}>Snel Toevoegen</Text>
        </Pressable>
        <Pressable style={[styles.quickKeyButton, { backgroundColor: '#2563EB' }]} onPress={() => router.push('/nutrition/compare')}>
          <MaterialCommunityIcons name="scale-balance" size={16} color="#FFFFFF" />
          <Text style={styles.quickKeyText}>Vergelijk Eten</Text>
        </Pressable>
        <Pressable style={[styles.quickKeyButton, { backgroundColor: '#F59E0B' }]} onPress={() => router.push('/my-nutrition')}>
          <MaterialCommunityIcons name="notebook-outline" size={16} color="#FFFFFF" />
          <Text style={styles.quickKeyText}>Mijn Voeding</Text>
        </Pressable>
        <Pressable style={[styles.quickKeyButton, { backgroundColor: '#4B5563' }]} onPress={() => router.push('/(tabs)/nutrition')}>
          <MaterialCommunityIcons name="food-apple-outline" size={16} color="#FFFFFF" />
          <Text style={styles.quickKeyText}>Voeding Overzicht</Text>
        </Pressable>
      </View>

      <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.progressLabel, { color: theme.subtitleColor }]}>DAGVOORTGANG</Text>
        <Text style={[styles.progressValue, { color: theme.titleColor }]}>2 / 5 taken voltooid</Text>
        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>STATISTIEKEN VANDAAG</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>8.4k</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Stappen</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>612</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Actieve kcal</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>71%</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Hydratatie</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>7u 24m</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Slaap</Text>
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: theme.titleColor }]}>Weektrend Belastbaarheid</Text>
          <Text style={[styles.chartMeta, { color: theme.subtitleColor }]}>Laatste 7 dagen</Text>
        </View>
        <View style={styles.trendBarsRow}>
          {WEEK_TREND.map((value, index) => (
            <View key={`trend-${index}`} style={styles.trendBarColumn}>
              <View style={styles.trendBarTrack}>
                <View style={[styles.trendBarFill, { height: `${value}%` }]} />
              </View>
              <Text style={[styles.trendDayLabel, { color: theme.subtitleColor }]}>
                {['M', 'D', 'W', 'D', 'V', 'Z', 'Z'][index]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: theme.titleColor }]}>Macro en Herstel</Text>
          <Text style={[styles.chartMeta, { color: theme.subtitleColor }]}>Dagdoelen</Text>
        </View>
        {MACRO_DISTRIBUTION.map((macro) => (
          <View key={macro.label} style={styles.macroRow}>
            <View style={styles.macroLabelWrap}>
              <View style={[styles.macroDot, { backgroundColor: macro.color }]} />
              <Text style={[styles.macroLabel, { color: theme.titleColor }]}>{macro.label}</Text>
            </View>
            <Text style={[styles.macroPercent, { color: theme.subtitleColor }]}>{macro.value}%</Text>
            <View style={styles.macroTrack}>
              <View style={[styles.macroFill, { width: `${macro.value}%`, backgroundColor: macro.color }]} />
            </View>
          </View>
        ))}

        <View style={[styles.recoveryCard, { borderColor: theme.border }]}>
          <View>
            <Text style={[styles.recoveryLabel, { color: theme.subtitleColor }]}>Recovery Score</Text>
            <Text style={[styles.recoveryValue, { color: theme.titleColor }]}>78 / 100</Text>
          </View>
          <MaterialCommunityIcons name="heart-pulse" size={22} color="#EF4444" />
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>WORKOUTS VANDAAG</Text>
        <Pressable style={styles.addButton} onPress={() => router.push('/workouts/add')}>
          <MaterialCommunityIcons name="plus" size={14} color="#2563EB" />
          <Text style={styles.addButtonText}>Workout Toevoegen</Text>
        </Pressable>
      </View>
      {!isAppHydrated ? (
        <View style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="progress-clock" size={20} color={theme.subtitleColor} />
            <View>
              <Text style={[styles.rowTitle, { color: theme.subtitleColor }]}>Workouts laden...</Text>
            </View>
          </View>
        </View>
      ) : todayWorkouts.length > 0 ? (
        todayWorkouts.map((activity) => (
          <Pressable
            key={activity.id}
            style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push(`/workouts/${activity.id}` as any)}
          >
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name={activity.icon as any} size={20} color={activity.accentColor} />
              <View>
                <Text style={[styles.rowTitle, { color: theme.titleColor }]}>{activity.title}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.subtitleColor }]}>
                  {ACTIVITY_TYPE_LABELS[activity.type]} · {activity.date}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
          </Pressable>
        ))
      ) : (
        <Pressable
          style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/workouts/add')}
        >
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="dumbbell" size={20} color={theme.subtitleColor} />
            <View>
              <Text style={[styles.rowTitle, { color: theme.subtitleColor }]}>Geen training gepland</Text>
              <Text style={[styles.rowSubtitle, { color: theme.subtitleColor }]}>Tik om een training te loggen</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="plus" size={22} color="#9CA3AF" />
        </Pressable>
      )}

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>VOEDING</Text>
      <Pressable style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/(tabs)/nutrition')}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#10B981" />
          <View>
            <Text style={[styles.rowTitle, { color: theme.titleColor }]}>Macro check</Text>
            <Text style={[styles.rowSubtitle, { color: theme.subtitleColor }]}>Je zit op 68% van je dagdoel</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
      </Pressable>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>MIND</Text>
      <Pressable style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/(tabs)/mind')}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons name="meditation" size={20} color="#8B5CF6" />
          <View>
            <Text style={[styles.rowTitle, { color: theme.titleColor }]}>Korte reset-sessie</Text>
            <Text style={[styles.rowSubtitle, { color: theme.subtitleColor }]}>8 min focus-ademhaling</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
      </Pressable>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>SNELLE ACTIES</Text>
      <View style={styles.actionsGrid}>
        <Pressable style={styles.actionButton} onPress={() => router.push('/workouts')}>
          <MaterialCommunityIcons name="play-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionText}>Start Workout</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.actionButtonAlt]} onPress={() => router.push('/(tabs)/community')}>
          <MaterialCommunityIcons name="account-group-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionText}>Open Community</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>HELP ONS VERBETEREN</Text>
      <Pressable style={styles.feedbackButton} onPress={() => router.push('/(tabs)')}>
        <MaterialCommunityIcons name="chat-outline" size={18} color="#FFFFFF" />
        <Text style={styles.feedbackButtonText}>Geef Feedback</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
      </Pressable>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 3,
    marginBottom: 0,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  settingsPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  heroCarouselWrap: {
    marginBottom: 14,
  },
  heroCarouselContent: {
    alignItems: 'stretch',
  },
  heroSlideCard: {
    height: 162,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 10,
  },
  heroSlideImage: {
    borderRadius: 18,
  },
  heroSlideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 14, 28, 0.48)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'flex-end',
  },
  heroSlideBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroSlideTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  heroSlideSubtitle: {
    marginTop: 4,
    color: '#E5E7EB',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    maxWidth: '85%',
  },
  heroDotsRow: {
    marginTop: 8,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  heroDotActive: {
    width: 20,
    backgroundColor: '#2563EB',
    opacity: 1,
  },
  heroButtonWrap: {
    marginBottom: 10,
  },
  heroButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  quickKeysWrap: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickKeyButton: {
    width: '48.5%',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickKeyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  progressValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#2563EB',
  },
  statsGrid: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  chartMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  trendBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  trendBarColumn: {
    flex: 1,
    alignItems: 'center',
  },
  trendBarTrack: {
    width: 16,
    height: 86,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  trendDayLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  macroRow: {
    marginBottom: 10,
  },
  macroLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  macroPercent: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 11,
    fontWeight: '700',
  },
  macroTrack: {
    marginTop: 6,
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 999,
  },
  recoveryCard: {
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recoveryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  recoveryValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '900',
  },
  sectionLabel: {
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonAlt: {
    backgroundColor: '#059669',
  },
  feedbackButton: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 90,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#DBEAFE',
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
});
