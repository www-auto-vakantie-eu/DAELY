import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { Activity, getActivities } from 'services/activity-storage';

function formatTodayLabel() {
  const now = new Date();
  return now.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('nl-NL');
}

function getMetricsSummary(activity: Activity) {
  if (activity.metrics?.workout) {
    return `${activity.metrics.workout.exercises?.length ?? 0} oefeningen${activity.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(activity.metrics.workout.totalVolumeKg)} kg volume` : ''}`;
  }
  if (activity.metrics?.session) {
    return `${activity.metrics.session.intensity ? `Intensiteit ${activity.metrics.session.intensity}` : 'Session'}${activity.metrics.session.focusAreas && activity.metrics.session.focusAreas.length > 0 ? ` · ${activity.metrics.session.focusAreas.join(', ')}` : ''}`;
  }
  if (activity.metrics?.match) {
    return `${activity.metrics.match.matchType ?? 'match'}${activity.metrics.match.scoreFor !== undefined && activity.metrics.match.scoreAgainst !== undefined ? ` · ${activity.metrics.match.scoreFor}-${activity.metrics.match.scoreAgainst}` : ''}`;
  }
  if (activity.metrics?.score) {
    if (activity.metrics.score.scoreType === 'racket') {
      return `${activity.metrics.score.result ?? 'score'}${activity.metrics.score.setsFor !== undefined && activity.metrics.score.setsAgainst !== undefined ? ` · ${activity.metrics.score.setsFor}-${activity.metrics.score.setsAgainst}` : ''}`;
    }
    if (activity.metrics.score.scoreType === 'golf') {
      return `Golf${activity.metrics.score.holesPlayed !== undefined ? ` · ${activity.metrics.score.holesPlayed} holes` : ''}${activity.metrics.score.strokes !== undefined ? ` · ${activity.metrics.score.strokes} slagen` : ''}`;
    }
    return 'Score activiteit';
  }
  if (activity.metrics?.skill) {
    return `${activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0 ? activity.metrics.skill.techniques.join(', ') : 'Skill'}${activity.metrics.skill.grade ? ` · ${activity.metrics.skill.grade}` : ''}`;
  }
  if (activity.metrics?.laps) {
    return `${activity.metrics.laps.distanceMeters !== undefined ? `${Math.round(activity.metrics.laps.distanceMeters)} m` : 'Laps'}${activity.metrics.laps.laps !== undefined ? ` · ${Math.round(activity.metrics.laps.laps)} banen` : ''}`;
  }
  if (activity.metrics?.gps) {
    return `${activity.metrics.gps.distanceMeters !== undefined ? `${Math.round(activity.metrics.gps.distanceMeters)} m` : 'GPS activiteit'}${activity.metrics.gps.averageSpeedKmh !== undefined ? ` · ${activity.metrics.gps.averageSpeedKmh.toFixed(1)} km/u` : ''}`;
  }
  return 'Geen metrics beschikbaar';
}

export default function TodayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then((items) => {
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
    });
  }, []);

  const todayLabel = useMemo(() => formatTodayLabel(), []);
  const todayKey = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, '0');
    const d = `${now.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const todayActivities = useMemo(
    () => activities.filter((activity) => activity.endedAt.startsWith(todayKey)),
    [activities, todayKey]
  );
  const mostRecentTodayActivity = todayActivities[0];

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <PageHeader
        title="Vandaag"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <Text style={[styles.dateLabel, { color: theme.subtitleColor }]}>{todayLabel}</Text>

      <View style={[styles.welcomeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.welcomeTitle, { color: theme.titleColor }]}>Welkom terug</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.subtitleColor }]}>Alles wat je vandaag nodig hebt, staat hier klaar.</Text>
      </View>

      <Pressable style={styles.primaryCard} onPress={() => router.push('/tracker')}>
        <View style={styles.primaryIconWrap}>
          <MaterialCommunityIcons name="run-fast" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.primaryTextWrap}>
          <Text style={styles.primaryTitle}>Start activiteit</Text>
          <Text style={styles.primarySubtitle}>Track je training, wedstrijd of sessie.</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
      </Pressable>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Vandaag data</Text>
        <Text style={[styles.dataFallback, { color: theme.subtitleColor }]}>Nog geen data gekoppeld.</Text>
        <View style={styles.dataGrid}>
          <DataTile label="Stappen" value="-" />
          <DataTile label="Hartslag" value="-" />
          <DataTile label="Kcal" value="-" />
          <DataTile label="Actieve minuten" value="-" />
          <DataTile label="Slaap/herstel" value="-" />
        </View>
        <Pressable style={styles.linkButton} onPress={() => router.push('/data-link')}>
          <Text style={styles.linkButtonText}>Data koppelen</Text>
        </Pressable>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Snelle acties</Text>
        <View style={styles.quickGrid}>
          <QuickActionTile label="Voeding toevoegen" icon="plus-circle-outline" onPress={() => router.push('/nutrition/add')} />
          <QuickActionTile label="Voeding vergelijken" icon="scale-balance" onPress={() => router.push('/nutrition/compare')} />
          <QuickActionTile label="Snel informatie vinden" icon="magnify" onPress={() => router.push('/nutrition/search')} />
          <QuickActionTile label="Habit tracker" icon="calendar-check-outline" disabled />
          <QuickActionTile label="Geef feedback" icon="chat-outline" onPress={() => router.push('/(tabs)')} />
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Vandaag actief</Text>
        {todayActivities.length > 0 ? (
          <>
            <Text style={[styles.activityStatus, { color: theme.subtitleColor }]}>{todayActivities.length} activiteit{todayActivities.length > 1 ? 'en' : ''} vandaag</Text>
            {mostRecentTodayActivity ? (
              <Pressable
                style={styles.recentActivityCard}
                onPress={() => router.push({ pathname: '/activities/[id]', params: { id: mostRecentTodayActivity.id } })}
              >
                <Text style={styles.recentDiscipline}>{mostRecentTodayActivity.disciplineName}</Text>
                <Text style={styles.recentMeta}>{formatDuration(mostRecentTodayActivity.durationSeconds)} · {formatDateTime(mostRecentTodayActivity.endedAt)}</Text>
                <Text style={styles.recentSummary}>{getMetricsSummary(mostRecentTodayActivity)}</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <View>
            <Text style={[styles.activityStatus, { color: theme.subtitleColor }]}>Nog geen activiteit vandaag.</Text>
            <Pressable onPress={() => router.push('/tracker')}>
              <Text style={styles.inlineLink}>Start activiteit</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function DataTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataTile}>
      <Text style={styles.dataTileLabel}>{label}</Text>
      <Text style={styles.dataTileValue}>{value}</Text>
    </View>
  );
}

function QuickActionTile({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickTile,
        disabled ? styles.quickTileDisabled : null,
        pressed && !disabled ? styles.quickTilePressed : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialCommunityIcons name={icon} size={18} color={disabled ? '#94A3B8' : '#2563EB'} />
      <Text style={[styles.quickTileText, disabled ? styles.quickTileTextDisabled : null]}>{disabled ? `${label} (Binnenkort)` : label}</Text>
    </Pressable>
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
  dateLabel: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  welcomeCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryCard: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryTextWrap: {
    flex: 1,
  },
  primaryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  primarySubtitle: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  dataFallback: {
    fontSize: 13,
    marginBottom: 10,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataTile: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  dataTileLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  dataTileValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkButtonText: {
    color: '#1E3A8A',
    fontWeight: '700',
    fontSize: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTile: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    minHeight: 68,
    justifyContent: 'center',
  },
  quickTilePressed: {
    opacity: 0.8,
  },
  quickTileDisabled: {
    backgroundColor: '#E2E8F0',
  },
  quickTileText: {
    marginTop: 6,
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  quickTileTextDisabled: {
    color: '#64748B',
  },
  activityStatus: {
    fontSize: 14,
    marginBottom: 10,
  },
  recentActivityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
  },
  recentDiscipline: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 4,
  },
  recentSummary: {
    color: '#1F2937',
    fontSize: 13,
    lineHeight: 18,
  },
  inlineLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 22,
  },
});
