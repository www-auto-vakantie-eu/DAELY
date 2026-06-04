import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { OrderCustomer, OrderShippingAddress, PaymentMethod } from '@/app/constants/commerce';

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
  const [validationError, setValidationError] = useState<string>('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('ideal');

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
    setValidationError('');

    if (items.length === 0) {
      Alert.alert('Winkelwagen leeg', 'Voeg eerst een product toe voordat je een concept-bestelling maakt.');
      return;
    }

    if (!firstName.trim()) {
      setValidationError('Voornaam is verplicht.');
      return;
    }
    if (!lastName.trim()) {
      setValidationError('Achternaam is verplicht.');
      return;
    }
    if (!email.trim()) {
      setValidationError('E-mailadres is verplicht.');
      return;
    }
    if (!street.trim()) {
      setValidationError('Straat en huisnummer zijn verplicht.');
      return;
    }
    if (!postalCode.trim()) {
      setValidationError('Postcode is verplicht.');
      return;
    }
    if (!city.trim()) {
      setValidationError('Plaats is verplicht.');
      return;
    }
    if (!country.trim()) {
      setValidationError('Land is verplicht.');
      return;
    }

    const customer: OrderCustomer = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    };

    const shippingAddress: OrderShippingAddress = {
      street: street.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
      country: country.trim(),
    };

    try {
      await createDraftOrderFromCart(items, savedCode, customer, shippingAddress, selectedPaymentMethod, 'mollie_test_placeholder');
      clearCart();
      setStatusMessage('Bestelling voorbereid. Betalen en partnerverwerking komen binnenkort.');
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

        <View style={[styles.formSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Klantgegevens</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Voornaam *"
            placeholderTextColor={theme.subtitleColor}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Achternaam *"
            placeholderTextColor={theme.subtitleColor}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="E-mailadres *"
            placeholderTextColor={theme.subtitleColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Telefoonnummer (optioneel)"
            placeholderTextColor={theme.subtitleColor}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.formSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Afleveradres</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Straat + huisnummer *"
            placeholderTextColor={theme.subtitleColor}
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Postcode *"
            placeholderTextColor={theme.subtitleColor}
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Plaats *"
            placeholderTextColor={theme.subtitleColor}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Land *"
            placeholderTextColor={theme.subtitleColor}
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <View style={[styles.formSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Betaalmethode</Text>
          <View style={styles.paymentMethodsWrap}>
            {(['ideal', 'card', 'apple_pay', 'klarna', 'manual_placeholder'] as PaymentMethod[]).map((method) => (
              <Pressable
                key={method}
                style={[
                  styles.paymentMethodCard,
                  selectedPaymentMethod === method && styles.paymentMethodCardSelected,
                  { backgroundColor: theme.background, borderColor: theme.border },
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Text style={[
                  styles.paymentMethodName,
                  { color: selectedPaymentMethod === method ? '#2563EB' : theme.titleColor }
                ]}>
                  {method === 'ideal' ? 'iDEAL' : method === 'card' ? 'Kaart' : method === 'apple_pay' ? 'Apple Pay' : method === 'klarna' ? 'Klarna' : 'Later betalen / Binnenkort'}
                </Text>
                {selectedPaymentMethod === method && (
                  <View style={styles.selectedIndicator} />
                )}
              </Pressable>
            ))}
          </View>
          <Text style={[styles.paymentHelpText, { color: theme.subtitleColor }]}>Betalen komt binnenkort beschikbaar. Deze keuze wordt alvast opgeslagen bij je concept-bestelling.</Text>
        </View>

        <Text style={[styles.paymentStatus, { color: theme.subtitleColor }]}>Betaling komt binnenkort beschikbaar.</Text>
        <Text style={[styles.fulfillmentStatus, { color: theme.subtitleColor }]}>Partnerverwerking wordt later uitgevoerd.</Text>

        {validationError ? <Text style={styles.validationError}>{validationError}</Text> : null}

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
  formSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  paymentStatus: {
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  fulfillmentStatus: {
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  validationError: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  paymentMethodsWrap: {
    gap: 10,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodCardSelected: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: '700',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  paymentHelpText: {
    fontSize: 13,
    marginTop: 8,
  },
});
