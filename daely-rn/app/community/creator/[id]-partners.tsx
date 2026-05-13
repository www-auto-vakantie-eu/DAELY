import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { getCreatorPartners, type Partner } from '@/services/creator-profiles';

export default function CreatorPartnersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      if (!id) return;
      const data = await getCreatorPartners(id);
      setPartners(data);
      setLoading(false);
    };
    loadPartners();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}> 
        <Text style={{ color: theme.titleColor, marginTop: 40, textAlign: 'center' }}>Laden...</Text>
      </View>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}> 
        <Text style={{ color: theme.titleColor, marginTop: 40, textAlign: 'center' }}>Geen samenwerkingen gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.titleColor }]}>Samenwerkingen & Partners</Text>
      {partners.map((partner) => (
        <View key={partner.id} style={[styles.partnerCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}> 
          <View style={styles.partnerHeader}>
            {partner.logo && (
              <Image source={{ uri: partner.logo }} style={styles.partnerLogo} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.partnerName, { color: theme.titleColor }]}>{partner.name}</Text>
              {partner.website && (
                <Pressable onPress={() => Linking.openURL(partner.website)}>
                  <Text style={[styles.partnerLink, { color: theme.primary }]}>Bezoek website</Text>
                </Pressable>
              )}
            </View>
          </View>
          {partner.description && (
            <Text style={[styles.partnerDescription, { color: theme.subtitleColor }]}>{partner.description}</Text>
          )}
          {partner.promotion && (
            <View style={styles.promotionBox}>
              <MaterialCommunityIcons name="gift-outline" size={18} color={theme.primary} />
              <Text style={[styles.promotionText, { color: theme.primary }]}>{partner.promotion}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  partnerCard: { borderRadius: 14, padding: 16, marginBottom: 18 },
  partnerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  partnerLogo: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
  partnerName: { fontSize: 16, fontWeight: '700' },
  partnerLink: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  partnerDescription: { fontSize: 13, marginTop: 8 },
  promotionBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 8 },
  promotionText: { fontSize: 13, fontWeight: '700' },
});
