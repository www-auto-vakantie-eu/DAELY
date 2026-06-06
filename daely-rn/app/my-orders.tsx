import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        title="Mijn bestellingen"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="package-variant" size={32} color="#2563EB" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Mijn bestellingen</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Bekijk je conceptbestellingen, status en partnerverwerking.
          </Text>
        </View>

        {orders.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="shopping-outline" size={48} color={theme.subtitleColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen bestellingen</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
              Producten en partnerbestellingen komen binnenkort volledig beschikbaar.
            </Text>
            <Pressable style={styles.shopButton} onPress={() => router.push('/shop')}>
              <Text style={styles.shopButtonText}>Shop openen</Text>
            </Pressable>
          </View>
        ) : (
          orders.map((order) => (
            <Pressable
              key={order.id}
              style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
            >
              <View style={styles.orderHeader}>
                <Text style={[styles.orderTitle, { color: theme.titleColor }]}>Bestelling {order.id.replace('order-', '')}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(order.status) }]}>
                  <Text style={styles.statusBadgeText}>{formatStatus(order.status)}</Text>
                </View>
              </View>
              <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>{new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              <View style={styles.orderFooter}>
                <Text style={[styles.orderTotal, { color: theme.titleColor }]}>Totaal: {formatCurrency(order.totalCents / 100)}</Text>
                <Pressable style={styles.viewButton} onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}>
                  <Text style={styles.viewButtonText}>Bekijk bestelling</Text>
                </Pressable>
              </View>
              {order.appliedInfluencerCode ? (
                <Text style={[styles.orderMeta, { color: theme.subtitleColor }]}>Code: {order.appliedInfluencerCode}</Text>
              ) : null}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
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
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
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
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  orderMeta: {
    fontSize: 14,
    marginBottom: 6,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

