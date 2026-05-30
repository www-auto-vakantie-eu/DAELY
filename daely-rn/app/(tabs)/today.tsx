import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ImageBackground, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/PageHeader';
import { Activity, getActivities } from 'services/activity-storage';
import { useAppContext } from '@/contexts/AppContext';
import { CONNECTED_DEVICES, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';

const HERO_BACKGROUND_STORAGE_KEY = 'daely.today.heroBackground.v1';

type HeroBackgroundOptionId = 'ownPhoto' | 'daelyHeader' | 'performance' | 'recovery' | 'community' | 'minimalDark';

type HeroBackgroundOption = {
  id: HeroBackgroundOptionId;
  label: string;
  source?: ImageSourcePropType;
  disabled?: boolean;
};

const HERO_BACKGROUND_OPTIONS: HeroBackgroundOption[] = [
  { id: 'ownPhoto', label: 'Eigen foto (Binnenkort)', disabled: true },
  { id: 'daelyHeader', label: 'DAELY header', source: require('../../assets/images/theme-classic.png') },
  { id: 'performance', label: 'Performance', source: require('../../assets/images/theme-pulse.png') },
  { id: 'recovery', label: 'Recovery', source: require('../../assets/images/theme-zen.ink.png') },
  { id: 'community', label: 'Community', source: require('../../assets/images/theme-retro-sport.png') },
  { id: 'minimalDark', label: 'Minimal dark' },
];

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
  const { user } = useAppContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [heroBackground, setHeroBackground] = useState<HeroBackgroundOptionId>('daelyHeader');
  const [showHeroBackgroundPicker, setShowHeroBackgroundPicker] = useState(false);
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);

  useEffect(() => {
    getActivities().then((items) => {
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(HERO_BACKGROUND_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      const exists = HERO_BACKGROUND_OPTIONS.some((option) => option.id === stored);
      if (exists) {
        setHeroBackground(stored as HeroBackgroundOptionId);
      }
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

  const selectedHeroBackground = HERO_BACKGROUND_OPTIONS.find((option) => option.id === heroBackground) ?? HERO_BACKGROUND_OPTIONS[1];
  const userName = typeof user.name === 'string' && user.name.trim().length > 0
    ? user.name.trim()
    : typeof user.username === 'string' && user.username.trim().length > 0
      ? user.username.trim()
      : undefined;
  const heroGreeting = userName ? `Welkom terug, ${userName}` : 'Welkom terug';

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
  const whoopDevice = CONNECTED_DEVICES.find((device) => device.id === 'whoop');
  const fitbitDevice = CONNECTED_DEVICES.find((device) => device.id === 'fitbit');
  const hasConnectedDevice = isWhoopConnected || isFitbitConnected;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <PageHeader
        title="Vandaag"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <Text style={[styles.dateLabel, { color: theme.subtitleColor }]}>{todayLabel}</Text>

      <View style={styles.heroWrap}>
        {selectedHeroBackground.source ? (
          <ImageBackground source={selectedHeroBackground.source} imageStyle={styles.heroImage} style={styles.heroCard}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <Pressable
                  style={styles.heroSettingsButton}
                  onPress={() => setShowHeroBackgroundPicker((v) => !v)}
                >
                  <MaterialCommunityIcons name="image-edit-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.heroSettingsButtonText}>Achtergrond wijzigen</Text>
                </Pressable>
              </View>
              <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
              <Text style={styles.welcomeSubtitle}>Alles wat je vandaag nodig hebt, staat hier klaar.</Text>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.heroCard, styles.heroCardFallback]}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <Pressable
                  style={styles.heroSettingsButton}
                  onPress={() => setShowHeroBackgroundPicker((v) => !v)}
                >
                  <MaterialCommunityIcons name="image-edit-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.heroSettingsButtonText}>Achtergrond wijzigen</Text>
                </Pressable>
              </View>
              <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
              <Text style={styles.welcomeSubtitle}>Alles wat je vandaag nodig hebt, staat hier klaar.</Text>
            </View>
          </View>
        )}

        {showHeroBackgroundPicker ? (
          <View style={styles.heroPickerCard}>
            {HERO_BACKGROUND_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                style={[styles.heroPickerItem, option.id === heroBackground ? styles.heroPickerItemActive : null, option.disabled ? styles.heroPickerItemDisabled : null]}
                disabled={option.disabled}
                onPress={() => {
                  if (option.disabled) return;
                  setHeroBackground(option.id);
                  setShowHeroBackgroundPicker(false);
                  AsyncStorage.setItem(HERO_BACKGROUND_STORAGE_KEY, option.id);
                }}
              >
                <Text style={[styles.heroPickerText, option.disabled ? styles.heroPickerTextDisabled : null]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
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

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Gekoppelde data</Text>
        <Text style={[styles.sectionHint, { color: theme.subtitleColor }]}>Overzicht van je huidige device-koppelingen.</Text>
        {!hasConnectedDevice ? (
          <>
            <Text style={[styles.dataFallback, { color: theme.subtitleColor }]}>Nog geen apparaat gekoppeld.</Text>
            <Text style={[styles.connectedSubtext, { color: theme.subtitleColor }]}>Koppel WHOOP of Fitbit om je dagdata automatisch te verrijken.</Text>
          </>
        ) : (
          <View style={styles.connectedList}>
            <View style={[styles.connectedItem, isWhoopConnected ? styles.connectedItemActive : null]}>
              <Text style={styles.connectedItemTitle}>WHOOP · {isWhoopConnected ? 'Verbonden' : 'Koppelbaar'}</Text>
              <Text style={styles.connectedItemText}>Data: {whoopDevice ? whoopDevice.dataPoints.join(', ') : 'Recovery, Sleep, Strain, Heart rate'}</Text>
            </View>
            <View style={[styles.connectedItem, isFitbitConnected ? styles.connectedItemActive : null]}>
              <Text style={styles.connectedItemTitle}>Fitbit · {isFitbitConnected ? 'Verbonden' : 'Koppelbaar'}</Text>
              <Text style={styles.connectedItemText}>Data: {fitbitDevice ? fitbitDevice.dataPoints.join(', ') : 'Steps, Sleep, Heart rate, HRV'}</Text>
            </View>
          </View>
        )}
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

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  heroWrap: {
    marginBottom: 12,
  },
  heroCard: {
    minHeight: 210,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  heroCardFallback: {
    backgroundColor: '#111827',
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.55)',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroSettingsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroPickerCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  heroPickerItem: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  heroPickerItemActive: {
    backgroundColor: '#DBEAFE',
  },
  heroPickerItemDisabled: {
    opacity: 0.6,
  },
  heroPickerText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  heroPickerTextDisabled: {
    color: '#64748B',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  primaryCard: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.26,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  primaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  dataFallback: {
    fontSize: 13,
    marginBottom: 8,
  },
  connectedSubtext: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  connectedList: {
    gap: 8,
  },
  connectedItem: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  connectedItemActive: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  connectedItemTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  connectedItemText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 17,
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
    gap: 6,
  },
  quickTile: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 9,
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickTilePressed: {
    opacity: 0.8,
  },
  quickTileDisabled: {
    backgroundColor: '#E2E8F0',
  },
  quickTileText: {
    marginTop: 0,
    marginLeft: 8,
    flex: 1,
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
