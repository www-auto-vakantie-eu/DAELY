import { StyleSheet, ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function LegalAppInfoScreen() {
  const router = useRouter();
  const theme = useTheme();

  const mock = (title: string) => Alert.alert(title, 'Deze pagina is nog niet gekoppeld aan backend/content.');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
          <Text style={styles.backLabel}>Juridisch & App-info</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>JURIDISCH</Text>
        <View style={styles.section}>
          <Pressable style={styles.row} onPress={() => mock('Privacybeleid')}><Text style={styles.label}>Privacybeleid</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={() => mock('Algemene voorwaarden')}><Text style={styles.label}>Algemene voorwaarden</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={() => mock('Open-source licenties')}><Text style={styles.label}>Open-source licenties</Text><MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" /></Pressable>
        </View>

        <Text style={styles.sectionLabel}>APP-INFORMATIE</Text>
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Versie</Text><Text style={styles.value}>1.0.0</Text></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Build</Text><Text style={styles.value}>2026.03.25</Text></View>
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
  value: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
});