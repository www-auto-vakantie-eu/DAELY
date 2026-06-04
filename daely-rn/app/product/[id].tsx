import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
  addFavoriteProduct,
  getFavoriteProducts,
  getSavedInfluencerCode,
  removeFavoriteProduct,
} from '@/services/commerce-storage';

let cartHydrated = false;

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

export default function ProductDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const hydrateCart = useCartStore((state) => state._hydrate);

  const [product, setProduct] = useState<CommerceProduct | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!cartHydrated) {
      hydrateCart();
      cartHydrated = true;
    }
  }, [hydrateCart]);

  useEffect(() => {
    const found = COMMERCE_PRODUCTS.find((p) => p.id === params.id);
    setProduct(found || null);

    getSavedInfluencerCode().then((code) => {
      if (code) {
        setSavedCode(code);
      }
    });

    if (params.id) {
      getFavoriteProducts().then((ids) => {
        setIsFavorite(ids.includes(params.id));
      });
    }
  }, [params.id]);

  if (!product) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <PageHeader
          title="Product"
          onCartPress={() => router.push('/(tabs)/cart')}
          showSearch={false}
          showSettings={false}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Product niet gevonden</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Dit product bestaat niet of is verwijderd.</Text>
            <Pressable style={styles.backButton} onPress={() => router.push('/shop')}>
              <Text style={styles.backButtonText}>Terug naar shop</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const discount = savedCode && product.eligibleForInfluencerDiscount
    ? INFLUENCER_DISCOUNT_CODES.find((item) => item.code === savedCode)?.percent ?? 0
    : 0;
  const finalPrice = discount > 0
    ? ((product.priceCents * (100 - discount)) / 100) / 100
    : product.priceCents / 100;

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavoriteProduct(product.id);
      setMessage('Verwijderd uit favorieten.');
      return;
    }

    setIsFavorite(true);
    await addFavoriteProduct(product.id);
    setMessage('Toegevoegd aan favorieten.');
  };

  const handleAddToCart = () => {
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
        title={product.name}
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.imagePlaceholder }} style={styles.productImage} />

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {product.productBadge ? (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>{product.productBadge}</Text>
            </View>
          ) : null}
          <Text style={[styles.partnerName, { color: theme.subtitleColor }]}>{product.partnerName}</Text>
          <Text style={[styles.productName, { color: theme.titleColor }]}>{product.name}</Text>
          <Text style={[styles.category, { color: theme.subtitleColor }]}>{product.category}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.titleColor }]}>{formatCurrency(finalPrice)}</Text>
            {discount > 0 ? (
              <Text style={styles.originalPrice}>{formatCurrency(product.priceCents / 100)}</Text>
            ) : null}
          </View>

          {product.eligibleForInfluencerDiscount && savedCode ? (
            <Text style={[styles.discountBadge, { color: '#059669' }]}>-{discount}% korting met code {savedCode}</Text>
          ) : null}

          {savedCode ? (
            <Text style={[styles.savedCode, { color: theme.subtitleColor }]}>Actieve code: {savedCode}</Text>
          ) : null}

          <Text style={[styles.status, { color: product.status === 'available' ? '#059669' : '#F59E0B' }]}>
            {product.status === 'available' ? 'Beschikbaar' : 'Binnenkort'}
          </Text>

          <Text style={[styles.partnerInfo, { color: theme.subtitleColor }]}>Verkocht door {product.partnerName}</Text>

          {product.description ? (
            <>
              <Text style={[styles.descriptionTitle, { color: theme.titleColor }]}>Beschrijving</Text>
              <Text style={[styles.description, { color: theme.subtitleColor }]}>{product.description}</Text>
            </>
          ) : null}

          {product.benefits && product.benefits.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Voordelen</Text>
              <View style={styles.benefitsRow}>
                {product.benefits.map((benefit, index) => (
                  <View key={index} style={[styles.benefitChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text style={[styles.benefitText, { color: theme.titleColor }]}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {product.sizes && product.sizes.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Maten</Text>
              <View style={styles.optionsRow}>
                {product.sizes.map((size, index) => (
                  <View key={index} style={[styles.optionChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text style={[styles.optionText, { color: theme.titleColor }]}>{size}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {product.colors && product.colors.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Kleuren</Text>
              <View style={styles.optionsRow}>
                {product.colors.map((color, index) => (
                  <View key={index} style={[styles.optionChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text style={[styles.optionText, { color: theme.titleColor }]}>{color}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {product.shippingInfo ? (
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>Verzending: {product.shippingInfo}</Text>
          ) : null}

          {product.returnInfo ? (
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>Retour: {product.returnInfo}</Text>
          ) : null}

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={handleToggleFavorite}
            >
              <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
                {isFavorite ? '♥ Favoriet' : '♡ Favoriet'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.addButton, product.status !== 'available' && styles.disabledButton]}
              disabled={product.status !== 'available'}
              onPress={handleAddToCart}
            >
              <Text style={styles.addButtonText}>
                {product.status === 'available' ? 'Toevoegen aan winkelwagen' : 'Binnenkort'}
              </Text>
            </Pressable>
          </View>

          {message ? <Text style={[styles.message, { color: theme.titleColor }]}>{message}</Text> : null}

          <View style={styles.linkRow}>
            <Pressable style={styles.linkButton} onPress={() => router.push('/(tabs)/cart')}>
              <Text style={styles.linkButtonText}>Naar winkelwagen</Text>
            </Pressable>
            <Pressable style={styles.linkButton} onPress={() => router.push('/shop')}>
              <Text style={styles.linkButtonText}>Terug naar shop</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  emptyCard: {
    margin: 16,
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
  backButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  infoCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  partnerName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 18,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  savedCode: {
    fontSize: 13,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  partnerInfo: {
    fontSize: 13,
    marginBottom: 16,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  benefitChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  favoriteButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderColor: '#E5E7EB',
  },
  favoriteButtonActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  favoriteButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  favoriteButtonTextActive: {
    color: '#F59E0B',
  },
  addButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  disabledButton: {
    opacity: 0.4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 12,
  },
  linkButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  linkButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },
});