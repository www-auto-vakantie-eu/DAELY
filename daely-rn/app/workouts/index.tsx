import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import {
  WORKOUT_ACTIVITIES,
  ACTIVITY_TYPE_LABELS,
  WEEK_BARS,
  PERSONAL_RECORDS,
  HEATMAP,
} from '@/constants/workout-activities';
import { getCreatorWorkoutEntries } from '@/services/creator-content';

type Filter = 'Alles' | 'Running' | 'Kracht' | 'HYROX' | 'Herstel';
const FILTERS: Filter[] = ['Alles', 'Running', 'Kracht', 'HYROX', 'Herstel'];

function getHeatColor(level: number, isDark: boolean): string {
  if (level === 3) return '#2563EB';
  if (level === 2) return '#60A5FA';
  if (level === 1) return '#BFDBFE';
  return isDark ? 'rgba(255,255,255,0.07)' : 'rgba(148, 163, 184, 0.18)';
}

export default function WorkoutsOverviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<Filter>('Alles');
  // Filtered list for 'Laatste activiteiten' sectie
  const filteredActivities = activeFilter === 'Alles'
    ? WORKOUT_ACTIVITIES
    : WORKOUT_ACTIVITIES.filter((a) => {
        if (activeFilter === 'Running') return a.type === 'running';
        if (activeFilter === 'Kracht') return a.type === 'kracht';
        if (activeFilter === 'HYROX') return a.type === 'hyrox';
        if (activeFilter === 'Herstel') return a.type === 'herstel' || a.type === 'mobility';
        return true;
      });
  const [createdWorkouts, setCreatedWorkouts] = useState([]);
  const hexBg = theme.background.replace('#', '');
  const r = parseInt(hexBg.slice(0, 2), 16);
  const isDark = r < 100;

  useEffect(() => {
    let isMounted = true;
    getCreatorWorkoutEntries()
      .then((entries) => {
        if (isMounted) setCreatedWorkouts(entries);
      })
      .catch(() => {
        if (isMounted) setCreatedWorkouts([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCreated = activeFilter === 'Alles'
    ? createdWorkouts
    : createdWorkouts.filter((entry) => {
        const t = entry.workout.type;
        if (activeFilter === 'Running') return t === 'running';
        if (activeFilter === 'Kracht') return t === 'kracht';
        if (activeFilter === 'HYROX') return t === 'hyrox';
        if (activeFilter === 'Herstel') return t === 'herstel' || t === 'mobility';
        return true;
      });

  const filteredSaved = activeFilter === 'Alles'
    ? WORKOUT_ACTIVITIES
    : WORKOUT_ACTIVITIES.filter((a) => {
        if (activeFilter === 'Running') return a.type === 'running';
        if (activeFilter === 'Kracht') return a.type === 'kracht';
        if (activeFilter === 'HYROX') return a.type === 'hyrox';
        if (activeFilter === 'Herstel') return a.type === 'herstel' || a.type === 'mobility';
        return true;
      });

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <Pressable
            style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
            <Text style={[styles.backButtonLabel, { color: theme.titleColor }]}>Home</Text>
          </Pressable>

          <Pressable
            style={[styles.calendarBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/workouts/calendar')}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={21} color={theme.titleColor} />
          </Pressable>
        </View>

        <LinearGradient
          colors={isDark ? ['#10203D', '#0B1220', '#08101C'] : ['#E0F2FE', '#FFFFFF', '#EEF2FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { borderColor: theme.border }]}
        >
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTextBlock}>
              <Text style={[styles.eyebrow, { color: theme.subtitleColor }]}>MIJN WORKOUTS</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Train.</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Track.</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Repeat.</Text>
            </View>
            <View style={styles.heroRightCol}>
              <View style={[styles.heroOrbit, { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.18)' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={28} color="#2563EB" />
              </View>
              <Text style={[styles.heroSubtext, { color: theme.subtitleColor }]}>Feed van al je sessies op één plek.</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View style={[styles.scoreCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF' }]}>
              <Text style={[styles.scoreValue, { color: theme.titleColor }]}>4</Text>
              <Text style={[styles.scoreLabel, { color: theme.subtitleColor }]}>Sessies deze week</Text>
            </View>
            <View style={[styles.scoreCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF' }]}>
              <Text style={[styles.scoreValue, { color: theme.titleColor }]}>23.6</Text>
              <Text style={[styles.scoreLabel, { color: theme.subtitleColor }]}>Km totaal</Text>
            </View>
            <View style={[styles.scoreCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF' }]}>
              <Text style={[styles.scoreValue, { color: theme.titleColor }]}>12</Text>
              <Text style={[styles.scoreLabel, { color: theme.subtitleColor }]}>Dagen streak</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? theme.titleColor : theme.card,
                    borderColor: active ? theme.titleColor : theme.border,
                  },
                ]}
              >
                <Text style={[styles.filterChipLabel, { color: active ? theme.background : theme.titleColor }]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Afgelopen 7 dagen</Text>

          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Zelf gecreëerde workouts</Text>
            <Text style={[styles.sectionCount, { color: theme.subtitleColor }]}>{filteredCreated.length} sessies</Text>
          </View>
          {filteredCreated.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={38} color={theme.subtitleColor} />
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen zelf gecreëerde workouts.</Text>
            </View>
          )}
          {filteredCreated.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => router.push(`/workouts/${entry.workout.id}` as any)}
              style={({ pressed }) => [
                styles.activityCard,
                { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.86 : 1 },
              ]}
            >
              <View style={styles.activityCardLeft}>
                <MaterialCommunityIcons name={entry.workout.icon as any} size={28} color={entry.workout.accentColor} />
              </View>
              <View style={styles.activityCardBody}>
                <Text style={[styles.activityTitle, { color: theme.titleColor }]} numberOfLines={1}>{entry.workout.title}</Text>
                <Text style={[styles.activityMeta, { color: theme.subtitleColor }]} numberOfLines={1}>{entry.workout.date}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} style={styles.chevron} />
            </Pressable>
          ))}
        </View>

          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Opgeslagen workouts</Text>
            <Text style={[styles.sectionCount, { color: theme.subtitleColor }]}>{filteredSaved.length} sessies</Text>
          </View>
          {filteredSaved.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={38} color={theme.subtitleColor} />
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen opgeslagen workouts.</Text>
            </View>
          )}
          {filteredSaved.map((activity) => (
            <Pressable
              key={activity.id}
              onPress={() => router.push(`/workouts/${activity.id}` as any)}
              style={({ pressed }) => [
                styles.activityCard,
                { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.86 : 1 },
              ]}
            >
              <View style={styles.activityCardLeft}>
                <MaterialCommunityIcons name={activity.icon as any} size={28} color={activity.accentColor} />
              </View>
              <View style={styles.activityCardBody}>
                <Text style={[styles.activityTitle, { color: theme.titleColor }]} numberOfLines={1}>{activity.title}</Text>
                <Text style={[styles.activityMeta, { color: theme.subtitleColor }]} numberOfLines={1}>{activity.date}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} style={styles.chevron} />
            </Pressable>
          ))}

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Laatste activiteiten</Text>
          <Text style={[styles.sectionCount, { color: theme.subtitleColor }]}>{filteredActivities.length} sessies</Text>
        </View>

        {filteredActivities.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={38} color={theme.subtitleColor} />
            <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen activiteiten voor dit filter.</Text>
          </View>
        )}

        {filteredActivities.map((activity) => (
          <Pressable
            key={activity.id}
            onPress={() => router.push(`/workouts/${activity.id}` as any)}
            style={({ pressed }) => [
              styles.activityCard,
              { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.86 : 1 },
            ]}
          >
            <View style={styles.activityTopRow}>
              <View style={[styles.activityIconWrap, { backgroundColor: `${activity.accentColor}18` }]}>
                <MaterialCommunityIcons name={activity.icon as any} size={22} color={activity.accentColor} />
              </View>
              <View style={styles.activityTitleWrap}>
                <Text style={[styles.activityType, { color: activity.accentColor }]}>{ACTIVITY_TYPE_LABELS[activity.type]}</Text>
                <Text style={[styles.activityTitle, { color: theme.titleColor }]}>{activity.title}</Text>
                <Text style={[styles.activityDate, { color: theme.subtitleColor }]}>{activity.date}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} />
            </View>

            <View style={styles.metricsRow}>
              {activity.metrics.slice(0, 3).map((metric) => (
                <View key={metric.label} style={[styles.metricPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }]}>
                  <Text style={[styles.metricPillValue, { color: theme.titleColor }]}>{metric.value}</Text>
                  <Text style={[styles.metricPillLabel, { color: theme.subtitleColor }]}>{metric.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.lapsLabel, { color: theme.subtitleColor }]}>Splits / onderdelen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lapsRow}>
              {activity.splits.slice(0, 4).map((split) => (
                <View key={split.label} style={[styles.lapCard, { borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF' }]}>
                  <Text style={[styles.lapCardLabel, { color: theme.titleColor }]}>{split.label}</Text>
                  <Text style={[styles.lapCardMeta, { color: theme.subtitleColor }]}>{split.meta}</Text>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        ))}

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>PR&apos;s en consistentie</Text>
        </View>

        <View style={styles.bottomGrid}>
          <View style={[styles.recordsCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Persoonlijke records</Text>
            <View style={styles.recordsList}>
              {PERSONAL_RECORDS.map((record) => (
                <View key={record.label} style={[styles.recordRow, { borderColor: theme.border }]}> 
                  <Text style={[styles.recordLabel, { color: theme.subtitleColor }]}>{record.label}</Text>
                  <Text style={[styles.recordValue, { color: theme.titleColor }]}>{record.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.heatmapCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Trainingskalender</Text>
            <Text style={[styles.cardSubtitle, { color: theme.subtitleColor }]}>Compacte maandweergave zoals een activity grid.</Text>
            <View style={styles.heatmapWrap}>
              {HEATMAP.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.heatmapRow}>
                  {row.map((cell, cellIndex) => (
                    <View
                      key={`cell-${rowIndex}-${cellIndex}`}
                      style={[styles.heatmapCell, { backgroundColor: getHeatColor(cell, isDark) }]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 96,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  calendarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    marginTop: 16,
    borderRadius: 32,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroRightCol: {
    alignItems: 'flex-end',
    gap: 10,
    maxWidth: 100,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontSize: 46,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trendBadgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroSubtext: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 6,
  },
  heroOrbit: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  scoreCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  scoreValue: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  scoreLabel: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  filterRow: {
    gap: 10,
    paddingTop: 18,
    paddingBottom: 6,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionRow: {
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  sectionMeta: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trendCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  trendCaption: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  trendDeltaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  trendDelta: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    width: '100%',
    height: 124,
    borderRadius: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 16,
    minHeight: 22,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  activityCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 16,
    marginBottom: 12,
  },
  activityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitleWrap: {
    flex: 1,
  },
  activityType: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  activityTitle: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 23,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  activityDate: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  metricPill: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 72,
  },
  metricPillValue: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  metricPillLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  lapsLabel: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  lapsRow: {
    gap: 10,
    paddingTop: 10,
  },
  lapCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 88,
  },
  lapCardLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  lapCardMeta: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomGrid: {
    gap: 12,
  },
  recordsCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  heatmapCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  recordsList: {
    marginTop: 12,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recordLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  recordValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  heatmapWrap: {
    marginTop: 16,
    gap: 8,
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heatmapCell: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  footerSpacer: {
    height: 12,
  },
});