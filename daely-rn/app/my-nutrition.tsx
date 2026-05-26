import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import {
  buildDayKey,
  deleteNutritionLog,
  getNutritionDailyTotals,
  getNutritionLogsForDay,
} from '@/services/nutrition-log';
import type { NutritionDailyTotals, NutritionLogEntry, NutritionMealType } from '@/services/nutrition-log.types';

const MEAL_ORDER: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];

const MEAL_LABELS: Record<NutritionMealType, string> = {
  ontbijt: 'Ontbijt',
  lunch: 'Lunch',
  diner: 'Diner',
  snack: 'Snack',
  'pre-workout': 'Pre-workout',
  'post-workout': 'Post-workout',
  supplement: 'Supplement',
};

function groupByMealType(entries: NutritionLogEntry[]) {
  return MEAL_ORDER
    .map((mealType) => {
      const items = entries.filter((entry) => entry.mealType === mealType);
      if (items.length === 0) return null;

      const subtotals = items.reduce(
        (accumulator, entry) => ({
          kcal: Number((accumulator.kcal + entry.macros.kcal).toFixed(2)),
          protein: Number((accumulator.protein + entry.macros.protein).toFixed(2)),
          carbs: Number((accumulator.carbs + entry.macros.carbs).toFixed(2)),
          fats: Number((accumulator.fats + entry.macros.fats).toFixed(2)),
        }),
        { kcal: 0, protein: 0, carbs: 0, fats: 0 }
      );

      return {
        mealType,
        items,
        subtotals,
      };
    })
    .filter((group): group is { mealType: NutritionMealType; items: NutritionLogEntry[]; subtotals: { kcal: number; protein: number; carbs: number; fats: number } } => !!group);
}

export default function MyNutritionScreen() {
  const theme = useTheme();

  const router = useRouter();
  const [entries, setEntries] = useState<NutritionLogEntry[]>([]);
  const [totals, setTotals] = useState<NutritionDailyTotals>({
    dayKey: buildDayKey(new Date()),
    kcal: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    itemCount: 0,
  });

  const loadToday = useCallback(async () => {
    const dayKey = buildDayKey(new Date());
    const [dayEntries, dayTotals] = await Promise.all([
      getNutritionLogsForDay(dayKey),
      getNutritionDailyTotals(dayKey),
    ]);
    setEntries(dayEntries);
    setTotals(dayTotals);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadToday();
    }, [loadToday])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Item verwijderen', 'Weet je zeker dat je dit item wilt verwijderen?', [
      { text: 'Annuleren', style: 'cancel' },
      {
        text: 'Verwijderen',
        style: 'destructive',
        onPress: async () => {
          await deleteNutritionLog(id);
          await loadToday();
        },
      },
    ]);
  };

  const todayLabel = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const mealGroups = groupByMealType(entries);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.titleColor }]}>Mijn Voeding</Text>
          <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>{todayLabel.toUpperCase()}</Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => router.push('/nutrition/add')}>
          <MaterialCommunityIcons name="plus" size={15} color="#2563EB" />
          <Text style={styles.addButtonText}>Snel toevoegen</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>DAGOVERZICHT</Text>
      <View style={styles.totalsGrid}>
        <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalValue, { color: theme.titleColor }]}>{totals.kcal}</Text>
          <Text style={[styles.totalLabel, { color: theme.subtitleColor }]}>kcal</Text>
        </View>
        <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalValue, { color: theme.titleColor }]}>{totals.protein}g</Text>
          <Text style={[styles.totalLabel, { color: theme.subtitleColor }]}>eiwit</Text>
        </View>
        <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalValue, { color: theme.titleColor }]}>{totals.carbs}g</Text>
          <Text style={[styles.totalLabel, { color: theme.subtitleColor }]}>koolhydraten</Text>
        </View>
        <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalValue, { color: theme.titleColor }]}>{totals.fats}g</Text>
          <Text style={[styles.totalLabel, { color: theme.subtitleColor }]}>vetten</Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>LOGBOEK VANDAAG ({totals.itemCount})</Text>
      {entries.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={20} color={theme.subtitleColor} />
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen items gelogd vandaag.</Text>
        </View>
      ) : (
        mealGroups.map((group) => (
          <View key={group.mealType} style={[styles.groupCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <View style={styles.groupHeader}>
              <Text style={[styles.groupTitle, { color: theme.titleColor }]}>{MEAL_LABELS[group.mealType]}</Text>
              <Text style={[styles.groupSubtotal, { color: theme.subtitleColor }]}>{group.subtotals.kcal} kcal · E {group.subtotals.protein}g · K {group.subtotals.carbs}g · V {group.subtotals.fats}g</Text>
            </View>

            {group.items.map((entry) => (
              <View key={entry.id} style={[styles.entryCard, { borderColor: theme.border }]}> 
                <View style={styles.entryTopRow}>
                  <View style={styles.entryLeft}>
                    <Text style={[styles.entryName, { color: theme.titleColor }]}>{entry.name}</Text>
                    <Text style={[styles.entryMeta, { color: theme.subtitleColor }]}>
                      {entry.itemType}
                      {entry.amount && entry.amountUnit ? ` · ${entry.amount} ${entry.amountUnit}` : ''}
                    </Text>
                  </View>
                  <Pressable onPress={() => handleDelete(entry.id)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
                  </Pressable>
                </View>
                <Text style={[styles.entryMacros, { color: theme.subtitleColor }]}>
                  {entry.macros.kcal} kcal · E {entry.macros.protein}g · K {entry.macros.carbs}g · V {entry.macros.fats}g
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  addButton: {
    marginTop: 4,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionLabel: {
    marginTop: 4,
    marginBottom: 9,
    marginLeft: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  totalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  totalCard: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  totalValue: {
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  totalLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 11,
    marginBottom: 11,
    gap: 9,
  },
  groupHeader: {
    gap: 2,
    paddingHorizontal: 2,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  groupSubtotal: {
    fontSize: 11,
    fontWeight: '600',
  },
  entryCard: {
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  entryTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  entryLeft: {
    flex: 1,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '800',
  },
  entryMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  entryMacros: {
    marginTop: 9,
    fontSize: 11,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
});
