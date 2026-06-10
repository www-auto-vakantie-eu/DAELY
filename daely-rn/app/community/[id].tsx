import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Image, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { fetchCommunityCreators, type CommunityCreator, type CountryCode } from '@/services/content-api';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

function openExternal(url?: string) {
  if (url) {
    Linking.openURL(url);
  }
}

export default function CommunityCreatorScreen() {
  const theme = useTheme();
  const { appSettings } = useAppContext();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [creator, setCreator] = useState<CommunityCreator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCreator = async () => {
      try {
        const country = appSettings.accountCountry as CountryCode;
        const creators = await fetchCommunityCreators(country);
        if (isMounted) {
          setCreator(creators.find((c) => c.id === id) || null);
        }
      } catch (error) {
        console.error('Failed to load community creator:', error);
        if (isMounted) {
          setCreator(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadCreator();
    } else {
      setCreator(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [appSettings.accountCountry, id]);

  if (isLoading) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.notFound, { color: theme.subtitleColor }]}>Creator laden...</Text>
        </View>
        <SharedBottomNav activeTab="community" />
      </AppScreen>
    );
  }

  if (!creator) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.notFound, { color: theme.subtitleColor }]}>Creator niet gevonden.</Text>
        </View>
        <SharedBottomNav activeTab="community" />
      </AppScreen>
    );
  }

  const socials = creator.socials ?? {};
  const instagram = socials.instagram;
  const facebook = socials.facebook;
  const tiktok = socials.tiktok;
  const youtube = socials.youtube;

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: creator.image }} style={styles.avatar} />
          </View>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.titleColor }]}>{creator.name}</Text>
          </View>
          {/* Socials */}
          {creator.socials && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 4, alignSelf: 'center' }}>
              {instagram ? (
                <Pressable onPress={() => openExternal(instagram)}>
                  <MaterialCommunityIcons name="instagram" size={22} color="#C13584" />
                </Pressable>
              ) : null}
              {facebook ? (
                <Pressable onPress={() => openExternal(facebook)}>
                  <MaterialCommunityIcons name="facebook" size={22} color="#1877F3" />
                </Pressable>
              ) : null}
              {tiktok ? (
                <Pressable onPress={() => openExternal(tiktok)}>
                  <MaterialCommunityIcons name="music" size={22} color="#000" />
                </Pressable>
              ) : null}
              {youtube ? (
                <Pressable onPress={() => openExternal(youtube)}>
                  <MaterialCommunityIcons name="youtube" size={22} color="#FF0000" />
                </Pressable>
              ) : null}
            </View>
          )}
          <Text style={[styles.specialty, { color: theme.subtitleColor }]}>{creator.specialty}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{formatFollowers(creator.followers)}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Volgers</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{creator.posts}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Posts</Text>
            </View>
          </View>
        </View>

        <View style={[styles.bioCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.bioLabel, { color: theme.subtitleColor }]}>Over</Text>
          <Text style={[styles.bio, { color: theme.titleColor }]}>{creator.bio}</Text>
        </View>

        <Pressable style={styles.followBtn}>
          <Text style={styles.followBtnText}>Volgen</Text>
        </Pressable>
        <View style={styles.bottomSpacer} />
    </ScrollView>
    <SharedBottomNav activeTab="community" />
  </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#3B82F6',
    padding: 3,
    marginBottom: 14,
  },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  specialty: { fontSize: 15, fontWeight: '500', marginBottom: 12 },
  badge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 18 },
  badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 32 },
  bioCard: { borderRadius: 20, padding: 16, marginBottom: 14 },
  bioLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase' },
  bio: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  followBtn: { backgroundColor: '#3B82F6', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  followBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  notFound: { padding: 24, fontSize: 16 },
  bottomSpacer: { height: 80 },
});
