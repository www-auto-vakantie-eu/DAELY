import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { clearQaSmokeSettingsRequests, submitSettingsRequest } from '@/services/settings-requests';
import { removeStoredWorkoutActivitiesByIdPrefix } from '@/services/workout-activities';
import { ACTIVITY_TYPE_COLORS } from '@/constants/workout-activities';

const SMOKE_CHECKS = [
  'Open Instellingen en controleer sync-status + laatste sync tijd.',
  'Gebruik "Testdata voorbereiden" en controleer pending requests.',
  'Ga naar Vandaag en controleer dat de test-workout zichtbaar is.',
  'Open Kalender en controleer dezelfde test-workout op vandaag.',
  'Open workout detail door op de test-workout te tikken.',
  'Druk in Instellingen op Nu synchroniseren en check update.',
  'Herstart app en verifieer dat test-workout blijft bestaan.',
];

function isoDateToday(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function QaSmokeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addWorkoutActivity, fetchWorkouts } = useAppContext();

  const [isPreparing, setIsPreparing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [status, setStatus] = useState('Nog niet gestart.');

  const now = useMemo(() => new Date(), []);

  const handlePrepare = async () => {
    if (isPreparing || isResetting) return;

    setIsPreparing(true);
    setStatus('Testdata voorbereiden...');

    try {
      const isoDate = isoDateToday(now);
      const [hh, mm, ss] = now.toTimeString().slice(0, 8).split(':');
      const clock = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      const testWorkoutId = `qa-smoke-${Date.now()}`;

      await addWorkoutActivity({
        id: testWorkoutId,
        type: 'kracht',
        title: 'QA Smoke Workout',
        date: `Vandaag · ${clock}`,
        dateIso: `${isoDate}T${hh}:${mm}:${ss}`,
        icon: 'flask-outline',
        accentColor: ACTIVITY_TYPE_COLORS.kracht,
        metrics: [{ label: 'Duur', value: '20 min' }],
        splits: [],
        heartRateData: [],
        description: 'Automatisch aangemaakt voor smoke-validatie.',
        image: '',
      });

      await submitSettingsRequest(
        'feedback-form',
        { source: 'qa-smoke', note: 'forced-local-pending' },
        { forceLocal: true },
      );

      await fetchWorkouts();
      setStatus('Klaar. Test-workout + pending sync verzoek zijn aangemaakt.');
    } catch {
      setStatus('Voorbereiden mislukt. Probeer opnieuw.');
    } finally {
      setIsPreparing(false);
    }
  };

  const handleReset = async () => {
    if (isPreparing || isResetting) return;

    setIsResetting(true);
    setStatus('Testdata opschonen...');

    try {
      const removedWorkouts = await removeStoredWorkoutActivitiesByIdPrefix('qa-smoke-');
      const removedRequests = await clearQaSmokeSettingsRequests();
      await fetchWorkouts();
      setStatus(`Opschonen klaar. Verwijderd: ${removedWorkouts} workout(s), ${removedRequests} verzoek(en).`);
    } catch {
      setStatus('Opschonen mislukt. Probeer opnieuw.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
            <Text style={[styles.backLabel, { color: theme.titleColor }]}>Terug</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.titleColor }]}>QA Smoke.</Text>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>1 knop om testdata te maken + checklist te lopen.</Text>

        <Pressable
          style={[styles.prepareButton, isPreparing ? styles.prepareButtonDisabled : null]}
          onPress={handlePrepare}
          disabled={isPreparing || isResetting}
        >
          <MaterialCommunityIcons name={isPreparing ? 'progress-clock' : 'flask-outline'} size={18} color="#FFFFFF" />
          <Text style={styles.prepareButtonText}>{isPreparing ? 'Bezig...' : 'Testdata voorbereiden'}</Text>
        </Pressable>

        <Pressable
          style={[styles.resetButton, isResetting ? styles.resetButtonDisabled : null]}
          onPress={handleReset}
          disabled={isPreparing || isResetting}
        >
          <MaterialCommunityIcons name={isResetting ? 'progress-clock' : 'delete-outline'} size={18} color="#FFFFFF" />
          <Text style={styles.prepareButtonText}>{isResetting ? 'Opschonen...' : 'Reset testdata'}</Text>
        </Pressable>

        <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statusLabel, { color: theme.subtitleColor }]}>STATUS</Text>
          <Text style={[styles.statusText, { color: theme.titleColor }]}>{status}</Text>
        </View>

        <View style={[styles.checklistCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.checklistTitle, { color: theme.titleColor }]}>Smoke Checklist</Text>
          {SMOKE_CHECKS.map((item, index) => (
            <View key={item} style={styles.checklistRow}>
              <View style={styles.indexDot}>
                <Text style={styles.indexDotText}>{index + 1}</Text>
              </View>
              <Text style={[styles.checklistText, { color: theme.subtitleColor }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickNavRow}>
          <Pressable style={styles.quickNavButton} onPress={() => router.push('/(tabs)/today')}>
            <Text style={styles.quickNavButtonText}>Naar Vandaag</Text>
          </Pressable>
          <Pressable style={[styles.quickNavButton, styles.quickNavButtonAlt]} onPress={() => router.push('/workouts/calendar')}>
            <Text style={styles.quickNavButtonText}>Naar Kalender</Text>
          </Pressable>
          <Pressable style={[styles.quickNavButton, styles.quickNavButtonAlt2]} onPress={() => router.push('/(tabs)/athlete')}>
            <Text style={styles.quickNavButtonText}>Naar Instellingen</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  prepareButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  prepareButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  prepareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  resetButton: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resetButtonDisabled: {
    backgroundColor: '#FCA5A5',
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checklistCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  indexDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  indexDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  checklistText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  quickNavRow: {
    marginTop: 12,
    gap: 8,
  },
  quickNavButton: {
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    paddingVertical: 11,
    alignItems: 'center',
  },
  quickNavButtonAlt: {
    backgroundColor: '#10B981',
  },
  quickNavButtonAlt2: {
    backgroundColor: '#6B7280',
  },
  quickNavButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
