import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Linking, type ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { PARTNERS } from '@/constants/partners';
import type { PartnerBrand } from '@/constants/partners';
import { PARTNER_LOGO_ASSETS } from '@/constants/partner-logo-assets';

const PARTNER_FILTERS = ['Alles', 'Kleding', 'Voeding', 'Supplementen'] as const;

function getSiteFaviconUrl(offerUrl: string): string {
  try {
    const domain = new URL(offerUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
}

function BrandLogo({
  partnerId,
  uri,
  name,
  offerUrl,
}: {
  partnerId: PartnerBrand['id'];
  uri: string;
  name: string;
  offerUrl: string;
}) {
  const fallbackLogo = getSiteFaviconUrl(offerUrl);
  const localLogo = PARTNER_LOGO_ASSETS[partnerId];
  const logoSources: ImageSourcePropType[] = [
    ...(localLogo ? [localLogo] : []),
    ...(uri ? [{ uri }] : []),
    ...(fallbackLogo ? [{ uri: fallbackLogo }] : []),
  ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (sourceIndex >= logoSources.length) {
    return (
      <View style={styles.logoFallback}>
        <Text style={styles.logoFallbackText}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      source={logoSources[sourceIndex]}
      style={styles.logoImage}
      resizeMode="contain"
      onError={() => setSourceIndex((prev) => prev + 1)}
    />
  );
}

function PartnerOfferRow({ partner }: { partner: PartnerBrand }) {
  const theme = useTheme();

  const openPartnerOffer = async () => {
    if (!partner.offerUrl) return;
    const separator = partner.offerUrl.includes('?') ? '&' : '?';
    const targetUrl = `${partner.offerUrl}${separator}coupon=${encodeURIComponent(partner.discountCode)}`;
    const canOpen = await Linking.canOpenURL(targetUrl);
    if (canOpen) {
      await Linking.openURL(targetUrl);
    }
  };

  return (
    <Pressable
      style={[styles.partnerRow, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={openPartnerOffer}
    >
      <View style={[styles.logoWrap, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <BrandLogo
          partnerId={partner.id}
          uri={partner.image}
          name={partner.name}
          offerUrl={partner.offerUrl}
        />
      </View>

      <View style={styles.infoCol}>
        <Text style={[styles.name, { color: theme.titleColor }]}>{partner.name}</Text>
        <View style={styles.discountLine}>
          <View style={styles.discountPill}>
            <Text style={styles.discountPillText}>{partner.discountLabel}</Text>
          </View>
          <Text style={[styles.automaticText, { color: theme.subtitleColor }]}>AUTOMATISCH</Text>
        </View>
      </View>

      <View style={[styles.chevronCircle, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="chevron-right" size={28} color={theme.subtitleColor} />
      </View>
    </Pressable>
  );
}

export default function PartnersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof PARTNER_FILTERS)[number]>('Alles');

  const filteredPartners = PARTNERS.filter((partner) => {
    if (activeFilter === 'Alles') return true;
    return partner.group === activeFilter;
  });

  const sectionLabel = activeFilter === 'Alles'
    ? 'ALLE PARTNERS'
    : `${activeFilter.toUpperCase()} PARTNERS`;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable
            style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color={theme.titleColor} />
            <Text style={[styles.backButtonText, { color: theme.titleColor }]}>Terug</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.titleColor }]}>Partners.</Text>
            <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Korting bij onze partnermerken.</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
          >
            {PARTNER_FILTERS.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    selected
                      ? styles.filterChipActive
                      : { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selected ? '#FFFFFF' : theme.subtitleColor },
                    ]}
                  >
                    {filter.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>{sectionLabel}</Text>

          {filteredPartners.map((partner) => (
            <PartnerOfferRow key={partner.id} partner={partner} />
          ))}

          {filteredPartners.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Nog geen partners in deze categorie.</Text>
            </View>
          ) : null}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 58,
    lineHeight: 62,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterRow: {
    gap: 10,
    paddingRight: 20,
  },
  filterChip: {
    minWidth: 124,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#0F111A',
    borderColor: '#0F111A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 14,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 122,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoImage: {
    width: 54,
    height: 54,
  },
  logoFallback: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  discountLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  discountPill: {
    backgroundColor: '#2D67E7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  discountPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  automaticText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  chevronCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 120,
  },
});
