import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import {
  fetchFeedbackAnalytics,
  fetchFeedbackResponses,
  type FeedbackAnalytics,
  type FeedbackResponseRow,
} from '@/services/feedback-analytics';

function formatScore(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return '-';
  }
  return value.toFixed(2);
}

export default function FeedbackAnalyticsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [latestResponses, setLatestResponses] = useState<FeedbackResponseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = useCallback(async (refreshing: boolean) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [analyticsData, responsesData] = await Promise.all([
        fetchFeedbackAnalytics(),
        fetchFeedbackResponses(),
      ]);

      setAnalytics(analyticsData);
      setLatestResponses(responsesData.slice(0, 5));
      setErrorMessage('');
    } catch {
      setErrorMessage('Kon feedback analytics niet laden. Controleer of de backend draait.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(false);
    }, [loadData])
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} />}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
        <MaterialCommunityIcons name="chevron-left" size={22} color={theme.titleColor} />
        <Text style={[styles.backLabel, { color: theme.titleColor }]}>Instellingen</Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.titleColor }]}>Feedback Analytics</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>INZICHT IN GEBRUIKERSFEEDBACK</Text>

      {errorMessage ? (
        <View style={[styles.errorCard, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {analytics ? (
        <>
          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.cardLabel, { color: theme.subtitleColor }]}>TOTAAL RESPONSES</Text>
            <Text style={[styles.cardValue, { color: theme.titleColor }]}>{analytics.totalResponses}</Text>
          </View>

          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Gemiddelde Scores</Text>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Tevredenheid</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.overallSatisfaction)}</Text></View>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Gebruiksvriendelijkheid</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.usability)}</Text></View>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Navigatie</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.navigation)}</Text></View>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Snelheid</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.speed)}</Text></View>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Design</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.design)}</Text></View>
            <View style={styles.metricRow}><Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Motivatie</Text><Text style={[styles.metricValue, { color: theme.titleColor }]}>{formatScore(analytics.averages.motivation)}</Text></View>
          </View>

          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Workout Niveau</Text>
            {analytics.breakdowns.workoutLevel.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen data</Text>
            ) : (
              analytics.breakdowns.workoutLevel.map((item) => (
                <View style={styles.metricRow} key={`wl-${item.label}`}>
                  <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>{item.label}</Text>
                  <Text style={[styles.metricValue, { color: theme.titleColor }]}>{item.count}</Text>
                </View>
              ))
            )}
          </View>

          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Doelbereiking</Text>
            {analytics.breakdowns.helpsGoals.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen data</Text>
            ) : (
              analytics.breakdowns.helpsGoals.map((item) => (
                <View style={styles.metricRow} key={`hg-${item.label}`}>
                  <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>{item.label}</Text>
                  <Text style={[styles.metricValue, { color: theme.titleColor }]}>{item.count}</Text>
                </View>
              ))
            )}
          </View>

          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Laatste Reacties (Top 5)</Text>
            {latestResponses.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen reacties</Text>
            ) : (
              latestResponses.map((row) => (
                <View key={row.request_id} style={styles.responseRow}>
                  <Text style={[styles.responseDate, { color: theme.subtitleColor }]}>{new Date(row.received_at).toLocaleString()}</Text>
                  <Text style={[styles.responseText, { color: theme.titleColor }]} numberOfLines={2}>
                    {row.first_improve || row.best_thing || 'Geen tekst ingevuld'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      ) : null}

      {isLoading ? <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text> : null}
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
    paddingTop: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    marginTop: 12,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 16,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardValue: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  metricLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  responseRow: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  responseDate: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});
