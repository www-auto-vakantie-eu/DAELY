import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

export default function VisualSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const preferences = [
    { id: 'none', label: 'Geen voorkeur' },
    { id: 'man', label: 'Man' },
    { id: 'woman', label: 'Vrouw' },
  ];

  const languages = [
    { id: 'nl', label: 'Nederlands' },
    { id: 'en', label: 'English' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Header met back button */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#0D0F1A" />
            <Text style={styles.backLabel}>Visuele Instellingen</Text>
          </Pressable>
        </View>
        <Text style={styles.pageSubtitle}>Bepaal hoe beeldmateriaal en interfacevoorkeuren in de app worden getoond.</Text>

        {/* Sectie: Voorkeur voor foto's en video's */}
        <Text style={styles.sectionLabel}>VOORKEUR INHOUD</Text>
        <View style={styles.section}>
          {preferences.map((pref, index) => (
            <View key={pref.id}>
              <Pressable
                style={styles.preferenceRow}
                onPress={() => updateAppSetting('photoPreference', pref.id as 'none' | 'man' | 'woman')}
              >
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {appSettings.photoPreference === pref.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.preferenceLabel}>{pref.label}</Text>
              </Pressable>
              {index < preferences.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <Text style={styles.preferenceHint}>
          Kies je voorkeur voor foto&apos;s en video&apos;s in de app
        </Text>

        {/* Sectie: Taalinstellingen */}
        <Text style={styles.sectionLabel}>TAAL</Text>
        <View style={styles.section}>
          {languages.map((lang, index) => (
            <View key={lang.id}>
              <Pressable
                style={styles.preferenceRow}
                onPress={() => updateAppSetting('visualLanguage', lang.id as 'nl' | 'en')}
              >
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {appSettings.visualLanguage === lang.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.preferenceLabel}>{lang.label}</Text>
              </Pressable>
              {index < languages.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <Text style={styles.preferenceHint}>
          Selecteer de taal voor de app-interface
        </Text>

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
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0F1A',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    paddingHorizontal: 4,
    marginBottom: 20,
    lineHeight: 20,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 52,
  },
  preferenceHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    paddingHorizontal: 4,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 120,
  },
});
