export type CommerceProductCategory = 'Kleding' | 'Accessoires' | 'Supplementen' | 'Essentials';
export type CommerceProductStatus = 'available' | 'coming_soon';

export interface CommerceProduct {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  category: CommerceProductCategory;
  priceCents: number;
  currency: 'EUR';
  imagePlaceholder: string;
  eligibleForInfluencerDiscount: boolean;
  status: CommerceProductStatus;
}

export interface InfluencerDiscountCode {
  code: string;
  percent: number;
  label: string;
  description: string;
}

export type CommerceOrderItemType =
  | 'challenge'
  | 'clothing'
  | 'supplement'
  | 'dish'
  | 'accessory'
  | 'essential';

export interface CommerceOrderItem {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  type: CommerceOrderItemType;
  priceCents: number;
  quantity: number;
  imagePlaceholder: string;
}

export type PartnerOrderStatus = 'not_sent' | 'sent_placeholder';

export interface CommercePartnerOrder {
  partnerId: string;
  partnerName: string;
  status: PartnerOrderStatus;
  items: CommerceOrderItem[];
  itemCount: number;
  totalCents: number;
}

export type CommerceOrderStatus = 'draft' | 'pending_payment' | 'paid_placeholder' | 'sent_to_partners_placeholder';

export interface CommerceOrder {
  id: string;
  createdAt: string;
  status: CommerceOrderStatus;
  appliedInfluencerCode?: string | null;
  subtotalCents: number;
  discountTotalCents: number;
  totalCents: number;
  items: CommerceOrderItem[];
  partnerOrders: CommercePartnerOrder[];
}

export const INFLUENCER_DISCOUNT_CODES: InfluencerDiscountCode[] = [
  {
    code: 'DAELY10',
    percent: 10,
    label: '10% influencerkorting',
    description: '10% korting op geschikte sportproducten.',
  },
  {
    code: 'COACH15',
    percent: 15,
    label: '15% coachkorting',
    description: '15% korting op geselecteerde trainingsproducten.',
  },
  {
    code: 'ATHLETE20',
    percent: 20,
    label: '20% athlete korting',
    description: '20% korting op eligible items.',
  },
];

export const COMMERCE_PRODUCTS: CommerceProduct[] = [
  {
    id: 'nike-dri-fit-tee',
    partnerId: 'nike',
    partnerName: 'Nike',
    name: 'Nike Dri-FIT Training T-shirt',
    category: 'Kleding',
    priceCents: 2999,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1520975922043-7ef1ae42be33?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'nike-essential-hoodie',
    partnerId: 'nike',
    partnerName: 'Nike',
    name: 'Nike Essentials Hoodie',
    category: 'Kleding',
    priceCents: 5499,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'gymshark-training-tank',
    partnerId: 'gymshark',
    partnerName: 'Gymshark',
    name: 'Gymshark Training Tank',
    category: 'Kleding',
    priceCents: 2499,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1526403227-35d2ca032302?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'gymshark-pro-shaker',
    partnerId: 'gymshark',
    partnerName: 'Gymshark',
    name: 'Gymshark Pro Shaker',
    category: 'Accessoires',
    priceCents: 1599,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1534430480878-4d8f1dca1d7e?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'dfyne-performance-bottle',
    partnerId: 'dfyne',
    partnerName: 'DFYNE',
    name: 'DFYNE Performance Drink Bottle',
    category: 'Accessoires',
    priceCents: 1999,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1580910051074-2cba82b0793c?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: false,
    status: 'available',
  },
  {
    id: 'dfyne-recovery-bundle',
    partnerId: 'dfyne',
    partnerName: 'DFYNE',
    name: 'DFYNE Recovery Bundle',
    category: 'Supplementen',
    priceCents: 3999,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'daely-essentials-protein',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'DAELY Essentials Protein',
    category: 'Supplementen',
    priceCents: 2999,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1510626176961-4b89d53ef2a5?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
  {
    id: 'daely-essentials-core-mat',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'DAELY Essentials Core Mat',
    category: 'Essentials',
    priceCents: 2299,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'coming_soon',
  },
  {
    id: 'daely-essentials-resistance-band',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'DAELY Essentials Resistance Band',
    category: 'Accessoires',
    priceCents: 1799,
    currency: 'EUR',
    imagePlaceholder: 'https://images.unsplash.com/photo-1534367615393-12a4c6f708e7?auto=format&fit=crop&w=800&q=80',
    eligibleForInfluencerDiscount: true,
    status: 'available',
  },
];
