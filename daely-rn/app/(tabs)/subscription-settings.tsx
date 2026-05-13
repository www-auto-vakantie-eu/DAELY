
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SubscriptionSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { appSettings, user } = useAppContext();
  // Dummy data voor demo
  const subscription = {
    plan: 'DAELY Premium',
    status: 'Actief abonnement',
    price: '€9,99 per maand',
    nextPayment: '12 mei 2026',
    paymentMethod: 'iDEAL / Apple Pay / creditcard eindigend op 1234',
    startedAt: '12 april 2026',
  };

  // Check op verplichte profielvelden (dummy check, later uitbreiden)
  useEffect(() => {
    if (!user?.name || !user?.email || !user?.country || !user?.birthdate || !user?.gender || !user?.username) {
      router.replace('/(tabs)/profile-wizard');
    }
  }, [user, router]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Abonnement beheren</Text>
      {/* 1. Huidig abonnement */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Jouw abonnement</Text>
        <Text style={styles.plan}>{subscription.plan} — {subscription.status}</Text>
        <Text style={styles.detail}>{subscription.price}</Text>
        <Text style={styles.detail}>Volgende betaling: {subscription.nextPayment}</Text>
        <Text style={styles.detail}>Betaalmethode: {subscription.paymentMethod}</Text>
        <Text style={styles.detail}>Abonnement gestart op: {subscription.startedAt}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Abonnement wijzigen</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Betaalmethode aanpassen</Text></Pressable>
        </View>
      </View>
      {/* 2. Wat zit er in mijn abonnement? */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inbegrepen in jouw abonnement</Text>
        <Text style={styles.bullet}>• Onbeperkte toegang tot workouts</Text>
        <Text style={styles.bullet}>• Persoonlijke trainingsschema’s</Text>
        <Text style={styles.bullet}>• Progressie tracking</Text>
        <Text style={styles.bullet}>• Premium creators</Text>
        <Text style={styles.bullet}>• Challenges</Text>
        <Text style={styles.bullet}>• Mind, herstel of voeding</Text>
        <Text style={styles.bullet}>• Geen advertenties</Text>
        <Text style={styles.bullet}>• Exclusieve content</Text>
      </View>
      {/* 3. Abonnement wijzigen */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Je abonnement aanpassen</Text>
        <View style={styles.planRow}><Text style={styles.planName}>Free</Text><Text style={styles.planPrice}>€0</Text><Text style={styles.planFor}>Basisgebruik</Text></View>
        <View style={styles.planRow}><Text style={styles.planName}>Premium Maandelijks</Text><Text style={styles.planPrice}>€9,99 p/m</Text><Text style={styles.planFor}>Flexibel</Text></View>
        <View style={styles.planRow}><Text style={styles.planName}>Premium Jaarlijks</Text><Text style={styles.planPrice}>€79,99 p/j</Text><Text style={styles.planFor}>Beste voordeel</Text></View>
        <View style={styles.planRow}><Text style={styles.planName}>Coach / Pro</Text><Text style={styles.planPrice}>€19,99 p/m</Text><Text style={styles.planFor}>Voor intensieve begeleiding</Text></View>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Upgrade naar Premium</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Stap over naar Jaarlijks</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Downgrade abonnement</Text></Pressable>
        </View>
        <Text style={styles.savings}>Bespaar 33% met jaarlijks betalen</Text>
      </View>
      {/* 4. Betaling en facturen */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Betaling & facturen</Text>
        <Text style={styles.detail}>Huidige betaalmethode: {subscription.paymentMethod}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Betaalmethode wijzigen</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Facturen bekijken</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Betaling opnieuw proberen</Text></Pressable>
        </View>
      </View>
      {/* 5. Verlenging en opzegging */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Verlenging & opzegging</Text>
        <Text style={styles.detail}>Als je opzegt, behoud je toegang tot DAELY Premium tot 12 mei 2026. Daarna ga je automatisch terug naar Free. Je progressie en profiel blijven bewaard.</Text>
      </View>
      {/* 6. Pauzeren of tijdelijk stoppen */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Abonnement pauzeren</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Pauzeer 1 maand</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Pauzeer 2 maanden</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Pauzeer 3 maanden</Text></Pressable>
        </View>
      </View>
      {/* 7. Support en hulp */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Support & hulp</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Contact opnemen</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Veelgestelde vragen</Text></Pressable>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Probleem met betaling melden</Text></Pressable>
        </View>
      </View>
      {/* 8. App Store / Google Play info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Store / Google Play</Text>
        <Text style={styles.detail}>Je abonnement wordt beheerd via Apple. Je kunt je abonnement wijzigen of opzeggen via je Apple ID-instellingen.</Text>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Beheer via Apple</Text></Pressable>
      </View>
      {/* 9. Abonnement opzeggen (helemaal onderaan) */}
      <View style={styles.card}>
        <Pressable style={styles.buttonDanger}><Text style={styles.buttonText}>Abonnement opzeggen</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 18, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  plan: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  detail: { fontSize: 14, color: '#444', marginBottom: 2 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 4 },
  button: { backgroundColor: '#3B82F6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  buttonDanger: { backgroundColor: '#EF4444', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  bullet: { fontSize: 14, marginBottom: 2 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  planName: { fontWeight: '600', width: 120 },
  planPrice: { width: 90 },
  planFor: { color: '#666', width: 120 },
  savings: { color: '#10B981', fontWeight: 'bold', marginTop: 6 },
});
