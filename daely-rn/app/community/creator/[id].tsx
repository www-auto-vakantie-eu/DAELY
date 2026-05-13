import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { getCreatorProfile, type CreatorProfile } from '@/services/creator-profiles';
import { BADGE_COLORS } from '@/constants/community-creators';

export default function CreatorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      const data = await getCreatorProfile(id);
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="progress-clock" size={40} color={theme.titleColor} />
          <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Profile laden...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: theme.titleColor }]}>Creator niet gevonden</Text>
        </View>
      </View>
    );
  }

  const badgeStyle = BADGE_COLORS[profile.badge];
  const socials = profile.socials;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header met achtergrondafbeelding */}


      {/* Avatar & Name met achtergrondfoto */}
      <View style={{ position: 'relative' }}>
        {(profile.headerImage || (profile.gallery && profile.gallery.length > 0 && profile.gallery[0].type === 'image')) && (
          <Image
            source={{ uri: profile.headerImage || profile.gallery[0].url }}
            style={[styles.headerBackground, { position: 'absolute', top: 0, left: 0, right: 0, height: 180, zIndex: 0 }]}
            resizeMode="cover"
            blurRadius={2}
          />
        )}
        <View style={[styles.headerOverlay, { position: 'absolute', top: 0, left: 0, right: 0, height: 180, zIndex: 1 }]} />
        <View style={[styles.avatarSection, { zIndex: 2, position: 'relative', paddingTop: 32 }]}> 
          <View style={styles.avatarRing}>
            <Image source={{ uri: profile.image }} style={styles.avatar} />
          </View>
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.titleColor }]}>{profile.name}</Text>
            </View>
            {/* Socials */}
            {profile.socials && (
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 4 }}>
                {profile.socials.instagram ? (
                  <Pressable onPress={() => Linking.openURL(profile.socials.instagram)}>
                    <MaterialCommunityIcons name="instagram" size={22} color="#C13584" />
                  </Pressable>
                ) : null}
                {profile.socials.facebook ? (
                  <Pressable onPress={() => Linking.openURL(profile.socials.facebook)}>
                    <MaterialCommunityIcons name="facebook" size={22} color="#1877F3" />
                  </Pressable>
                ) : null}
                {profile.socials.tiktok ? (
                  <Pressable onPress={() => Linking.openURL(profile.socials.tiktok)}>
                    <MaterialCommunityIcons name="music" size={22} color="#000" />
                  </Pressable>
                ) : null}
                {profile.socials.youtube ? (
                  <Pressable onPress={() => Linking.openURL(profile.socials.youtube)}>
                    <MaterialCommunityIcons name="youtube" size={22} color="#FF0000" />
                  </Pressable>
                ) : null}
                {profile.socials.website ? (
                  <Pressable onPress={() => Linking.openURL(profile.socials.website)}>
                    <MaterialCommunityIcons name="web" size={22} color={theme.titleColor} />
                  </Pressable>
                ) : null}
              </View>
            )}
            <Text style={[styles.headerTitle, { color: theme.titleColor, marginTop: 8 }]}>Creator Profiel</Text>
            <Text style={[styles.specialty, { color: theme.subtitleColor }]}>{profile.specialty}</Text>
          </View>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaRow}>
        <Pressable
          style={[styles.followButton, { backgroundColor: theme.primary || '#2563EB' }]}
          onPress={() => setIsFollowing(!isFollowing)}
        >
          <MaterialCommunityIcons
            name={isFollowing ? 'check' : 'plus'}
            size={16}
            color={'#FFFFFF'}
          />
          <Text style={[styles.followButtonText, { color: '#FFFFFF' }]}>Volgen</Text>
        </Pressable>
        <Pressable style={[styles.messageButton, { backgroundColor: theme.primary || '#2563EB' }]}> 
          <MaterialCommunityIcons name="message-outline" size={16} color="#FFFFFF" />
          <Text style={[styles.messageButtonText, { color: '#FFFFFF' }]}>Bericht</Text>
        </Pressable>
        <Pressable
          style={[styles.messageButton, { backgroundColor: theme.primary || '#2563EB' }]}
          onPress={() => router.push('/(tabs)/community/creator/voorbeeld-creator-commerce')}
        >
          <MaterialCommunityIcons name="gift-outline" size={16} color="#FFFFFF" />
          <Text style={[styles.messageButtonText, { color: '#FFFFFF' }]}>Samenwerkingen</Text>
        </Pressable>
      </View>

      {/* Bio */}
      <View style={[styles.bioCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Text style={[styles.bioText, { color: theme.subtitleColor }]}>{profile.bio}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>
            {(profile.followers / 1000).toFixed(profile.followers >= 100 ? 1 : 0)}K
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Volgers</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>{profile.stats.approvedPosts}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Posts</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>{profile.stats.approvedMeals}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Gerechten</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
          <Text style={[styles.statValue, { color: theme.titleColor }]}>{profile.stats.approvedWorkouts}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Workouts</Text>
        </View>
      </View>

      {/* Achievements */}
      <View>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>ACHIEVEMENTS</Text>
        <View style={styles.achievementsGrid}>
          {profile.achievements.length > 0 ? (
            profile.achievements.map((badge) => (
              <View key={badge.id} style={[styles.achievementBadge, { borderColor: badge.color }]}>
                <MaterialCommunityIcons name={badge.icon as any} size={32} color={badge.color} />
                <Text style={[styles.achievementLabel, { color: theme.titleColor }]}>{badge.label}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noAchievementsText, { color: theme.subtitleColor }]}>Nog geen achievements</Text>
          )}
        </View>
      </View>

      {/* Content Stats */}
      <View style={styles.contentStatsSection}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>CONTENT STATS</Text>
        <View style={[styles.contentStatCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
          <View style={styles.contentStatRow}>
            <View style={styles.contentStatCol}>
              <MaterialCommunityIcons name="pencil-box" size={20} color="#3B82F6" />
              <Text style={[styles.contentStatLabel, { color: theme.subtitleColor }]}>Posts</Text>
            </View>
            <Text style={[styles.contentStatValue, { color: theme.titleColor }]}>
              {profile.stats.approvedPosts} / {profile.stats.totalPosts}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contentStatRow}>
            <View style={styles.contentStatCol}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#10B981" />
              <Text style={[styles.contentStatLabel, { color: theme.subtitleColor }]}>Gerechten</Text>
            </View>
            <Text style={[styles.contentStatValue, { color: theme.titleColor }]}>
              {profile.stats.approvedMeals} / {profile.stats.totalMeals}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contentStatRow}>
            <View style={styles.contentStatCol}>
              <MaterialCommunityIcons name="dumbbell" size={20} color="#EA580C" />
              <Text style={[styles.contentStatLabel, { color: theme.subtitleColor }]}>Workouts</Text>
            </View>
            <Text style={[styles.contentStatValue, { color: theme.titleColor }]}>
              {profile.stats.approvedWorkouts} / {profile.stats.totalWorkouts}
            </Text>
          </View>
        </View>
      </View>

      {/* Joined Date */}
      <View style={[styles.joinedCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <MaterialCommunityIcons name="calendar-outline" size={16} color={theme.subtitleColor} />
        <Text style={[styles.joinedText, { color: theme.subtitleColor }]}>
          Lid sinds {new Date(profile.stats.joinedDate).toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      {/* Recente Posts & Workouts */}
      <View style={{ marginTop: 32 }}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>RECENTE POSTS</Text>
        {profile.recentPosts && profile.recentPosts.length > 0 ? (
          profile.recentPosts.map((post) => (
            <View key={post.id} style={[styles.postCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}> 
              <Text style={[styles.postTitle, { color: theme.titleColor }]}>{post.title}</Text>
              <Text style={[styles.postDate, { color: theme.subtitleColor }]}>{new Date(post.date).toLocaleDateString('nl-NL')}</Text>
              <Text style={[styles.postContent, { color: theme.subtitleColor }]} numberOfLines={2}>{post.content}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noAchievementsText, { color: theme.subtitleColor }]}>Nog geen posts</Text>
        )}
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>RECENTE WORKOUTS</Text>
        {profile.recentWorkouts && profile.recentWorkouts.length > 0 ? (
          profile.recentWorkouts.map((workout) => (
            <View key={workout.id} style={[styles.postCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}> 
              <Text style={[styles.postTitle, { color: theme.titleColor }]}>{workout.title}</Text>
              <Text style={[styles.postDate, { color: theme.subtitleColor }]}>{new Date(workout.date).toLocaleDateString('nl-NL')}</Text>
              <Text style={[styles.postContent, { color: theme.subtitleColor }]} numberOfLines={2}>{workout.description}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noAchievementsText, { color: theme.subtitleColor }]}>Nog geen workouts</Text>
        )}
      </View>

      {/* Galerij */}
      <View style={{ marginTop: 32 }}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>GALERIJ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {profile.gallery && profile.gallery.length > 0 ? (
            profile.gallery.map((item, idx) => (
              <View key={idx} style={{ marginRight: 12 }}>
                {item.type === 'image' ? (
                  <Image source={{ uri: item.url }} style={{ width: 120, height: 120, borderRadius: 12 }} />
                ) : (
                  <View style={{ width: 120, height: 120, borderRadius: 12, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="play-circle-outline" size={48} color="#FFF" />
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={[styles.noAchievementsText, { color: theme.subtitleColor }]}>Nog geen media</Text>
          )}
        </ScrollView>
      </View>

      {/* Social Media Links */}
      <View style={{ marginTop: 32, marginBottom: 32 }}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>SOCIAL MEDIA</Text>
        <View style={{ flexDirection: 'row', gap: 18, marginTop: 8 }}>
          {socials?.instagram && (
            <Pressable onPress={() => Linking.openURL(socials.instagram!)}>
              <MaterialCommunityIcons name="instagram" size={28} color="#E1306C" />
            </Pressable>
          )}
          {socials?.youtube && (
            <Pressable onPress={() => Linking.openURL(socials.youtube!)}>
              <MaterialCommunityIcons name="youtube" size={28} color="#FF0000" />
            </Pressable>
          )}
          {socials?.tiktok && (
            <Pressable onPress={() => Linking.openURL(socials.tiktok!)}>
              <MaterialCommunityIcons name="music" size={28} color="#000" />
            </Pressable>
          )}
          {socials?.website && (
            <Pressable onPress={() => Linking.openURL(socials.website!)}>
              <MaterialCommunityIcons name="web" size={28} color={theme.titleColor} />
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  headerContainer: {
    position: 'relative',
    height: 140,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 140,
    paddingHorizontal: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 14, fontWeight: '500' },
  errorText: { fontSize: 16, fontWeight: '600' },
  avatarSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#2563EB',
  },
  avatar: { width: '100%', height: '100%' },
  nameBlock: { flex: 1, paddingTop: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  specialty: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  badgeRow: { marginTop: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  followButtonText: { fontSize: 14, fontWeight: '700' },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  messageButtonText: { fontSize: 14, fontWeight: '700' },
  bioCard: { borderRadius: 12, padding: 14, marginBottom: 16 },
  bioText: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 4, letterSpacing: 0.5 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  achievementBadge: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  achievementLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center' },
  noAchievementsText: { fontSize: 14, fontWeight: '500', textAlign: 'center', flex: 1 },
  contentStatsSection: { marginBottom: 24 },
  contentStatCard: { borderRadius: 12, padding: 14 },
  contentStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contentStatCol: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  contentStatLabel: { fontSize: 13, fontWeight: '600' },
  contentStatValue: { fontSize: 16, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  joinedCard: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinedText: { fontSize: 13, fontWeight: '500' },
  postCard: { borderRadius: 12, padding: 12, marginBottom: 10 },
  postTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  postDate: { fontSize: 11, fontWeight: '500', marginBottom: 6 },
  postContent: { fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: 40 },
});
