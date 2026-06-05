import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PaymentReturnScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="Betaling"
        onCartPress={() => router.push('/(tabs)/cart')}
        showSearch={false}
        showSettings={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="clock-outline" size={48} color="#2563EB" />
          </View>
          <Text style={[styles.title, { color: theme.titleColor }]}>Binnenkort beschikbaar</Text>
          <Text style={[styles.description, { color: theme.subtitleColor }]}>
            Betalingscontrole komt binnenkort beschikbaar. Bekijk je bestellingen of ga terug naar de shop.
          </Text>
          <Pressable style={styles.button} onPress={() => router.push('/my-orders')}>
            <Text style={styles.buttonText}>Naar My Orders</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => router.push('/shop')}>
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Naar Shop</Text>
          </Pressable>
        </View>
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
    padding: 24,
    gap: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  secondaryButtonText: {
    fontWeight: '800',
    fontSize: 16,
  },
});