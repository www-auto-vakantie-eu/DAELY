import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/PageHeader';
import { Activity, getActivities } from 'services/activity-storage';
import { CONNECTED_DEVICES, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';

type TrackingTypeKey = 'workout' | 'session' | 'match' | 'score' | 'skill' | 'laps' | 'gps';

const TRACKING_TYPE_ORDER: Array<{ key: TrackingTypeKey; label: string }> = [
  { key: 'workout', label: 'Workout' },
  { key: 'session', label: 'Session' },
  { key: 'match', label: 'Match' },
  { key: 'score', label: 'Score' },
  { key: 'skill', label: 'Skill' },
  { key: 'laps', label: 'Laps' },
  { key: 'gps', label: 'GPS' },
];

export default function MyStatsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);

  useEffect(() => {
    getActivities().then((items) => {
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
      setActivitiesLoading(false);
    });
  }, []);

  useEffect(() => {
    const restoreConnectedStatus = async () => {
      try {
        const values = await AsyncStorage.multiGet([WHOOP_TOKEN_STORAGE_KEY, 'fitbit_oauth_token', 'fitbit_connected']);
        const valueMap = new Map(values);
        setIsWhoopConnected(!!valueMap.get(WHOOP_TOKEN_STORAGE_KEY));
        const fitbitConnected = !!valueMap.get('fitbit_oauth_token') || valueMap.get('fitbit_connected') === 'true';
        setIsFitbitConnected(fitbitConnected);
      } catch {
        setIsWhoopConnected(false);
        setIsFitbitConnected(false);
      }
    };

    void restoreConnectedStatus();
  }, []);

  const deviceStatusItems = useMemo(
    () => CONNECTED_DEVICES.filter((device) => ['whoop', 'fitbit', 'apple-health', 'garmin', 'google-fit-health-connect'].includes(device.id)),
    []
  );

  const totalActivities = activities.length;
  const totalDurationSeconds = activities.reduce((sum, activity) => sum + (activity.durationSeconds || 0), 0);
  const totalDurationHours = Math.floor(totalDurationSeconds / 3600);
  const totalDurationMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const uniqueDisciplines = Array.from(new Set(activities.map((activity) => activity.disciplineId))).length;
  const mostRecent = activities[0];
  const recentActivities = activities.slice(0, 3);
  const isEmpty = !activitiesLoading && activities.length === 0;

  const trackingTypeCounts = useMemo(() => {
    const counts: Record<TrackingTypeKey, number> = {
      workout: 0,
      session: 0,
      match: 0,
      score: 0,
      skill: 0,
      laps: 0,
      gps: 0,
    };

    for (const activity of activities) {
      const key = activity.trackingType as TrackingTypeKey;
      if (key in counts) {
        counts[key] += 1;
      }
    }

    return counts;
  }, [activities]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDuration(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  }

  function renderMetricsSummary(activity: Activity) {
    if (!activity.metrics) return null;

    if (activity.metrics.workout) {
      return `${activity.metrics.workout.exercises?.length ?? 0} oefeningen${activity.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(activity.metrics.workout.totalVolumeKg)} kg` : ''}`;
    }
    if (activity.metrics.session) {
      return `Intensiteit ${activity.metrics.session.intensity ?? '-'}`;
    }
    if (activity.metrics.match) {
      return `${activity.metrics.match.matchType ?? 'match'}${activity.metrics.match.scoreFor !== undefined && activity.metrics.match.scoreAgainst !== undefined ? ` · ${activity.metrics.match.scoreFor}-${activity.metrics.match.scoreAgainst}` : ''}`;
    }
    if (activity.metrics.score) {
      return `${activity.metrics.score.scoreType ?? 'score'}${activity.metrics.score.result ? ` · ${activity.metrics.score.result}` : ''}`;
    }
    if (activity.metrics.skill) {
      return activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0 ? activity.metrics.skill.techniques.join(', ') : 'Skill';
    }
    if (activity.metrics.laps) {
      return activity.metrics.laps.distanceMeters !== undefined ? `${Math.round(activity.metrics.laps.distanceMeters)} m` : 'Laps';
    }
    if (activity.metrics.gps) {
      return activity.metrics.gps.distanceMeters !== undefined ? `${Math.round(activity.metrics.gps.distanceMeters)} m` : 'GPS activiteit';
    }

    return null;
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <PageHeader
        title="Data"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Data</Text>
        <Text style={[styles.heroText, { color: theme.subtitleColor }]}>Bekijk je voortgang, activiteiten en gekoppelde apparaten.</Text>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Activiteitenoverzicht</Text>
        {activitiesLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : isEmpty ? (
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen activiteiten opgeslagen.</Text>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Totaal activiteiten</Text>
              <Text style={styles.statValue}>{totalActivities}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Totale sporttijd</Text>
              <Text style={styles.statValue}>{totalDurationHours}u {totalDurationMinutes}m</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Disciplines</Text>
              <Text style={styles.statValue}>{uniqueDisciplines}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Meest recent</Text>
              <Text style={styles.statValueSmall}>{mostRecent ? mostRecent.disciplineName : '-'}</Text>
              {mostRecent ? <Text style={styles.statMeta}>{formatDate(mostRecent.endedAt)}</Text> : null}
            </View>
          </View>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Per trackingtype</Text>
        {activitiesLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <View style={styles.trackingGrid}>
            {TRACKING_TYPE_ORDER.map((item) => (
              <View key={item.key} style={styles.trackingChip}>
                <Text style={styles.trackingChipLabel}>{item.label}</Text>
                <Text style={styles.trackingChipValue}>{trackingTypeCounts[item.key]}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Gekoppelde apparaten</Text>
        <View style={styles.deviceList}>
          {deviceStatusItems.map((device) => {
            const isSoon = device.status === 'soon';
            const isConnected = device.id === 'whoop' ? isWhoopConnected : device.id === 'fitbit' ? isFitbitConnected : false;
            const statusLabel = isSoon ? 'Binnenkort' : isConnected ? 'Verbonden' : 'Koppelbaar';

            return (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceHeaderRow}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text
                    style={[
                      styles.deviceStatus,
                      isSoon ? styles.deviceStatusSoon : isConnected ? styles.deviceStatusConnected : styles.deviceStatusConnectable,
                    ]}
                  >
                    {statusLabel}
                  </Text>
                </View>
                <Text style={styles.deviceMeta}>Data: {device.dataPoints.join(', ')}</Text>
              </View>
            );
          })}
        </View>
        <Pressable style={styles.secondaryCtaBtn} onPress={() => router.push('/data-link')}>
          <Text style={styles.secondaryCtaBtnText}>Apparaat koppelen</Text>
        </Pressable>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recente activiteiten</Text>
        {activitiesLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : isEmpty ? (
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen activiteiten opgeslagen.</Text>
        ) : (
          <View style={styles.recentList}>
            {recentActivities.map((activity) => (
              <Pressable
                key={activity.id}
                style={styles.recentCard}
                onPress={() => router.push({ pathname: '/activities/[id]', params: { id: activity.id } })}
              >
                <Text style={styles.recentTitle}>{activity.disciplineName}</Text>
                <Text style={styles.recentMeta}>{formatDate(activity.endedAt)} · {formatDuration(activity.durationSeconds)}</Text>
                {renderMetricsSummary(activity) ? <Text style={styles.recentSummary}>{renderMetricsSummary(activity)}</Text> : null}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.ctaRow}>
        <Pressable style={styles.primaryCtaBtn} onPress={() => router.push('/tracker')}>
          <Text style={styles.primaryCtaBtnText}>Start activiteit</Text>
        </Pressable>
        <Pressable style={styles.secondaryCtaBtn} onPress={() => router.push('/activities')}>
          <Text style={styles.secondaryCtaBtnText}>Activiteiten bekijken</Text>
        </Pressable>
      </View>

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
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  statValueSmall: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  statMeta: {
    marginTop: 2,
    color: '#64748B',
    fontSize: 11,
  },
  trackingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackingChip: {
    width: '31%',
    minHeight: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  trackingChipLabel: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackingChipValue: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '800',
  },
  deviceList: {
    gap: 8,
  },
  deviceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    marginRight: 8,
  },
  deviceStatus: {
    fontSize: 12,
    fontWeight: '700',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  deviceStatusConnected: {
    color: '#166534',
    backgroundColor: '#DCFCE7',
  },
  deviceStatusConnectable: {
    color: '#1E3A8A',
    backgroundColor: '#DBEAFE',
  },
  deviceStatusSoon: {
    color: '#374151',
    backgroundColor: '#E5E7EB',
  },
  deviceMeta: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 17,
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  recentTitle: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  recentSummary: {
    color: '#1F2937',
    fontSize: 12,
    lineHeight: 17,
  },
  ctaRow: {
    gap: 8,
    marginTop: 2,
  },
  primaryCtaBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryCtaBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryCtaBtnText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 18,
  },
});
