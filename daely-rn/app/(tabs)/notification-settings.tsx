import { StyleSheet, ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { getQuickWinPushCopyForSettings, type QuickWinPushDay } from '@/services/push-quickwins';

const DAY_ORDER: QuickWinPushDay[] = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];

function getTodayDayKey(): QuickWinPushDay {
  const jsDay = new Date().getDay();
  const indexFromMonday = (jsDay + 6) % 7;
  return DAY_ORDER[indexFromMonday];
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();
  const todayDayKey = getTodayDayKey();
  const quickWinPreview = [
    getQuickWinPushCopyForSettings(todayDayKey, 'slot1', appSettings.appLanguage),
    getQuickWinPushCopyForSettings(todayDayKey, 'slot2', appSettings.appLanguage),
    getQuickWinPushCopyForSettings(todayDayKey, 'slot3', appSettings.appLanguage),
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
            <Text style={styles.backLabel}>Meldingen</Text>
          </Pressable>
          <Text style={styles.pageSubtitle}>Kies per type welke meldingen je wilt ontvangen.</Text>
        </View>

        <Text style={styles.sectionLabel}>NOTIFICATIES PER TYPE</Text>
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Workouts</Text><Switch value={appSettings.notifyWorkouts} onValueChange={(v) => updateAppSetting('notifyWorkouts', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Reminders</Text><Switch value={appSettings.notifyReminders} onValueChange={(v) => updateAppSetting('notifyReminders', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Community</Text><Switch value={appSettings.notifyCommunity} onValueChange={(v) => updateAppSetting('notifyCommunity', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Uitdagingen</Text><Switch value={appSettings.notifyChallenges} onValueChange={(v) => updateAppSetting('notifyChallenges', v)} /></View>
          <View style={styles.separator} />
          <View style={styles.row}><Text style={styles.label}>Marketing</Text><Switch value={appSettings.notifyMarketing} onValueChange={(v) => updateAppSetting('notifyMarketing', v)} /></View>
        </View>

        <Text style={styles.sectionLabel}>VOORBEELD QUICK-WIN MELDINGEN</Text>
        <View style={styles.section}>
          {quickWinPreview.map((message, idx) => (
            <View key={`quickwin-preview-${idx}`}>
              <View style={styles.previewRow}>
                <MaterialCommunityIcons name="bell-outline" size={16} color="#6B7280" />
                <Text style={styles.previewText}>{message}</Text>
              </View>
              {idx < quickWinPreview.length - 1 && <View style={styles.separator} />}
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
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  label: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  previewText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#374151' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
  bottomSpacer: { height: 120 },
});