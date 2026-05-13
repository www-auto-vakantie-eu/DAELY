
import { COMMUNITY_CREATORS } from '@/constants/community-creators';
import { StyleSheet } from 'react-native';
// ...existing code...

// --- Component ---

export default function CreatorCommerceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const cart = useCartStore();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [sort, setSort] = useState<string>('populair');

  // Debug: log id en beschikbare creators
  console.log('CreatorCommerceScreen id:', id);
  console.log('COMMUNITY_CREATORS ids:', COMMUNITY_CREATORS.map(c => c.id));

  // Dummy data per creator-id (uitbreidbaar)
  const CREATOR_DATA: Record<string, any> = React.useMemo(() => {
    const data: Record<string, any> = {};
    for (const c of COMMUNITY_CREATORS) {
      data[c.id] = {
        name: c.name,
        featuredBundle: {
          id: 'dummy-bundle',
          name: `${c.name}'s Bundel`,
          description: 'Voorbeeldbundel voor deze creator. Hier komt straks een echte actie.',
          image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
          price: 99.99,
          salePrice: 79.99,
          products: [
            { id: 'dummy-product-1', name: 'Voorbeeld Product 1', price: 49.99 },
            { id: 'dummy-product-2', name: 'Voorbeeld Product 2', price: 49.99 },
          ],
          savings: 20.00,
          label: `Aanbevolen door ${c.name}`,
        },
        bundles: [
          {
            id: 'dummy-bundle',
            name: `${c.name}'s Bundel`,
            description: 'Voorbeeldbundel voor deze creator.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            price: 99.99,
            salePrice: 79.99,
            products: [
              { id: 'dummy-product-1', name: 'Voorbeeld Product 1', price: 49.99 },
              { id: 'dummy-product-2', name: 'Voorbeeld Product 2', price: 49.99 },
            ],
            savings: 20.00,
            label: `Aanbevolen door ${c.name}`,
          },
        ],
        brands: [
          {
            id: 'dummy-brand',
            name: 'Voorbeeld Merk',
            logo: 'https://logo.clearbit.com/example.com',
            description: 'Voorbeeldmerk voor deze creator.',
            why: `${c.name} werkt samen met dit merk vanwege kwaliteit en innovatie.`,
            action: '10% korting op alle producten',
            label: 'Officiële samenwerking',
          },
        ],
        products: [
          {
            id: 'dummy-product-1',
            name: 'Voorbeeld Product 1',
            brand: 'Voorbeeld Merk',
            image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
            price: 49.99,
            salePrice: 39.99,
            creatorRecommendation: `Aanbevolen door ${c.name}.`,
            labels: ['Favoriet van de creator'],
            sizes: ['S', 'M', 'L'],
          },
        ],
        faq: [
          { q: 'Hoe werkt de creator-korting?', a: 'De korting wordt automatisch toegepast wanneer je via deze pagina een product toevoegt.' },
          { q: 'Kan ik producten retourneren?', a: 'Ja, retourneren kan binnen 30 dagen na ontvangst.' },
          { q: 'Zijn dit betaalde samenwerkingen?', a: 'Sommige samenwerkingen zijn betaald of affiliate, dit staat altijd duidelijk vermeld.' },
        ],
      };
    }
    return data;
  }, [COMMUNITY_CREATORS]);

  // Vind de creator in de lijst
  const creator = COMMUNITY_CREATORS.find((c) => c.id === id);
  const data = id && CREATOR_DATA[id];

  if (!creator || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.titleColor, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Creator niet gevonden</Text>
        <Text style={{ color: theme.subtitleColor }}>Deze pagina is nog niet ingericht voor deze creator.</Text>
      </View>
    );
  }

  // --- Helper: Voeg bundel toe aan winkelwagen ---
  function addBundleToCart(bundle: any) {
    bundle.products.forEach((p: any) => {
      cart.addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        creatorId: creator.id,
        creatorName: creator.name,
        bundleId: bundle.id,
        bundleName: bundle.name,
        discount: bundle.price < bundle.products.reduce((sum: number, x: any) => sum + x.price, 0) ? (bundle.products.reduce((sum: number, x: any) => sum + x.price, 0) - bundle.price) : 0,
      });
    });
    Alert.alert('Toegevoegd', `Toegevoegd aan je winkelwagen via ${creator.name}'s actie.`);
  }

  // --- Helper: Voeg los product toe ---
  function addProductToCart(product: any) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      creatorId: creator.id,
      creatorName: creator.name,
      discount: (product.price - (product.salePrice || product.price)),
    });
    Alert.alert('Toegevoegd', `Toegevoegd aan je winkelwagen via ${creator.name}'s actie.`);
  }

  // --- Filteren/sorteren ---
  let filteredProducts = data.products;
  if (selectedBrand) filteredProducts = filteredProducts.filter((p: any) => p.brand === selectedBrand);
  if (filter) filteredProducts = filteredProducts.filter((p: any) => p.labels?.includes(filter));
  if (sort === 'nieuwste') filteredProducts = filteredProducts;
  if (sort === 'hoogste korting') filteredProducts = [...filteredProducts].sort((a: any, b: any) => ((b.price - (b.salePrice || b.price)) - (a.price - (a.salePrice || a.price))));
  if (sort === 'prijs laag-hoog') filteredProducts = [...filteredProducts].sort((a: any, b: any) => (a.salePrice || a.price) - (b.salePrice || b.price));
  if (sort === 'prijs hoog-laag') filteredProducts = [...filteredProducts].sort((a: any, b: any) => (b.salePrice || b.price) - (a.salePrice || a.price));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      {/* 1. Uitgelichte actie/deal */}
      <View style={styles.featuredCard}>
        <Image source={{ uri: data.featuredBundle.image }} style={styles.featuredImage} />
        <Text style={styles.featuredTitle}>{data.featuredBundle.name}</Text>
        <Text style={styles.featuredDesc}>{data.featuredBundle.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>€{data.featuredBundle.price.toFixed(2)}</Text>
          <Text style={styles.salePrice}>€{data.featuredBundle.salePrice.toFixed(2)}</Text>
          <Text style={styles.savings}>Je bespaart €{data.featuredBundle.savings.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Pressable style={styles.ctaButton} onPress={() => addBundleToCart(data.featuredBundle)}>
            <MaterialCommunityIcons name="cart-plus" size={18} color="#fff" />
            <Text style={styles.ctaButtonText}>Voeg bundel toe aan winkelwagen</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Bekijk producten</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Creator-bundels */}
      <Text style={styles.sectionTitle}>Bundels van {creator.name}</Text>
      {data.bundles.map((bundle: any) => (
        <View key={bundle.id} style={styles.bundleCard}>
          <Image source={{ uri: bundle.image }} style={styles.bundleImage} />
          <Text style={styles.bundleName}>{bundle.name}</Text>
          <Text style={styles.bundleDesc}>{bundle.description}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.oldPrice}>€{bundle.price.toFixed(2)}</Text>
            <Text style={styles.salePrice}>€{bundle.salePrice.toFixed(2)}</Text>
            <Text style={styles.savings}>Je bespaart €{(bundle.price - bundle.salePrice).toFixed(2)}</Text>
          </View>
          <Text style={styles.bundleLabel}>{bundle.label}</Text>
          <Pressable style={styles.ctaButton} onPress={() => addBundleToCart(bundle)}>
            <MaterialCommunityIcons name="cart-plus" size={18} color="#fff" />
            <Text style={styles.ctaButtonText}>Voeg volledige bundel toe aan winkelwagen</Text>
          </Pressable>
        </View>
      ))}

      {/* 3. Merken */}
      <Text style={styles.sectionTitle}>Merken waarmee {creator.name} samenwerkt</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {data.brands.map((brand: any) => (
          <View key={brand.id} style={styles.brandCard}>
            <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.brandDesc}>{brand.description}</Text>
            <Text style={styles.brandWhy}>{brand.why}</Text>
            <Text style={styles.brandAction}>{brand.action}</Text>
            <Text style={styles.brandLabel}>{brand.label}</Text>
            <Pressable style={styles.secondaryButton} onPress={() => setSelectedBrand(brand.name)}>
              <Text style={styles.secondaryButtonText}>Bekijk producten van dit merk</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* 4. Productkaarten */}
      <Text style={styles.sectionTitle}>Producten uit samenwerkingen</Text>
      {/* Filters en sortering */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <Pressable style={styles.filterButton} onPress={() => setFilter('Favoriet van de creator')}><Text>Favorieten</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setFilter('Tijdelijke actie')}><Text>Acties</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setFilter('Populair in de community')}><Text>Populair</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setFilter('')}><Text>Alles</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <Pressable style={styles.filterButton} onPress={() => setSort('populair')}><Text>Populair</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setSort('nieuwste')}><Text>Nieuwste</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setSort('hoogste korting')}><Text>Hoogste korting</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setSort('prijs laag-hoog')}><Text>Prijs laag-hoog</Text></Pressable>
        <Pressable style={styles.filterButton} onPress={() => setSort('prijs hoog-laag')}><Text>Prijs hoog-laag</Text></Pressable>
      </View>
      {filteredProducts.map((product: any) => (
        <View key={product.id} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productDesc}>{product.creatorRecommendation}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.oldPrice}>€{product.price.toFixed(2)}</Text>
            <Text style={styles.salePrice}>€{product.salePrice.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
            {product.labels.map((label: string) => (
              <Text key={label} style={styles.productLabel}>{label}</Text>
            ))}
          </View>
          <Pressable style={styles.ctaButton} onPress={() => addProductToCart(product)}>
            <MaterialCommunityIcons name="cart-plus" size={18} color="#fff" />
            <Text style={styles.ctaButtonText}>Voeg toe aan winkelwagen</Text>
          </Pressable>
        </View>
      ))}

      {/* 5. Verhaal achter de samenwerking */}
      <Text style={styles.sectionTitle}>Waarom deze samenwerking?</Text>
      <Text style={styles.storyText}>Deze producten gebruikt {creator.name} tijdens trainingen, wedstrijden en herstelmomenten. De selectie is gebaseerd op comfort, kwaliteit en toepasbaarheid voor sporters binnen deze community.</Text>

      {/* 6. Reviews/video’s */}
      <Text style={styles.sectionTitle}>Reviews & video’s van {creator.name}</Text>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewQuote}>“Deze schoenen draag ik bij mijn intervaltrainingen omdat ze licht zijn maar genoeg demping geven.”</Text>
        <Text style={styles.reviewProduct}>- Over Nike Pegasus 41</Text>
      </View>

      {/* 8. Transparantie */}
      <Text style={styles.sectionTitle}>Transparantie over samenwerking</Text>
      <Text style={styles.transparencyText}>Sommige producten op deze pagina maken deel uit van een betaalde samenwerking of affiliate-samenwerking. Wanneer je via deze pagina koopt, kan de creator hier voordeel uit halen. Kortingen worden automatisch toegepast wanneer beschikbaar.</Text>

      {/* 11. FAQ */}
      <Text style={styles.sectionTitle}>Veelgestelde vragen</Text>
      {data.faq.map((item: any, idx: number) => (
        <View key={idx} style={styles.faqCard}>
          <Text style={styles.faqQ}>{item.q}</Text>
          <Text style={styles.faqA}>{item.a}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  featuredCard: { borderRadius: 16, backgroundColor: '#F3F4F6', padding: 18, marginBottom: 24 },
  featuredImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
  featuredTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  featuredDesc: { fontSize: 14, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  oldPrice: { textDecorationLine: 'line-through', color: '#888', fontSize: 14 },
  salePrice: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 },
  savings: { color: '#10B981', fontWeight: 'bold', fontSize: 13 },
  ctaButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, marginTop: 8, gap: 8 },
  ctaButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, marginTop: 8, gap: 8 },
  secondaryButtonText: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginTop: 32, marginBottom: 12 },
  bundleCard: { borderRadius: 14, backgroundColor: '#F3F4F6', padding: 16, marginBottom: 18 },
  bundleImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 8 },
  bundleName: { fontSize: 16, fontWeight: '700' },
  bundleDesc: { fontSize: 13, marginBottom: 6 },
  bundleLabel: { color: '#2563EB', fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  brandCard: { width: 220, borderRadius: 14, backgroundColor: '#fff', padding: 14, marginRight: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  brandLogo: { width: 48, height: 48, borderRadius: 12, marginBottom: 8 },
  brandName: { fontSize: 15, fontWeight: '700' },
  brandDesc: { fontSize: 12, marginBottom: 4 },
  brandWhy: { fontSize: 12, fontStyle: 'italic', marginBottom: 2 },
  brandAction: { color: '#10B981', fontWeight: 'bold', fontSize: 12 },
  brandLabel: { color: '#2563EB', fontWeight: 'bold', fontSize: 11, marginBottom: 4 },
  filterButton: { backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  productCard: { borderRadius: 14, backgroundColor: '#fff', padding: 14, marginBottom: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  productImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 8 },
  productName: { fontSize: 15, fontWeight: '700' },
  productBrand: { fontSize: 12, color: '#2563EB', marginBottom: 2 },
  productDesc: { fontSize: 12, marginBottom: 4 },
  productLabel: { backgroundColor: '#F3F4F6', color: '#2563EB', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, marginRight: 4 },
  storyText: { fontSize: 13, marginBottom: 12 },
  reviewCard: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, marginBottom: 12 },
  reviewQuote: { fontStyle: 'italic', fontSize: 13, marginBottom: 4 },
  reviewProduct: { fontSize: 12, color: '#2563EB' },
  transparencyText: { fontSize: 12, color: '#888', marginBottom: 12 },
  faqCard: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, marginBottom: 8 },
  faqQ: { fontWeight: 'bold', fontSize: 13 },
  faqA: { fontSize: 12 },
});
