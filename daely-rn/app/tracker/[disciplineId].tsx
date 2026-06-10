
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import PageHeader from '../components/PageHeader';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';
import { Activity, getActivities } from 'services/activity-storage';

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('nl-NL');
}

function getTrackingPreview(trackingType: string) {
  switch (trackingType) {
    case 'workout':
      return ['Sets', 'Reps', 'Gewicht', 'Volume', 'Notities'];
    case 'session':
      return ['Duur', 'Gevoel', 'Focus', 'Intensiteit'];
    case 'match':
      return ['Score', 'Positie', 'Stats'];
    case 'score':
      return ['Sets', 'Holes', 'Resultaat'];
    case 'skill':
      return ['Technieken', 'Pogingen', 'Grade'];
    case 'laps':
      return ['Banen', 'Afstand', 'Tempo'];
    case 'gps':
      return ['Afstand', 'Snelheid', 'Route'];
    default:
      return ['Metrics'];
  }
}

function getIntroText(trackingType: string) {
  if (trackingType === 'workout') {
    return 'Leg je oefeningen, sets, reps en gewicht vast.';
  }
  return 'Klaar om te starten? DAELY past de tracking aan op jouw discipline.';
}

function getActivitySummary(activity: Activity) {
  if (activity.metrics?.workout) {
    return `${activity.metrics.workout.exercises?.length ?? 0} oefeningen${activity.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(activity.metrics.workout.totalVolumeKg)} kg volume` : ''}`;
  }
  if (activity.metrics?.session) {
    return `Session${activity.metrics.session.intensity ? ` · ${activity.metrics.session.intensity}` : ''}`;
  }
  if (activity.metrics?.match) {
    return `${activity.metrics.match.matchType ?? 'match'}${activity.metrics.match.scoreFor !== undefined && activity.metrics.match.scoreAgainst !== undefined ? ` · ${activity.metrics.match.scoreFor}-${activity.metrics.match.scoreAgainst}` : ''}`;
  }
  if (activity.metrics?.score) {
    return `${activity.metrics.score.scoreType ?? 'score'}${activity.metrics.score.result ? ` · ${activity.metrics.score.result}` : ''}`;
  }
  if (activity.metrics?.skill) {
    return `${activity.metrics.skill.skillType ?? 'skill'}${activity.metrics.skill.grade ? ` · ${activity.metrics.skill.grade}` : ''}`;
  }
  if (activity.metrics?.laps) {
    return `${activity.metrics.laps.distanceMeters !== undefined ? `${Math.round(activity.metrics.laps.distanceMeters)} m` : 'laps activiteit'}`;
  }
  if (activity.metrics?.gps) {
    return `${activity.metrics.gps.distanceMeters !== undefined ? `${Math.round(activity.metrics.gps.distanceMeters)} m` : 'gps activiteit'}`;
  }
  return 'Geen metrics';
}

export default function DisciplineDetail() {
  const { disciplineId } = useLocalSearchParams<{ disciplineId: string }>();
  const router = useRouter();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  const discipline = SPORT_DISCIPLINES.find(d => d.id === disciplineId);

  useEffect(() => {
    if (!disciplineId) return;
    getActivities().then((activities) => {
      const filtered = activities
        .filter((activity) => activity.disciplineId === disciplineId)
        .slice(0, 3);
      setRecentActivities(filtered);
    });
  }, [disciplineId]);

  const trackingPreview = useMemo(() => getTrackingPreview(discipline?.trackingType ?? ''), [discipline?.trackingType]);

  if (!discipline) {
    return (
      <View style={styles.container}>
        <PageHeader title="Discipline niet gevonden" />
        <Text style={styles.fallback}>Deze discipline bestaat niet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <PageHeader title={discipline.name} />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{discipline.name}</Text>
        <Text style={styles.heroMeta}>Tracking: {discipline.trackingType}</Text>
        <Text style={styles.heroDescription}>{getIntroText(discipline.trackingType)}</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push({ pathname: '/tracker/[disciplineId]/start', params: { disciplineId } })}
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>Start {discipline.name} activiteit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Wat wordt bijgehouden?</Text>
        <View style={styles.chipsRow}>
          {trackingPreview.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Hoe werkt het?</Text>
        <View style={styles.stepItem}><Text style={styles.stepIndex}>1.</Text><Text style={styles.stepText}>Start je sessie</Text></View>
        <View style={styles.stepItem}><Text style={styles.stepIndex}>2.</Text><Text style={styles.stepText}>Voeg oefeningen toe</Text></View>
        <View style={styles.stepItem}><Text style={styles.stepIndex}>3.</Text><Text style={styles.stepText}>Sla je workout op</Text></View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recente {discipline.name} activiteiten</Text>
        {recentActivities.length === 0 ? (
          <Text style={styles.emptyRecent}>Nog geen {discipline.name} activiteiten opgeslagen.</Text>
        ) : (
          recentActivities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.recentItem}
              onPress={() => router.push({ pathname: '/activities/[id]', params: { id: activity.id } })}
            >
              <Text style={styles.recentName}>{activity.disciplineName}</Text>
              <Text style={styles.recentMeta}>{formatDuration(activity.durationSeconds)} · {formatDate(activity.endedAt)}</Text>
              <Text style={styles.recentSummary}>{getActivitySummary(activity)}</Text>
            </Pressable>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.secondaryStartButton}
        onPress={() => router.push({ pathname: '/tracker/[disciplineId]/start', params: { disciplineId } })}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryStartButtonText}>Start activiteit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  fallback: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 32,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroMeta: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  heroDescription: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepIndex: {
    width: 24,
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 14,
  },
  stepText: {
    color: '#334155',
    fontSize: 14,
    flex: 1,
  },
  emptyRecent: {
    color: '#64748B',
    fontSize: 14,
  },
  recentItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  recentName: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 3,
  },
  recentSummary: {
    color: '#334155',
    fontSize: 12,
  },
  secondaryStartButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryStartButtonText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '800',
  },
});
