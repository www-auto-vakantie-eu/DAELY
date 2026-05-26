import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { addNutritionLog } from '@/services/nutrition-log';
import { searchNutrition, type NutritionSearchResult } from '@/services/nutrition-search';
import type { NutritionMealType } from '@/services/nutrition-log.types';

const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const UNIT_OPTIONS = ['gram', 'ml', 'portie', 'stuk', 'scoop', 'tablet', 'capsule'] as const;

function sourceLabel(source: NutritionSearchResult['source'], originSource?: NutritionSearchResult['originSource']): string {
  if (source === 'daely' && originSource === 'user') return 'Zelf toegevoegd';
  if (source === 'open_food_facts') return 'Open Food Facts';
  if (source === 'usda') return 'USDA';
  return 'DAELY';
}

function verificationHint(status?: string): string | null {
  if (!status) return null;
  if (status === 'admin_verified') return 'Geverifieerd door DAELY';
  if (status === 'brand_verified') return 'Geverifieerd door merk';
  if (status === 'label_verified') return 'Label geverifieerd';
  if (status === 'community_verified') return 'Community geverifieerd';
  if (status === 'unverified') return 'Community data (nog niet geverifieerd)';
  return `Status: ${status}`;
}

export default function NutritionSearchScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NutritionSearchResult[]>([]);
  const [selected, setSelected] = useState<NutritionSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [didSearch, setDidSearch] = useState(false);

  const [mealType, setMealType] = useState<NutritionMealType>('snack');
  const [amount, setAmount] = useState('100');
  const [amountUnit, setAmountUnit] = useState<(typeof UNIT_OPTIONS)[number]>('gram');
  const [isSaving, setIsSaving] = useState(false);

  const queryTrimmed = query.trim();
  const canSearch = queryTrimmed.length >= 3;

  useEffect(() => {
    setSelected(null);
    setErrorMessage(null);

    if (!canSearch) {
      setLoading(false);
      setDidSearch(false);
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await searchNutrition(queryTrimmed);
        setResults(found);
        setDidSearch(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Zoeken mislukt.');
        setResults([]);
        setDidSearch(true);
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => clearTimeout(handle);
  }, [queryTrimmed, canSearch]);

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value.replace(',', '.').trim());
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  const handleSelect = (item: NutritionSearchResult) => {
    setSelected(item);
    setAmount(String(item.servingSize > 0 ? item.servingSize : 100));

    const normalized = (item.servingUnit || '').toLowerCase();
    if (normalized.includes('ml')) {
      setAmountUnit('ml');
    } else if (normalized.includes('scoop')) {
      setAmountUnit('scoop');
    } else if (normalized.includes('stuk')) {
      setAmountUnit('stuk');
    } else if (normalized.includes('tablet')) {
      setAmountUnit('tablet');
    } else if (normalized.includes('capsule')) {
      setAmountUnit('capsule');
    } else if (normalized.includes('portie') || normalized.includes('serving')) {
      setAmountUnit('portie');
    } else {
      setAmountUnit('gram');
    }
  };

  const canSave = useMemo(() => !!selected && !isSaving, [selected, isSaving]);

  const handleAddToLog = async () => {
    if (!selected || !canSave) return;

    setIsSaving(true);
    try {
      await addNutritionLog({
        source: selected.source,
        itemType: selected.itemType || 'food',
        mealType,
        name: selected.name,
        brand: selected.brand,
        amount: parseNumber(amount),
        amountUnit,
        macros: {
          kcal: selected.kcal,
          protein: selected.protein,
          carbs: selected.carbs,
          fats: selected.fats,
        },
      });

      Alert.alert('Toegevoegd', 'Item toegevoegd aan Mijn Voeding.', [
        { text: 'Bekijk logboek', onPress: () => router.replace('/my-nutrition') },
      ]);
    } catch (error) {
      Alert.alert('Toevoegen mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.titleColor} />
          <Text style={[styles.backButtonText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.titleColor }]}>Handmatig zoeken</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Zoek voeding, drinken of supplementen uit meerdere bronnen.</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Zoek voeding, drinken of supplement..."
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        style={[styles.searchInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]}
      />

      {!canSearch ? (
        <Text style={[styles.infoText, { color: theme.subtitleColor }]}>Typ minimaal 3 tekens om te zoeken.</Text>
      ) : null}

      {loading ? (
        <View style={[styles.stateCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={[styles.stateText, { color: theme.subtitleColor }]}>Zoeken...</Text>
        </View>
      ) : null}

      {!loading && errorMessage ? (
        <View style={[styles.stateCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#EF4444" />
          <Text style={[styles.stateText, { color: theme.subtitleColor }]}>{errorMessage}</Text>
        </View>
      ) : null}

      {!loading && didSearch && results.length === 0 && !errorMessage ? (
        <View style={[styles.stateCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Text style={[styles.stateText, { color: theme.subtitleColor }]}>Geen resultaten gevonden.</Text>
          <Pressable style={[styles.addManualButton, { borderColor: theme.border }]} onPress={() => router.push('/nutrition/add')}>
            <MaterialCommunityIcons name="plus-circle-outline" size={16} color={theme.titleColor} />
            <Text style={[styles.addManualButtonText, { color: theme.titleColor }]}>Zelf item toevoegen</Text>
          </Pressable>
        </View>
      ) : null}

      {results.length > 0 ? (
        <View style={styles.resultsWrap}>
          {results.map((item) => {
            const isActive = selected?.externalId === item.externalId;
            return (
              <Pressable
                key={`${item.source}-${item.externalId}`}
                style={[styles.resultCard, { borderColor: isActive ? '#2563EB' : theme.border, backgroundColor: theme.card }]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.resultTopRow}>
                  <Text style={[styles.resultName, { color: theme.titleColor }]}>{item.name}</Text>
                  <View style={[styles.sourceBadge, { backgroundColor: isActive ? '#DBEAFE' : '#E5E7EB' }]}>
                    <Text style={styles.sourceBadgeText}>{sourceLabel(item.source, item.originSource)}</Text>
                  </View>
                </View>

                <Text style={[styles.resultMeta, { color: theme.subtitleColor }]}>
                  {item.brand || 'Onbekend merk'} · {item.kcal} kcal · E {item.protein}g · K {item.carbs}g · V {item.fats}g
                </Text>

                {item.verificationStatus ? (
                  <Text style={[styles.resultStatus, { color: item.verificationStatus === 'unverified' ? '#B45309' : theme.subtitleColor }]}>
                    {verificationHint(item.verificationStatus)}{item.confidenceScore ? ` · Confidence ${item.confidenceScore}` : ''}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {selected ? (
        <View style={[styles.selectionCard, { borderColor: theme.border, backgroundColor: theme.card }]}> 
          {selected.imageUrl ? <Image source={{ uri: selected.imageUrl }} style={styles.selectionImage} /> : null}
          <Text style={[styles.selectionTitle, { color: theme.titleColor }]}>{selected.name}</Text>
          <Text style={[styles.selectionMeta, { color: theme.subtitleColor }]}>{selected.brand || 'Onbekend merk'} · {sourceLabel(selected.source, selected.originSource)}</Text>

          {selected.verificationStatus ? (
            <Text style={[styles.selectionVerification, { color: selected.verificationStatus === 'unverified' ? '#B45309' : theme.subtitleColor }]}> 
              {verificationHint(selected.verificationStatus)}{selected.confidenceScore ? ` · Confidence ${selected.confidenceScore}` : ''}
            </Text>
          ) : null}

          <Text style={[styles.macrosText, { color: theme.subtitleColor }]}>
            {selected.kcal} kcal · E {selected.protein}g · K {selected.carbs}g · V {selected.fats}g
          </Text>

          <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>Meal type</Text>
          <View style={styles.chipRow}>
            {MEAL_TYPES.map((value) => {
              const active = mealType === value;
              return (
                <Pressable
                  key={value}
                  style={[styles.chip, { borderColor: active ? '#2563EB' : theme.border, backgroundColor: active ? '#DBEAFE' : theme.background }]}
                  onPress={() => setMealType(value)}
                >
                  <Text style={[styles.chipText, { color: active ? '#1D4ED8' : theme.titleColor }]}>{value}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>Hoeveelheid</Text>
          <View style={styles.amountRow}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
            />
            <View style={styles.unitRow}>
              {UNIT_OPTIONS.map((unit) => {
                const active = amountUnit === unit;
                return (
                  <Pressable
                    key={unit}
                    style={[styles.unitChip, { borderColor: active ? '#2563EB' : theme.border, backgroundColor: active ? '#DBEAFE' : theme.background }]}
                    onPress={() => setAmountUnit(unit)}
                  >
                    <Text style={[styles.unitChipText, { color: active ? '#1D4ED8' : theme.titleColor }]}>{unit}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable style={[styles.saveButton, !canSave ? styles.saveButtonDisabled : null]} disabled={!canSave} onPress={handleAddToLog}>
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>{isSaving ? 'Toevoegen...' : 'Toevoegen aan Mijn Voeding'}</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: -4,
    fontSize: 13,
    fontWeight: '500',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stateCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addManualButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  addManualButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultsWrap: {
    gap: 8,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  resultTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  resultName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  sourceBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceBadgeText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '800',
  },
  resultMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultStatus: {
    fontSize: 10,
    fontWeight: '600',
  },
  selectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  selectionImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  selectionMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectionVerification: {
    fontSize: 11,
    fontWeight: '600',
  },
  macrosText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  amountRow: {
    gap: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    width: '42%',
    fontSize: 14,
    fontWeight: '700',
  },
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unitChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  saveButton: {
    marginTop: 6,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
