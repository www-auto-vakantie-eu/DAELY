import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { addNutritionLog, getRecentUniqueNutritionItems } from '@/services/nutrition-log';
import {
  addFavoriteNutritionItem,
  buildFavoriteNutritionKey,
  getFavoriteNutritionItems,
  removeFavoriteNutritionItem,
  type FavoriteNutritionItem,
} from '@/services/nutrition-favorites';
import {
  contributeNutritionProduct,
  searchNutritionProducts,
  type NutritionProductSummary,
} from '@/services/nutrition-products';
import type { NutritionItemType, NutritionLogEntry, NutritionMealType, NutritionSourceType } from '@/services/nutrition-log.types';

const ITEM_TYPES: NutritionItemType[] = ['food', 'drink', 'supplement'];
const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const UNITS = ['gram', 'ml', 'portie', 'stuk', 'scoop', 'tablet', 'capsule'] as const;

function sourceLabel(source: NutritionSourceType): string {
  if (source === 'daely') return 'DAELY';
  if (source === 'open_food_facts') return 'Open Food Facts';
  if (source === 'usda') return 'USDA';
  if (source === 'barcode') return 'Barcode';
  return 'Zelf toegevoegd';
}

function productSourceLabel(source: NutritionProductSummary['source']): string {
  if (source === 'open_food_facts') return 'Open Food Facts';
  if (source === 'usda') return 'USDA';
  if (source === 'brand') return 'Merk';
  if (source === 'admin') return 'DAELY';
  return 'Zelf toegevoegd';
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
  const [shareWithCommunity, setShareWithCommunity] = useState(false);
  const [searchResults, setSearchResults] = useState<NutritionProductSummary[]>([]);
  const [didSearchCatalog, setDidSearchCatalog] = useState(false);
  const [isSearchingCatalog, setIsSearchingCatalog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recentItems, setRecentItems] = useState<NutritionLogEntry[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteNutritionItem[]>([]);
  const [quickSuccessKey, setQuickSuccessKey] = useState<string | null>(null);
  const [quickAddBusyKey, setQuickAddBusyKey] = useState<string | null>(null);

  const canSubmit = useMemo(() => name.trim().length > 0 && !isSaving, [name, isSaving]);

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value.replace(',', '.').trim());
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  const loadQuickLists = useCallback(async () => {
    const [recent, favorites] = await Promise.all([
      getRecentUniqueNutritionItems(5),
      getFavoriteNutritionItems(),
    ]);
    setRecentItems(recent.slice(0, 5));
    setFavoriteItems(favorites.slice(0, 5));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadQuickLists();
    }, [loadQuickLists])
  );

  const favoriteKeys = useMemo(() => new Set(favoriteItems.map((item) => item.key)), [favoriteItems]);

  const applyRecentItem = (entry: NutritionLogEntry) => {
    setName(entry.name);
    setBrand(entry.brand || '');
    setItemType(entry.itemType);
    setMealType(entry.mealType);
    setAmount(entry.amount ? String(entry.amount) : '100');
    setAmountUnit((entry.amountUnit as (typeof UNITS)[number]) || 'gram');
    setKcal(String(entry.macros.kcal));
    setProtein(String(entry.macros.protein));
    setCarbs(String(entry.macros.carbs));
    setFats(String(entry.macros.fats));
    setNotes(entry.notes || '');
  };

  const applyFavoriteItem = (item: FavoriteNutritionItem) => {
    setName(item.name);
    setBrand(item.brand || '');
    setItemType(item.itemType);
    setMealType(item.mealType);
    setAmount(String(item.amount));
    setAmountUnit((item.amountUnit as (typeof UNITS)[number]) || 'gram');
    setKcal(String(item.macros.kcal));
    setProtein(String(item.macros.protein));
    setCarbs(String(item.macros.carbs));
    setFats(String(item.macros.fats));
    setNotes(item.notes || '');
  };

  const addEntryToFavorites = async (entry: NutritionLogEntry) => {
    await addFavoriteNutritionItem({
      name: entry.name,
      brand: entry.brand,
      source: entry.source,
      itemType: entry.itemType,
      mealType: entry.mealType,
      amount: entry.amount || 100,
      amountUnit: entry.amountUnit || 'gram',
      macros: entry.macros,
      notes: entry.notes,
    });
    await loadQuickLists();
  };

  const removeEntryFromFavorites = async (entry: NutritionLogEntry) => {
    const key = buildFavoriteNutritionKey({
      name: entry.name,
      brand: entry.brand,
      macros: entry.macros,
    });
    await removeFavoriteNutritionItem(key);
    await loadQuickLists();
  };

  const quickAddFromEntry = async (entry: NutritionLogEntry, key: string) => {
    if (quickAddBusyKey) {
      return;
    }

    setQuickAddBusyKey(key);
    try {
      await addNutritionLog({
        source: entry.source,
        itemType: entry.itemType,
        mealType: entry.mealType,
        name: entry.name,
        brand: entry.brand,
        amount: entry.amount || 100,
        amountUnit: entry.amountUnit || 'gram',
        macros: entry.macros,
        notes: entry.notes,
      });
      setQuickSuccessKey(key);
      setTimeout(() => setQuickSuccessKey((current) => (current === key ? null : current)), 1200);
      await loadQuickLists();
    } catch (error) {
      Alert.alert('Quick add mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setQuickAddBusyKey((current) => (current === key ? null : current));
    }
  };

  const quickAddFromFavorite = async (item: FavoriteNutritionItem, key: string) => {
    if (quickAddBusyKey) {
      return;
    }

    setQuickAddBusyKey(key);
    try {
      await addNutritionLog({
        source: item.source,
        itemType: item.itemType,
        mealType: item.mealType,
        name: item.name,
        brand: item.brand,
        amount: item.amount,
        amountUnit: item.amountUnit,
        macros: item.macros,
        notes: item.notes,
      });
      setQuickSuccessKey(key);
      setTimeout(() => setQuickSuccessKey((current) => (current === key ? null : current)), 1200);
      await loadQuickLists();
    } catch (error) {
      Alert.alert('Quick add mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setQuickAddBusyKey((current) => (current === key ? null : current));
    }
  };

  const handleSearchCatalog = async () => {
    const query = name.trim();
    if (!query) {
      setDidSearchCatalog(true);
      setSearchResults([]);
      return;
    }

    setIsSearchingCatalog(true);
    try {
      const results = await searchNutritionProducts(query);
      setSearchResults(results);
      setDidSearchCatalog(true);
    } catch (error) {
      Alert.alert('Zoeken mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
      setDidSearchCatalog(true);
      setSearchResults([]);
    } finally {
      setIsSearchingCatalog(false);
    }
  };

  const applyCatalogProduct = (product: NutritionProductSummary) => {
    setName(product.name);
    setBrand(product.brand || '');
    setItemType(product.itemType);
    setKcal(String(product.nutrients.kcal));
    setProtein(String(product.nutrients.protein));
    setCarbs(String(product.nutrients.carbs));
    setFats(String(product.nutrients.fats));

    if (product.nutrients.perUnit === '100ml') {
      setAmount('100');
      setAmountUnit('ml');
    } else if (product.nutrients.perUnit === '100g') {
      setAmount('100');
      setAmountUnit('gram');
    }
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

      let contributionFailed = false;
      if (shareWithCommunity) {
        try {
          await contributeNutritionProduct({
            submittedName: name,
            submittedBrand: brand,
            submittedItemType: itemType,
            submittedNutritionJson: {
              perUnit: amountUnit === 'ml' ? '100ml' : 'serving',
              kcal: parseNumber(kcal),
              protein: parseNumber(protein),
              carbs: parseNumber(carbs),
              fats: parseNumber(fats),
            },
            source: 'user',
          });
        } catch (error) {
          console.warn('Nutrition contribution failed:', error);
          contributionFailed = true;
        }
      }

      const successMessage = contributionFailed
        ? 'Item toegevoegd aan Mijn Voeding. Anonieme bijdrage aan DAELY database is niet gelukt.'
        : 'Item toegevoegd aan Mijn Voeding.';

      Alert.alert('Opgeslagen', successMessage, [
        {
          text: 'Bekijk logboek',
          onPress: () => router.replace('/my-nutrition'),
        },
      ]);
      await loadQuickLists();
    } catch (error) {
      Alert.alert('Opslaan mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerRow}>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
          <Text style={[styles.backText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.titleColor }]}>Zelf toevoegen</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Log voeding snel en duidelijk voor vandaag.</Text>

      <View style={styles.shortcutRow}>
        <Pressable style={[styles.scanShortcutButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.push('/nutrition/scan')}>
          <MaterialCommunityIcons name="barcode-scan" size={16} color={theme.titleColor} />
          <Text style={[styles.scanShortcutText, { color: theme.titleColor }]}>Barcode scannen</Text>
        </Pressable>
        <Pressable style={[styles.scanShortcutButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.push('/nutrition/search')}>
          <MaterialCommunityIcons name="text-search" size={16} color={theme.titleColor} />
          <Text style={[styles.scanShortcutText, { color: theme.titleColor }]}>Handmatig zoeken</Text>
        </Pressable>
      </View>

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recent toegevoegd</Text>
        {recentItems.length === 0 ? (
          <Text style={[styles.catalogHintText, { color: theme.subtitleColor }]}>Nog geen recente items. Voeg eerst iets toe.</Text>
        ) : (
          <View style={styles.catalogResultsWrap}>
            {recentItems.map((entry) => {
              const favoriteKey = buildFavoriteNutritionKey({ name: entry.name, brand: entry.brand, macros: entry.macros });
              const isFavorite = favoriteKeys.has(favoriteKey);
              const successKey = `recent-${favoriteKey}`;

              return (
                <View key={`recent-${entry.id}`} style={[styles.quickCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
                  <View style={styles.quickRowTop}>
                    <View style={styles.quickTextWrap}>
                      <Text style={[styles.catalogResultTitle, { color: theme.titleColor }]}>{entry.name}</Text>
                      <Text style={[styles.catalogResultMeta, { color: theme.subtitleColor }]}>
                        {entry.brand || 'Onbekend merk'} · {entry.macros.kcal} kcal · {sourceLabel(entry.source)}
                      </Text>
                      <Text style={[styles.catalogResultMeta, { color: theme.subtitleColor }]}>
                        Snel opnieuw toevoegen · {entry.amount || 100} {entry.amountUnit || 'gram'} · {entry.mealType}
                      </Text>
                    </View>
                    <Pressable
                      style={[styles.iconButton, { borderColor: theme.border }]}
                      onPress={() => void (isFavorite ? removeEntryFromFavorites(entry) : addEntryToFavorites(entry))}
                    >
                      <MaterialCommunityIcons name={isFavorite ? 'star' : 'star-outline'} size={18} color={isFavorite ? '#F59E0B' : theme.titleColor} />
                    </Pressable>
                  </View>

                  <View style={styles.quickActionRow}>
                    <Pressable
                      style={[styles.todayButton, quickAddBusyKey ? styles.todayButtonDisabled : null]}
                      onPress={() => void quickAddFromEntry(entry, successKey)}
                      disabled={!!quickAddBusyKey}
                    >
                      <Text style={styles.todayButtonText}>{quickAddBusyKey === successKey ? 'Bezig...' : quickSuccessKey === successKey ? 'Toegevoegd aan vandaag' : '+ Vandaag'}</Text>
                    </Pressable>
                    <Pressable style={[styles.secondaryChipButton, { borderColor: theme.border }]} onPress={() => applyRecentItem(entry)}>
                      <Text style={[styles.secondaryChipButtonText, { color: theme.titleColor }]}>Wijzig</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Favorieten</Text>
        {favoriteItems.length === 0 ? (
          <Text style={[styles.catalogHintText, { color: theme.subtitleColor }]}>Nog geen favorieten. Markeer een recent item met de ster.</Text>
        ) : (
          <View style={styles.catalogResultsWrap}>
            {favoriteItems.map((item) => {
              const successKey = `favorite-${item.key}`;
              return (
                <View key={`favorite-${item.key}`} style={[styles.quickCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
                  <View style={styles.quickRowTop}>
                    <View style={styles.quickTextWrap}>
                      <Text style={[styles.catalogResultTitle, { color: theme.titleColor }]}>{item.name}</Text>
                      <Text style={[styles.catalogResultMeta, { color: theme.subtitleColor }]}>
                        {item.brand || 'Onbekend merk'} · {item.macros.kcal} kcal · {sourceLabel(item.source)}
                      </Text>
                      <Text style={[styles.catalogResultMeta, { color: theme.subtitleColor }]}>
                        Snel opnieuw toevoegen · {item.amount} {item.amountUnit || 'gram'} · {item.mealType}
                      </Text>
                    </View>
                    <Pressable
                      style={[styles.iconButton, { borderColor: theme.border }]}
                      onPress={() => void removeFavoriteNutritionItem(item.key).then(loadQuickLists)}
                    >
                      <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
                    </Pressable>
                  </View>

                  <View style={styles.quickActionRow}>
                    <Pressable
                      style={[styles.todayButton, quickAddBusyKey ? styles.todayButtonDisabled : null]}
                      onPress={() => void quickAddFromFavorite(item, successKey)}
                      disabled={!!quickAddBusyKey}
                    >
                      <Text style={styles.todayButtonText}>{quickAddBusyKey === successKey ? 'Bezig...' : quickSuccessKey === successKey ? 'Toegevoegd aan vandaag' : '+ Vandaag'}</Text>
                    </Pressable>
                    <Pressable style={[styles.secondaryChipButton, { borderColor: theme.border }]} onPress={() => applyFavoriteItem(item)}>
                      <Text style={[styles.secondaryChipButtonText, { color: theme.titleColor }]}>Wijzig</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Product</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Bijv. Protein shake" placeholderTextColor="#9CA3AF" style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />

        <Pressable style={[styles.catalogSearchButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={handleSearchCatalog}>
          <MaterialCommunityIcons name="database-search" size={16} color={theme.titleColor} />
          <Text style={[styles.catalogSearchText, { color: theme.titleColor }]}>{isSearchingCatalog ? 'Zoeken...' : 'Zoek in DAELY producten'}</Text>
        </Pressable>

        {didSearchCatalog && searchResults.length === 0 ? (
          <Text style={[styles.catalogHintText, { color: theme.subtitleColor }]}>Geen product gevonden. Voeg dit product zelf toe.</Text>
        ) : null}

        {searchResults.length > 0 ? (
          <View style={styles.catalogResultsWrap}>
            {searchResults.map((product) => (
              <Pressable
                key={`${product.id}`}
                style={[styles.catalogResultCard, { borderColor: theme.border, backgroundColor: theme.card }]}
                onPress={() => applyCatalogProduct(product)}
              >
                <Text style={[styles.catalogResultTitle, { color: theme.titleColor }]}>{product.name}</Text>
                <Text style={[styles.catalogResultMeta, { color: theme.subtitleColor }]}>
                  {product.brand || 'Onbekend merk'} · {product.nutrients.kcal} kcal · {product.itemType} · {productSourceLabel(product.source)}
                </Text>
                {verificationHint(product.verificationStatus) ? (
                  <Text style={[styles.catalogHintText, { color: product.verificationStatus === 'unverified' ? '#B45309' : theme.subtitleColor }]}>
                    {verificationHint(product.verificationStatus)}
                  </Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={[styles.label, { color: theme.subtitleColor }]}>Merk (optioneel)</Text>
        <TextInput value={brand} onChangeText={setBrand} placeholder="Bijv. XXL Nutrition" placeholderTextColor="#9CA3AF" style={[styles.input, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
      </View>

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
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

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
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

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.subtitleColor }]}>Macro's</Text>
        <View style={styles.macroGrid}>
          <TextInput value={kcal} onChangeText={setKcal} placeholder="kcal" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={protein} onChangeText={setProtein} placeholder="eiwit" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={carbs} onChangeText={setCarbs} placeholder="koolhydraten" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
          <TextInput value={fats} onChangeText={setFats} placeholder="vetten" keyboardType="decimal-pad" placeholderTextColor="#9CA3AF" style={[styles.input, styles.macroInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.card }]} />
        </View>
      </View>

      <View style={[styles.block, { borderColor: theme.border, backgroundColor: theme.card }]}>
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
        style={[styles.shareRow, { borderColor: theme.border, backgroundColor: theme.card }]}
        onPress={() => setShareWithCommunity((current) => !current)}
      >
        <MaterialCommunityIcons
          name={shareWithCommunity ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={20}
          color={shareWithCommunity ? '#2563EB' : theme.subtitleColor}
        />
        <View style={styles.shareTextWrap}>
          <Text style={[styles.shareTitle, { color: theme.titleColor }]}>Help andere sporters</Text>
          <Text style={[styles.shareSubtitle, { color: theme.subtitleColor }]}>Help andere sporters met betere productdata</Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.saveButton, !canSubmit ? styles.saveButtonDisabled : null]}
        onPress={handleSave}
        disabled={!canSubmit}
      >
        <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>{isSaving ? 'Opslaan...' : 'Toevoegen aan vandaag'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 98,
    gap: 14,
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
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scanShortcutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  block: {
    gap: 9,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  shareRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareTextWrap: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  shareSubtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  catalogSearchButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  catalogSearchText: {
    fontSize: 12,
    fontWeight: '700',
  },
  catalogHintText: {
    fontSize: 11,
    fontWeight: '600',
  },
  catalogResultsWrap: {
    gap: 8,
  },
  catalogResultCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  catalogResultTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  catalogResultMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
  quickCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 11,
    gap: 10,
  },
  quickRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickTextWrap: {
    flex: 1,
  },
  iconButton: {
    borderWidth: 1,
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  todayButtonDisabled: {
    opacity: 0.6,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  secondaryChipButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  secondaryChipButtonText: {
    fontSize: 12,
    fontWeight: '700',
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
