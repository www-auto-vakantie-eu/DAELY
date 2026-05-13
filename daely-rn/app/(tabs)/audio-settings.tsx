import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

export default function AudioSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const voices = [
    { id: 'voice-male-1', label: 'Man - Diep', gender: 'male' },
    { id: 'voice-male-2', label: 'Man - Neutraal', gender: 'male' },
    { id: 'voice-male-3', label: 'Man - Enthousiast', gender: 'male' },
    { id: 'voice-female-1', label: 'Vrouw - Rustig', gender: 'female' },
    { id: 'voice-female-2', label: 'Vrouw - Professioneel', gender: 'female' },
    { id: 'voice-female-3', label: 'Vrouw - Vriendelijk', gender: 'female' },
  ];

  const languages = [
    { id: 'nl', label: 'Nederlands' },
    { id: 'en', label: 'English' },
  ];

  const maleVoices = voices.filter(v => v.gender === 'male');
  const femaleVoices = voices.filter(v => v.gender === 'female');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Header met back button */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#0D0F1A" />
            <Text style={styles.backLabel}>Audio Instellingen</Text>
          </Pressable>
        </View>
        <Text style={styles.pageSubtitle}>Kies stemprofiel en taal voor gesproken audio in de app.</Text>

        {/* Sectie: Stem - Mannelijk */}
        <Text style={styles.sectionLabel}>STEM - MANNELIJK</Text>
        <View style={styles.section}>
          {maleVoices.map((voice, index) => (
            <View key={voice.id}>
              <Pressable
                style={[styles.voiceRow, appSettings.selectedVoice === voice.id && styles.voiceRowSelected]}
                onPress={() => updateAppSetting('selectedVoice', voice.id)}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, appSettings.selectedVoice === voice.id && styles.radioOuterSelected]}>
                    {appSettings.selectedVoice === voice.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <View style={styles.voiceInfo}>
                  <Text style={styles.voiceLabel}>{voice.label}</Text>
                  <MaterialCommunityIcons name="play-circle-outline" size={16} color="#3B82F6" />
                </View>
              </Pressable>
              {index < maleVoices.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Sectie: Stem - Vrouwelijk */}
        <Text style={styles.sectionLabel}>STEM - VROUWELIJK</Text>
        <View style={styles.section}>
          {femaleVoices.map((voice, index) => (
            <View key={voice.id}>
              <Pressable
                style={[styles.voiceRow, appSettings.selectedVoice === voice.id && styles.voiceRowSelected]}
                onPress={() => updateAppSetting('selectedVoice', voice.id)}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, appSettings.selectedVoice === voice.id && styles.radioOuterSelected]}>
                    {appSettings.selectedVoice === voice.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <View style={styles.voiceInfo}>
                  <Text style={styles.voiceLabel}>{voice.label}</Text>
                  <MaterialCommunityIcons name="play-circle-outline" size={16} color="#3B82F6" />
                </View>
              </Pressable>
              {index < femaleVoices.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Sectie: Taal Voorkeur */}
        <Text style={styles.sectionLabel}>TAAL VOORKEUR</Text>
        <View style={styles.section}>
          {languages.map((lang, index) => (
            <View key={lang.id}>
              <Pressable
                style={styles.preferenceRow}
                onPress={() => updateAppSetting('audioLanguage', lang.id as 'nl' | 'en')}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, appSettings.audioLanguage === lang.id && styles.radioOuterSelected]}>
                    {appSettings.audioLanguage === lang.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.preferenceLabel}>{lang.label}</Text>
              </Pressable>
              {index < languages.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <Text style={styles.preferenceHint}>
          Selecteer de taal voor spraakuitvoer
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
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  voiceRowSelected: {
    backgroundColor: '#F0F9FF',
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
  radioOuterSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  voiceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
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
