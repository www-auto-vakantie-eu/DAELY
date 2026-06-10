import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PARTNERS } from '@/constants/partners';
import { PARTNER_LOGO_ASSETS } from '@/constants/partner-logo-assets';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function PartnerDetailScreen() {

  const { id } = useLocalSearchParams();
  const theme = useTheme();
  // id kan een string of array zijn, altijd string pakken en lowercasen
  const idStr = Array.isArray(id) ? id[0] : id;
  const partner = PARTNERS.find((p) => p.id.toLowerCase() === String(idStr).toLowerCase());

  if (!partner) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}> 
        <Text style={{ color: theme.titleColor }}>Partner niet gevonden.</Text>
        <Text style={{ color: theme.subtitleColor, marginTop: 12 }}>Ontvangen id: {JSON.stringify(id)}</Text>
      </View>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <Image
          source={PARTNER_LOGO_ASSETS[partner.id] ? PARTNER_LOGO_ASSETS[partner.id] : { uri: partner.image }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.titleColor }]}>{partner.name}</Text>
        <Text style={[styles.category, { color: theme.subtitleColor }]}>{partner.category || partner.group}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Korte omschrijving</Text>
        <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{partner.summary || 'Geen omschrijving.'}</Text>
      </View>

      <Pressable
        style={[styles.ctaButton, { backgroundColor: theme.card, borderColor: theme.tabBarActive || '#2D67E7' }]}
        onPress={() => {
          if (partner.offerUrl) {
            Linking.openURL(partner.offerUrl);
          }
        }}
      >
        <Text style={[styles.ctaButtonText, { color: theme.titleColor }]}>Bekijk deal / website</Text>
        <MaterialCommunityIcons name="open-in-new" size={18} color={theme.titleColor} style={{ marginLeft: 8 }} />
      </Pressable>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Waarom deze partner bij DAELY past</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>Unieke samenwerking en gedeelde visie op sport, gezondheid en community.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Producten die ze aanbieden</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>Proteïne, supplementen, sportkleding, accessoires, ...</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Uitgelichte producten</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>- Whey Protein{"\n"}- Creatine{"\n"}- Sportshirts{"\n"}- ...</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Voordeel voor DAELY-gebruikers</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{partner.discountLabel} met code <Text style={{ fontWeight: 'bold', color: theme.titleColor }}>{partner.discountCode}</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Geschikt voor welke sporters</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>Kracht, conditie, teamsport, recreatief, topsport, ...</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Creators / ambassadeurs</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>Zie community of partnerpagina voor ambassadeurs.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Reviews / betrouwbaarheid</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>Hoog gewaardeerd door gebruikers en bekend van betrouwbare levering.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Actieve acties</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{partner.discountLabel} met code <Text style={{ fontWeight: 'bold', color: theme.titleColor }}>{partner.discountCode}</Text></Text>
        </View>

    </ScrollView>
    <SharedBottomNav activeTab="community" />
  </AppScreen>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 30,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
