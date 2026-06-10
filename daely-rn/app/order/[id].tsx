import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { CommerceOrder } from '@/app/constants/commerce';
import { getCommerceOrders } from '@/services/commerce-storage';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const formatStatus = (status: CommerceOrder['status']) => {
  switch (status) {
    case 'draft':
      return 'Concept';
    case 'pending_payment':
      return 'In afwachting';
    case 'paid_placeholder':
      return 'Betaald';
    case 'sent_to_partners_placeholder':
      return 'Verzonden naar partners';
    default:
      return status;
  }
};

const formatPaymentStatus = (status?: CommerceOrder['paymentStatus']) => {
  if (!status) return 'Niet beschikbaar';
  switch (status) {
    case 'not_started':
      return 'Niet gestart';
    case 'payment_placeholder':
      return 'Binnenkort beschikbaar';
    case 'pending_placeholder':
      return 'In behandeling';
    case 'paid_placeholder':
      return 'Betaald';
    case 'failed_placeholder':
      return 'Mislukt';
    case 'cancelled_placeholder':
      return 'Geannuleerd';
    default:
      return status;
  }
};

const formatFulfillmentStatus = (status?: CommerceOrder['fulfillmentStatus']) => {
  if (!status) return 'Niet beschikbaar';
  switch (status) {
    case 'not_sent':
      return 'Niet verzonden';
    case 'sent_to_partners_placeholder':
      return 'Verzonden naar partners';
    default:
      return status;
  }
};

export default function OrderDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id;
  const [order, setOrder] = useState<CommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommerceOrders().then((orders) => {
      const found = orders.find((o) => o.id === orderId) || null;
      setOrder(found);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <PageHeader
          title="Bestelling"
          onCartPress={() => router.push('/(tabs)/cart')}
          showSearch={false}
          showSettings={false}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Laden...</Text>
        </View>
        <SharedBottomNav activeTab="community" />
      </AppScreen>
    );
  }

  if (!order) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <PageHeader
          title="Bestelling"
          onCartPress={() => router.push('/(tabs)/cart')}
          showSearch={false}
          showSettings={false}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.titleColor }]}>Bestelling niet gevonden</Text>
            <Text style={[styles.description, { color: theme.subtitleColor }]}>Ga terug naar My Orders.</Text>
          </View>
        </ScrollView>
        <SharedBottomNav activeTab="community" />
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <PageHeader
        title="Bestelling"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="package-variant" size={32} color="#2563EB" />
          </View>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Bestelling {order.id.replace('order-', '')}</Text>
            <Text style={[styles.heroSubtitle, { color: theme.subtitleColor }]}>
              {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(order.status) }]}>
            <Text style={styles.statusBadgeText}>{formatStatus(order.status)}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Ordergegevens</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Ordernummer:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{order.id.replace('order-', '')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Besteldatum:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>
              {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Status:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{formatStatus(order.status)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Betaling:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{formatPaymentStatus(order.paymentStatus)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Verzending:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{formatFulfillmentStatus(order.fulfillmentStatus)}</Text>
          </View>
        </View>

        {order.appliedInfluencerCode && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Kortingscode</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{order.appliedInfluencerCode}</Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Bedragen</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Subtotaal:</Text>
            <Text style={[styles.value, { color: theme.titleColor }]}>{formatCurrency(order.subtotalCents / 100)}</Text>
          </View>
          {order.discountTotalCents > 0 && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Korting:</Text>
              <Text style={[styles.value, { color: '#10B981' }]}>-{formatCurrency(order.discountTotalCents / 100)}</Text>
            </View>
          )}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.label, styles.totalLabel, { color: theme.titleColor }]}>Totaal:</Text>
            <Text style={[styles.value, styles.totalValue, { color: theme.titleColor }]}>{formatCurrency(order.totalCents / 100)}</Text>
          </View>
        </View>

        {order.customer && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Klantgegevens</Text>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Naam:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>
                {order.customer.firstName} {order.customer.lastName}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>E-mail:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>{order.customer.email}</Text>
            </View>
            {order.customer.phone && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.subtitleColor }]}>Telefoon:</Text>
                <Text style={[styles.value, { color: theme.titleColor }]}>{order.customer.phone}</Text>
              </View>
            )}
          </View>
        )}

        {order.shippingAddress && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Afleveradres</Text>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Straat:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>{order.shippingAddress.street}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Postcode:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>{order.shippingAddress.postalCode}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Plaats:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>{order.shippingAddress.city}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.subtitleColor }]}>Land:</Text>
              <Text style={[styles.value, { color: theme.titleColor }]}>{order.shippingAddress.country}</Text>
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Producten</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.titleColor }]}>{item.name}</Text>
                <Text style={[styles.itemMeta, { color: theme.subtitleColor }]}>
                  {item.partnerName} • {item.quantity}x • {formatCurrency(item.priceCents / 100)}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: theme.titleColor }]}>
                {formatCurrency((item.priceCents * item.quantity) / 100)}
              </Text>
            </View>
          ))}
        </View>

        {order.partnerOrders.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Partner-suborders</Text>
            {order.partnerOrders.map((partnerOrder) => (
              <View key={partnerOrder.partnerId} style={styles.partnerRow}>
                <Text style={[styles.partnerName, { color: theme.titleColor }]}>{partnerOrder.partnerName}</Text>
                <Text style={[styles.partnerMeta, { color: theme.subtitleColor }]}>
                  {partnerOrder.itemCount} items • {formatCurrency(partnerOrder.totalCents / 100)}
                </Text>
                <Text style={[styles.partnerStatus, { color: theme.subtitleColor }]}>
                  Status: {partnerOrder.status === 'not_sent' ? 'Niet verzonden' : 'Verzonden'}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Status</Text>
          <Text style={[styles.description, { color: theme.subtitleColor }]}>
            Betaling en partnerverwerking komen binnenkort beschikbaar.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => router.push('/shop')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Verder shoppen</Text>
          </Pressable>
        </View>
      </ScrollView>
      <SharedBottomNav activeTab="community" />
    </AppScreen>
  );
}

function getStatusBadgeColor(status: CommerceOrder['status']) {
  switch (status) {
    case 'draft':
      return '#F59E0B';
    case 'pending_payment':
      return '#F59E0B';
    case 'paid_placeholder':
      return '#10B981';
    case 'sent_to_partners_placeholder':
      return '#2563EB';
    default:
      return '#6B7280';
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  partnerRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  partnerMeta: {
    fontSize: 13,
  },
  partnerStatus: {
    fontSize: 13,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});