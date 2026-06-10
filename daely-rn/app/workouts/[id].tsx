import { ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import {
  WORKOUT_ACTIVITIES,
  ACTIVITY_TYPE_LABELS,
} from '@/constants/workout-activities';
import { getPublicCreatorWorkouts } from '@/services/creator-content';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

function getHrZoneColor(bpm: number): string {
  if (bpm >= 170) return '#EF4444';
  if (bpm >= 158) return '#F97316';
  if (bpm >= 142) return '#EAB308';
  if (bpm >= 120) return '#22C55E';
  return '#60A5FA';
}

function getHrZoneLabel(max: number): string {
  if (max >= 170) return 'Zone 5 — Rood';
  if (max >= 158) return 'Zone 4 — Oranje';
  if (max >= 142) return 'Zone 3 — Geel';
  return 'Zone 2 — Blauw';
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const hexBg = theme.background.replace('#', '');
  const r = parseInt(hexBg.slice(0, 2), 16);
  const isDark = r < 100;

  const [publicWorkouts, setPublicWorkouts] = useState(WORKOUT_ACTIVITIES.slice(0, 0));

  useEffect(() => {
    getPublicCreatorWorkouts().then(setPublicWorkouts).catch(() => setPublicWorkouts([]));
  }, []);

  const allActivities = useMemo(() => [...publicWorkouts, ...WORKOUT_ACTIVITIES], [publicWorkouts]);
  const activity = allActivities.find((a) => a.id === id);

  if (!activity) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.content}>
          <Text style={[styles.notFoundText, { color: theme.subtitleColor }]}>Activiteit niet gevonden.</Text>
        </View>
        <SharedBottomNav activeTab="disciplines" />
      </AppScreen>
    );
  }

  const maxHr = Math.max(...activity.heartRateData);
  const minHr = Math.min(...activity.heartRateData);
  const hrRange = maxHr - minHr || 1;
  const avgHr = Math.round(activity.heartRateData.reduce((a, b) => a + b, 0) / activity.heartRateData.length);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Hero */}
        <ImageBackground
          source={{ uri: activity.image }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.90)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Type badge */}
            <View style={[styles.heroBadge, { backgroundColor: `${activity.accentColor}22`, borderColor: `${activity.accentColor}55` }]}>
              <MaterialCommunityIcons name={activity.icon as any} size={15} color={activity.accentColor} />
              <Text style={[styles.heroBadgeText, { color: activity.accentColor }]}>
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </Text>
            </View>

            {/* Title + date */}
            <Text style={styles.heroTitle}>{activity.title}</Text>
            <Text style={styles.heroDate}>{activity.date}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>

          {/* Metrics grid */}
          <View style={styles.metricsGrid}>
            {activity.metrics.map((metric) => (
              <View
                key={metric.label}
                style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <Text style={[styles.metricValue, { color: theme.titleColor }]}>{metric.value}</Text>
                <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>{metric.label}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={[styles.descriptionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.descriptionHeader}>
              <MaterialCommunityIcons name="note-text-outline" size={18} color={theme.subtitleColor} />
              <Text style={[styles.descriptionHeaderText, { color: theme.subtitleColor }]}>Notities</Text>
            </View>
            <Text style={[styles.descriptionText, { color: theme.titleColor }]}>{activity.description}</Text>
          </View>

          {/* Heart Rate visualization */}
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Hartslag</Text>
          <View style={[styles.hrCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.hrHeaderRow}>
              <View>
                <Text style={[styles.hrAvgValue, { color: theme.titleColor }]}>{avgHr} bpm</Text>
                <Text style={[styles.hrAvgLabel, { color: theme.subtitleColor }]}>Gemiddeld</Text>
              </View>
              <View style={styles.hrZoneRow}>
                <View style={[styles.hrZoneDot, { backgroundColor: getHrZoneColor(maxHr) }]} />
                <Text style={[styles.hrZoneLabel, { color: theme.subtitleColor }]}>{getHrZoneLabel(maxHr)}</Text>
              </View>
              <View style={styles.hrMinMaxBlock}>
                <Text style={[styles.hrMmValue, { color: theme.titleColor }]}>{maxHr}</Text>
                <Text style={[styles.hrMmLabel, { color: theme.subtitleColor }]}>Max HR</Text>
              </View>
            </View>

            {/* Bar visualization */}
            <View style={styles.hrBarsWrap}>
              {activity.heartRateData.map((bpm, index) => {
                const heightPct = ((bpm - minHr) / hrRange) * 100;
                const barH = Math.max(10, (heightPct / 100) * 80);
                return (
                  <View key={`hr-${index}`} style={styles.hrBarCol}>
                    <View style={[styles.hrBarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
                      <View
                        style={[
                          styles.hrBarFill,
                          { height: barH, backgroundColor: getHrZoneColor(bpm) },
                        ]}
                      />
                    </View>
                    <Text style={[styles.hrBarBpm, { color: theme.subtitleColor }]}>{bpm}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Splits / exercises */}
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>
            {activity.type === 'kracht' ? 'Oefeningen' : 'Splits'}
          </Text>
          <View style={[styles.splitsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {activity.splits.map((split, index) => (
              <View
                key={split.label}
                style={[
                  styles.splitRow,
                  { borderBottomColor: theme.border },
                  index === activity.splits.length - 1 && styles.splitRowLast,
                ]}
              >
                <View style={[styles.splitNumber, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                  <Text style={[styles.splitNumberText, { color: theme.subtitleColor }]}>{index + 1}</Text>
                </View>
                <View style={styles.splitTextWrap}>
                  <Text style={[styles.splitLabel, { color: theme.titleColor }]}>{split.label}</Text>
                  <Text style={[styles.splitMeta, { color: theme.subtitleColor }]}>{split.meta}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color={theme.subtitleColor} />
              </View>
            ))}
          </View>

          {/* Map placeholder */}
          {activity.type === 'running' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Route</Text>
              <View style={[styles.mapPlaceholder, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <LinearGradient
                  colors={isDark ? ['#0F1E3D', '#162038'] : ['#EFF6FF', '#DBEAFE']}
                  style={styles.mapGradient}
                >
                  <MaterialCommunityIcons name="map-outline" size={44} color="#2563EB" />
                  <Text style={[styles.mapPlaceholderTitle, { color: theme.titleColor }]}>GPS-route</Text>
                  <Text style={[styles.mapPlaceholderSubtitle, { color: theme.subtitleColor }]}>
                    Kaartweergave beschikbaar na GPS-koppeling in volgende update.
                  </Text>
                </LinearGradient>
              </View>
            </>
          )}

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
    paddingTop: 20,
    paddingBottom: 100,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Hero
  heroImage: {
    height: 360,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 52,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 52,
    lineHeight: 54,
    fontWeight: '900',
    letterSpacing: -2,
    color: '#FFFFFF',
  },
  heroDate: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.2,
  },

  // Metrics grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '47%',
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  metricValue: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  metricLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // Description
  descriptionCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 28,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  descriptionHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },

  // Section title
  sectionTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 14,
  },

  // Heart rate
  hrCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 28,
  },
  hrHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  hrAvgValue: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  hrAvgLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  hrZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },
  hrZoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hrZoneLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  hrMinMaxBlock: {
    alignItems: 'flex-end',
  },
  hrMmValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  hrMmLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  hrBarsWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 100,
  },
  hrBarCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: 100,
    justifyContent: 'flex-end',
  },
  hrBarTrack: {
    width: '100%',
    borderRadius: 8,
    height: 80,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  hrBarFill: {
    width: '100%',
    borderRadius: 8,
  },
  hrBarBpm: {
    fontSize: 8,
    fontWeight: '700',
  },

  // Splits
  splitsCard: {
    borderWidth: 1,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 28,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  splitRowLast: {
    borderBottomWidth: 0,
  },
  splitNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitNumberText: {
    fontSize: 13,
    fontWeight: '800',
  },
  splitTextWrap: {
    flex: 1,
  },
  splitLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  splitMeta: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '600',
  },

  // Map placeholder
  mapPlaceholder: {
    borderWidth: 1,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapGradient: {
    paddingVertical: 52,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 30,
  },
  mapPlaceholderTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: 96,
  },
});
