import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/app/store/cartStore';
import PageHeader from '@/app/components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import {
  COMMERCE_PRODUCTS,
  CommerceProduct,
  CommerceProductCategory,
  INFLUENCER_DISCOUNT_CODES,
} from '@/app/constants/commerce';
import {
  getFavoriteProducts,
  getSavedInfluencerCode,
  removeFavoriteProduct,
} from '@/services/commerce-storage';

let cartHydrated = false;

const getPlaceholderColor = (placeholder: string): string => {
  if (placeholder.includes('performance')) return '#1E3A8A';
  if (placeholder.includes('essentials')) return '#059669';
  if (placeholder.includes('studio')) return '#7C3AED';
  if (placeholder.includes('recovery')) return '#DC2626';
  return '#6B7280';
};

const ProductImage = ({ placeholder, style }: { placeholder: string; style: any }) => {
  const isUrl = placeholder.startsWith('http://') || placeholder.startsWith('https://');
  if (isUrl) {
    return <Image source={{ uri: placeholder }} style={style} />;
  }
  const color = getPlaceholderColor(placeholder);
  return (
    <View style={[style, { backgroundColor: color, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800' }}>DAELY</Text>
    </View>
  );
};

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

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const hydrateCart = useCartStore((state) => state._hydrate);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!cartHydrated) {
      hydrateCart();
      cartHydrated = true;
    }
  }, [hydrateCart]);

  useEffect(() => {
    getFavoriteProducts().then(setFavoriteIds);
    getSavedInfluencerCode().then((code) => {
      if (code) {
        setSavedCode(code);
      }
    });
  }, []);

  const favoriteProducts = favoriteIds
    .map((id) => COMMERCE_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as CommerceProduct[];

  const handleToggleFavorite = async (productId: string) => {
    const next = favoriteIds.filter((id) => id !== productId);
    setFavoriteIds(next);
    await removeFavoriteProduct(productId);
    setMessage('Verwijderd uit favorieten.');
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
        title="Favorieten"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Bewaar producten die je later wilt bestellen.</Text>
        </View>

        {favoriteProducts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen favoriete producten.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Sla producten op vanuit de shop om ze hier terug te vinden.</Text>
            <Pressable style={styles.shopButton} onPress={() => router.push('/shop')}>
              <Text style={styles.shopButtonText}>Shop openen</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {favoriteProducts.map((product) => {
              const discount = savedCode && product.eligibleForInfluencerDiscount
                ? INFLUENCER_DISCOUNT_CODES.find((item) => item.code === savedCode)?.percent ?? 0
                : 0;
              const finalPrice = discount > 0
                ? ((product.priceCents * (100 - discount)) / 100) / 100
                : product.priceCents / 100;

              return (
                <View key={product.id} style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <ProductImage placeholder={product.imagePlaceholder} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    {product.productBadge ? (
                      <Text style={styles.cardBadge}>{product.productBadge}</Text>
                    ) : null}
                    <Text style={[styles.partnerName, { color: theme.subtitleColor }]}>{product.partnerName}</Text>
                    <Text style={[styles.productName, { color: theme.titleColor }]}>{product.name}</Text>
                    <Text style={[styles.category, { color: theme.subtitleColor }]}>{product.category}</Text>
                    {product.description ? (
                      <Text style={[styles.productDescription, { color: theme.subtitleColor }]} numberOfLines={2}>{product.description}</Text>
                    ) : null}
                    <View style={styles.priceRow}>
                      <Text style={[styles.price, { color: theme.titleColor }]}>{formatCurrency(finalPrice)}</Text>
                      {discount > 0 ? (
                        <Text style={styles.originalPrice}>{formatCurrency(product.priceCents / 100)}</Text>
                      ) : null}
                    </View>
                    {product.eligibleForInfluencerDiscount && savedCode ? (
                      <Text style={[styles.discountBadge, { color: '#059669' }]}>-{discount}% met {savedCode}</Text>
                    ) : null}
                    {savedCode ? (
                      <Text style={[styles.savedCode, { color: theme.subtitleColor }]}>Actieve code: {savedCode}</Text>
                    ) : null}
                  </View>
                  <View style={styles.actions}>
                    <Pressable style={styles.detailButton} onPress={() => router.push(`/product/${product.id}` as any)}>
                      <Text style={styles.detailButtonText}>Bekijk</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.addButton, product.status !== 'available' && styles.disabledButton]}
                      disabled={product.status !== 'available'}
                      onPress={() => handleAddToCart(product)}
                    >
                      <Text style={styles.addButtonText}>
                        {product.status === 'available' ? 'In winkelwagen' : 'Binnenkort'}
                      </Text>
                    </Pressable>
                    <Pressable style={styles.removeButton} onPress={() => handleToggleFavorite(product.id)}>
                      <Text style={styles.removeButtonText}>Verwijderen</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {message ? <Text style={[styles.message, { color: theme.titleColor }]}>{message}</Text> : null}
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
    fontSize: 18,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  shopButtonText: {
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
  partnerName: {
    fontSize: 12,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  savedCode: {
    fontSize: 12,
    marginBottom: 8,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  detailButtonText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 13,
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  disabledButton: {
    opacity: 0.4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  removeButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
  },
  removeButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});