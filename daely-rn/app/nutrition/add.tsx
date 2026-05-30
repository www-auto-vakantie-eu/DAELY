import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useTheme } from '@/hooks/use-theme';

const MOMENTS = ['Ontbijt', 'Lunch', 'Diner', 'Snack', 'Drinken'] as const;

type Moment = (typeof MOMENTS)[number];

export default function AddNutritionScreen() {
  const theme = useTheme();

  const [mealName, setMealName] = useState('');
  const [moment, setMoment] = useState<Moment>('Ontbijt');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showPlaceholderFeedback, setShowPlaceholderFeedback] = useState(false);

  const canSubmit = useMemo(() => mealName.trim().length > 0, [mealName]);

  const handleSubmit = () => {
    if (!canSubmit) {
      setShowPlaceholderFeedback(false);
      Alert.alert('Incompleet', 'Vul eerst een product of maaltijdnaam in.');
      return;
    }

    setShowPlaceholderFeedback(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader title="Voeding toevoegen" showSettings={false} showSearch={false} showCart={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Snel vastleggen</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>Leg snel vast wat je hebt gegeten of gedronken.</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Product/maaltijd naam</Text>
          <TextInput
            value={mealName}
            onChangeText={setMealName}
            placeholder="Bijv. Griekse yoghurt met banaan"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />

          <Text style={[styles.label, { color: theme.subtitleColor }]}>Moment</Text>
          <View style={styles.chipsRow}>
            {MOMENTS.map((item) => {
              const active = item === moment;
              return (
                <Pressable
                  key={item}
                  onPress={() => setMoment(item)}
                  style={[
                    styles.chip,
                    { borderColor: active ? '#2563EB' : theme.border, backgroundColor: active ? '#DBEAFE' : theme.background },
                  ]}
                >
                  <Text style={[styles.chipText, { color: active ? '#1D4ED8' : theme.titleColor }]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.subtitleColor }]}>Hoeveelheid</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Bijv. 250 ml of 1 portie"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />

          <Text style={[styles.label, { color: theme.subtitleColor }]}>Notities</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Optioneel: hoe voelde je je, timing, etc."
            placeholderTextColor="#9CA3AF"
            multiline
            style={[
              styles.input,
              styles.notesInput,
              { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background },
            ]}
          />

          <Pressable style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Toevoegen</Text>
          </Pressable>

          {showPlaceholderFeedback ? (
            <View style={[styles.feedbackCard, { borderColor: theme.border, backgroundColor: theme.background }]}>
              <Text style={[styles.feedbackText, { color: theme.subtitleColor }]}>Voeding opslaan komt binnenkort.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  introCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  notesInput: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackCard: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});
