import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { addNutritionLog } from '@/services/nutrition-log';
import type { NutritionItemType, NutritionMealType } from '@/services/nutrition-log.types';

const ITEM_TYPES: NutritionItemType[] = ['food', 'drink', 'supplement'];
const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const UNITS = ['gram', 'ml', 'portie', 'stuk', 'scoop', 'tablet', 'capsule'] as const;

export default function AddNutritionScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [itemType, setItemType] = useState<NutritionItemType>('food');
  const [mealType, setMealType] = useState<NutritionMealType>('ontbijt');
  const [amount, setAmount] = useState('');
  const [amountUnit, setAmountUnit] = useState<(typeof UNITS)[number]>('gram');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = useMemo(() => name.trim().length > 0 && !isSaving, [name, isSaving]);

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value.replace(',', '.').trim());
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  const handleSave = async () => {
    if (!canSubmit) return;

    setIsSaving(true);
    try {
      await addNutritionLog({
        source: 'manual',
        itemType,
        mealType,
        name,
        brand,
        amount: parseNumber(amount),
        amountUnit,
        macros: {
          kcal: parseNumber(kcal),
          protein: parseNumber(protein),
          carbs: parseNumber(carbs),
          fats: parseNumber(fats),
        },
        notes,
      });

      Alert.alert('Opgeslagen', 'Item toegevoegd aan Mijn Voeding.', [
        {
          text: 'Bekijk logboek',
          onPress: () => router.replace('/my-nutrition'),
        },
      ]);
    } catch (error) {
      Alert.alert('Opslaan mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
          <Text style={[styles.backText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.titleColor }]}>Snel Toevoegen</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Voeding, drinken of supplement toevoegen.</Text>

      <Pressable style={[styles.scanShortcutButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.push('/nutrition/scan')}>
        <MaterialCommunityIcons name="barcode-scan" size={16} color={theme.titleColor} />
        <Text style={[styles.scanShortcutText, { color: theme.titleColor }]}>Barcode scannen</Text>
      </Pressable>

      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Naam</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Bijv. Protein shake" placeholderTextColor="#9CA3AF" style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />

        <Text style={[styles.label, { color: theme.subtitleColor }]}>Merk (optioneel)</Text>
        <TextInput value={brand} onChangeText={setBrand} placeholder="Bijv. XXL Nutrition" placeholderTextColor="#9CA3AF" style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Type</Text>
        <View style={styles.chipRow}>
          {ITEM_TYPES.map((value) => {
            const selected = itemType === value;
            return (
              <Pressable
                key={value}
                style={[styles.chip, { borderColor: selected ? '#2563EB' : theme.border, backgroundColor: selected ? '#DBEAFE' : theme.card }]}
                onPress={() => setItemType(value)}
              >
                <Text style={[styles.chipText, { color: selected ? '#1D4ED8' : theme.titleColor }]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.subtitleColor }]}>Meal type</Text>
        <View style={styles.chipRow}>
          {MEAL_TYPES.map((value) => {
            const selected = mealType === value;
            return (
              <Pressable
                key={value}
                style={[styles.chip, { borderColor: selected ? '#2563EB' : theme.border, backgroundColor: selected ? '#DBEAFE' : theme.card }]}
                onPress={() => setMealType(value)}
              >
                <Text style={[styles.chipText, { color: selected ? '#1D4ED8' : theme.titleColor }]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Hoeveelheid</Text>
        <View style={styles.inlineRow}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="decimal-pad"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.inlineInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]}
          />
          <View style={styles.unitRow}>
            {UNITS.map((unit) => {
              const selected = amountUnit === unit;
              return (
                <Pressable
                  key={unit}
                  style={[styles.unitChip, { borderColor: selected ? '#2563EB' : theme.border, backgroundColor: selected ? '#DBEAFE' : theme.card }]}
                  onPress={() => setAmountUnit(unit)}
                >
                  <Text style={[styles.unitChipText, { color: selected ? '#1D4ED8' : theme.titleColor }]}>{unit}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Macro's</Text>
        <View style={styles.macroGrid}>
          <TextInput value={kcal} onChangeText={setKcal} placeholder="kcal" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={protein} onChangeText={setProtein} placeholder="eiwit" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={carbs} onChangeText={setCarbs} placeholder="koolhydraten" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={fats} onChangeText={setFats} placeholder="vetten" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Notities (optioneel)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Bijv. met water gemixt"
          placeholderTextColor="#9CA3AF"
          multiline
          style={[styles.input, styles.notesInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]}
        />
      </View>

      <Pressable
        style={[styles.saveButton, !canSubmit ? styles.saveButtonDisabled : null]}
        onPress={handleSave}
        disabled={!canSubmit}
      >
        <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>{isSaving ? 'Opslaan...' : 'Opslaan'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 92,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  backText: {
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
  scanShortcutButton: {
    marginTop: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanShortcutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  block: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  inlineRow: {
    gap: 8,
  },
  inlineInput: {
    width: '45%',
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
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  macroInput: {
    width: '48.5%',
  },
  notesInput: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 6,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
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
    fontSize: 15,
    fontWeight: '800',
  },
});
