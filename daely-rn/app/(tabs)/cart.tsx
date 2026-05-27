import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '@/hooks/use-theme';

export default function CartScreen() {
  const theme = useTheme();
  const { items, removeItem, clearCart } = useCartStore();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: '900', color: theme.titleColor }}>Winkelwagen</Text>
        <Pressable onPress={clearCart} style={{ padding: 8 }}>
          <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Leeg</Text>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {items.length === 0 ? (
          <Text style={{ color: theme.subtitleColor }}>Je winkelwagen is leeg.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{item.title}</Text>
                {item.subtitle && <Text style={{ color: theme.subtitleColor }}>{item.subtitle}</Text>}
                <Text style={{ color: theme.subtitleColor }}>Aantal: {item.quantity}</Text>
              </View>
              <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Text style={{ color: '#EF4444' }}>Verwijder</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 14,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  removeBtn: {
    marginLeft: 12,
    padding: 6,
  },
});
