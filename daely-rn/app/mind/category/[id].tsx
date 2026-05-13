import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { MIND_CATEGORIES } from '@/constants/mind-categories';
import { MIND_PROGRAMS } from '@/constants/mind-programs';

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatCardTitle(title: string): string {
  const words = title.trim().split(' ');
  if (words.length <= 2) {
    return title;
  }

  const splitIndex = Math.ceil(words.length / 2);
  return `${words.slice(0, splitIndex).join(' ')}\n${words.slice(splitIndex).join(' ')}`;
}

function getCardTitleSize(title: string): { fontSize: number; lineHeight: number } {
  if (title.length >= 28) {
    return { fontSize: 40, lineHeight: 42 };
  }
  if (title.length >= 22) {
    return { fontSize: 46, lineHeight: 48 };
  }
  return { fontSize: 54, lineHeight: 56 };
}

export default function MindCategoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;

  const category = MIND_CATEGORIES.find((item) => item.id === categoryId);

  const programs = useMemo(() => {
    if (!category) {
      return [];
    }
    return MIND_PROGRAMS.filter((program) => program.categories.includes(category.id));
  }, [category]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Pressable
          style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.card }]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={theme.titleColor} />
          <Text style={[styles.backText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>

        {category ? (
          <ImageBackground source={{ uri: category.image }} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={[styles.heroDecor1, { backgroundColor: hexToRgba(category.accent, 0.2) }]} />
            <View style={[styles.heroDecor2, { borderColor: hexToRgba(category.accent, 0.25), borderWidth: 1.5 }]} />
            <LinearGradient
              colors={[hexToRgba(category.accent, 0.12), hexToRgba(category.accent, 0.52), 'rgba(0,0,0,0.76)']}
              style={styles.heroOverlay}
            >
              <View style={[styles.heroBadge, { borderColor: hexToRgba(category.accent, 0.9), backgroundColor: hexToRgba(category.accent, 0.26) }]}>
                <MaterialCommunityIcons name={category.icon} size={18} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>{category.name}</Text>
              </View>
              <Text style={styles.heroTitle}>{category.name}</Text>
              <Text style={styles.heroSubtitle}>{category.description}</Text>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View style={[styles.notFound, { borderColor: theme.border }]}>
            <Text style={[styles.notFoundTitle, { color: theme.titleColor }]}>Categorie niet gevonden</Text>
            <Text style={[styles.notFoundSubtitle, { color: theme.subtitleColor }]}>Deze categorie bestaat niet of is verplaatst.</Text>
          </View>
        )}

        {programs.map((program) => (
          <Pressable
            key={program.id}
            style={styles.cardWrap}
            onPress={() => router.push({ pathname: '/mind/[id]', params: { id: program.id } })}
          >
            <ImageBackground source={{ uri: program.image }} style={styles.card} imageStyle={styles.cardImage}>
              <LinearGradient colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']} style={styles.cardOverlay}>
                <Text
                  style={[styles.cardTitle, getCardTitleSize(program.title)]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {formatCardTitle(program.title)}
                </Text>
                <Text style={styles.cardMeta}>{program.minutes} MIN    {program.sessions} SESSIES</Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        ))}

        {category && programs.length === 0 && (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <MaterialCommunityIcons name="meditation" size={34} color={theme.subtitleColor} />
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Geen technieken</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>Er zijn nog geen technieken in deze categorie.</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hero: {
    height: 220,
    marginBottom: 16,
  },
  heroImage: {
    borderRadius: 30,
  },
  heroOverlay: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroDecor1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  heroDecor2: {
    position: 'absolute',
    top: 20,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  cardWrap: {
    marginBottom: 16,
  },
  card: {
    height: 290,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 40,
  },
  cardOverlay: {
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 70,
  },
  cardTitle: {
    color: '#FFFFFF',
    letterSpacing: -1.8,
    fontWeight: '900',
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyState: {
    marginTop: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
  },
  notFound: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  notFoundSubtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  bottomSpacer: { height: 80 },
});
