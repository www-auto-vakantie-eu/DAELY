import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';

const FEEDBACK_TYPES = ['Idee', 'Bug', 'Verbetering', 'Compliment'] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export default function FeedbackScreen() {
  const theme = useTheme();

  const [feedbackType, setFeedbackType] = useState<FeedbackType>('Idee');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSubmittedMessage, setShowSubmittedMessage] = useState(false);

  const canSubmit = useMemo(
    () => subject.trim().length > 0 && message.trim().length > 0,
    [subject, message],
  );

  const handleSubmit = () => {
    if (!canSubmit) {
      setShowSubmittedMessage(false);
      return;
    }

    setShowSubmittedMessage(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader title="Feedback" showSettings={false} showSearch={false} showCart={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Jouw input helpt</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>Help DAELY beter worden door je feedback te delen.</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Type feedback</Text>
          <View style={styles.typeRow}>
            {FEEDBACK_TYPES.map((type) => {
              const active = feedbackType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setFeedbackType(type)}
                  style={[
                    styles.typeChip,
                    { borderColor: active ? '#2563EB' : theme.border, backgroundColor: active ? '#DBEAFE' : theme.background },
                  ]}
                >
                  <Text style={[styles.typeChipText, { color: active ? '#1D4ED8' : theme.titleColor }]}>{type}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.subtitleColor }]}>Onderwerp</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Waar gaat je feedback over?"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />

          <Text style={[styles.label, { color: theme.subtitleColor }]}>Bericht</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Beschrijf je idee, bug of verbetering"
            placeholderTextColor="#9CA3AF"
            multiline
            style={[
              styles.input,
              styles.messageInput,
              { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background },
            ]}
          />

          <Pressable style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Feedback versturen</Text>
          </Pressable>

          {showSubmittedMessage ? (
            <View style={[styles.feedbackCard, { borderColor: theme.border, backgroundColor: theme.background }]}>
              <Text style={[styles.feedbackText, { color: theme.subtitleColor }]}>Bedankt voor je feedback. Verzenden naar het team komt binnenkort.</Text>
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
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  messageInput: {
    minHeight: 110,
    textAlignVertical: 'top',
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
    lineHeight: 19,
    fontWeight: '600',
  },
});
