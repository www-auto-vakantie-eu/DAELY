import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import {
  getDiscountForCode,
  getSavedInfluencerCode,
  saveInfluencerCode,
  validateInfluencerCode,
} from '@/services/commerce-storage';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [codeInput, setCodeInput] = useState('');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSavedInfluencerCode().then((code) => {
      if (code) {
        setActiveCode(code);
        setCodeInput(code);
      }
    });
  }, []);

  const discountPercent = activeCode ? getDiscountForCode(activeCode)?.percent ?? 0 : 0;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(
    () =>
      items.reduce((sum, item) => {
        const eligible = item.meta?.eligibleForDiscount === true;
        if (!eligible || discountPercent <= 0) {
          return sum;
        }
        return sum + item.price * item.quantity * (discountPercent / 100);
      },
      0),
    [items, discountPercent]
  );

  const total = subtotal - discountAmount;

  const handleApplyCode = async () => {
    const normalized = codeInput.trim().toUpperCase();
    if (!normalized) {
      setMessage('Voer een code in om korting toe te passen.');
      return;
    }

    if (!validateInfluencerCode(normalized)) {
      setMessage('Ongeldige code. Probeer DAELY10, COACH15 of ATHLETE20.');
      return;
    }

    await saveInfluencerCode(normalized);
    setActiveCode(normalized);
    setMessage(`Kortingscode ${normalized} is toegepast.`);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity <= 1) {
      removeItem(id);
      return;
    }
    updateQuantity(id, quantity - 1);
  };

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="Winkelwagen"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.codeSection, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Kortingscode</Text>
          <View style={styles.inputRow}> 
            <TextInput
              style={[styles.codeInput, { backgroundColor: theme.background, color: theme.titleColor, borderColor: theme.border }]}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="DAELY10"
              placeholderTextColor={theme.subtitleColor}
              autoCapitalize="characters"
            />
            <Pressable style={[styles.applyButton, { backgroundColor: '#2563EB' }]} onPress={handleApplyCode}>
              <Text style={styles.applyButtonText}>Toepassen</Text>
            </Pressable>
          </View>
          {activeCode ? (
            <Text style={[styles.savedCode, { color: theme.titleColor }]}>Actieve code: {activeCode}</Text>
          ) : (
            <Text style={[styles.savedCode, { color: theme.subtitleColor }]}>Geen actieve code.</Text>
          )}
          {message ? <Text style={[styles.message, { color: theme.titleColor }]}>{message}</Text> : null}
        </View>

        {items.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Je winkelwagen is leeg.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              {item.image ? <Image source={{ uri: item.image }} style={styles.itemImage} /> : null}
              <View style={styles.itemDetails}> 
                <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{item.name}</Text>
                {item.partnerName ? <Text style={[styles.itemPartner, { color: theme.subtitleColor }]}>{item.partnerName}</Text> : null}
                <Text style={[styles.itemMeta, { color: theme.subtitleColor }]}>Prijs: {formatCurrency(item.price)}</Text>
                <View style={styles.quantityRow}> 
                  <Pressable style={styles.quantityButton} onPress={() => handleDecrease(item.id, item.quantity)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={[styles.quantityText, { color: theme.titleColor }]}>{item.quantity}</Text>
                  <Pressable style={styles.quantityButton} onPress={() => handleIncrease(item.id, item.quantity)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Text style={{ color: '#EF4444' }}>Verwijder</Text>
              </Pressable>
            </View>
          ))
        )}

        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.summaryRow}> 
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Subtotaal</Text>
            <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Korting</Text>
            <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{discountPercent > 0 ? `-${discountPercent}% (${formatCurrency(discountAmount)})` : 'Geen korting'}</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Totaal</Text>
            <Text style={[styles.totalValue, { color: theme.titleColor }]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <Pressable style={[styles.primaryButton, items.length === 0 && styles.disabledButton]} disabled={items.length === 0} onPress={handleCheckout}>
          <Text style={styles.primaryButtonText}>Naar checkout</Text>
        </Pressable>
        <View style={styles.placeholderBox}> 
          <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>Betalen is een placeholder. Geen live betaling wordt gestart.</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  codeSection: {
    marginBottom: 18,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  applyButton: {
    borderRadius: 14,
    paddingHorizontal: 18,
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
    marginTop: 10,
    fontSize: 14,
  },
  emptyText: {
    marginTop: 20,
    color: '#6B7280',
    fontSize: 15,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemPartner: {
    fontSize: 13,
    marginBottom: 8,
  },
  itemMeta: {
    fontSize: 13,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 6,
    marginLeft: 12,
  },
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  primaryButton: {
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  placeholderBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  placeholderText: {
    fontSize: 13,
  },
});
