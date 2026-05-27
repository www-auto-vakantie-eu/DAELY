
import { View, Image, Pressable, ScrollView, Text } from 'react-native';

export default function VoorbeeldCreatorCommerce() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
        <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 4 }}>Samenwerkingen van Tim</Text>
        <Text style={{ fontSize: 16, color: '#374151', textAlign: 'center' }}>
          Ontdek de merken, producten en exclusieve acties die Tim speciaal voor deze community heeft geselecteerd. Voeg losse producten toe of kies direct een complete creator-bundel met automatische korting in je winkelwagen.
        </Text>
      </View>

      {/* Uitgelichte actie/deal */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>Tim’s Recovery Bundle</Text>
        <Text style={{ fontSize: 15, color: '#374151', marginBottom: 12 }}>
          Alles voor herstel na je training: magnesium, foam roller en eiwitshake.
        </Text>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }} style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 14 }} />
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginRight: 8 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Voeg bundel toe aan winkelwagen</Text>
          </Pressable>
          <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }} onPress={() => {}}>
            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 15 }}>Bekijk producten</Text>
          </Pressable>
        </View>
        <Text style={{ color: '#059669', fontWeight: 'bold', fontSize: 15 }}>Je bespaart €18,50 met Tim’s bundel.</Text>
      </View>
      {/* Merken waarmee Tim samenwerkt */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Merken waarmee Tim samenwerkt</Text>
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 28 }}>
        {/* Merk 1 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', flex: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Image source={{ uri: 'https://logo.clearbit.com/nike.com' }} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 8 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Nike</Text>
          <Text style={{ fontSize: 13, color: '#374151', textAlign: 'center', marginBottom: 6 }}>
            Tim gebruikt Nike voor zijn hardlooptrainingen en wedstrijden.
          </Text>
          <Text style={{ fontSize: 13, color: '#059669', marginBottom: 6 }}>10% korting op geselecteerde hardloopschoenen</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Waarom samen? Kwaliteit, innovatie en comfort.</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Bekijk Nike selectie</Text>
          </Pressable>
        </View>
        {/* Merk 2 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', flex: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Image source={{ uri: 'https://logo.clearbit.com/myprotein.com' }} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 8 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>MyProtein</Text>
          <Text style={{ fontSize: 13, color: '#374151', textAlign: 'center', marginBottom: 6 }}>
            Voor eiwitten, supplementen en herstelproducten vertrouwt Tim op MyProtein.
          </Text>
          <Text style={{ fontSize: 13, color: '#059669', marginBottom: 6 }}>15% korting met code TIM15</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Waarom samen? Betrouwbare kwaliteit en snelle levering.</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Bekijk MyProtein selectie</Text>
          </Pressable>
        </View>
      </View>
      {/* Productkaarten */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Producten uit samenwerkingen</Text>
      <View style={{ gap: 18, marginBottom: 32 }}>
        {/* Product 1 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', gap: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Nike Pegasus 41</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>Nike</Text>
            <Text style={{ fontSize: 13, color: '#059669', marginBottom: 2 }}>Met Tim-code: €116,99</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>Aanbevolen door Tim voor dagelijkse hardlooptrainingen.</Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#111827' }}>€129,99</Text>
              <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>€116,99</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Beschikbare maten: 41, 42, 43, 44</Text>
            <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' }} onPress={() => {}}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Voeg toe aan winkelwagen</Text>
            </Pressable>
          </View>
        </View>
        {/* Product 2 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', gap: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>MyProtein Whey</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>MyProtein</Text>
            <Text style={{ fontSize: 13, color: '#059669', marginBottom: 2 }}>15% korting met code TIM15</Text>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>Tim gebruikt deze whey voor optimaal herstel na zware trainingen.</Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#111827' }}>€29,99</Text>
              <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>€25,49</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Smaak: Vanille, Chocolade</Text>
            <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' }} onPress={() => {}}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Voeg toe aan winkelwagen</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {/* Creator-bundels */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Bundels van Tim</Text>
      <View style={{ gap: 18, marginBottom: 32 }}>
        {/* Bundel 1 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Starter Pack</Text>
          <Text style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>Voor beginners die willen starten met dezelfde setup als Tim.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }} style={{ width: 54, height: 54, borderRadius: 8 }} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }} style={{ width: 54, height: 54, borderRadius: 8 }} />
          </View>
          <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>Inhoud: Nike Pegasus 41, MyProtein Whey</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#111827' }}>Normaal €159,98</Text>
            <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>Bundelprijs €139,99</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#059669', marginBottom: 8 }}>Je bespaart €19,99 met deze bundel.</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Voeg volledige bundel toe aan winkelwagen</Text>
          </Pressable>
        </View>
        {/* Bundel 2 */}
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Recovery Pack</Text>
          <Text style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>Producten voor herstel, voeding en mobiliteit.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }} style={{ width: 54, height: 54, borderRadius: 8 }} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }} style={{ width: 54, height: 54, borderRadius: 8 }} />
          </View>
          <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>Inhoud: MyProtein Whey, Foam Roller</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#111827' }}>Normaal €49,99</Text>
            <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>Bundelprijs €39,99</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#059669', marginBottom: 8 }}>Je bespaart €10,00 met deze bundel.</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Voeg volledige bundel toe aan winkelwagen</Text>
          </Pressable>
        </View>
      </View>
      {/* Verhaal achter de samenwerking */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Waarom deze samenwerking?</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
        <Text style={{ fontSize: 15, color: '#374151', marginBottom: 6 }}>
          Deze producten gebruikt Tim tijdens trainingen, wedstrijden en herstelmomenten. De selectie is gebaseerd op comfort, kwaliteit en toepasbaarheid voor sporters binnen deze community.
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          &quot;Waarom werkt Tim samen met deze merken? Omdat ze bijdragen aan zijn prestaties én herstel.&quot;
        </Text>
      </View>
      {/* Video/quote/review van Tim */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Review & video van Tim</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
        {/* Dummy video (thumbnail) */}
        <Image source={{ uri: 'https://img.youtube.com/vi/2Vv-BfVoq4g/0.jpg' }} style={{ width: '100%', height: 160, borderRadius: 10, marginBottom: 12 }} />
        <Text style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}>
          “Deze schoenen draag ik bij mijn intervaltrainingen omdat ze licht zijn maar genoeg demping geven.”
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>- Tim over Nike Pegasus 41</Text>
      </View>
      {/* Filters en categorieën */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Filter & Sorteer</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Training</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Wedstrijd</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Herstel</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Voeding</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Kleding</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Accessoires</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Favorieten</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Acties</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
        <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text style={{ color: '#fff' }}>Populair</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Nieuwste</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Hoogste korting</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Prijs laag-hoog</Text></Pressable>
        <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}><Text>Prijs hoog-laag</Text></Pressable>
      </View>
      {/* Transparantie over samenwerking */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Transparantie over samenwerking</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
        <Text style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}>
          Sommige producten op deze pagina maken deel uit van een betaalde samenwerking of affiliate-samenwerking. Wanneer je via deze pagina koopt, kan Tim hier voordeel uit halen. Kortingen worden automatisch toegepast wanneer beschikbaar.
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Text style={{ backgroundColor: '#F59E42', color: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, marginBottom: 6 }}>Betaalde samenwerking</Text>
          <Text style={{ backgroundColor: '#2563EB', color: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, marginBottom: 6 }}>Affiliate product</Text>
          <Text style={{ backgroundColor: '#059669', color: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, marginBottom: 6 }}>Zelf gebruikt door Tim</Text>
        </View>
      </View>
      {/* Winkelwagen-interactie (dummy) */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Winkelwagen</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 15, color: '#059669', marginBottom: 8 }}>Toegevoegd aan je winkelwagen via Tim’s actie.</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Bekijk winkelwagen</Text>
          </Pressable>
          <Pressable style={{ backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => {}}>
            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 14 }}>Verder winkelen</Text>
          </Pressable>
        </View>
      </View>
      {/* Vergelijkbare creators */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Bekijk ook samenwerkingen van andere creators</Text>
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={{ width: 54, height: 54, borderRadius: 27, marginBottom: 6 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Lisa</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 4 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontSize: 13 }}>Bekijk samenwerkingen</Text>
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/65.jpg' }} style={{ width: 54, height: 54, borderRadius: 27, marginBottom: 6 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Donny</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 4 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontSize: 13 }}>Bekijk samenwerkingen</Text>
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }} style={{ width: 54, height: 54, borderRadius: 27, marginBottom: 6 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Elise</Text>
          <Pressable style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 4 }} onPress={() => {}}>
            <Text style={{ color: '#fff', fontSize: 13 }}>Bekijk samenwerkingen</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
