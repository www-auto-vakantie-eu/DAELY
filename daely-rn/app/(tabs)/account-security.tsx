import { StyleSheet, ScrollView, View, Text, Pressable, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { submitSettingsRequest } from '@/services/settings-requests';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const handleDeleteAccount = async () => {
    try {
      await submitSettingsRequest('data-deletion', { source: 'account-security' });
      Alert.alert('Verzoek geregistreerd', 'Je accountverwijderingsverzoek is opgeslagen.');
    } catch {
      Alert.alert('Fout', 'Verzoek kon niet worden opgeslagen. Probeer opnieuw.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
          <Text style={styles.backLabel}>Account & Beveiliging</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>INLOGGEN</Text>
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Biometrisch ontgrendelen</Text><Switch value={appSettings.biometric} onValueChange={(v) => updateAppSetting('biometric', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>2-staps verificatie</Text><Switch value={appSettings.twoFactor} onValueChange={(v) => updateAppSetting('twoFactor', v)} /></View>
          <View style={styles.separator} />
          <Pressable style={styles.row}><Text style={styles.label}>Wachtwoord wijzigen</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row}><Text style={styles.label}>Actieve sessies</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
        </View>

        <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteText}>Account verwijderen</Text>
        </Pressable>
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
  deleteButton: { marginTop: 18, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  deleteText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
});