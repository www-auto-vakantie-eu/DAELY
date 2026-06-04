import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/app/store/cartStore';
import {
  CommerceOrder,
  CommerceOrderItem,
  CommercePartnerOrder,
  InfluencerDiscountCode,
  INFLUENCER_DISCOUNT_CODES,
  OrderCustomer,
  OrderShippingAddress,
  PaymentMethod,
  PaymentProvider,
} from '@/app/constants/commerce';

const INFLUENCER_CODE_STORAGE_KEY = 'daely.commerce.influencerCode.v1';
const FAVORITE_PRODUCTS_STORAGE_KEY = 'daely.commerce.favoriteProducts.v1';
const COMMERCE_ORDERS_STORAGE_KEY = 'daely.commerce.orders.v1';

export async function getSavedInfluencerCode(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(INFLUENCER_CODE_STORAGE_KEY);
  return raw ? raw : null;
}

export async function saveInfluencerCode(code: string): Promise<void> {
  await AsyncStorage.setItem(INFLUENCER_CODE_STORAGE_KEY, code.trim().toUpperCase());
}

export async function clearInfluencerCode(): Promise<void> {
  await AsyncStorage.removeItem(INFLUENCER_CODE_STORAGE_KEY);
}

export function validateInfluencerCode(code: string): boolean {
  return getDiscountForCode(code) !== undefined;
}

export function getDiscountForCode(code: string): InfluencerDiscountCode | undefined {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) {
    return undefined;
  }
  return INFLUENCER_DISCOUNT_CODES.find((discount) => discount.code === normalized);
}

export async function getFavoriteProducts(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITE_PRODUCTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export async function addFavoriteProduct(productId: string): Promise<void> {
  const current = await getFavoriteProducts();
  if (!current.includes(productId)) {
    await AsyncStorage.setItem(FAVORITE_PRODUCTS_STORAGE_KEY, JSON.stringify([...current, productId]));
  }
}

export async function removeFavoriteProduct(productId: string): Promise<void> {
  const current = await getFavoriteProducts();
  const next = current.filter((id) => id !== productId);
  await AsyncStorage.setItem(FAVORITE_PRODUCTS_STORAGE_KEY, JSON.stringify(next));
}

export async function getCommerceOrders(): Promise<CommerceOrder[]> {
  const raw = await AsyncStorage.getItem(COMMERCE_ORDERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createDraftOrderFromCart(
  items: CartItem[],
  appliedCode?: string | null,
  customer?: OrderCustomer,
  shippingAddress?: OrderShippingAddress,
  paymentMethod?: PaymentMethod,
  paymentProvider?: PaymentProvider
): Promise<CommerceOrder> {
  const orderItems: CommerceOrderItem[] = items.map((item) => ({
    id: item.id,
    partnerId: item.partnerId ?? 'unknown',
    partnerName: item.partnerName ?? 'DAELY',
    name: item.name,
    type: item.type,
    priceCents: Math.round(item.price * 100),
    quantity: item.quantity,
    imagePlaceholder: item.image ?? '',
  }));

  const subtotalCents = orderItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const discountPercent = appliedCode ? getDiscountForCode(appliedCode)?.percent ?? 0 : 0;
  const discountTotalCents = Math.round((subtotalCents * discountPercent) / 100);
  const totalCents = subtotalCents - discountTotalCents;

  const partnerOrdersMap = new Map<string, { partnerName: string; items: CommerceOrderItem[] }>();

  orderItems.forEach((item) => {
    const group = partnerOrdersMap.get(item.partnerId);
    if (group) {
      group.items.push(item);
      return;
    }

    partnerOrdersMap.set(item.partnerId, {
      partnerName: item.partnerName,
      items: [item],
    });
  });

  const partnerOrders: CommercePartnerOrder[] = Array.from(partnerOrdersMap.entries()).map(
    ([partnerId, group]) => {
      const totalCents = group.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
      return {
        partnerId,
        partnerName: group.partnerName,
        status: 'not_sent',
        items: group.items,
        itemCount: group.items.reduce((count, item) => count + item.quantity, 0),
        totalCents,
      };
    }
  );

  const order: CommerceOrder = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'draft',
    appliedInfluencerCode: appliedCode?.trim().toUpperCase() || null,
    subtotalCents,
    discountTotalCents,
    totalCents,
    items: orderItems,
    partnerOrders,
    customer,
    shippingAddress,
    paymentStatus: 'not_started',
    fulfillmentStatus: 'not_sent',
    paymentProvider: paymentProvider || 'none',
    paymentMethod: paymentMethod || 'manual_placeholder',
    paymentReference: `pay-ref-${Date.now()}`,
    paymentCreatedAt: new Date().toISOString(),
  };

  const currentOrders = await getCommerceOrders();
  await AsyncStorage.setItem(COMMERCE_ORDERS_STORAGE_KEY, JSON.stringify([order, ...currentOrders]));

  return order;
}
