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

const FILTER_PARTNERS: string[] = [
  'Alles',
  'Nike',
  'Gymshark',
  'DFYNE',
  'DAELY Essentials',
];

const SORT_OPTIONS: ('Aanbevolen' | 'Prijs laag-hoog' | 'Prijs hoog-laag' | 'Partner A-Z')[] = [
  'Aanbevolen',
  'Prijs laag-hoog',
  'Prijs hoog-laag',
  'Partner A-Z',
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
  const [selectedPartner, setSelectedPartner] = useState<string>('Alles');
  const [selectedSort, setSelectedSort] = useState<'Aanbevolen' | 'Prijs laag-hoog' | 'Prijs hoog-laag' | 'Partner A-Z'>('Aanbevolen');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const filteredProducts = useMemo(() => {
  let products = COMMERCE_PRODUCTS;

  if (selectedCategory !== 'Alles') {
    products = products.filter((product) => product.category === selectedCategory);
  }

  if (selectedPartner !== 'Alles') {
    products = products.filter((product) => product.partnerName === selectedPartner);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    products = products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.partnerName.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  if (selectedSort === 'Prijs laag-hoog') {
    products = [...products].sort((a, b) => a.priceCents - b.priceCents);
  } else if (selectedSort === 'Prijs hoog-laag') {
    products = [...products].sort((a, b) => b.priceCents - a.priceCents);
  } else if (selectedSort === 'Partner A-Z') {
    products = [...products].sort((a, b) => a.partnerName.localeCompare(b.partnerName));
  }

  return products;
}, [selectedCategory, selectedPartner, selectedSort, searchQuery]);

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

  const handleClearFilters = () => {
    setSelectedCategory('Alles');
    setSelectedPartner('Alles');
    setSelectedSort('Aanbevolen');
    setSearchQuery('');
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
          <View style={styles.heroActions}>
            <Pressable style={styles.heroActionButton} onPress={() => router.push('/favorites')}>
              <Text style={styles.heroActionText}>Favorieten</Text>
            </Pressable>
            <Pressable style={styles.heroActionButton} onPress={() => router.push('/(tabs)/cart')}>
              <Text style={styles.heroActionText}>Winkelwagen</Text>
            </Pressable>
          </View>
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

        <View style={[styles.searchSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.background, color: theme.titleColor, borderColor: theme.border }]}
            placeholder="Zoek product, partner of categorie"
            placeholderTextColor={theme.subtitleColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: theme.titleColor }]}>Partner</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterRow}>
              {FILTER_PARTNERS.map((partner) => (
                <Pressable
                  key={partner}
                  style={[
                    styles.filterChip,
                    selectedPartner === partner && { backgroundColor: '#2563EB' },
                    { borderColor: theme.border },
                  ]}
                  onPress={() => setSelectedPartner(partner)}
                >
                  <Text style={[styles.filterChipText, selectedPartner === partner && { color: '#FFFFFF' }]}>{partner}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: theme.titleColor }]}>Categorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
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
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: theme.titleColor }]}>Sorteren</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterRow}>
              {SORT_OPTIONS.map((sort) => (
                <Pressable
                  key={sort}
                  style={[
                    styles.filterChip,
                    selectedSort === sort && { backgroundColor: '#2563EB' },
                    { borderColor: theme.border },
                  ]}
                  onPress={() => setSelectedSort(sort)}
                >
                  <Text style={[styles.filterChipText, selectedSort === sort && { color: '#FFFFFF' }]}>{sort}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.resultSection}>
          <Text style={[styles.resultText, { color: theme.subtitleColor }]}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 'en' : ''} gevonden
          </Text>
          {(searchQuery || selectedPartner !== 'Alles' || selectedCategory !== 'Alles') && (
            <Pressable onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>Filters wissen</Text>
            </Pressable>
          )}
        </View>

        {filteredProducts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Geen producten gevonden.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Pas je zoekterm of filters aan.</Text>
            <Pressable style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Filters wissen</Text>
            </Pressable>
          </View>
        ) : null}

        {filteredProducts.map((product) => {
          const discount = savedCode && product.eligibleForInfluencerDiscount
            ? INFLUENCER_DISCOUNT_CODES.find((item) => item.code === savedCode)?.percent ?? 0
            : 0;
          const finalPrice = discount > 0
            ? ((product.priceCents * (100 - discount)) / 100) / 100
            : product.priceCents / 100;

          return (
            <Pressable
              key={product.id}
              style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push(`/product/${product.id}` as any)}
            >
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
                  onPress={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(product.id);
                  }}
                >
                  <Text style={{ color: favoriteIds.includes(product.id) ? '#F59E0B' : theme.subtitleColor }}>
                    {favoriteIds.includes(product.id) ? '♥' : '♡'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.addButton, product.status !== 'available' && styles.disabledButton]}
                  disabled={product.status !== 'available'}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <Text style={styles.addButtonText}>{product.status === 'available' ? 'In winkelwagen' : 'Binnenkort'}</Text>
                </Pressable>
              </View>
            </Pressable>
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
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  heroActionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  heroActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
  searchSection: {
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  searchInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
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
  resultSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 13,
  },
  clearFiltersText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 14,
  },
  clearButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  clearButtonText: {
    color: '#FFFFFF',
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
