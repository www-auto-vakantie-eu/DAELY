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
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

const MEAL_TYPES: NutritionMealType[] = ['ontbijt', 'lunch', 'diner', 'snack', 'pre-workout', 'post-workout', 'supplement'];
const UNIT_OPTIONS = ['gram', 'ml', 'portie', 'stuk'] as const;

function barcodeSourceLabel(source?: BarcodeNutritionProduct['source']): string {
  if (source === 'daely') return 'DAELY';
  if (source === 'usda') return 'USDA';
  if (source === 'open_food_facts') return 'Open Food Facts';
  return 'Zelf toegevoegd';
}

function verificationHint(status?: string): string | null {
  if (!status) return null;
  if (status === 'admin_verified') return 'DAELY geverifieerd';
  if (status === 'brand_verified') return 'Merk geverifieerd';
  if (status === 'label_verified') return 'Label gecheckt';
  if (status === 'community_verified') return 'Community check';
  if (status === 'unverified') return 'Niet officieel geverifieerd';
  return `Status: ${status}`;
}

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
        itemType: product.itemType || 'food',
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
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </AppScreen>
    );
  }

  if (!permission.granted) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="camera-off-outline" size={30} color={theme.subtitleColor} />
          <Text style={[styles.permissionTitle, { color: theme.titleColor }]}>Camera toegang nodig</Text>
          <Text style={[styles.permissionSubtitle, { color: theme.subtitleColor }]}>Geef camera permissie om barcodes te scannen.</Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Permissie geven</Text>
          </Pressable>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.titleColor }]}>Barcode scannen</Text>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Scan een barcode en voeg direct toe aan je daglog.</Text>

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
              <View style={styles.scanFrame}>
                <View style={styles.scanCornerTopLeft} />
                <View style={styles.scanCornerTopRight} />
                <View style={styles.scanCornerBottomLeft} />
                <View style={styles.scanCornerBottomRight} />
              </View>
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

                <View style={styles.sourceInfoRow}>
                  <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>{barcodeSourceLabel(product.source)}</Text>
                  </View>
                  {verificationHint(product.verificationStatus) ? (
                    <Text style={[styles.verificationText, { color: product.verificationStatus === 'unverified' ? '#B45309' : theme.subtitleColor }]}>
                      {verificationHint(product.verificationStatus)}
                          {product.confidenceScore ? ` · ${product.confidenceScore}` : ''}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.metaBlock}>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>kcal: {product.kcal}</Text>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Eiwit: {product.protein}g</Text>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Koolhydraten: {product.carbs}g</Text>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Vetten: {product.fats}g</Text>
                </View>

                <Text style={[styles.label, { color: theme.subtitleColor }]}>Eetmoment</Text>
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

            <View style={styles.secondaryActionRow}>
              <Pressable style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={resetForRescan}>
                <MaterialCommunityIcons name="refresh" size={16} color={theme.titleColor} />
                <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Opnieuw scannen</Text>
              </Pressable>
              {notFoundMessage ? (
                <Pressable style={[styles.secondaryButton, styles.secondaryWarmButton]} onPress={() => router.push('/nutrition/add')}>
                  <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#92400E" />
                  <Text style={[styles.secondaryButtonText, styles.secondaryWarmButtonText]}>Zelf toevoegen</Text>
                </Pressable>
              ) : null}
            </View>
            {scannedCode ? <Text style={[styles.scannedCode, { color: theme.subtitleColor }]}>Barcode: {scannedCode}</Text> : null}
          </View>
        )}
      </ScrollView>
      <SharedBottomNav activeTab="nutrition" />
    </AppScreen>
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
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: -4,
    fontSize: 13,
    fontWeight: '600',
  },
  cameraWrap: {
    borderWidth: 1,
    borderRadius: 16,
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
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  scanCornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 26,
    height: 26,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 12,
  },
  scanCornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 26,
    height: 26,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderTopRightRadius: 12,
  },
  scanCornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 26,
    height: 26,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
  },
  scanCornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomRightRadius: 12,
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
    borderRadius: 16,
    padding: 12,
    gap: 11,
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
  sourceInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  sourceBadge: {
    borderRadius: 999,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceBadgeText: {
    color: '#1E3A8A',
    fontSize: 10,
    fontWeight: '800',
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
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
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  secondaryWarmButton: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  secondaryWarmButtonText: {
    color: '#92400E',
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
