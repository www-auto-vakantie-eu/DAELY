import { StyleSheet, ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { useCallback, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useFocusEffect } from '@react-navigation/native';
import { getSettingsRequests, syncPendingSettingsRequests } from '@/services/settings-requests';

function SettingsCartHeader({ theme, onSettings, onCart }: { theme: any; onSettings: () => void; onCart: () => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8, backgroundColor: theme.background }}>
      <Pressable
        style={({ pressed }) => [{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.card,
          borderColor: theme.border,
          marginRight: 10,
        }, pressed ? { opacity: 0.85 } : null]}
        onPress={onSettings}
      >
        <MaterialCommunityIcons name="cog-outline" size={22} color={theme.titleColor} />
      </Pressable>
      <Pressable
        style={({ pressed }) => [{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.card,
          borderColor: theme.border,
        }, pressed ? { opacity: 0.85 } : null]}
        onPress={onCart}
      >
        <MaterialCommunityIcons name="shopping-outline" size={22} color={theme.titleColor} />
      </Pressable>
    </View>
  );
}

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
  const { setIsLoggedIn, accountType, appSettings, updateAppSetting } = useAppContext();
  const router = useRouter();
  const theme = useTheme();
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
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <SettingsCartHeader
        theme={theme}
        onSettings={() => {}}
        onCart={() => router.push('/(tabs)/cart')}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.pageTitle}>Instellingen</Text>
          <Text style={styles.pageSubtitle}>BEHEER JE ACCOUNT</Text>
        </View>

        {/* Sectie: Voorkeuren */}
        <Text style={styles.sectionLabel}>VOORKEUREN</Text>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Notificaties</Text>
            <Switch
              value={appSettings.notificationsEnabled}
              onValueChange={(value) => updateAppSetting('notificationsEnabled', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/discipline-visibility-settings')}>
            <MaterialCommunityIcons name="eye-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Discipline-knoppen tonen</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/tab-visibility-settings')}>
            <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Tabs tonen/verbergen</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          {/* Donkere modus optie verwijderd */}
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/notification-settings')}>
            <MaterialCommunityIcons name="tune-vertical" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Meldingen</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/accessibility-settings')}>
            <MaterialCommunityIcons name="human-handsup" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Toegankelijkheid</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/subscription-settings')}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Abonnement beheren</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <MaterialCommunityIcons name="volume-high" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Geluidseffecten</Text>
            <Switch
              value={appSettings.soundEffects}
              onValueChange={(value) => updateAppSetting('soundEffects', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/connected-devices')}>
            <MaterialCommunityIcons name="link-variant" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Gekoppelde apparaten</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/data-link')}>
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Koppel nieuw apparaat</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
        </View>

        {/* Sectie: Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.section}>
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/account-security')}>
            <MaterialCommunityIcons name="shield-account-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Account & Beveiliging</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/privacy-consent')}>
            <MaterialCommunityIcons name="shield-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Privacy & Toestemming</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/language-region')}>
            <MaterialCommunityIcons name="translate" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Taal & Regio</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/themes')}>
            <MaterialCommunityIcons name="palette-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Thema&apos;s</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/visual-settings')}>
            <MaterialCommunityIcons name="eye-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Visuele Instellingen</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/audio-settings')}>
            <MaterialCommunityIcons name="volume-high" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Audio Instellingen</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>INFORMATIE</Text>
        <View style={styles.section}>
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/legal-app-info')}>
            <MaterialCommunityIcons name="information-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Juridisch & App-info</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/feedback-analytics')}>
            <MaterialCommunityIcons name="chart-box-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Feedback Analytics</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/legal-app-info')}>
            <MaterialCommunityIcons name="file-document-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Privacybeleid</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/support-center')}>
            <MaterialCommunityIcons name="help-circle-outline" size={22} color="#6B7280" />
            <Text style={styles.settingLabel}>Hulp & Support</Text>
            {pendingSyncCount > 0 ? (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pendingSyncCount}</Text>
              </View>
            ) : null}
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>SYNC STATUS</Text>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <MaterialCommunityIcons
              name={pendingSyncCount > 0 ? 'cloud-alert-outline' : 'cloud-check-outline'}
              size={22}
              color={pendingSyncCount > 0 ? '#F59E0B' : '#10B981'}
            />
            <View style={styles.syncInfoWrap}>
              <Text style={styles.settingLabel}>
                {pendingSyncCount > 0
                  ? `${pendingSyncCount} verzoek(en) wachten op sync`
                  : 'Alle verzoeken zijn gesynchroniseerd'}
              </Text>
              <Text style={styles.lastSyncText}>Laatste sync: {formatSyncTimestamp(lastSyncAt)}</Text>
              <Text style={styles.syncStatusText}>{syncStatusMessage}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <Pressable
            style={styles.settingRow}
            onPress={handleManualSync}
            disabled={syncInProgress}
          >
            <MaterialCommunityIcons name="sync" size={22} color="#2563EB" />
            <Text style={[styles.settingLabel, styles.syncActionText]}>
              {syncInProgress ? 'Synchroniseren...' : 'Nu synchroniseren'}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>QA TESTMODE</Text>
        <View style={styles.section}>
          <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/qa-smoke')}>
            <MaterialCommunityIcons name="flask-outline" size={22} color="#2563EB" />
            <Text style={[styles.settingLabel, styles.syncActionText]}>Open Smoke Test Center</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </Pressable>
          {accountType === 'admin' ? (
            <>
              <View style={styles.separator} />
              <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/admin-review')}>
                <MaterialCommunityIcons name="shield-check-outline" size={22} color="#2563EB" />
                <Text style={[styles.settingLabel, styles.syncActionText]}>Open Admin Review</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
              </Pressable>
            </>
          ) : null}
        </View>
          {/* Optionele profielvelden */}
          {/* ...styles */}
          {/* Plaats dit blok binnen de return van de function component, voor de uitlogknop: */}
          {/* ...andere content... */}
<Text style={styles.sectionLabel}>OPTIONELE PROFIELVELDEN</Text>
<View style={styles.section}>
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/goals')}>
    <Text style={styles.settingLabel}>Doelen</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/training-level')}>
    <Text style={styles.settingLabel}>Trainingsniveau</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/training-preferences')}>
    <Text style={styles.settingLabel}>Trainingsvoorkeuren</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/equipment')}>
    <Text style={styles.settingLabel}>Beschikbare apparatuur</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/body-stats')}>
    <Text style={styles.settingLabel}>Lichaamsgegevens & progressie</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/injuries')}>
    <Text style={styles.settingLabel}>Blessures & beperkingen</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/notifications')}>
    <Text style={styles.settingLabel}>Notificaties</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/role')}>
    <Text style={styles.settingLabel}>App-rol</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/integrations')}>
    <Text style={styles.settingLabel}>Integraties & apparaten</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/nutrition')}>
    <Text style={styles.settingLabel}>Voedingsvoorkeuren</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/motivation')}>
    <Text style={styles.settingLabel}>Motivatiestijl</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/content-style')}>
    <Text style={styles.settingLabel}>Contentstijl</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/event-goals')}>
    <Text style={styles.settingLabel}>Event- of wedstrijddoelen</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/privacy')}>
    <Text style={styles.settingLabel}>Privacy & toestemming</Text>
  </Pressable>
  <View style={styles.separator} />
  <Pressable style={styles.settingRow} onPress={() => router.push('/(tabs)/subscription-settings')}>
    <Text style={styles.settingLabel}>Abonnement & betaling</Text>
  </Pressable>
</View>

        {/* Uitloggen */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Uitloggen</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
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
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0D0F1A',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  pageSubtitle: {
    marginTop: 4,
    marginBottom: 28,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6B7280',
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
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
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
