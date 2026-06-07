import { StyleSheet, ScrollView, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

type SharePreference = 'private' | 'ask' | 'never';

const COMMUNITY_SHARE_PREFERENCE_KEY = 'daely.community.sharePreference.v1';

const OPTIONS = [
  { value: 'private' as SharePreference, label: 'Standaard privé', description: 'Alles wat je toevoegt in DAELY blijft standaard privé.' },
  { value: 'ask' as SharePreference, label: 'Vraag bij prestaties', description: 'Vraag of je updates wilt delen na activiteiten.' },
  { value: 'never' as SharePreference, label: 'Nooit vragen', description: 'Nooit vragen om iets te delen.' },
];

export default function CommunitySharingSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [sharePreference, setSharePreference] = useState<SharePreference>('private');

  useEffect(() => {
    AsyncStorage.getItem(COMMUNITY_SHARE_PREFERENCE_KEY).then((stored) => {
      if (stored && ['private', 'ask', 'never'].includes(stored)) {
        setSharePreference(stored as SharePreference);
      }
    });
  }, []);

  const handleSelect = (preference: SharePreference) => {
    setSharePreference(preference);
    AsyncStorage.setItem(COMMUNITY_SHARE_PREFERENCE_KEY, preference);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header met back button */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={theme.titleColor} />
            <Text style={[styles.backLabel, { color: theme.titleColor }]}>Community delen</Text>
          </Pressable>
        </View>
        <Text style={[styles.pageSubtitle, { color: theme.subtitleColor }]}>
          Bepaal wanneer DAELY je vraagt om updates op je feed te delen.
        </Text>

        {/* Sectie: Delen voorkeur */}
        <Text style={[styles.sectionLabel, { color: theme.titleColor }]}>DEELVOORKEUR</Text>
        <View style={styles.section}>
          {OPTIONS.map((option) => (
            <View key={option.value}>
              <Pressable
                style={styles.preferenceRow}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.radioContainer}>
                  <View style={[styles.radioOuter, { borderColor: theme.border }]}>
                    {sharePreference === option.value && <View style={[styles.radioInner, { backgroundColor: theme.tabBarActive }]} />}
                  </View>
                </View>
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, { color: theme.titleColor }]}>{option.label}</Text>
                  <Text style={[styles.preferenceDescription, { color: theme.subtitleColor }]}>{option.description}</Text>
                </View>
              </Pressable>
              {option.value !== 'never' && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
            </View>
          ))}
        </View>

        {/* Uitleg */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information" size={20} color={theme.tabBarActive} />
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
            Je deelt alleen bewust via Community of later bij prestaties. Alles blijft lokaal en privé.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  radioContainer: {
    paddingTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginLeft: 34,
    marginTop: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});