
import { useEffect, useState } from 'react';
import { ScrollView, View, Image, Pressable, Text, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getCreatorPartners, type Partner } from '@/services/creator-profiles';


export default function CreatorPartnersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Strip '-partners' van id indien aanwezig
  const creatorId = id?.endsWith('-partners') ? id.slice(0, -9) : id;
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      if (!creatorId) return;
      const data = await getCreatorPartners(creatorId);
      setPartners(data);
      setLoading(false);
    };
    loadPartners();
  }, [creatorId]);

  // Voorbeeld data voor uitgelichte bundel (hardcoded, want Muscle Meat heeft geen bundel info)
  const bundle = {
    title: "Olivier's Muscle Recovery Bundle",
    description: 'Alles voor spierherstel: kip, rund, vis en supplementen.',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    saveText: 'Je bespaart €12,50 met Olivier’s bundel.',
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <Image source={{ uri: partners[0]?.logo || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
        <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 4 }}>Samenwerkingen van Olivier</Text>
        <Text style={{ fontSize: 16, color: '#374151', textAlign: 'center' }}>
          Ontdek de merken, producten en exclusieve acties die Olivier speciaal voor deze community heeft geselecteerd. Voeg losse producten toe of kies direct een complete creator-bundel met automatische korting in je winkelwagen.
        </Text>
      </View>

      {/* Uitgelichte actie/deal */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>{bundle.title}</Text>
        <Text style={{ fontSize: 15, color: '#374151', marginBottom: 12 }}>{bundle.description}</Text>
        <Image source={{ uri: bundle.image }} style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 14 }} />
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginRight: 8 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Voeg bundel toe aan winkelwagen</Text>
          </Pressable>
          <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }} onPress={() => {}}>
            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 15 }}>Bekijk producten</Text>
          </Pressable>
        </View>
        <Text style={{ color: '#059669', fontWeight: 'bold', fontSize: 15 }}>{bundle.saveText}</Text>
      </View>

      {/* Merken waarmee Olivier samenwerkt */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Merken waarmee Olivier samenwerkt</Text>
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 28 }}>
        {partners.map((partner) => (
          <View key={partner.id} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', flex: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
            {partner.logo && <Image source={{ uri: partner.logo }} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 8 }} />}
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{partner.name}</Text>
            <Text style={{ fontSize: 13, color: '#374151', textAlign: 'center', marginBottom: 6 }}>{partner.description || `Olivier werkt samen met ${partner.name}.`}</Text>
            {partner.promotion && <Text style={{ fontSize: 13, color: '#059669', marginBottom: 6 }}>{partner.promotion}</Text>}
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Waarom samen? Kwaliteit, innovatie en comfort.</Text>
            {partner.website && (
              <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => Linking.openURL(partner.website || '')}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Bekijk {partner.name} selectie</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* Productkaarten uit samenwerkingen (optioneel, voorbeeld) */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Producten uit samenwerkingen</Text>
      <View style={{ gap: 18, marginBottom: 32 }}>
        {/* Voorbeeld productkaart */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', gap: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Muscle Meat Kipfilet</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>Muscle Meat</Text>
            <Text style={{ fontSize: 13, color: '#059669', marginBottom: 2 }}>Met Olivier-code: €19,99</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>Aanbevolen door Olivier voor spierherstel en eiwitinname.</Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#111827' }}>€24,99</Text>
              <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>€19,99</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Inhoud: 1kg, 2kg, 5kg</Text>
            <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' }} onPress={() => {}}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Voeg toe aan winkelwagen</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

