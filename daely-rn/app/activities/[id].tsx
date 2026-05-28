import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PageHeader from '../components/PageHeader';
import { getActivities, Activity } from 'services/activity-storage';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    getActivities().then((acts) => {
      setActivity(acts.find((a) => a.id === id) || null);
    });
  }, [id]);

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

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={activity.disciplineName || 'Activiteit'} />
      <Text style={styles.meta}>{formatDate(activity.endedAt)}</Text>
      <Text style={styles.meta}>{activity.disciplineName} · {activity.trackingType}</Text>
      <Text style={styles.meta}>Duur: {formatDuration(activity.durationSeconds)}</Text>
      <Text style={styles.meta}>Status: {activity.status}</Text>
      {activity.notes && (
        <Text style={styles.notes}>Notities: {activity.notes}</Text>
      )}
      {activity.metrics?.workout ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Workout metrics</Text>
          {(activity.metrics.workout.exercises ?? []).map((exercise) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {exercise.sets} sets · {exercise.reps} reps
                {exercise.weightKg !== undefined ? ` · ${exercise.weightKg} kg` : ''}
              </Text>
              {exercise.notes ? <Text style={styles.exerciseNotes}>{exercise.notes}</Text> : null}
            </View>
          ))}
          {activity.metrics.workout.totalVolumeKg !== undefined ? (
            <Text style={styles.totalVolume}>Totaal volume: {Math.round(activity.metrics.workout.totalVolumeKg)} kg</Text>
          ) : null}
          {activity.metrics.workout.notes ? (
            <Text style={styles.notes}>Workout notities: {activity.metrics.workout.notes}</Text>
          ) : null}
        </View>
      ) : null}
      {activity.metrics?.session ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Session metrics</Text>
          {activity.metrics.session.intensity ? (
            <Text style={styles.meta}>Intensiteit: {activity.metrics.session.intensity}</Text>
          ) : null}
          {activity.metrics.session.focusAreas && activity.metrics.session.focusAreas.length > 0 ? (
            <Text style={styles.meta}>Focusgebieden: {activity.metrics.session.focusAreas.join(', ')}</Text>
          ) : null}
          {activity.metrics.session.feelingBefore ? (
            <Text style={styles.meta}>Gevoel voor: {activity.metrics.session.feelingBefore}</Text>
          ) : null}
          {activity.metrics.session.feelingAfter ? (
            <Text style={styles.meta}>Gevoel na: {activity.metrics.session.feelingAfter}</Text>
          ) : null}
          {activity.metrics.session.notes ? (
            <Text style={styles.notes}>Session notities: {activity.metrics.session.notes}</Text>
          ) : null}
          {isPrivateDefault ? <Text style={styles.privacyNote}>Deze activiteit staat standaard prive.</Text> : null}
        </View>
      ) : null}
      {activity.metrics?.match ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Match metrics</Text>
          {activity.metrics.match.matchType ? <Text style={styles.meta}>Type: {activity.metrics.match.matchType}</Text> : null}
          {activity.metrics.match.team ? <Text style={styles.meta}>Team: {activity.metrics.match.team}</Text> : null}
          {activity.metrics.match.opponent ? <Text style={styles.meta}>Tegenstander: {activity.metrics.match.opponent}</Text> : null}
          {activity.metrics.match.position ? <Text style={styles.meta}>Positie: {activity.metrics.match.position}</Text> : null}
          {activity.metrics.match.scoreFor !== undefined || activity.metrics.match.scoreAgainst !== undefined ? (
            <Text style={styles.meta}>
              Score: {activity.metrics.match.scoreFor ?? '-'} - {activity.metrics.match.scoreAgainst ?? '-'}
            </Text>
          ) : null}
          {activity.metrics.match.personalStats ? (
            <View style={styles.personalStatsBox}>
              <Text style={styles.personalStatsTitle}>Persoonlijke stats</Text>
              {activity.metrics.match.personalStats.goals !== undefined ? <Text style={styles.meta}>Goals: {activity.metrics.match.personalStats.goals}</Text> : null}
              {activity.metrics.match.personalStats.assists !== undefined ? <Text style={styles.meta}>Assists: {activity.metrics.match.personalStats.assists}</Text> : null}
              {activity.metrics.match.personalStats.points !== undefined ? <Text style={styles.meta}>Points: {activity.metrics.match.personalStats.points}</Text> : null}
              {activity.metrics.match.personalStats.rebounds !== undefined ? <Text style={styles.meta}>Rebounds: {activity.metrics.match.personalStats.rebounds}</Text> : null}
              {activity.metrics.match.personalStats.blocks !== undefined ? <Text style={styles.meta}>Blocks: {activity.metrics.match.personalStats.blocks}</Text> : null}
              {activity.metrics.match.personalStats.tackles !== undefined ? <Text style={styles.meta}>Tackles: {activity.metrics.match.personalStats.tackles}</Text> : null}
            </View>
          ) : null}
          {activity.metrics.match.intensity ? <Text style={styles.meta}>Intensiteit: {activity.metrics.match.intensity}</Text> : null}
          {activity.metrics.match.notes ? <Text style={styles.notes}>Match notities: {activity.metrics.match.notes}</Text> : null}
        </View>
      ) : null}
      {activity.metrics?.score ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Score metrics</Text>
          {activity.metrics.score.scoreType ? <Text style={styles.meta}>Type: {activity.metrics.score.scoreType}</Text> : null}

          {activity.metrics.score.scoreType === 'racket' ? (
            <>
              {activity.metrics.score.opponent ? <Text style={styles.meta}>Tegenstander: {activity.metrics.score.opponent}</Text> : null}
              {activity.metrics.score.result ? <Text style={styles.meta}>Resultaat: {activity.metrics.score.result}</Text> : null}
              {activity.metrics.score.setsFor !== undefined || activity.metrics.score.setsAgainst !== undefined ? (
                <Text style={styles.meta}>Sets: {activity.metrics.score.setsFor ?? '-'} - {activity.metrics.score.setsAgainst ?? '-'}</Text>
              ) : null}
              {activity.metrics.score.pointsFor !== undefined || activity.metrics.score.pointsAgainst !== undefined ? (
                <Text style={styles.meta}>Punten: {activity.metrics.score.pointsFor ?? '-'} - {activity.metrics.score.pointsAgainst ?? '-'}</Text>
              ) : null}
            </>
          ) : null}

          {activity.metrics.score.scoreType === 'golf' ? (
            <>
              {activity.metrics.score.holesPlayed !== undefined ? <Text style={styles.meta}>Holes: {activity.metrics.score.holesPlayed}</Text> : null}
              {activity.metrics.score.strokes !== undefined ? <Text style={styles.meta}>Slagen: {activity.metrics.score.strokes}</Text> : null}
              {activity.metrics.score.par !== undefined ? <Text style={styles.meta}>Par: {activity.metrics.score.par}</Text> : null}
              {activity.metrics.score.handicap !== undefined ? <Text style={styles.meta}>Handicap: {activity.metrics.score.handicap}</Text> : null}
            </>
          ) : null}

          {activity.metrics.score.intensity ? <Text style={styles.meta}>Intensiteit: {activity.metrics.score.intensity}</Text> : null}
          {activity.metrics.score.notes ? <Text style={styles.notes}>Score notities: {activity.metrics.score.notes}</Text> : null}
        </View>
      ) : null}
      {activity.metrics?.skill ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Skill metrics</Text>
          {activity.metrics.skill.skillType ? <Text style={styles.meta}>Type: {activity.metrics.skill.skillType}</Text> : null}
          {activity.metrics.skill.level ? <Text style={styles.meta}>Niveau: {activity.metrics.skill.level}</Text> : null}
          {activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0 ? (
            <Text style={styles.meta}>Technieken: {activity.metrics.skill.techniques.join(', ')}</Text>
          ) : null}
          {activity.metrics.skill.attempts !== undefined || activity.metrics.skill.successfulAttempts !== undefined ? (
            <Text style={styles.meta}>
              Pogingen: {activity.metrics.skill.successfulAttempts ?? '-'} / {activity.metrics.skill.attempts ?? '-'} succesvol
            </Text>
          ) : null}
          {activity.metrics.skill.grade ? <Text style={styles.meta}>Grade: {activity.metrics.skill.grade}</Text> : null}
          {activity.metrics.skill.rounds !== undefined ? <Text style={styles.meta}>Rondes: {activity.metrics.skill.rounds}</Text> : null}
          {activity.metrics.skill.intensity ? <Text style={styles.meta}>Intensiteit: {activity.metrics.skill.intensity}</Text> : null}
          {activity.metrics.skill.notes ? <Text style={styles.notes}>Skill notities: {activity.metrics.skill.notes}</Text> : null}
        </View>
      ) : null}
      {activity.metrics?.laps ? (
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>Laps metrics</Text>
          {activity.metrics.laps.poolLengthMeters !== undefined ? <Text style={styles.meta}>Zwembadlengte: {activity.metrics.laps.poolLengthMeters} m</Text> : null}
          {activity.metrics.laps.laps !== undefined ? <Text style={styles.meta}>Banen: {activity.metrics.laps.laps}</Text> : null}
          {activity.metrics.laps.distanceMeters !== undefined ? <Text style={styles.meta}>Afstand: {activity.metrics.laps.distanceMeters} m</Text> : null}
          {activity.metrics.laps.strokeType ? <Text style={styles.meta}>Slagtype: {activity.metrics.laps.strokeType}</Text> : null}
          {activity.metrics.laps.pacePer100mSeconds !== undefined ? (
            <Text style={styles.meta}>Tempo per 100m: {formatPacePer100m(activity.metrics.laps.pacePer100mSeconds)}</Text>
          ) : null}
          {activity.metrics.laps.intensity ? <Text style={styles.meta}>Intensiteit: {activity.metrics.laps.intensity}</Text> : null}
          {activity.metrics.laps.notes ? <Text style={styles.notes}>Laps notities: {activity.metrics.laps.notes}</Text> : null}
        </View>
      ) : null}
      {!activity.metrics?.workout && !activity.metrics?.session && !activity.metrics?.match && !activity.metrics?.score && !activity.metrics?.skill && !activity.metrics?.laps ? (
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholder}>Metrics komen binnenkort voor deze discipline.</Text>
        </View>
      ) : null}
    </ScrollView>
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
  fallback: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  meta: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
  },
  notes: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
  },
  metricsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  exerciseMeta: {
    fontSize: 14,
    color: '#4B5563',
  },
  exerciseNotes: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  totalVolume: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  privacyNote: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  personalStatsBox: {
    marginTop: 6,
    marginBottom: 6,
  },
  personalStatsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  placeholderBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  placeholder: {
    color: '#6B7280',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
