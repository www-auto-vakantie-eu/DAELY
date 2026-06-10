import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_COLORS,
  type ActivityType,
} from '@/constants/workout-activities';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

const ACTIVITY_TYPES: ActivityType[] = ['kracht', 'running', 'hyrox', 'herstel', 'mobility'];

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  kracht: 'dumbbell',
  running: 'run-fast',
  hyrox: 'lightning-bolt',
  herstel: 'heart-pulse',
  mobility: 'human-handsup',
};

const SPORTS = [
  // Daely Disciplines
  { id: 'fitness', label: 'Fitness', icon: 'dumbbell' },
  { id: 'hardlopen', label: 'Hardlopen', icon: 'run-fast' },
  { id: 'zwaargewicht', label: 'Zwaargewicht', icon: 'weight-lifter' },
  { id: 'hyrox', label: 'Hyrox', icon: 'lightning-bolt' },
  { id: 'yoga', label: 'Yoga', icon: 'meditation' },
  { id: 'pilates', label: 'Pilates', icon: 'yoga' },
  { id: 'calisthenics', label: 'Calisthenics', icon: 'human-handsup' },
  { id: 'mobiliteit', label: 'Mobiliteit', icon: 'human-female-dance' },
  { id: 'vechttraining', label: 'Vechttraining', icon: 'boxing-glove' },
  
  // Teamsporten
  { id: 'voetbal', label: 'Voetbal', icon: 'soccer' },
  { id: 'basketbal', label: 'Basketbal', icon: 'basketball' },
  { id: 'hockey', label: 'Hockey', icon: 'hockey-sticks' },
  { id: 'handbal', label: 'Handbal', icon: 'handball' },
  { id: 'volleybal', label: 'Volleybal', icon: 'volleyball' },
  { id: 'rugby', label: 'Rugby', icon: 'rugby' },
  { id: 'baseball', label: 'Baseball', icon: 'baseball' },
  { id: 'softbal', label: 'Softbal', icon: 'baseball' },
  { id: 'lacrosse', label: 'Lacrosse', icon: 'lacrosse' },
  
  // Racketsporten
  { id: 'tennis', label: 'Tennis', icon: 'tennis' },
  { id: 'paddel', label: 'Padel', icon: 'tennis' },
  { id: 'badminton', label: 'Badminton', icon: 'badminton' },
  { id: 'tafeltennnis', label: 'Tafeltennnis', icon: 'ping-pong' },
  { id: 'squash', label: 'Squash', icon: 'racquetball' },
  
  // Watersporten
  { id: 'zwemmen', label: 'Zwemmen', icon: 'swim' },
  { id: 'surfen', label: 'Surfen', icon: 'surfer' },
  { id: 'wakeboarden', label: 'Wakeboarden', icon: 'water-skiing' },
  { id: 'kayaken', label: 'Kayaken', icon: 'kayak' },
  { id: 'roei', label: 'Roei', icon: 'rowing' },
  { id: 'duiken', label: 'Duiken', icon: 'diving-flippers' },
  { id: 'snorkelen', label: 'Snorkelen', icon: 'diving-flippers' },
  { id: 'kitesurfen', label: 'Kitesurfen', icon: 'kite' },
  { id: 'windsurfen', label: 'Windsurfen', icon: 'wind-power' },
  
  // Wielsport
  { id: 'fietsen', label: 'Fietsen', icon: 'bike' },
  { id: 'mtb', label: 'Mountain Biking', icon: 'bike-fast' },
  { id: 'wielrennen', label: 'Wielrennen', icon: 'bike' },
  { id: 'bmx', label: 'BMX', icon: 'bike-fast' },
  { id: 'skaten', label: 'Skaten', icon: 'skate' },
  { id: 'skateboarden', label: 'Skateboarden', icon: 'skateboard' },
  { id: 'step', label: 'Step', icon: 'scooter' },
  
  // Wintersporten
  { id: 'skiën', label: 'Skiën', icon: 'ski' },
  { id: 'snowboarden', label: 'Snowboarden', icon: 'snowboarder' },
  { id: 'schaatsen', label: 'Schaatsen', icon: 'ice-skate' },
  { id: 'langlaufen', label: 'Langlaufen', icon: 'cross-country-skiing' },
  { id: 'rodelen', label: 'Rodelen', icon: 'sledding' },
  
  // Atletiek & Loopsport
  { id: 'atletiek', label: 'Atletiek', icon: 'run-fast' },
  { id: 'wandelen', label: 'Wandelen', icon: 'walk' },
  { id: 'trailrunning', label: 'Trail Running', icon: 'run-fast' },
  { id: 'hindernislopen', label: 'Hindernislopen', icon: 'run-fast' },
  
  // Gevechts- & Vechtsporten
  { id: 'judo', label: 'Judo', icon: 'martial-arts-gi' },
  { id: 'karate', label: 'Karate', icon: 'martial-arts-gi' },
  { id: 'taekwondo', label: 'Taekwondo', icon: 'martial-arts-gi' },
  { id: 'brazilaans_jiu_jitsu', label: 'Braziliaans Jiu-Jitsu', icon: 'martial-arts-gi' },
  { id: 'worstelen', label: 'Worstelen', icon: 'martial-arts-gi' },
  { id: 'boksen', label: 'Boksen', icon: 'boxing-glove' },
  { id: 'mma', label: 'MMA', icon: 'boxing-glove' },
  { id: 'muay_thai', label: 'Muay Thai', icon: 'boxing-glove' },
  
  // Individuele sporten
  { id: 'golf', label: 'Golf', icon: 'golf' },
  { id: 'boogschieten', label: 'Boogschieten', icon: 'bow-arrow' },
  { id: 'schieten', label: 'Schieten', icon: 'ricochet' },
  { id: 'paardrijden', label: 'Paardrijden', icon: 'horse' },
  { id: 'paardensport', label: 'Paardensport', icon: 'horse-variant' },
  { id: 'dansen', label: 'Dansen', icon: 'dance-pole' },
  { id: 'gymnastica', label: 'Gymnastiek', icon: 'human-handsup' },
  { id: 'parkour', label: 'Parkour', icon: 'run-fast' },
  
  // Extreme sporten
  { id: 'klimmen', label: 'Klimmen', icon: 'climbing' },
  { id: 'abseilen', label: 'Abseilen', icon: 'rope' },
  { id: 'parachutespringen', label: 'Parachutespringen', icon: 'parachute' },
  { id: 'bungeejumpen', label: 'Bungee Jumpen', icon: 'rope' },
  { id: 'skydiven', label: 'Skydiven', icon: 'parachute' },
  
  // Motorsport
  { id: 'motoren', label: 'Motoren', icon: 'motorcycle' },
  { id: 'autocross', label: 'Autocross', icon: 'car-sports' },
  { id: 'motorsport', label: 'Motorsport', icon: 'race' },
  { id: 'gokarten', label: 'Gokarten', icon: 'race' },
  
  // Overige activiteiten
  { id: 'flexibity', label: 'Flexibiliteit', icon: 'human-handsup' },
  { id: 'recovery', label: 'Recovery', icon: 'heart-pulse' },
  { id: 'stretching', label: 'Stretching', icon: 'human-handsup' },
  { id: 'meditatie', label: 'Meditatie', icon: 'meditation' },
  { id: 'wandelen_natuur', label: 'Wandelen (natuur)', icon: 'tree' },
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
  { id: 'trampoline', label: 'Trampoline', icon: 'basketball-hoop' },
  { id: 'slackline', label: 'Slackline', icon: 'rope' },
] as const;

