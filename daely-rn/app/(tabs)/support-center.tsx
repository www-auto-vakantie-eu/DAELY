import { StyleSheet, ScrollView, View, Text, Pressable, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { submitSettingsRequest } from '@/services/settings-requests';

export default function SupportCenterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const handleContactSupport = async () => {
    try {
      await submitSettingsRequest('support-contact', { includeLogs: appSettings.includeLogs });
      Alert.alert('Supportverzoek verzonden', 'Ons team neemt zo snel mogelijk contact op.');
    } catch {
      Alert.alert('Fout', 'Supportverzoek kon niet worden opgeslagen.');
    }
  };

  const handleBugReport = async () => {
    try {
      await submitSettingsRequest('bug-report', { includeLogs: appSettings.includeLogs });
      Alert.alert('Bugrapport verzonden', 'Dankjewel. We hebben je rapport ontvangen.');
    } catch {
      Alert.alert('Fout', 'Bugrapport kon niet worden opgeslagen.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
          <Text style={styles.backLabel}>Hulp & Support</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.section}>
          <Pressable style={styles.row} onPress={() => Alert.alert('FAQ', 'FAQ pagina volgt in de volgende sprint.')}><Text style={styles.label}>FAQ</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={handleContactSupport}><Text style={styles.label}>Contact support</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={handleBugReport}><Text style={styles.label}>Bug rapporteren</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Logs meesturen</Text><Switch value={appSettings.includeLogs} onValueChange={(v) => updateAppSetting('includeLogs', v)} /></View>
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
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  label: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
});