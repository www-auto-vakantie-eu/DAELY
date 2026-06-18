import { StyleSheet, ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { useCallback, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useFocusEffect } from '@react-navigation/native';
import { getSettingsRequests, syncPendingSettingsRequests } from '@/services/settings-requests';
import AppHeader from '../components/AppHeader';
import { AppScreen } from '@/components/AppScreen';
import { THEMES } from '@/constants/themes';

function formatSyncTimestamp(iso: string | null): string {
  if (!iso) {
    return 'nog geen succesvolle sync';
  }

  const date = new Date(iso);
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function InstellingenScreen() {
  const { setIsLoggedIn, accountType, appSettings, updateAppSetting, activeThemeId } = useAppContext();
  const router = useRouter();
  const theme = useTheme();
  
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';

  const classicGlowGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  const sectionBorderColor = isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : undefined;
  const sectionShadowColor = isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : undefined;
  const iconColor = isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : currentTheme.colors.primary || '#6B7280';
  const chevronColor = isClassic ? '#475569' : '#D1D5DB';
  const titleColor = isClassic ? '#0F172A' : isForce ? '#7F1D1D' : isSahara ? '#7A4E24' : isRetro ? '#1B2E6B' : theme.titleColor;
  const subtitleColor = isClassic ? '#475569' : isForce ? '#B91C1C' : isSahara ? '#9A6B3A' : isRetro ? '#B42318' : theme.subtitleColor;
  const separatorColor = isClassic ? '#DBEAFE' : isForce ? '#FEE2E2' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : '#E5E7EB';
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState('Nog niet gesynchroniseerd in deze sessie.');
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const refreshSyncStatus = useCallback(async () => {
    try {
      const requests = await getSettingsRequests();
      const pending = requests.filter((item) => item.synced === false).length;
      const synced = requests
        .filter((item) => item.synced === true)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setLastSyncAt(synced[0]?.createdAt ?? null);
      setPendingSyncCount(pending);
    } catch {
      setSyncStatusMessage('Kon sync-status niet laden.');
    }
  }, []);

  const handleManualSync = useCallback(async () => {
    try {
      setSyncInProgress(true);
      const result = await syncPendingSettingsRequests();
      await refreshSyncStatus();
      if (result.synced > 0 || result.failed === 0) {
        setLastSyncAt(result.completedAt);
      }
      setSyncStatusMessage(
        result.attempted === 0
          ? 'Alles is al gesynchroniseerd.'
          : `Gesynchroniseerd: ${result.synced}, nog open: ${result.failed}`
      );
    } catch {
      setSyncStatusMessage('Synchroniseren mislukt. Probeer opnieuw.');
    } finally {
      setSyncInProgress(false);
    }
  }, [refreshSyncStatus]);

  useFocusEffect(
    useCallback(() => {
      refreshSyncStatus();
    }, [refreshSyncStatus])
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.replace('/(auth)/login');
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <AppHeader
        title="Instellingen"
        showSettings={false}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Sectie: Voorkeuren */}
        <Text style={[styles.sectionLabel, { color: titleColor }]}>VOORKEUREN</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <View style={styles.settingRow}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Notificaties</Text>
              </View>
              <Switch
                value={appSettings.notificationsEnabled}
                onValueChange={(value) => updateAppSetting('notificationsEnabled', value)}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/discipline-visibility-settings')}>
              <MaterialCommunityIcons name="eye-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Discipline-knoppen tonen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/tab-visibility-settings')}>
              <MaterialCommunityIcons name="view-dashboard-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Tabs tonen/verbergen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            {/* Donkere modus optie verwijderd */}
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/notification-settings')}>
              <MaterialCommunityIcons name="tune-vertical" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Meldingen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/accessibility-settings')}>
              <MaterialCommunityIcons name="human-handsup" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Toegankelijkheid</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/subscription-settings')}>
              <MaterialCommunityIcons name="credit-card-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Abonnement beheren</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <View style={styles.settingRow}>
              <MaterialCommunityIcons name="volume-high" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Geluidseffecten</Text>
              </View>
              <Switch
                value={appSettings.soundEffects}
                onValueChange={(value) => updateAppSetting('soundEffects', value)}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/connected-devices')}>
              <MaterialCommunityIcons name="link-variant" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Gekoppelde apparaten</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/data-link')}>
              <MaterialCommunityIcons name="plus-circle-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Koppel nieuw apparaat</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/hero-background-settings')}>
              <MaterialCommunityIcons name="image-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Welkom terug achtergrond</Text>
                <Text style={[styles.settingSublabel, { color: subtitleColor }]}>Kies je Today hero theme</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
          </View>
        </View>

        {/* Sectie: Account */}
        <Text style={[styles.sectionLabel, { color: titleColor }]}>ACCOUNT</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/account-security')}>
              <MaterialCommunityIcons name="shield-account-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Account & Beveiliging</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/privacy-consent')}>
              <MaterialCommunityIcons name="shield-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Privacy & Toestemming</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/language-region')}>
              <MaterialCommunityIcons name="translate" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Taal & Regio</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/themes')}>
              <MaterialCommunityIcons name="palette-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Thema&apos;s</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/visual-settings')}>
              <MaterialCommunityIcons name="eye-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Visuele Instellingen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/audio-settings')}>
              <MaterialCommunityIcons name="volume-high" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Audio Instellingen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: titleColor }]}>INFORMATIE</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/legal-app-info')}>
              <MaterialCommunityIcons name="information-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Juridisch & App-info</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/feedback-analytics')}>
              <MaterialCommunityIcons name="chart-box-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Feedback Analytics</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/legal-app-info')}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Privacybeleid</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/support-center')}>
              <MaterialCommunityIcons name="help-circle-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Hulp & Support</Text>
              </View>
            {pendingSyncCount > 0 ? (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pendingSyncCount}</Text>
              </View>
            ) : null}
            <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
          </Pressable>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: titleColor }]}>SYNC STATUS</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <View style={styles.settingRow}>
              <MaterialCommunityIcons
                name={pendingSyncCount > 0 ? 'cloud-alert-outline' : 'cloud-check-outline'}
                size={22}
                color={pendingSyncCount > 0 ? '#F59E0B' : '#10B981'}
              />
              <View style={styles.syncInfoWrap}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>
                  {pendingSyncCount > 0
                    ? `${pendingSyncCount} verzoek(en) wachten op sync`
                    : 'Alle verzoeken zijn gesynchroniseerd'}
                </Text>
                <Text style={[styles.lastSyncText, { color: subtitleColor }]}>Laatste sync: {formatSyncTimestamp(lastSyncAt)}</Text>
                <Text style={[styles.syncStatusText, { color: subtitleColor }]}>{syncStatusMessage}</Text>
              </View>
            </View>
          <View style={[styles.separator, { borderColor: separatorColor }]} />
          <Pressable
            style={styles.settingRow}
            onPress={handleManualSync}
            disabled={syncInProgress}
          >
            <MaterialCommunityIcons name="sync" size={22} color={iconColor} />
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, styles.syncActionText, { color: titleColor }]}>
                {syncInProgress ? 'Synchroniseren...' : 'Nu synchroniseren'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
          </Pressable>
        </View>
        </View>

        <Text style={[styles.sectionLabel, { color: titleColor }]}>QA TESTMODE</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/qa-smoke')}>
              <MaterialCommunityIcons name="flask-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, styles.syncActionText, { color: titleColor }]}>Open Smoke Test Center</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            {accountType === 'admin' ? (
              <>
                <View style={[styles.separator, { borderColor: separatorColor }]} />
                <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/admin-review')}>
                  <MaterialCommunityIcons name="shield-check-outline" size={22} color={iconColor} />
                <View style={styles.settingLabelContainer}>
                  <Text style={[styles.settingLabel, styles.syncActionText, { color: titleColor }]}>Open Admin Review</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
              </Pressable>
            </>
          ) : null}
        </View>
        </View>

        <Text style={[styles.sectionLabel, { color: titleColor }]}>OPTIONELE PROFIELVELDEN</Text>
        <View style={[styles.section, { borderColor: sectionBorderColor, shadowColor: sectionShadowColor }]}>
          <LinearGradient
            colors={classicGlowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionBackground}
            pointerEvents="none"
          />
          <View style={styles.sectionContent}>
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/goals')}>
              <MaterialCommunityIcons name="target" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Doelen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/training-level')}>
              <MaterialCommunityIcons name="dumbbell" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Trainingsniveau</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/training-preferences')}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Trainingsvoorkeuren</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/equipment')}>
              <MaterialCommunityIcons name="weight-lifter" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Beschikbare apparatuur</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/body-stats')}>
              <MaterialCommunityIcons name="ruler" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Lichaamsgegevens & progressie</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/injuries')}>
              <MaterialCommunityIcons name="bandage" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Blessures & beperkingen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/motivation')}>
              <MaterialCommunityIcons name="emoticon-happy-outline" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Motivatie & doelen</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
            <View style={[styles.separator, { borderColor: separatorColor }]} />
            <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/integrations')}>
              <MaterialCommunityIcons name="connection" size={22} color={iconColor} />
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: titleColor }]}>Integraties</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={chevronColor} />
            </Pressable>
          </View>
        </View>

        {/* Uitloggen */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Uitloggen</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F2F4',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#9CA3AF',
    marginBottom: 10,
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionContent: {
    position: 'relative',
    zIndex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingSublabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  syncInfoWrap: {
    flex: 1,
    gap: 2,
  },
  syncStatusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#374151',
  },
  syncActionText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  pendingBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pendingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 52,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 120,
  },
  feedbackHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D0F1A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  celebrationSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  celebrationHint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