type SportId = (typeof SPORTS)[number]['id'];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateLabel(date: Date): string {
  const label = date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function AddWorkoutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addWorkoutActivity } = useAppContext();

  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType>('kracht');
  const [selectedSport, setSelectedSport] = useState<SportId>('fitness');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const today = new Date();
  const todayLabel = formatDateLabel(today);
  const todayIso = toIsoDate(today);
  const parsedDuration = Number.parseInt(durationMinutes.replace(/\D/g, ''), 10);
  const hasDurationValue = Number.isFinite(parsedDuration);
  const isDurationValid = !hasDurationValue || (parsedDuration >= 5 && parsedDuration <= 360);
  const normalizedTitle = title.trim().replace(/\s+/g, ' ');
  const canSave = normalizedTitle.length >= 3 && isDurationValid;

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    setFormError('');

    if (!isDurationValid) {
      setFormError('Duur moet tussen 5 en 360 minuten liggen.');
      return;
    }

    const timeLabel = today.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    const [hh, mm, ss] = today.toTimeString().slice(0, 8).split(':');
    const isoTime = `${hh}:${mm}:${ss}`;

    const newActivity = {
      id: `custom-${Date.now()}`,
      type: selectedType,
      title: normalizedTitle,
      date: `Vandaag · ${timeLabel}`,
      dateIso: `${todayIso}T${isoTime}`,
      icon: ACTIVITY_ICONS[selectedType],
      accentColor: ACTIVITY_TYPE_COLORS[selectedType],
      metrics: [
        {
          label: 'Sport',
          value: SPORTS.find((sport) => sport.id === selectedSport)?.label ?? 'Onbekend',
        },
        ...(hasDurationValue ? [{ label: 'Duur', value: `${parsedDuration} min` }] : []),
      ],
      splits: [],
      heartRateData: [],
      description: '',
      image: '',
    };

    setIsSaving(true);
    try {
      await addWorkoutActivity(newActivity);
      router.back();
    } catch {
      setFormError('Opslaan mislukt. Controleer je verbinding en probeer opnieuw.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={[styles.title, { color: theme.titleColor }]}>Log Training.</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>{todayLabel}</Text>

      <Text style={[styles.fieldLabel, { color: theme.subtitleColor }]}>TYPE</Text>
      <View style={styles.typeRow}>
        {ACTIVITY_TYPES.map((type) => {
          const isSelected = type === selectedType;
          const color = ACTIVITY_TYPE_COLORS[type];
          return (
            <Pressable
              key={type}
              style={[
                styles.typeChip,
                {
                  borderColor: isSelected ? color : theme.border,
                  backgroundColor: isSelected ? `${color}18` : theme.card,
                },
              ]}
              onPress={() => setSelectedType(type)}
            >
              <MaterialCommunityIcons
                name={ACTIVITY_ICONS[type] as any}
                size={16}
                color={isSelected ? color : theme.subtitleColor}
              />
              <Text style={[styles.typeChipText, { color: isSelected ? color : theme.subtitleColor }]}>
                {ACTIVITY_TYPE_LABELS[type]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.fieldLabel, { color: theme.subtitleColor }]}>SPORT</Text>
      <View style={styles.typeRow}>
        {SPORTS.map((sport) => {
          const isSelected = sport.id === selectedSport;
          return (
            <Pressable
              key={sport.id}
              style={[
                styles.typeChip,
                {
                  borderColor: isSelected ? '#2563EB' : theme.border,
                  backgroundColor: isSelected ? '#DBEAFE' : theme.card,
                },
              ]}
              onPress={() => setSelectedSport(sport.id)}
            >
              <MaterialCommunityIcons
                name={sport.icon as any}
                size={16}
                color={isSelected ? '#1D4ED8' : theme.subtitleColor}
              />
              <Text style={[styles.typeChipText, { color: isSelected ? '#1D4ED8' : theme.subtitleColor }]}>
                {sport.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.fieldLabel, { color: theme.subtitleColor }]}>NAAM</Text>
      <View style={[styles.inputWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.titleColor }]}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (formError) setFormError('');
          }}
          placeholder="Bijv. Upper Body Push"
          placeholderTextColor={theme.subtitleColor}
          maxLength={80}
          returnKeyType="done"
        />
      </View>

      <Text style={[styles.fieldLabel, { color: theme.subtitleColor }]}>DUUR (MINUTEN)</Text>
      <View style={[styles.inputWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.titleColor }]}
          value={durationMinutes}
          onChangeText={(text) => {
            setDurationMinutes(text.replace(/\D/g, ''));
            if (formError) setFormError('');
          }}
          placeholder="60"
          placeholderTextColor={theme.subtitleColor}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={4}
        />
      </View>

      {formError ? (
        <View style={styles.errorBanner}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#B91C1C" />
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      <Pressable
        style={[styles.saveButton, !canSave || isSaving ? styles.saveButtonDisabled : null]}
        onPress={handleSave}
        disabled={!canSave || isSaving}
      >
        <MaterialCommunityIcons name={isSaving ? 'progress-clock' : 'check'} size={18} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>{isSaving ? 'Opslaan...' : 'Training opslaan'}</Text>
      </Pressable>
    </ScrollView>
    <SharedBottomNav activeTab="disciplines" />
  </AppScreen>
);
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 100 },
  title: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 28,
    fontSize: 14,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  typeChipText: { fontSize: 12, fontWeight: '700' },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 14,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: { backgroundColor: '#93C5FD' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  errorBanner: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
