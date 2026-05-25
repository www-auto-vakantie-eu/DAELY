import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';

type Meal = (typeof NUTRITION_MEALS)[number];

const compareRows = [
  { label: 'Calorieen', key: 'kcal' as const, unit: 'kcal' },
  { label: 'Eiwit', key: 'protein' as const, unit: 'g' },
  { label: 'Koolhydraten', key: 'carbs' as const, unit: 'g' },
  { label: 'Vetten', key: 'fats' as const, unit: 'g' },
] as const;

export default function NutritionCompareScreen() {
  const theme = useTheme();
  const router = useRouter();
  const initialLeft = NUTRITION_MEALS[0]?.id ?? '';
  const initialRight = NUTRITION_MEALS[1]?.id ?? NUTRITION_MEALS[0]?.id ?? '';

  const [leftMealId, setLeftMealId] = useState(initialLeft);
  const [rightMealId, setRightMealId] = useState(initialRight);

  const leftMeal = useMemo(
    () => NUTRITION_MEALS.find((meal) => meal.id === leftMealId) ?? NUTRITION_MEALS[0],
    [leftMealId],
  );
  const rightMeal = useMemo(
    () => NUTRITION_MEALS.find((meal) => meal.id === rightMealId) ?? NUTRITION_MEALS[1] ?? NUTRITION_MEALS[0],
    [rightMealId],
  );

  if (!leftMeal || !rightMeal) {
    return (
      <View style={[styles.emptyWrap, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.titleColor }]}>Geen voedingsdata gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.titleColor} />
          <Text style={[styles.backButtonText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.titleColor }]}>Vergelijk Eten</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Twijfel je tussen twee opties, zoals 2 soorten ijsjes? Vergelijk ze direct.</Text>

      <View style={styles.selectionRow}>
        <View style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.selectionLabel, { color: theme.subtitleColor }]}>OPTIE A</Text>
          <Picker selectedValue={leftMealId} onValueChange={(value) => setLeftMealId(String(value))}>
            {NUTRITION_MEALS.map((meal) => (
              <Picker.Item key={`left-${meal.id}`} label={meal.name} value={meal.id} />
            ))}
          </Picker>
        </View>
        <View style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.selectionLabel, { color: theme.subtitleColor }]}>OPTIE B</Text>
          <Picker selectedValue={rightMealId} onValueChange={(value) => setRightMealId(String(value))}>
            {NUTRITION_MEALS.map((meal) => (
              <Picker.Item key={`right-${meal.id}`} label={meal.name} value={meal.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={[styles.summaryRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryName, { color: theme.titleColor }]}>{leftMeal.name}</Text>
          <Text style={[styles.summaryBrand, { color: theme.subtitleColor }]}>{leftMeal.brand}</Text>
        </View>
        <MaterialCommunityIcons name="compare-horizontal" size={20} color={theme.subtitleColor} />
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryName, { color: theme.titleColor }]}>{rightMeal.name}</Text>
          <Text style={[styles.summaryBrand, { color: theme.subtitleColor }]}>{rightMeal.brand}</Text>
        </View>
      </View>

      <View style={[styles.tableCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {compareRows.map((row) => {
          const leftValue = Number(leftMeal[row.key]);
          const rightValue = Number(rightMeal[row.key]);
          const leftIsBetter = leftValue < rightValue;
          const rightIsBetter = rightValue < leftValue;

          return (
            <View key={row.key} style={styles.tableRow}>
              <Text style={[styles.valueText, { color: leftIsBetter ? '#059669' : theme.titleColor }]}>
                {leftValue} {row.unit}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>{row.label}</Text>
              <Text style={[styles.valueText, { color: rightIsBetter ? '#059669' : theme.titleColor }]}>
                {rightValue} {row.unit}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.tipCard, { borderColor: theme.border }]}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#F59E0B" />
        <Text style={[styles.tipText, { color: theme.subtitleColor }]}>Groen = lagere waarde op dat onderdeel. Handig voor snelle keuzes.</Text>
      </View>
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
    paddingBottom: 96,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  selectionRow: {
    gap: 10,
  },
  selectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  selectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginLeft: 6,
  },
  summaryRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCol: {
    flex: 1,
  },
  summaryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryBrand: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
  },
  tableCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  valueText: {
    width: '31%',
    fontSize: 13,
    fontWeight: '800',
  },
  tipCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
