import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
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

export default function MyOrdersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [orders, setOrders] = useState<CommerceOrder[]>([]);

  useEffect(() => {
    getCommerceOrders().then(setOrders);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="My Orders"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {orders.length === 0 ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.title, { color: theme.titleColor }]}>Nog geen bestellingen.</Text>
            <Text style={[styles.description, { color: theme.subtitleColor }]}>Producten en partnerbestellingen komen binnenkort volledig beschikbaar.</Text>
            <Pressable style={styles.shopButton} onPress={() => router.push('/shop')}>
              <Text style={styles.shopButtonText}>Shop openen</Text>
            </Pressable>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderTitle, { color: theme.titleColor }]}>Bestelling {order.id.replace('order-', '')}</Text>
                <Text style={[styles.orderStatus, { color: theme.titleColor }]}>{formatStatus(order.status)}</Text>
              </View>
              <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>{new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Totaal: {formatCurrency(order.totalCents / 100)}</Text>
              {order.appliedInfluencerCode ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Code: {order.appliedInfluencerCode}</Text>
              ) : null}
              {order.customer ? (
                <>
                  <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Klant: {order.customer.firstName} {order.customer.lastName}</Text>
                  <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>E-mail: {order.customer.email}</Text>
                </>
              ) : null}
              {order.shippingAddress ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Afleveren: {order.shippingAddress.city}, {order.shippingAddress.country}</Text>
              ) : null}
              {order.paymentMethod ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Betaalmethode: {order.paymentMethod === 'ideal' ? 'iDEAL' : order.paymentMethod === 'card' ? 'Kaart' : order.paymentMethod === 'apple_pay' ? 'Apple Pay' : order.paymentMethod === 'klarna' ? 'Klarna' : 'Later'}</Text>
              ) : null}
              {order.paymentProvider ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Payment provider: {order.paymentProvider === 'mollie_test_placeholder' ? 'Mollie (test)' : order.paymentProvider === 'stripe_test_placeholder' ? 'Stripe (test)' : 'Geen'}</Text>
              ) : null}
              {order.paymentReference ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Payment ref: {order.paymentReference}</Text>
              ) : null}
              {order.paymentStatus ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Betaling: {order.paymentStatus === 'not_started' ? 'Niet gestart' : order.paymentStatus === 'payment_placeholder' ? 'Binnenkort beschikbaar' : 'Placeholder'}</Text>
              ) : null}
              {order.fulfillmentStatus ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Verzending: {order.fulfillmentStatus === 'not_sent' ? 'Niet verzonden' : 'Placeholder'}</Text>
              ) : null}
              <View style={styles.partnerList}>
                {order.partnerOrders.map((partnerOrder) => (
                  <View key={partnerOrder.partnerId} style={styles.partnerRow}>
                    <Text style={[styles.partnerName, { color: theme.titleColor }]}>{partnerOrder.partnerName}</Text>
                    <Text style={[styles.partnerData, { color: theme.subtitleColor }]}>{partnerOrder.itemCount} items • {formatCurrency(partnerOrder.totalCents / 100)}</Text>
                    <Text style={[styles.partnerStatus, { color: theme.subtitleColor }]}>Status: {partnerOrder.status === 'not_sent' ? 'Niet verzonden' : 'Verzonden'}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
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
  card: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  shopButton: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  orderMeta: {
    fontSize: 13,
    marginBottom: 6,
  },
  partnerList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  partnerRow: {
    marginBottom: 10,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  partnerData: {
    fontSize: 13,
    marginBottom: 4,
  },
  partnerStatus: {
    fontSize: 13,
  },
});

