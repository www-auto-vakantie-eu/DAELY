import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from './store/cartStore';
import PageHeader from './components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import {
  createDraftOrderFromCart,
  getDiscountForCode,
  getSavedInfluencerCode,
} from '@/services/commerce-storage';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

export default function CheckoutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    getSavedInfluencerCode().then((code) => {
      if (code) {
        setSavedCode(code);
      }
    });
  }, []);

  const discountPercent = savedCode ? getDiscountForCode(savedCode)?.percent ?? 0 : 0;

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
      }, 0),
    [items, discountPercent]
  );

  const total = subtotal - discountAmount;

  const partnerGroups = useMemo(() => {
    const groups: Record<string, { partnerName: string; count: number; total: number }> = {};

    items.forEach((item) => {
      const partnerId = item.partnerId ?? 'unknown';
      const partnerName = item.partnerName ?? 'DAELY';
      const group = groups[partnerId] || { partnerName, count: 0, total: 0 };
      group.count += item.quantity;
      group.total += item.price * item.quantity;
      groups[partnerId] = group;
    });

    return Object.entries(groups).map(([partnerId, group]) => ({
      partnerId,
      partnerName: group.partnerName,
      itemCount: group.count,
      total: group.total,
    }));
  }, [items]);

  const handleCreateDraftOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Winkelwagen leeg', 'Voeg eerst een product toe voordat je een concept-bestelling maakt.');
      return;
    }

    try {
      await createDraftOrderFromCart(items, savedCode);
      clearCart();
      setStatusMessage('Concept-bestelling gemaakt. Je kunt hem terugvinden bij My Orders.');
      router.push('/my-orders');
    } catch {
      Alert.alert('Fout', 'Er is iets misgegaan bij het maken van de concept-bestelling.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="Checkout"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Besteloverzicht</Text>
          <View style={styles.row}> 
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Subtotaal</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.row}> 
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Korting</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>
              {discountPercent > 0 ? `-${discountPercent}%` : 'Geen korting'}
            </Text>
          </View>
          <View style={styles.row}> 
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Totaal</Text>
            <Text style={[styles.total, { color: theme.titleColor }]}>{formatCurrency(total)}</Text>
          </View>
          <Text style={[styles.helpText, { color: theme.subtitleColor }]}>Partnerorders worden lokaal gesplitst en later doorgestuurd.</Text>
        </View>

        <View style={[styles.partnerSection, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Partnerverdeling</Text>
          {partnerGroups.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Je hebt nog geen producten in de winkelwagen.</Text>
          ) : (
            partnerGroups.map((group) => (
              <View key={group.partnerId} style={styles.partnerRow}> 
                <Text style={[styles.partnerName, { color: theme.titleColor }]}>{group.partnerName}</Text>
                <Text style={[styles.partnerMeta, { color: theme.subtitleColor }]}>{group.itemCount} items • {formatCurrency(group.total)}</Text>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={[styles.primaryButton, items.length === 0 && styles.disabledButton]}
          disabled={items.length === 0}
          onPress={handleCreateDraftOrder}
        >
          <Text style={styles.primaryButtonText}>Concept-bestelling maken</Text>
        </Pressable>
        {statusMessage ? <Text style={[styles.statusMessage, { color: theme.titleColor }]}>{statusMessage}</Text> : null}
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
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  total: {
    fontSize: 20,
    fontWeight: '900',
  },
  helpText: {
    marginTop: 10,
    fontSize: 13,
  },
  partnerSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  partnerRow: {
    marginBottom: 14,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
  },
  partnerMeta: {
    fontSize: 13,
  },
  primaryButton: {
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
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusMessage: {
    marginTop: 16,
    fontSize: 14,
  },
});
