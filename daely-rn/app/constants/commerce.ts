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
  description?: string;
  benefits?: string[];
  sizes?: string[];
  colors?: string[];
  shippingInfo?: string;
  returnInfo?: string;
  partnerLogoPlaceholder?: string;
  productBadge?: string;
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

export type PaymentProvider = 'none' | 'mollie_test_placeholder' | 'stripe_test_placeholder';

export type PaymentMethod = 'ideal' | 'card' | 'apple_pay' | 'klarna' | 'manual_placeholder';

export type PaymentStatus = 'not_started' | 'payment_placeholder' | 'pending_placeholder' | 'paid_placeholder' | 'failed_placeholder' | 'cancelled_placeholder';

export type FulfillmentStatus = 'not_sent' | 'sent_to_partners_placeholder';

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface OrderShippingAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

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
  customer?: OrderCustomer;
  shippingAddress?: OrderShippingAddress;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentProvider?: PaymentProvider;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paymentRedirectUrl?: string;
  paymentCreatedAt?: string;
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
    id: 'performance-tee',
    partnerId: 'daely-performance',
    partnerName: 'DAELY Performance',
    name: 'Performance Training T-shirt',
    category: 'Kleding',
    priceCents: 2999,
    currency: 'EUR',
    imagePlaceholder: 'gradient-performance',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Ademend en comfortabel trainingsshirt gemaakt van hoogwaardige stof.',
    benefits: ['Ademend materiaal', 'Sneldrogend', 'Lichtgewicht'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Zwart', 'Wit', 'Grijs', 'Navy'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Populair',
  },
  {
    id: 'essential-hoodie',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'Essential Training Hoodie',
    category: 'Kleding',
    priceCents: 5499,
    currency: 'EUR',
    imagePlaceholder: 'gradient-essentials',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Comfortabele hoodie voor training en casual gebruik.',
    benefits: ['Warm en zacht', 'Kap met trekkoord', 'Kangaroo zak'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Zwart', 'Donkergrijs', 'Marine'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'DAELY keuze',
  },
  {
    id: 'studio-tank',
    partnerId: 'daely-studio',
    partnerName: 'DAELY Studio',
    name: 'Studio Training Tank',
    category: 'Kleding',
    priceCents: 2499,
    currency: 'EUR',
    imagePlaceholder: 'gradient-studio',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Strakke tanktop voor intensieve trainingssessies.',
    benefits: ['Strakke pasvorm', 'Ademend', 'Sneldrogend'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Zwart', 'Wit', 'Grijs', 'Rood'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Partner deal',
  },
  {
    id: 'studio-shaker',
    partnerId: 'daely-studio',
    partnerName: 'DAELY Studio',
    name: 'Studio Pro Shaker',
    category: 'Accessoires',
    priceCents: 1599,
    currency: 'EUR',
    imagePlaceholder: 'gradient-studio',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Professionele proteïne shaker met mixing bal.',
    benefits: ['600ml capaciteit', 'Mixing bal', 'Lekbestend'],
    sizes: [],
    colors: ['Zwart', 'Wit'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
  },
  {
    id: 'performance-bottle',
    partnerId: 'daely-performance',
    partnerName: 'DAELY Performance',
    name: 'Performance Hydration Bottle',
    category: 'Accessoires',
    priceCents: 1999,
    currency: 'EUR',
    imagePlaceholder: 'gradient-performance',
    eligibleForInfluencerDiscount: false,
    status: 'available',
    description: 'Premium drinkfles voor hydratatie tijdens training.',
    benefits: ['Dubbelwand isolatie', 'BPA-vrij', 'Handig formaat'],
    sizes: [],
    colors: ['Blauw', 'Roze', 'Zwart'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Nieuw',
  },
  {
    id: 'recovery-bundle',
    partnerId: 'daely-recovery',
    partnerName: 'DAELY Recovery',
    name: 'Recovery Bundle',
    category: 'Supplementen',
    priceCents: 3999,
    currency: 'EUR',
    imagePlaceholder: 'gradient-recovery',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Complete recovery bundel voor na je training.',
    benefits: ['Eiwitshake', 'BCAA supplement', 'Magnesium'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
  },
  {
    id: 'essentials-protein',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'Essentials Daily Protein',
    category: 'Supplementen',
    priceCents: 2999,
    currency: 'EUR',
    imagePlaceholder: 'gradient-essentials',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Hoogwaardige proteïne voor spierherstel.',
    benefits: ['25g proteïne per serving', 'Snel opneembaar', 'Natuurlijke smaken'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Populair',
  },
  {
    id: 'essentials-mat',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'Essentials Core Training Mat',
    category: 'Essentials',
    priceCents: 2299,
    currency: 'EUR',
    imagePlaceholder: 'gradient-essentials',
    eligibleForInfluencerDiscount: true,
    status: 'coming_soon',
    description: 'Duurzame yogamat voor training en stretching.',
    benefits: ['Anti-slip', 'Milieuvriendelijk', 'Extra dik'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Nieuw',
  },
  {
    id: 'essentials-band',
    partnerId: 'daely-essentials',
    partnerName: 'DAELY Essentials',
    name: 'Essentials Resistance Band',
    category: 'Accessoires',
    priceCents: 1799,
    currency: 'EUR',
    imagePlaceholder: 'gradient-essentials',
    eligibleForInfluencerDiscount: true,
    status: 'available',
    description: 'Veelzijdige weerstandsband voor krachttraining.',
    benefits: ['Lichtgewicht', 'Duurzaam', 'Compact'],
    sizes: [],
    colors: ['Zwart', 'Rood', 'Blauw', 'Groen'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
  },
];
