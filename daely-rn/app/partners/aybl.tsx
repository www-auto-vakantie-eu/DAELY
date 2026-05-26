import React from 'react';
import { View, Text, Image, Linking, Pressable, StyleSheet } from 'react-native';

export default function AyblPartner() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://aybl.com/cdn/shop/files/AYBL_Logo_White_Transparent_200x.png' }} style={styles.logo} />
      <Text style={styles.name}>Aybl</Text>
      <Text style={styles.description}>Premium activewear voor vrouwen. Ontdek de nieuwste collecties en samenwerkingen.</Text>
      <Pressable onPress={() => Linking.openURL('https://www.aybl.com/')} style={styles.button}>
        <Text style={styles.buttonText}>Bezoek Aybl</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { width: 120, height: 60, resizeMode: 'contain', marginBottom: 16 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});