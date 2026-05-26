import { Alert, View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function TappingScreen() {
  const theme = useTheme();
  const router = useRouter();

  const tappingTechniques = [
    {
      id: 'basic',
      name: 'Basis Tapping',
      description: 'Universele techniek voor dagelijkse balans.',
      icon: 'hand-okay',
      accent: '#F4A259',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'stress',
      name: 'Stress Release',
      description: 'Speciaal voor het loslaten van spanning en stress.',
      icon: 'emoticon-cool-outline',
      accent: '#E07A5F',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'sleep',
      name: 'Slaap Tapping',
      description: 'Voor ontspanning en beter inslapen.',
      icon: 'weather-night',
      accent: '#355070',
      image: 'https://images.unsplash.com/photo-1455642305367-68834a7d641e?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'affirmation',
      name: 'Affirmatie Tapping',
      description: 'Combineer tapping met positieve zinnen.',
      icon: 'format-quote-close',
      accent: '#2A9D8F',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  const openTechniqueFallback = (name: string) => {
    Alert.alert('Binnenkort beschikbaar', `${name} detailpagina volgt binnenkort.`, [
      { text: 'Terug naar Mind', onPress: () => router.replace('/(tabs)/mind') },
      { text: 'Sluiten', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 18 }} />
      {tappingTechniques.map((tech) => (
        <Pressable
          key={tech.id}
          style={styles.bigCardWrap}
          onPress={() => openTechniqueFallback(tech.name)}
        >
          <View style={styles.shadowWrap}>
            <ImageBackground
              source={{ uri: tech.image }}
              style={styles.bigCard}
              imageStyle={styles.bigCardImage}
            >
              <View style={[styles.label, { backgroundColor: tech.accent + 'E6' }]}> 
                <MaterialCommunityIcons name={tech.icon as any} size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.labelText}>{tech.name}</Text>
              </View>
              <View style={styles.bigCardContent}>
                <Text style={styles.bigCardTitle}>{tech.name}</Text>
                <Text style={styles.bigCardDesc}>{tech.description}</Text>
              </View>
            </ImageBackground>
          </View>
        </Pressable>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bigCardWrap: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'visible',
  },
  shadowWrap: {
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backgroundColor: 'transparent',
  },
  bigCard: {
    height: 200,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bigCardImage: {
    borderRadius: 28,
  },
  label: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 2,
  },
  labelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  bigCardContent: {
    padding: 22,
    paddingTop: 38,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  bigCardTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bigCardDesc: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
