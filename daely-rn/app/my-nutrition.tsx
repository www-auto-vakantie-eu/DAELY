import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function MyNutritionScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.titleColor }]}>Mijn Voeding</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Hier komt jouw voedingsinformatie, statistieken en weekgemiddelden.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
