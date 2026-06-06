import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

const steps = [
  'Basisgegevens',
  'Functies & Disciplines',
  'Content voorkeuren',
  'Community instellingen',
  'Betaalwijze',
];

export default function ProfileWizardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  type ProfileWizardForm = {
    name: string;
    email: string;
    country: string;
    language: string;
    birthdate: string;
    gender: string;
    username: string;
    region: string;
    functions: string;
    disciplines: string[];
    contentPrefs: string[];
    community: { prefs?: string };
  };

  const [form, setForm] = useState<ProfileWizardForm>({
    name: '',
    email: '',
    country: '',
    language: '',
    birthdate: '',
    gender: '',
    username: '',
    region: '',
    functions: '',
    disciplines: [],
    contentPrefs: [],
    community: {},
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const skip = () => router.replace('/(tabs)/today');
  const finish = () => router.replace('/(tabs)/today');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="Profiel instellen"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="account-edit" size={32} color="#2563EB" />
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Stel je DAELY-profiel in</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Kies je doelen, disciplines en voorkeuren om DAELY op maat te maken.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressBar}>
            {steps.map((s, index) => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  index <= step ? styles.progressDotActive : null,
                  { backgroundColor: index <= step ? '#2563EB' : theme.border },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.progressText, { color: theme.subtitleColor }]}>
            Stap {step + 1} van {steps.length}: {steps[step]}
          </Text>
        </View>

        {step === 0 && (
          <View style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stepTitle, { color: theme.titleColor }]}>Basisgegevens</Text>
            <Text style={[styles.stepSubtitle, { color: theme.subtitleColor }]}>
              Vertel ons wie je bent, zodat we je DAELY-ervaring kunnen personaliseren.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Volledige naam"
              value={form.name}
              onChangeText={v => setForm(f => ({ ...f, name: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={form.email}
              onChangeText={v => setForm(f => ({ ...f, email: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Land"
              value={form.country}
              onChangeText={v => setForm(f => ({ ...f, country: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Taalvoorkeur"
              value={form.language}
              onChangeText={v => setForm(f => ({ ...f, language: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Geboortedatum (dd-mm-jjjj)"
              value={form.birthdate}
              onChangeText={v => setForm(f => ({ ...f, birthdate: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Geslacht"
              value={form.gender}
              onChangeText={v => setForm(f => ({ ...f, gender: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Gebruikersnaam"
              value={form.username}
              onChangeText={v => setForm(f => ({ ...f, username: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Regio / provincie / stad"
              value={form.region}
              onChangeText={v => setForm(f => ({ ...f, region: v }))}
            />
          </View>
        )}

        {step === 1 && (
          <View style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stepTitle, { color: theme.titleColor }]}>Functies & Disciplines</Text>
            <Text style={[styles.stepSubtitle, { color: theme.subtitleColor }]}>
              Kies welke DAELY-functies je gaat gebruiken en je sportdisciplines.
            </Text>
            <Text style={[styles.label, { color: theme.titleColor }]}>Welke functies ga je gebruiken?</Text>
            <TextInput
              style={styles.input}
              placeholder="Functies (bijv. schema's, challenges, voeding)"
              value={form.functions}
              onChangeText={v => setForm(f => ({ ...f, functions: v }))}
            />
            <Text style={[styles.label, { color: theme.titleColor }]}>Welke disciplines?</Text>
            <TextInput
              style={styles.input}
              placeholder="Disciplines (bijv. fitness, hardlopen, yoga)"
              value={form.disciplines.join(', ')}
              onChangeText={v => setForm(f => ({ ...f, disciplines: v.split(',').map(s => s.trim()) }))}
            />
          </View>
        )}

        {step === 2 && (
          <View style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stepTitle, { color: theme.titleColor }]}>Content voorkeuren</Text>
            <Text style={[styles.stepSubtitle, { color: theme.subtitleColor }]}>
              Kies je content- en creator-voorkeuren.
            </Text>
            <Text style={[styles.label, { color: theme.titleColor }]}>Creator- en contentvoorkeuren</Text>
            <TextInput
              style={styles.input}
              placeholder="Voorkeuren (bijv. voeding, kracht, yoga, mindset)"
              value={form.contentPrefs.join(', ')}
              onChangeText={v => setForm(f => ({ ...f, contentPrefs: v.split(',').map(s => s.trim()) }))}
            />
          </View>
        )}

        {step === 3 && (
          <View style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stepTitle, { color: theme.titleColor }]}>Community instellingen</Text>
            <View style={[styles.noticeCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
              <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
              <View style={styles.noticeContent}>
                <Text style={[styles.noticeTitle, { color: '#92400E' }]}>Binnenkort beschikbaar</Text>
                <Text style={[styles.noticeText, { color: '#B45309' }]}>
                  Community features worden binnenkort toegevoegd. Je kunt deze instellingen later aanpassen.
                </Text>
              </View>
            </View>
            <Text style={[styles.label, { color: theme.titleColor }]}>Social & community instellingen</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, opacity: 0.5 }]}
              placeholder="Community voorkeuren (binnenkort beschikbaar)"
              value={form.community.prefs || ''}
              editable={false}
            />
          </View>
        )}

        {step === 4 && (
          <View style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stepTitle, { color: theme.titleColor }]}>Betaalwijze</Text>
            <View style={[styles.noticeCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
              <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
              <View style={styles.noticeContent}>
                <Text style={[styles.noticeTitle, { color: '#92400E' }]}>Beheer in abonnementinstellingen</Text>
                <Text style={[styles.noticeText, { color: '#B45309' }]}>
                  Je kunt je betaalwijze en abonnementinstellingen beheren in Instellingen → Abonnement.
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.skipButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/subscription-settings')}
            >
              <MaterialCommunityIcons name="cog" size={20} color={theme.titleColor} />
              <Text style={[styles.skipButtonText, { color: theme.titleColor }]}>Open abonnementinstellingen</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={skip}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Overslaan</Text>
          </Pressable>
          {step > 0 && (
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={prev}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Vorige</Text>
            </Pressable>
          )}
          {step < steps.length - 1 ? (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: '#2563EB' }]}
              onPress={next}
            >
              <Text style={styles.primaryButtonText}>Volgende</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: '#2563EB' }]}
              onPress={finish}
            >
              <Text style={styles.primaryButtonText}>Naar Vandaag</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
  },
  progressCard: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressDotActive: {
    height: 6,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  stepCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  noticeCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 100,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 22,
  },
});