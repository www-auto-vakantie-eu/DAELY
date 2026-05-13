import { StyleSheet, ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

export default function AccessibilitySettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
            <Text style={styles.backLabel}>Toegankelijkheid</Text>
          </Pressable>
          <Text style={styles.pageSubtitle}>Pas contrast, beweging en tekstgrootte aan voor prettiger gebruik.</Text>
        </View>

        <Text style={styles.sectionLabel}>WEERGAVE</Text>
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Hoog contrast</Text><Switch value={appSettings.highContrast} onValueChange={(v) => updateAppSetting('highContrast', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Minder beweging</Text><Switch value={appSettings.reduceMotion} onValueChange={(v) => updateAppSetting('reduceMotion', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Haptische feedback</Text><Switch value={appSettings.haptics} onValueChange={(v) => updateAppSetting('haptics', v)} /></View>
        </View>

        <Text style={styles.sectionLabel}>TEKSTGROOTTE</Text>
        <View style={styles.section}>
          {[
            { id: 'normaal', label: 'Normaal' },
            { id: 'groot', label: 'Groot' },
            { id: 'extra', label: 'Extra groot' },
          ].map((item, index, arr) => (
            <View key={item.id}>
              <Pressable style={styles.optionRow} onPress={() => updateAppSetting('textSize', item.id as 'normaal' | 'groot' | 'extra')}>
                <Text style={styles.label}>{item.label}</Text>
                {appSettings.textSize === item.id ? <MaterialCommunityIcons name="check-circle" size={20} color="#2563EB" /> : <MaterialCommunityIcons name="circle-outline" size={20} color="#9CA3AF" />}
              </Pressable>
              {index < arr.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F2F4' },
  content: { padding: 16 },
  headerRow: { marginBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  backLabel: { fontSize: 18, fontWeight: '700', color: '#0D0F1A' },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#6B7280', paddingLeft: 4, lineHeight: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: '#9CA3AF', marginBottom: 10, marginLeft: 4 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  label: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
  bottomSpacer: { height: 120 },
});