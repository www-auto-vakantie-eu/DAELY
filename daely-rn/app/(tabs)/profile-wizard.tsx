import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

const steps = [
  'Basisgegevens',
  'Functies & Disciplines',
  'Content voorkeuren',
  'Community instellingen',
  'Betaalwijze',
];

export default function ProfileWizardScreen() {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  type ProfileWizardForm = {
    name: string;
    email: string;
    password: string;
    country: string;
    language: string;
    birthdate: string;
    gender: string;
    avatar: string;
    username: string;
    region: string;
    functions: string;
    disciplines: string[];
    contentPrefs: string[];
    community: { prefs?: string };
    payment: string;
  };

  const [form, setForm] = useState<ProfileWizardForm>({
    name: '',
    email: '',
    password: '',
    country: '',
    language: '',
    birthdate: '',
    gender: '',
    avatar: '',
    username: '',
    region: '',
    functions: '',
    disciplines: [],
    contentPrefs: [],
    community: {},
    payment: '',
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profiel aanvullen ({step + 1}/{steps.length})</Text>
      <Text style={styles.stepTitle}>{steps[step]}</Text>
      {step === 0 && (
        <View>
          <TextInput style={styles.input} placeholder="Volledige naam" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <TextInput style={styles.input} placeholder="E-mail" value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} />
          <TextInput style={styles.input} placeholder="Wachtwoord" secureTextEntry value={form.password} onChangeText={v => setForm(f => ({ ...f, password: v }))} />
          <TextInput style={styles.input} placeholder="Land" value={form.country} onChangeText={v => setForm(f => ({ ...f, country: v }))} />
          <TextInput style={styles.input} placeholder="Taalvoorkeur" value={form.language} onChangeText={v => setForm(f => ({ ...f, language: v }))} />
          <TextInput style={styles.input} placeholder="Geboortedatum (dd-mm-jjjj)" value={form.birthdate} onChangeText={v => setForm(f => ({ ...f, birthdate: v }))} />
          <TextInput style={styles.input} placeholder="Geslacht" value={form.gender} onChangeText={v => setForm(f => ({ ...f, gender: v }))} />
          <TextInput style={styles.input} placeholder="Gebruikersnaam" value={form.username} onChangeText={v => setForm(f => ({ ...f, username: v }))} />
          <TextInput style={styles.input} placeholder="Regio / provincie / stad" value={form.region} onChangeText={v => setForm(f => ({ ...f, region: v }))} />
          {/* Profielfoto upload kan hier als aparte component */}
        </View>
      )}
      {step === 1 && (
        <View>
          <Text style={styles.label}>Welke functies ga je gebruiken?</Text>
          <TextInput style={styles.input} placeholder="Functies (bijv. schema's, challenges)" value={form.functions} onChangeText={v => setForm(f => ({ ...f, functions: v }))} />
          <Text style={styles.label}>Welke disciplines?</Text>
          <TextInput style={styles.input} placeholder="Disciplines (bijv. fitness, hardlopen)" value={form.disciplines.join(', ')} onChangeText={v => setForm(f => ({ ...f, disciplines: v.split(',').map(s => s.trim()) }))} />
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={styles.label}>Creator- en contentvoorkeuren</Text>
          <TextInput style={styles.input} placeholder="Voorkeuren (bijv. voeding, kracht, yoga)" value={form.contentPrefs.join(', ')} onChangeText={v => setForm(f => ({ ...f, contentPrefs: v.split(',').map(s => s.trim()) }))} />
        </View>
      )}
      {step === 3 && (
        <View>
          <Text style={styles.label}>Social & community instellingen</Text>
          <TextInput style={styles.input} placeholder="Community voorkeuren" value={form.community.prefs || ''} onChangeText={v => setForm(f => ({ ...f, community: { ...f.community, prefs: v } }))} />
        </View>
      )}
      {step === 4 && (
        <View>
          <Text style={styles.label}>Manier van betalen / rekening koppelen</Text>
          <TextInput style={styles.input} placeholder="Betaalmethode (iDEAL, creditcard, etc.)" value={form.payment} onChangeText={v => setForm(f => ({ ...f, payment: v }))} />
        </View>
      )}
      <View style={styles.buttonRow}>
        {step > 0 && <Button title="Vorige" onPress={prev} />}
        {step < steps.length - 1 ? (
          <Button title="Volgende" onPress={next} />
        ) : (
          <Button title="Afronden" onPress={() => alert('Profiel opgeslagen!')} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  stepTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  label: { fontWeight: '600', marginBottom: 6 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});
