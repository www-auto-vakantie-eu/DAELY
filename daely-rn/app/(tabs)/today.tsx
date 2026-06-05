import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ImageBackground, ImageSourcePropType } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/PageHeader';
import { Activity, getActivities } from 'services/activity-storage';
import { useAppContext } from '@/contexts/AppContext';
import { CONNECTED_DEVICES, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';

const HERO_BACKGROUND_STORAGE_KEY = 'daely.today.heroBackground.v1';
const SHORTCUTS_STORAGE_KEY = 'daely.today.shortcuts.v1';

type HeroBackgroundOptionId = 'ownPhoto' | 'daelyClassic' | 'sunriseEnergy' | 'midnightFocus' | 'recoveryFlow' | 'performanceBlue' | 'forestBalance' | 'communityPulse' | 'pureMinimal';

type ShortcutId = 'nutrition' | 'habits' | 'stats' | 'tracker' | 'activities' | 'shop' | 'feedback';

type ShortcutOption = {
  id: ShortcutId;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route: string;
};

type HeroBackgroundOption = {
  id: HeroBackgroundOptionId;
  label: string;
  source?: ImageSourcePropType;
  disabled?: boolean;
};

const HERO_BACKGROUND_OPTIONS: HeroBackgroundOption[] = [
  { id: 'ownPhoto', label: 'Eigen foto (Binnenkort)', disabled: true },
  { id: 'daelyClassic', label: 'DAELY Classic', source: require('../../assets/images/theme-classic.png') },
  { id: 'sunriseEnergy', label: 'Sunrise Energy', source: require('../../assets/images/theme-ember.png') },
  { id: 'midnightFocus', label: 'Midnight Focus', source: require('../../assets/images/theme-rogue.png') },
  { id: 'recoveryFlow', label: 'Recovery Flow', source: require('../../assets/images/theme-zen.ink.png') },
  { id: 'performanceBlue', label: 'Performance Blue', source: require('../../assets/images/theme-pulse.png') },
  { id: 'forestBalance', label: 'Forest Balance', source: require('../../assets/images/theme-forest-breath.png') },
  { id: 'communityPulse', label: 'Community Pulse', source: require('../../assets/images/theme-retro-sport.png') },
  { id: 'pureMinimal', label: 'Pure Minimal' },
];

const SHORTCUT_OPTIONS: ShortcutOption[] = [
  { id: 'nutrition', label: 'Voeding', icon: 'food-apple-outline', route: '/nutrition/add' },
  { id: 'habits', label: 'Habit tracker', icon: 'calendar-check-outline', route: '/habits' },
  { id: 'stats', label: 'Data', icon: 'chart-bar', route: '/my-stats' },
  { id: 'tracker', label: 'Start activiteit', icon: 'run-fast', route: '/tracker' },
  { id: 'activities', label: 'Activiteiten', icon: 'history', route: '/activities' },
  { id: 'shop', label: 'Shop', icon: 'shopping-outline', route: '/shop' },
  { id: 'feedback', label: 'Feedback', icon: 'chat-outline', route: '/feedback' },
];

const DEFAULT_SHORTCUTS: ShortcutId[] = ['nutrition', 'habits', 'stats'];

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
  const params = useLocalSearchParams<{ open?: string }>();
  const theme = useTheme();
  const { user } = useAppContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [heroBackground, setHeroBackground] = useState<HeroBackgroundOptionId>('daelyClassic');
  const [showHeroBackgroundPicker, setShowHeroBackgroundPicker] = useState(false);
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);
  const [shortcuts, setShortcuts] = useState<ShortcutId[]>(DEFAULT_SHORTCUTS);
  const [showShortcutPicker, setShowShortcutPicker] = useState(false);

  useEffect(() => {
    if (params.open === 'background') {
      setShowHeroBackgroundPicker(true);
      router.setParams({ open: undefined });
    } else if (params.open === 'shortcuts') {
      setShowShortcutPicker(true);
      router.setParams({ open: undefined });
    }
  }, [params.open, router]);

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
    AsyncStorage.getItem(SHORTCUTS_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 3 && parsed.every((id: string) => SHORTCUT_OPTIONS.some((opt) => opt.id === id))) {
          setShortcuts(parsed as ShortcutId[]);
        }
      } catch {
        // Fallback to defaults
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

const handleShortcutPress = (shortcutId: ShortcutId) => {
  const option = SHORTCUT_OPTIONS.find((opt) => opt.id === shortcutId);
  if (option) {
    router.push(option.route as any);
  }
};

const handleSaveShortcuts = async (newShortcuts: ShortcutId[]) => {
  setShortcuts(newShortcuts);
  setShowShortcutPicker(false);
  try {
    await AsyncStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(newShortcuts));
  } catch {
    // Silent fail, shortcuts remain in state
  }
};

