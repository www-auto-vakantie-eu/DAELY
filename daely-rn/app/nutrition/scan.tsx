import React, { useMemo, useState } from 'react';
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
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { lookupBarcodeProduct, type BarcodeNutritionProduct } from '@/services/nutrition-barcode';
import { addNutritionLog } from '@/services/nutrition-log';
import type { NutritionMealType } from '@/services/nutrition-log.types';

const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const UNIT_OPTIONS = ['gram', 'ml', 'portie', 'stuk'] as const;

export default function NutritionScanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [isHandlingScan, setIsHandlingScan] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<BarcodeNutritionProduct | null>(null);
  const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);

  const [mealType, setMealType] = useState<NutritionMealType>('snack');
  const [amount, setAmount] = useState('100');
  const [amountUnit, setAmountUnit] = useState<(typeof UNIT_OPTIONS)[number]>('gram');
  const [isSaving, setIsSaving] = useState(false);

  const hasResult = !!product || !!notFoundMessage;

  const canSave = useMemo(() => {
    return !!product && !isSaving;
  }, [product, isSaving]);

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value.replace(',', '.').trim());
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  const resetForRescan = () => {
    setIsHandlingScan(false);
    setScannedCode(null);
    setProduct(null);
    setNotFoundMessage(null);
  };

  const handleScanned = async (result: BarcodeScanningResult) => {
    if (isHandlingScan || hasResult) {
      return;
    }

    const code = String(result.data || '').trim();
    if (!code) {
      return;
    }

    setIsHandlingScan(true);
    setScannedCode(code);
    setNotFoundMessage(null);
    setProduct(null);

    try {
      const found = await lookupBarcodeProduct(code);
      if (!found) {
        setNotFoundMessage('Geen product gevonden voor deze barcode.');
        return;
      }

      setProduct(found);
      setAmount(String(found.servingSize > 0 ? found.servingSize : 100));

      const normalizedUnit = (found.servingUnit || '').toLowerCase();
      if (normalizedUnit.includes('ml')) {
        setAmountUnit('ml');
      } else if (normalizedUnit.includes('stuk')) {
        setAmountUnit('stuk');
      } else if (normalizedUnit.includes('portie')) {
        setAmountUnit('portie');
      } else {
        setAmountUnit('gram');
      }
    } catch (error) {
      setNotFoundMessage(error instanceof Error ? error.message : 'Barcode opzoeken mislukt.');
    } finally {
      setIsHandlingScan(false);
    }
  };

  const handleSave = async () => {
    if (!product || !canSave) return;

    setIsSaving(true);
    try {
      await addNutritionLog({
        source: 'barcode',
        itemType: 'food',
        mealType,
        name: product.name,
        brand: product.brand,
        amount: parseNumber(amount),
        amountUnit,
        macros: {
          kcal: product.kcal,
          protein: product.protein,
          carbs: product.carbs,
          fats: product.fats,
        },
        notes: `Barcode: ${product.barcode}`,
      });

      Alert.alert('Toegevoegd', 'Barcode product toegevoegd aan Mijn Voeding.', [
        { text: 'Bekijk logboek', onPress: () => router.replace('/my-nutrition') },
      ]);
    } catch (error) {
      Alert.alert('Opslaan mislukt', error instanceof Error ? error.message : 'Onbekende fout.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="camera-off-outline" size={30} color={theme.subtitleColor} />
        <Text style={[styles.permissionTitle, { color: theme.titleColor }]}>Camera toegang nodig</Text>
        <Text style={[styles.permissionSubtitle, { color: theme.subtitleColor }]}>Geef camera permissie om barcodes te scannen.</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Permissie geven</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.titleColor} />
          <Text style={[styles.backText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.titleColor }]}>Barcode scannen</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Scan een product en voeg het direct toe aan Mijn Voeding.</Text>

      {!hasResult && (
        <View style={[styles.cameraWrap, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
            }}
          />
          <View pointerEvents="none" style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.overlayText}>Richt de barcode binnen het kader</Text>
          </View>
          {isHandlingScan && (
            <View style={styles.lookupOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.lookupText}>Product opzoeken...</Text>
            </View>
          )}
        </View>
      )}

      {(!!notFoundMessage || !!product) && (
        <View style={[styles.resultCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          {notFoundMessage ? (
            <>
              <MaterialCommunityIcons name="barcode-off" size={22} color="#EF4444" />
              <Text style={[styles.notFoundTitle, { color: theme.titleColor }]}>Niet gevonden</Text>
              <Text style={[styles.notFoundText, { color: theme.subtitleColor }]}>{notFoundMessage}</Text>
            </>
          ) : null}

          {product ? (
            <>
              {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.productImage} /> : null}
              <Text style={[styles.productName, { color: theme.titleColor }]}>{product.name}</Text>
              <Text style={[styles.productBrand, { color: theme.subtitleColor }]}>{product.brand || 'Merk onbekend'}</Text>

              <View style={styles.metaBlock}>
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>kcal: {product.kcal}</Text>
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Eiwit: {product.protein}g</Text>
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Koolhydraten: {product.carbs}g</Text>
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Vetten: {product.fats}g</Text>
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

              <Text style={[styles.label, { color: theme.subtitleColor }]}>Hoeveelheid</Text>
              <View style={styles.amountRow}>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  style={[styles.amountInput, { borderColor: theme.border, color: theme.titleColor, backgroundColor: theme.background }]}
                />
                <View style={styles.unitRow}>
                  {UNIT_OPTIONS.map((unit) => {
                    const selected = amountUnit === unit;
                    return (
                      <Pressable
                        key={unit}
                        style={[styles.unitChip, { borderColor: selected ? '#2563EB' : theme.border, backgroundColor: selected ? '#DBEAFE' : theme.background }]}
                        onPress={() => setAmountUnit(unit)}
                      >
                        <Text style={[styles.unitChipText, { color: selected ? '#1D4ED8' : theme.titleColor }]}>{unit}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable style={[styles.primaryButton, !canSave ? styles.disabledButton : null]} onPress={handleSave} disabled={!canSave}>
                <MaterialCommunityIcons name="plus-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>{isSaving ? 'Toevoegen...' : 'Toevoegen aan Mijn Voeding'}</Text>
              </Pressable>
            </>
          ) : null}

          <Pressable style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={resetForRescan}>
            <MaterialCommunityIcons name="refresh" size={16} color={theme.titleColor} />
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Opnieuw scannen</Text>
          </Pressable>
          {scannedCode ? <Text style={[styles.scannedCode, { color: theme.subtitleColor }]}>Barcode: {scannedCode}</Text> : null}
        </View>
      )}
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
    paddingBottom: 88,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  permissionSubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
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
  backText: {
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
    marginTop: -4,
    fontSize: 13,
    fontWeight: '500',
  },
  cameraWrap: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    height: 360,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  scanFrame: {
    width: '72%',
    height: 120,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  lookupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lookupText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  notFoundText: {
    fontSize: 13,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  productName: {
    fontSize: 18,
    fontWeight: '900',
  },
  productBrand: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaBlock: {
    gap: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '700',
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
  primaryButton: {
    marginTop: 4,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scannedCode: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
