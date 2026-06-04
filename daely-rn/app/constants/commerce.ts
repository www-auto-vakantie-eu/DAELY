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
    description: 'Ademend en comfortabel trainingsshirt gemaakt van hoogwaardige stof.',
    benefits: ['Ademend materiaal', 'Sneldrogend', 'Lichtgewicht'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Zwart', 'Wit', 'Grijs', 'Navy'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Populair',
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
    description: 'Comfortabele hoodie voor training en casual gebruik.',
    benefits: ['Warm en zacht', 'Kap met trekkoord', 'Kangaroo zak'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Zwart', 'Donkergrijs', 'Marine'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'DAELY keuze',
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
    description: 'Strakke tanktop voor intensieve trainingssessies.',
    benefits: ['Strakke pasvorm', 'Ademend', 'Sneldrogend'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Zwart', 'Wit', 'Grijs', 'Rood'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Partner deal',
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
    description: 'Professionele proteïne shaker met mixing bal.',
    benefits: ['600ml capaciteit', 'Mixing bal', 'Lekbestend'],
    sizes: [],
    colors: ['Zwart', 'Wit'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
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
    description: 'Premium drinkfles voor hydratatie tijdens training.',
    benefits: ['Dubbelwand isolatie', 'BPA-vrij', 'Handig formaat'],
    sizes: [],
    colors: ['Blauw', 'Roze', 'Zwart'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Nieuw',
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
    description: 'Complete recovery bundel voor na je training.',
    benefits: ['Eiwitshake', 'BCAA supplement', 'Magnesium'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
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
    description: 'Hoogwaardige proteïne voor spierherstel.',
    benefits: ['25g proteïne per serving', 'Snel opneembaar', 'Natuurlijke smaken'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Populair',
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
    description: 'Duurzame yogamat voor training en stretching.',
    benefits: ['Anti-slip', 'Milieuvriendelijk', 'Extra dik'],
    sizes: [],
    colors: [],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: 'Nieuw',
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
    description: 'Veelzijdige weerstandsband voor krachttraining.',
    benefits: ['Lichtgewicht', 'Duurzaam', 'Compact'],
    sizes: [],
    colors: ['Zwart', 'Rood', 'Blauw', 'Groen'],
    shippingInfo: 'Verzending binnen 2-3 werkdagen',
    returnInfo: 'Gratis retour binnen 30 dagen',
    productBadge: '',
  },
];
