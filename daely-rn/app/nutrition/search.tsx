import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useTheme } from '@/hooks/use-theme';

const POPULAR_SEARCHES = [
  'Eiwitrijke snacks',
  'Pre-workout maaltijd',
  'Herstel na training',
  'Gezonde lunch',
  'Hydratatie',
] as const;

export default function NutritionSearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader title="Voeding zoeken" showSettings={false} showSearch={false} showCart={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.introCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Snel vinden</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>Zoek snel voedingsinformatie of productdetails.</Text>
        </View>

        <View style={[styles.searchCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Zoekveld</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Zoek product, merk of maaltijd"
            placeholderTextColor="#9CA3AF"
            style={[styles.searchInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />
        </View>

        <View style={[styles.popularCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Text style={[styles.popularTitle, { color: theme.titleColor }]}>Populaire zoekopdrachten</Text>
          <View style={styles.chipsRow}>
            {POPULAR_SEARCHES.map((item) => (
              <Pressable
                key={item}
                onPress={() => setQuery(item)}
                style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.background }]}
              >
                <Text style={[styles.chipText, { color: theme.titleColor }]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {hasQuery ? (
          <View style={[styles.resultCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.resultText, { color: theme.subtitleColor }]}>Zoeken in voedingsdata komt binnenkort.</Text>
          </View>
        ) : null}
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
  searchCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  popularCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
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
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  resultText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});
