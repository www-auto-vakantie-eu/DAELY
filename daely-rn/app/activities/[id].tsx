import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PageHeader from '../components/PageHeader';
import { getActivities, deleteActivity, Activity } from 'services/activity-storage';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';
/* eslint-disable import/no-unresolved -- Platform split (ActivityMap.tsx/native.tsx/web.tsx) */
// @ts-ignore - Platform split (ActivityMap.tsx/native.tsx/web.tsx)
import ActivityMap from '@/components/ActivityMap';

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    getActivities().then((acts) => {
      setActivity(acts.find((a) => a.id === id) || null);
    });
  }, [id]);


  // Delete handler
  const handleDelete = () => {
    if (!activity) return;
    Alert.alert(
      'Activiteit verwijderen',
      'Weet je zeker dat je deze activiteit wilt verwijderen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            await deleteActivity(activity.id);
            router.replace('/activities');
          },
        },
      ]
    );
  };

  if (!activity) {
    return (
      <View style={styles.container}>
        <PageHeader title="Activiteit" />
        <Text style={styles.fallback}>Activiteit niet gevonden.</Text>
      </View>
    );
  }

  const discipline = SPORT_DISCIPLINES.find((item) => item.id === activity.disciplineId);
  const isPrivateDefault = discipline?.privacyDefault === 'private';
  const hasAnyMetrics = Boolean(
    activity.metrics?.workout ||
      activity.metrics?.session ||
      activity.metrics?.match ||
      activity.metrics?.score ||
      activity.metrics?.skill ||
      activity.metrics?.laps ||
      activity.metrics?.gps
  );

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Prestatie details" />

      <View style={styles.heroCard}>
        <Text style={styles.heroDiscipline}>{activity.disciplineName}</Text>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadge}>{activity.trackingType}</Text>
          <Text style={styles.heroBadge}>{activity.status}</Text>
        </View>
        <Text style={styles.heroDuration}>{formatDuration(activity.durationSeconds)}</Text>
        <Text style={styles.heroMeta}>{formatDate(activity.endedAt)}</Text>
        {activity.workoutName && (
          <View style={styles.workoutContext}>
            <Text style={styles.workoutContextTitle}>{activity.workoutName}</Text>
            {activity.programId && activity.programWeek && activity.programDay && (
              <Text style={styles.programContext}>Programma · Week {activity.programWeek} · Dag {activity.programDay}</Text>
            )}
          </View>
        )}
      </View>

      {activity.metrics?.workout ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Workout</Text>
          {(activity.metrics.workout.exercises ?? []).map((exercise) => (
            <View key={exercise.id} style={styles.subCard}>
              <Text style={styles.subCardTitle}>{exercise.name}</Text>
              <DetailRow
                label="Sets / reps"
                value={`${exercise.sets} / ${exercise.reps}${exercise.weightKg !== undefined ? ` · ${exercise.weightKg} kg` : ''}`}
              />
              {exercise.notes ? <DetailRow label="Notitie" value={exercise.notes} /> : null}
            </View>
          ))}
          {activity.metrics.workout.totalVolumeKg !== undefined ? (
            <DetailRow label="Totaal volume" value={`${Math.round(activity.metrics.workout.totalVolumeKg)} kg`} />
          ) : null}
          {activity.metrics.workout.notes ? <DetailRow label="Workout notitie" value={activity.metrics.workout.notes} /> : null}
        </View>
      ) : null}
      {activity.metrics?.session ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Session</Text>
          {activity.metrics.session.intensity ? <DetailRow label="Intensiteit" value={activity.metrics.session.intensity} /> : null}
          {activity.metrics.session.focusAreas && activity.metrics.session.focusAreas.length > 0 ? (
            <DetailRow label="Focusgebieden" value={activity.metrics.session.focusAreas.join(', ')} />
          ) : null}
          {activity.metrics.session.feelingBefore ? <DetailRow label="Gevoel voor" value={activity.metrics.session.feelingBefore} /> : null}
          {activity.metrics.session.feelingAfter ? <DetailRow label="Gevoel na" value={activity.metrics.session.feelingAfter} /> : null}
          {activity.metrics.session.notes ? <DetailRow label="Notitie" value={activity.metrics.session.notes} /> : null}
          {isPrivateDefault ? <Text style={styles.infoText}>Deze activiteit staat standaard prive.</Text> : null}
        </View>
      ) : null}
      {activity.metrics?.match ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Match</Text>
          {activity.metrics.match.matchType ? <DetailRow label="Type" value={activity.metrics.match.matchType} /> : null}
          {activity.metrics.match.team ? <DetailRow label="Team" value={activity.metrics.match.team} /> : null}
          {activity.metrics.match.opponent ? <DetailRow label="Tegenstander" value={activity.metrics.match.opponent} /> : null}
          {activity.metrics.match.position ? <DetailRow label="Positie" value={activity.metrics.match.position} /> : null}
          {activity.metrics.match.scoreFor !== undefined || activity.metrics.match.scoreAgainst !== undefined ? (
            <DetailRow label="Score" value={`${activity.metrics.match.scoreFor ?? '-'} - ${activity.metrics.match.scoreAgainst ?? '-'}`} />
          ) : null}
          {activity.metrics.match.personalStats ? (
            <View style={styles.subCard}>
              <Text style={styles.subCardTitle}>Persoonlijke stats</Text>
              {activity.metrics.match.personalStats.goals !== undefined ? <DetailRow label="Goals" value={`${activity.metrics.match.personalStats.goals}`} /> : null}
              {activity.metrics.match.personalStats.assists !== undefined ? <DetailRow label="Assists" value={`${activity.metrics.match.personalStats.assists}`} /> : null}
              {activity.metrics.match.personalStats.points !== undefined ? <DetailRow label="Points" value={`${activity.metrics.match.personalStats.points}`} /> : null}
              {activity.metrics.match.personalStats.rebounds !== undefined ? <DetailRow label="Rebounds" value={`${activity.metrics.match.personalStats.rebounds}`} /> : null}
              {activity.metrics.match.personalStats.blocks !== undefined ? <DetailRow label="Blocks" value={`${activity.metrics.match.personalStats.blocks}`} /> : null}
              {activity.metrics.match.personalStats.tackles !== undefined ? <DetailRow label="Tackles" value={`${activity.metrics.match.personalStats.tackles}`} /> : null}
            </View>
          ) : null}
          {activity.metrics.match.intensity ? <DetailRow label="Intensiteit" value={activity.metrics.match.intensity} /> : null}
          {activity.metrics.match.notes ? <DetailRow label="Notitie" value={activity.metrics.match.notes} /> : null}
        </View>
      ) : null}
      {activity.metrics?.score ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Score</Text>
          {activity.metrics.score.scoreType ? <DetailRow label="Type" value={activity.metrics.score.scoreType} /> : null}

          {activity.metrics.score.scoreType === 'racket' ? (
            <View style={styles.subCard}>
              <Text style={styles.subCardTitle}>Racket</Text>
              {activity.metrics.score.opponent ? <DetailRow label="Tegenstander" value={activity.metrics.score.opponent} /> : null}
              {activity.metrics.score.result ? <DetailRow label="Resultaat" value={activity.metrics.score.result} /> : null}
              {activity.metrics.score.setsFor !== undefined || activity.metrics.score.setsAgainst !== undefined ? (
                <DetailRow label="Sets" value={`${activity.metrics.score.setsFor ?? '-'} - ${activity.metrics.score.setsAgainst ?? '-'}`} />
              ) : null}
              {activity.metrics.score.pointsFor !== undefined || activity.metrics.score.pointsAgainst !== undefined ? (
                <DetailRow label="Punten" value={`${activity.metrics.score.pointsFor ?? '-'} - ${activity.metrics.score.pointsAgainst ?? '-'}`} />
              ) : null}
            </View>
          ) : null}

          {activity.metrics.score.scoreType === 'golf' ? (
            <View style={styles.subCard}>
              <Text style={styles.subCardTitle}>Golf</Text>
              {activity.metrics.score.holesPlayed !== undefined ? <DetailRow label="Holes" value={`${activity.metrics.score.holesPlayed}`} /> : null}
              {activity.metrics.score.strokes !== undefined ? <DetailRow label="Slagen" value={`${activity.metrics.score.strokes}`} /> : null}
              {activity.metrics.score.par !== undefined ? <DetailRow label="Par" value={`${activity.metrics.score.par}`} /> : null}
              {activity.metrics.score.handicap !== undefined ? <DetailRow label="Handicap" value={`${activity.metrics.score.handicap}`} /> : null}
            </View>
          ) : null}

          {activity.metrics.score.intensity ? <DetailRow label="Intensiteit" value={activity.metrics.score.intensity} /> : null}
          {activity.metrics.score.notes ? <DetailRow label="Notitie" value={activity.metrics.score.notes} /> : null}
        </View>
      ) : null}
      {activity.metrics?.skill ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Skill</Text>
          {activity.metrics.skill.skillType ? <DetailRow label="Type" value={activity.metrics.skill.skillType} /> : null}
          {activity.metrics.skill.level ? <DetailRow label="Niveau" value={activity.metrics.skill.level} /> : null}
          {activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0 ? (
            <DetailRow label="Technieken" value={activity.metrics.skill.techniques.join(', ')} />
          ) : null}
          {activity.metrics.skill.attempts !== undefined || activity.metrics.skill.successfulAttempts !== undefined ? (
            <DetailRow label="Pogingen" value={`${activity.metrics.skill.successfulAttempts ?? '-'} / ${activity.metrics.skill.attempts ?? '-'} succesvol`} />
          ) : null}
          {activity.metrics.skill.grade ? <DetailRow label="Grade" value={activity.metrics.skill.grade} /> : null}
          {activity.metrics.skill.rounds !== undefined ? <DetailRow label="Rondes" value={`${activity.metrics.skill.rounds}`} /> : null}
          {activity.metrics.skill.intensity ? <DetailRow label="Intensiteit" value={activity.metrics.skill.intensity} /> : null}
          {activity.metrics.skill.notes ? <DetailRow label="Notitie" value={activity.metrics.skill.notes} /> : null}
        </View>
      ) : null}
      {activity.metrics?.laps ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Laps</Text>
          {activity.metrics.laps.poolLengthMeters !== undefined ? <DetailRow label="Zwembadlengte" value={`${activity.metrics.laps.poolLengthMeters} m`} /> : null}
          {activity.metrics.laps.laps !== undefined ? <DetailRow label="Banen" value={`${activity.metrics.laps.laps}`} /> : null}
          {activity.metrics.laps.distanceMeters !== undefined ? <DetailRow label="Afstand" value={`${activity.metrics.laps.distanceMeters} m`} /> : null}
          {activity.metrics.laps.strokeType ? <DetailRow label="Slagtype" value={activity.metrics.laps.strokeType} /> : null}
          {activity.metrics.laps.pacePer100mSeconds !== undefined ? (
            <DetailRow label="Tempo per 100m" value={formatPacePer100m(activity.metrics.laps.pacePer100mSeconds)} />
          ) : null}
          {activity.metrics.laps.intensity ? <DetailRow label="Intensiteit" value={activity.metrics.laps.intensity} /> : null}
          {activity.metrics.laps.notes ? <DetailRow label="Notitie" value={activity.metrics.laps.notes} /> : null}
        </View>
      ) : null}
      {activity.metrics?.gps ? (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>GPS</Text>
          {activity.metrics.gps.distanceMeters !== undefined ? <DetailRow label="Afstand" value={`${Math.round(activity.metrics.gps.distanceMeters)} m`} /> : null}
          {activity.metrics.gps.averageSpeedKmh !== undefined && activity.metrics.gps.averageSpeedKmh !== null && !isNaN(activity.metrics.gps.averageSpeedKmh) ? <DetailRow label="Gemiddelde snelheid" value={`${activity.metrics.gps.averageSpeedKmh.toFixed(1)} km/u`} /> : null}
          {activity.metrics.gps.maxSpeedKmh !== undefined && activity.metrics.gps.maxSpeedKmh !== null && !isNaN(activity.metrics.gps.maxSpeedKmh) ? <DetailRow label="Max snelheid" value={`${activity.metrics.gps.maxSpeedKmh.toFixed(1)} km/u`} /> : null}
          {activity.metrics.gps.locationPermissionStatus ? <DetailRow label="Locatie permissie" value={activity.metrics.gps.locationPermissionStatus} /> : null}
          {activity.metrics.gps.routePoints && activity.metrics.gps.routePoints.length > 0 ? (
            <DetailRow label="Routepunten" value={`${activity.metrics.gps.routePoints.length}`} />
          ) : null}
          {activity.metrics.gps.notes ? <DetailRow label="Notitie" value={activity.metrics.gps.notes} /> : null}
          {activity.metrics.gps.routePoints && activity.metrics.gps.routePoints.length > 0 ? (
            <View style={styles.mapContainer}>
              <ActivityMap routePoints={activity.metrics.gps.routePoints} />
            </View>
          ) : null}
        </View>
      ) : null}
      {activity.notes ? (
        <View style={styles.notesCard}>
          <Text style={styles.metricTitle}>Notities</Text>
          <Text style={styles.notesText}>{activity.notes}</Text>
        </View>
      ) : null}

      {!hasAnyMetrics ? (
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholder}>Metrics komen binnenkort voor deze discipline.</Text>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push({ pathname: '/activities/[id]/edit', params: { id: activity.id } })}
        >
          <Text style={styles.editBtnText}>Activiteit bewerken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Activiteit verwijderen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}


function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function formatPacePer100m(seconds: number) {
  const rounded = Math.max(0, Math.round(seconds));
  const min = Math.floor(rounded / 60)
    .toString()
    .padStart(2, '0');
  const sec = (rounded % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  heroDiscipline: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  heroBadge: {
    marginRight: 8,
    backgroundColor: '#1E293B',
    color: '#BFDBFE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  heroDuration: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
  },
  heroMeta: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 14,
  },
  workoutContext: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
  },
  workoutContextTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  programContext: {
    color: '#BFDBFE',
    fontSize: 13,
    fontWeight: '600',
  },
  fallback: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  subCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
  },
  mapContainer: {
    marginTop: 12,
  },
  placeholderBox: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  placeholder: {
    color: '#6B7280',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'column',
    marginTop: 24,
    marginBottom: 16,
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
