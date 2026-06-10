import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

type ProductForm = {
  name: string;
  kcal: string;
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
};

const EMPTY_FORM: ProductForm = {
  name: '',
  kcal: '',
  protein: '',
  carbs: '',
  fats: '',
  sugar: '',
};

export default function NutritionCompareScreen() {
  const theme = useTheme();

  const [productA, setProductA] = useState<ProductForm>(EMPTY_FORM);
  const [productB, setProductB] = useState<ProductForm>(EMPTY_FORM);
  const [showResult, setShowResult] = useState(false);

  const canCompare = useMemo(
    () => productA.name.trim().length > 0 && productB.name.trim().length > 0,
    [productA.name, productB.name],
  );

  const updateProduct = (type: 'a' | 'b', key: keyof ProductForm, value: string) => {
    if (type === 'a') {
      setProductA((prev) => ({ ...prev, [key]: value }));
      return;
    }

    setProductB((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompare = () => {
    setShowResult(canCompare);
  };

  const renderCard = (title: string, type: 'a' | 'b', values: ProductForm) => (
    <View style={[styles.compareCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.titleColor }]}>{title}</Text>

      <Text style={[styles.label, { color: theme.subtitleColor }]}>Productnaam</Text>
      <TextInput
        value={values.name}
        onChangeText={(value) => updateProduct(type, 'name', value)}
        placeholder="Bijv. Havermout"
        placeholderTextColor="#9CA3AF"
        style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
      />

      <View style={styles.row}>
        <View style={styles.rowCol}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Kcal</Text>
          <TextInput
            value={values.kcal}
            onChangeText={(value) => updateProduct(type, 'kcal', value)}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />
        </View>

        <View style={styles.rowCol}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Eiwitten</Text>
          <TextInput
            value={values.protein}
            onChangeText={(value) => updateProduct(type, 'protein', value)}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.rowCol}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Koolhydraten</Text>
          <TextInput
            value={values.carbs}
            onChangeText={(value) => updateProduct(type, 'carbs', value)}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />
        </View>

        <View style={styles.rowCol}>
          <Text style={[styles.label, { color: theme.subtitleColor }]}>Vetten</Text>
          <TextInput
            value={values.fats}
            onChangeText={(value) => updateProduct(type, 'fats', value)}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
          />
        </View>
      </View>

      <Text style={[styles.label, { color: theme.subtitleColor }]}>Suiker</Text>
      <TextInput
        value={values.sugar}
        onChangeText={(value) => updateProduct(type, 'sugar', value)}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor="#9CA3AF"
        style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
      />
    </View>
  );

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <View style={styles.screen}>
        <PageHeader title="Voeding vergelijken" showSettings={false} showSearch={false} showCart={false} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.introCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.introTitle, { color: theme.titleColor }]}>Snel naast elkaar</Text>
            <Text style={[styles.introText, { color: theme.subtitleColor }]}>
              Vergelijk producten op kcal, eiwitten, koolhydraten, vetten en suiker.
            </Text>
          </View>

          {renderCard('Product A', 'a', productA)}
          {renderCard('Product B', 'b', productB)}

          <Pressable style={[styles.compareButton, !canCompare ? styles.compareButtonDisabled : null]} onPress={handleCompare}>
            <Text style={styles.compareButtonText}>Vergelijken</Text>
          </Pressable>

          {showResult ? (
            <View style={[styles.resultCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.resultText, { color: theme.subtitleColor }]}>Vergelijking wordt binnenkort uitgebreid.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <SharedBottomNav activeTab="nutrition" />
    </AppScreen>
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
    paddingBottom: 100,
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
  compareCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowCol: {
    flex: 1,
  },
  compareButton: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonDisabled: {
    opacity: 0.6,
  },
  compareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
