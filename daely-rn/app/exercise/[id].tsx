import { StyleSheet, View, Text, Pressable, StatusBar, ScrollView, ImageBackground, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

const DIFF_COLORS: Record<string, string> = {
  Beginner: '#10B981',
  Gemiddeld: '#F59E0B',
  Gevorderd: '#EF4444',
};

const CAT_COLORS: Record<string, string> = {
  Barbell: '#2563EB',
  Dumbbell: '#7C3AED',
  Machine: '#0891B2',
  Cable: '#059669',
  Bodyweight: '#D97706',
  Calisthenics: '#DC2626',
  Gevorderd: '#9333EA',
  Hybrid: '#EA580C',
  Isolatie: '#DB2777',
  Specialist: '#475569',
};

const BASE_EQUIPMENT: Record<string, string> = {
  Barbell: 'Barbell + bench + rack',
  Dumbbell: 'Dumbbells + bench',
  Machine: 'Chest machine',
  Cable: 'Cable station',
  Bodyweight: 'Lichaamsgewicht',
  Calisthenics: 'Rings/bar/dip station',
  Gevorderd: 'Bodyweight of extra load',
  Hybrid: 'Combi materiaal (landmine/kettlebell/band)',
  Isolatie: 'Lichte isolatie-set-up',
  Specialist: 'Speciality set-up (bands/chains/slingshot)',
};

function inferTargets(name: string): string[] {
  const lower = name.toLowerCase();
  const targets = ['Pectoralis major (borst)'];

  if (lower.includes('incline') || lower.includes('low to high')) {
    targets.push('Bovenborst');
  }
  if (lower.includes('decline') || lower.includes('high to low')) {
    targets.push('Onderborst');
  }
  if (lower.includes('fly') || lower.includes('crossover') || lower.includes('squeeze') || lower.includes('press')) {
    targets.push('Binnenborst activatie');
  }
  if (lower.includes('push-up') || lower.includes('dips') || lower.includes('planche')) {
    targets.push('Triceps (secundair)');
    targets.push('Schouders (secundair)');
  }
  if (lower.includes('single arm') || lower.includes('one arm') || lower.includes('alternating')) {
    targets.push('Core anti-rotatie');
  }

  return Array.from(new Set(targets));
}

function inferExecution(name: string, categorie: string): string[] {
  const lower = name.toLowerCase();

  if (lower.includes('push-up') || lower.includes('dips') || categorie === 'Bodyweight' || categorie === 'Calisthenics') {
    return [
      'Zet schouders laag en actief, romp in een rechte lijn.',
      'Laat gecontroleerd zakken tot comfortabele diepte zonder spanning te verliezen.',
      'Duw explosief omhoog en eindig met volledige lock-out of maximale borstactivatie.',
    ];
  }

  if (lower.includes('fly') || lower.includes('crossover') || lower.includes('squeeze')) {
    return [
      'Start met lichte buiging in de ellebogen en borst open.',
      'Breng de armen in een boog naar elkaar toe en knijp 1 seconde samen.',
      'Ga langzaam terug naar start en behoud constante spanning op de borst.',
    ];
  }

  return [
    'Positioneer schouderbladen stabiel tegen bank of toestel en houd de voeten stevig.',
    'Laat het gewicht gecontroleerd zakken naar borstlijn met neutrale polsen.',
    'Druk krachtig omhoog in een vloeiende lijn zonder de spanning op de borst te verliezen.',
  ];
}

function inferTips(name: string, categorie: string): string[] {
  const lower = name.toLowerCase();
  const tips = [
    'Werk met volledige controle in de excentrische fase (2-3 seconden zakken).',
    'Houd de borst trots en voorkom opgetrokken schouders.',
  ];

  if (categorie === 'Cable' || lower.includes('fly')) {
    tips.push('Kies een gewicht waarmee je de eindknijp echt kunt vasthouden.');
  } else if (categorie === 'Bodyweight' || categorie === 'Calisthenics') {
    tips.push('Verhoog eerst je herhalingen met strakke techniek, pas daarna extra gewicht.');
  } else {
    tips.push('Gebruik een korte pauze op de bodem voor meer krachtcontrole.');
  }

  if (lower.includes('incline')) {
    tips.push('Richt de bank op ongeveer 30-35 graden voor nadruk op bovenborst.');
  }
  if (lower.includes('decline')) {
    tips.push('Houd je romp stabiel om druk op de onderborst te maximaliseren.');
  }

  return tips.slice(0, 4);
}

function inferPrescription(moeilijkheid: string, name: string): { sets: string; reps: string; rest: string; tempo: string } {
  const lower = name.toLowerCase();
  const isPower = lower.includes('explosive') || lower.includes('clap') || lower.includes('throw') || lower.includes('plyometric');
  const isIso = lower.includes('isometric') || lower.includes('paused') || lower.includes('tempo');

  if (isPower) {
    return { sets: '4-6', reps: '3-6', rest: '90-150 sec', tempo: 'Explosief op, gecontroleerd neer' };
  }
  if (isIso) {
    return { sets: '3-4', reps: '6-10', rest: '75-120 sec', tempo: '3-1-1 tempo' };
  }
  if (moeilijkheid === 'Gevorderd') {
    return { sets: '4-5', reps: '5-8', rest: '120-180 sec', tempo: '2-0-1 tempo' };
  }
  if (moeilijkheid === 'Gemiddeld') {
    return { sets: '3-4', reps: '8-12', rest: '75-120 sec', tempo: '2-0-2 tempo' };
  }
  return { sets: '3-4', reps: '10-15', rest: '60-90 sec', tempo: '2-0-2 tempo' };
}

function buildYouTubeSearchUrl(name: string): string {
  const query = encodeURIComponent(`${name} chest exercise tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function buildImageSearchUrl(name: string): string {
  const query = encodeURIComponent(`${name} chest exercise form`);
  return `https://www.google.com/search?tbm=isch&q=${query}`;
}

function buildHeroImageUrl(name: string, categorie: string): string {
  const query = encodeURIComponent(`${name} ${categorie} gym`);
  return `https://source.unsplash.com/1200x800/?${query}`;
}

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    spiergroep?: string;
    categorie?: string;
    moeilijkheid?: string;
  }>();

  const name = typeof params.name === 'string' ? params.name : 'Oefening';
  const spiergroep = typeof params.spiergroep === 'string' ? params.spiergroep : 'Onbekend';
  const categorie = typeof params.categorie === 'string' ? params.categorie : 'Onbekend';
  const moeilijkheid = typeof params.moeilijkheid === 'string' ? params.moeilijkheid : 'Beginner';

  const catColor = CAT_COLORS[categorie] ?? '#6B7280';
  const diffColor = DIFF_COLORS[moeilijkheid] ?? '#6B7280';
  const equipment = BASE_EQUIPMENT[categorie] ?? 'Standaard fitness materiaal';
  const targets = inferTargets(name);
  const execution = inferExecution(name, categorie);
  const tips = inferTips(name, categorie);
  const prescription = inferPrescription(moeilijkheid, name);
  const youtubeUrl = buildYouTubeSearchUrl(name);
  const imageSearchUrl = buildImageSearchUrl(name);
  const heroImageUrl = buildHeroImageUrl(name, categorie);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.titleColor} />
          <Text style={[styles.backLabel, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ImageBackground source={{ uri: heroImageUrl }} style={styles.heroImage} imageStyle={styles.heroImageInner}>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroLabel}>Exercise Media</Text>
            </View>
          </ImageBackground>

          <View style={styles.iconRow}>
            <View style={[styles.iconDot, { backgroundColor: catColor }]} />
            <Text style={[styles.title, { color: theme.titleColor }]}>{name}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: catColor + '22' }]}>
              <Text style={[styles.badgeText, { color: catColor }]}>{categorie}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: diffColor + '22' }]}>
              <Text style={[styles.badgeText, { color: diffColor }]}>{moeilijkheid}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: '#E11D48' }]}
              onPress={() => {
                void Linking.openURL(youtubeUrl);
              }}
            >
              <MaterialCommunityIcons name="youtube" size={16} color="#FFFFFF" />
              <Text style={styles.actionText}>Video Demo</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: '#2563EB' }]}
              onPress={() => {
                void Linking.openURL(imageSearchUrl);
              }}
            >
              <MaterialCommunityIcons name="image-search" size={16} color="#FFFFFF" />
              <Text style={styles.actionText}>Illustraties</Text>
            </Pressable>
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Spiergroep</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>{spiergroep}</Text>
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Materiaal</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>{equipment}</Text>
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}> 
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Doelspieren</Text>
            {targets.map((target) => (
              <Text key={target} style={[styles.bulletText, { color: theme.titleColor }]}>• {target}</Text>
            ))}
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Uitvoering</Text>
            {execution.map((step, index) => (
              <Text key={step} style={[styles.bulletText, { color: theme.titleColor }]}>{index + 1}. {step}</Text>
            ))}
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Sets, Reps en Rust</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>Sets: {prescription.sets}</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>Reps: {prescription.reps}</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>Rust: {prescription.rest}</Text>
            <Text style={[styles.infoValue, { color: theme.titleColor }]}>Tempo: {prescription.tempo}</Text>
          </View>

          <View style={[styles.infoBlock, { borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.subtitleColor }]}>Coaching Tips</Text>
            {tips.map((tip) => (
              <Text key={tip} style={[styles.bulletText, { color: theme.titleColor }]}>• {tip}</Text>
            ))}
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  heroImage: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImageInner: {
    borderRadius: 14,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoBlock: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
});