const selectedShortcuts = shortcuts.map((id) => SHORTCUT_OPTIONS.find((opt) => opt.id === id)).filter(Boolean) as ShortcutOption[];

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <PageHeader
        title="Vandaag"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.heroWrap}>
        {selectedHeroBackground.source ? (
          <ImageBackground source={selectedHeroBackground.source} imageStyle={styles.heroImage} style={styles.heroCard}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <Text style={styles.heroDateLabel}>{todayLabel}</Text>
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
                <Text style={styles.welcomeSubtitle}>Vandaag hoeft niet perfect te zijn. Wel bewust, actief en beter dan gisteren.</Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.heroCard, styles.heroCardFallback]}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <Text style={styles.heroDateLabel}>{todayLabel}</Text>
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
                <Text style={styles.welcomeSubtitle}>Vandaag hoeft niet perfect te zijn. Wel bewust, actief en beter dan gisteren.</Text>
              </View>
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

      <View style={styles.shortcutsRow}>
        {selectedShortcuts.map((shortcut) => (
            <Pressable
              key={shortcut.id}
              style={[styles.shortcutCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => handleShortcutPress(shortcut.id)}
            >
              <MaterialCommunityIcons name={shortcut.icon} size={20} color="#2563EB" />
              <Text style={[styles.shortcutLabel, { color: theme.titleColor }]}>{shortcut.label}</Text>
            </Pressable>
          ))}
        </View>

        {showShortcutPicker ? (
          <View style={[styles.shortcutsPickerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.shortcutsPickerTitle, { color: theme.titleColor }]}>Kies 3 sneltoetsen</Text>
            <Text style={[styles.shortcutsPickerHint, { color: theme.subtitleColor }]}>Tap op een optie om te selecteren. Selecteer precies 3 opties.</Text>
            <View style={styles.shortcutsPickerOptions}>
              {SHORTCUT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.shortcutsPickerOption,
                    shortcuts.includes(option.id) ? styles.shortcutsPickerOptionSelected : null,
                    { backgroundColor: theme.background, borderColor: theme.border },
                  ]}
                  onPress={() => {
                    if (shortcuts.includes(option.id)) {
                      if (shortcuts.length > 1) {
                        handleSaveShortcuts(shortcuts.filter((id) => id !== option.id));
                      }
                    } else if (shortcuts.length < 3) {
                      handleSaveShortcuts([...shortcuts, option.id]);
                    }
                  }}
                >
                  <MaterialCommunityIcons name={option.icon} size={18} color={shortcuts.includes(option.id) ? '#2563EB' : '#94A3B8'} />
                  <Text style={[styles.shortcutsPickerOptionText, { color: shortcuts.includes(option.id) ? '#2563EB' : theme.titleColor }]}>{option.label}</Text>
                  {shortcuts.includes(option.id) && (
                    <MaterialCommunityIcons name="check-circle" size={16} color="#2563EB" />
                  )}
                </Pressable>
              ))}
            </View>
            <View style={styles.shortcutsPickerActions}>
              <Pressable
                style={[styles.shortcutsPickerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => setShowShortcutPicker(false)}
              >
                <Text style={[styles.shortcutsPickerButtonText, { color: theme.titleColor }]}>Annuleren</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

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
            <Text style={[styles.activityStatus, { color: theme.subtitleColor }]}>Nog geen activiteit</Text>
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
          <QuickActionTile label="Habit tracker" icon="calendar-check-outline" onPress={() => router.push('/habits')} />
          <QuickActionTile label="Geef feedback" icon="chat-outline" onPress={() => router.push('/feedback')} />
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
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroContent: {
    marginTop: 'auto',
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
  heroDateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  shortcutsSection: {
    marginBottom: 12,
  },
  shortcutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortcutsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  customizeButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  shortcutCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  shortcutsPickerCard: {
    marginTop: 8,
    borderRadius: 12,
    padding: 14,
  },
  shortcutsPickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  shortcutsPickerHint: {
    fontSize: 12,
    marginBottom: 12,
  },
  shortcutsPickerOptions: {
    gap: 6,
  },
  shortcutsPickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  shortcutsPickerOptionSelected: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  shortcutsPickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  shortcutsPickerActions: {
    marginTop: 8,
  },
  shortcutsPickerButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  shortcutsPickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
