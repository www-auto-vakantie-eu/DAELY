import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from './store/cartStore';
import PageHeader from './components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import {
  COMMERCE_PRODUCTS,
  CommerceProduct,
  CommerceProductCategory,
  INFLUENCER_DISCOUNT_CODES,
} from './constants/commerce';
import {
  addFavoriteProduct,
  getFavoriteProducts,
  getSavedInfluencerCode,
  removeFavoriteProduct,
  saveInfluencerCode,
  validateInfluencerCode,
} from '@/services/commerce-storage';

let cartHydrated = false;

const FILTER_CATEGORIES: (CommerceProductCategory | 'Alles')[] = [
  'Alles',
  'Kleding',
  'Accessoires',
  'Supplementen',
  'Essentials',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const getCartType = (category: CommerceProductCategory) => {
  if (category === 'Kleding') {
    return 'clothing' as const;
  }
  if (category === 'Supplementen') {
    return 'supplement' as const;
  }
  if (category === 'Accessoires') {
    return 'accessory' as const;
  }
  return 'essential' as const;
};

export default function ShopScreen() {
  const theme = useTheme();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const hydrateCart = useCartStore((state) => state._hydrate);

  const [selectedCategory, setSelectedCategory] = useState<CommerceProductCategory | 'Alles'>('Alles');
  const [influencerCode, setInfluencerCode] = useState<string>('');
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (!cartHydrated) {
      hydrateCart();
      cartHydrated = true;
    }
  }, [hydrateCart]);

  useEffect(() => {
    getSavedInfluencerCode().then((code) => {
      if (code) {
        setSavedCode(code);
        setInfluencerCode(code);
      }
    });
    getFavoriteProducts().then(setFavoriteIds);
  }, []);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'Alles'
        ? COMMERCE_PRODUCTS
        : COMMERCE_PRODUCTS.filter((product) => product.category === selectedCategory),
    [selectedCategory]
  );

  const handleSaveCode = async () => {
    const normalized = influencerCode.trim().toUpperCase();

    if (!normalized) {
      setMessage('Voer een influencer code in om korting te activeren.');
      return;
    }

    if (validateInfluencerCode(normalized)) {
      await saveInfluencerCode(normalized);
      setSavedCode(normalized);
      setMessage(`Kortingscode ${normalized} succesvol opgeslagen.`);
      return;
    }

    setMessage('Ongeldige code. Gebruik DAELY10, COACH15 of ATHLETE20.');
  };

  const handleToggleFavorite = async (productId: string) => {
    if (favoriteIds.includes(productId)) {
      const next = favoriteIds.filter((id) => id !== productId);
      setFavoriteIds(next);
      await removeFavoriteProduct(productId);
      return;
    }

    setFavoriteIds((current) => [...current, productId]);
    await addFavoriteProduct(productId);
  };

  const handleAddToCart = (product: CommerceProduct) => {
    addItem({
      id: product.id,
      type: getCartType(product.category),
      name: product.name,
      price: product.priceCents / 100,
      image: product.imagePlaceholder,
      quantity: 1,
      partnerId: product.partnerId,
      partnerName: product.partnerName,
      meta: {
        eligibleForDiscount: product.eligibleForInfluencerDiscount,
      },
    });
    setMessage(`'${product.name}' toegevoegd aan winkelwagen.`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="Shop"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Ontdek sportproducten van DAELY partners.</Text>
          <Text style={[styles.heroDescription, { color: theme.subtitleColor }]}>Kleding, accessoires en supplementen in één winkelervaring. Gebruik jouw influencercode voor extra korting.</Text>
        </View>

        <View style={[styles.codeSection, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Influencer code</Text>
          <View style={styles.inputRow}> 
            <TextInput
              style={[styles.codeInput, { backgroundColor: theme.background, color: theme.titleColor, borderColor: theme.border }]}
              value={influencerCode}
              onChangeText={setInfluencerCode}
              placeholder="DAELY10"
              placeholderTextColor={theme.subtitleColor}
              autoCapitalize="characters"
            />
            <Pressable style={[styles.applyButton, { backgroundColor: '#2563EB' }]} onPress={handleSaveCode}>
              <Text style={styles.applyButtonText}>Opslaan</Text>
            </Pressable>
          </View>
          {savedCode ? (
            <Text style={[styles.savedCode, { color: theme.titleColor }]}>Actieve code: {savedCode}</Text>
          ) : (
            <Text style={[styles.savedCode, { color: theme.subtitleColor }]}>Geen code actief.</Text>
          )}
          {message ? <Text style={[styles.message, { color: theme.titleColor }]}>{message}</Text> : null}
        </View>

        <View style={styles.filterRow}>
          {FILTER_CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && { backgroundColor: '#2563EB' },
                { borderColor: theme.border },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.filterChipText, selectedCategory === category && { color: '#FFFFFF' }]}>{category}</Text>
            </Pressable>
          ))}
        </View>

        {filteredProducts.map((product) => {
          const discount = savedCode && product.eligibleForInfluencerDiscount
            ? INFLUENCER_DISCOUNT_CODES.find((item) => item.code === savedCode)?.percent ?? 0
            : 0;
          const finalPrice = discount > 0
            ? ((product.priceCents * (100 - discount)) / 100) / 100
            : product.priceCents / 100;

          return (
            <View key={product.id} style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <Image source={{ uri: product.imagePlaceholder }} style={styles.productImage} />
              <View style={styles.productInfo}> 
                <Text style={[styles.productBrand, { color: theme.subtitleColor }]}>{product.partnerName}</Text>
                <Text style={[styles.productName, { color: theme.titleColor }]}>{product.name}</Text>
                <Text style={[styles.productCategory, { color: theme.subtitleColor }]}>{product.category}</Text>
                <View style={styles.productPriceRow}> 
                  <Text style={[styles.productPrice, { color: theme.titleColor }]}>{formatCurrency(finalPrice)}</Text>
                  {discount > 0 ? (
                    <Text style={styles.productOriginalPrice}>{formatCurrency(product.priceCents / 100)}</Text>
                  ) : null}
                </View>
                {product.eligibleForInfluencerDiscount && savedCode ? (
                  <Text style={[styles.productBadge, { color: '#059669' }]}>-{discount}% met {savedCode}</Text>
                ) : null}
                {product.status === 'coming_soon' ? (
                  <Text style={styles.productTag}>Binnenkort</Text>
                ) : null}
              </View>
              <View style={styles.cardActions}> 
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(product.id)}
                >
                  <Text style={{ color: favoriteIds.includes(product.id) ? '#F59E0B' : theme.subtitleColor }}>
                    {favoriteIds.includes(product.id) ? '♥' : '♡'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.addButton, product.status !== 'available' && styles.disabledButton]}
                  disabled={product.status !== 'available'}
                  onPress={() => handleAddToCart(product)}
                >
                  <Text style={styles.addButtonText}>{product.status === 'available' ? 'In winkelwagen' : 'Binnenkort'}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  codeSection: {
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInput: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
  },
  applyButton: {
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  savedCode: {
    marginTop: 10,
    fontSize: 14,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  productCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  productInfo: {
    padding: 16,
  },
  productBrand: {
    fontSize: 12,
    marginBottom: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 13,
    marginBottom: 10,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  productBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  productTag: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 10,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#2563EB',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.4,
  },
});
