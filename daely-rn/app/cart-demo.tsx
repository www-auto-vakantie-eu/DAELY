import React from 'react';
import { View, Text, Button, FlatList, Image } from 'react-native';
import { useCartStore, CartItem } from './store/cartStore';

// Voorbeeld van een product (kan challenge, kleding, supplement, gerecht zijn)
const exampleProduct: CartItem = {
  id: 'challenge-1',
  type: 'challenge',
  name: '30 Dagen Push-up Challenge',
  price: 19.95,
  quantity: 1,
  image: undefined,
};

export default function CartDemo() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total());

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Button title="Voeg challenge toe" onPress={() => addItem(exampleProduct)} />
      <Button title="Leeg winkelwagen" onPress={clearCart} color="#e53935" />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 16 }}>Winkelwagen</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            {item.image && (
              <Image source={{ uri: item.image }} style={{ width: 40, height: 40, marginRight: 8 }} />
            )}
            <Text style={{ flex: 1 }}>{item.name} x{item.quantity}</Text>
            <Text>€{item.price.toFixed(2)}</Text>
            <Button title="Verwijder" onPress={() => removeItem(item.id)} color="#e53935" />
          </View>
        )}
        ListEmptyComponent={<Text>Winkelwagen is leeg</Text>}
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Totaal: €{total.toFixed(2)}</Text>
    </View>
  );
}
