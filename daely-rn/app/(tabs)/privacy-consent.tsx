import { StyleSheet, ScrollView, View, Text, Pressable, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { submitSettingsRequest } from '@/services/settings-requests';

export default function PrivacyConsentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const handleDataExport = async () => {
    try {
      await submitSettingsRequest('data-export', { source: 'privacy-consent' });
      Alert.alert('Dataverzoek verzonden', 'Je datadownload is geregistreerd en wordt voorbereid.');
    } catch {
      Alert.alert('Fout', 'Het dataverzoek kon niet worden opgeslagen. Probeer opnieuw.');
    }
  };

  const handleDataDeletion = async () => {
    try {
      await submitSettingsRequest('data-deletion', { source: 'privacy-consent' });
      Alert.alert('Verwijderverzoek verzonden', 'Je verzoek is veilig geregistreerd.');
    } catch {
      Alert.alert('Fout', 'Het verwijderverzoek kon niet worden opgeslagen. Probeer opnieuw.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
          <Text style={styles.backLabel}>Privacy & Toestemming</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>TOESTEMMINGEN</Text>
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Analytics</Text><Switch value={appSettings.analytics} onValueChange={(v) => updateAppSetting('analytics', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Gepersonaliseerde content</Text><Switch value={appSettings.personalization} onValueChange={(v) => updateAppSetting('personalization', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Locatiegebruik</Text><Switch value={appSettings.location} onValueChange={(v) => updateAppSetting('location', v)} /></View>
        </View>

        <Text style={styles.sectionLabel}>MIJN DATA</Text>
        <View style={styles.section}>
          <Pressable style={styles.row} onPress={handleDataExport}>
            <Text style={styles.label}>Download mijn data</Text>
            <MaterialCommunityIcons name="download" size={20} color="#2563EB" />
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={handleDataDeletion}>
            <Text style={[styles.label, { color: '#DC2626' }]}>Verwijder mijn data</Text>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#DC2626" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F2F4' },
  content: { padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  backLabel: { fontSize: 18, fontWeight: '700', color: '#0D0F1A' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: '#9CA3AF', marginBottom: 10, marginLeft: 4 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  label: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
});