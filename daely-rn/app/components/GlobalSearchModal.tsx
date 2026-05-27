
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Pressable, Animated, Dimensions, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

type SearchResultItem = {
  id: string;
  label: string;
  meta?: string;
  onSelect: () => void;
};

type GlobalSearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  results: SearchResultItem[];
};

export default function GlobalSearchModal({ visible, onClose, onSearch, results }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }).start(() => {
        inputRef.current?.focus();
      });
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
      setQuery('');
      onSearch('');
    }
  }, [onSearch, slideAnim, visible]);

  const width = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [48, SCREEN_WIDTH - 32],
  });
  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!visible) return null;

  return (
    <View style={styles.animatedOverlay} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.animatedBar, { width }]}> 
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="magnify" size={24} color="#888" />
          <Animated.View style={{ flex: 1, opacity }}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Zoeken..."
              value={query}
              onChangeText={text => {
                setQuery(text);
                onSearch(text);
              }}
              autoFocus
              returnKeyType="search"
            />
          </Animated.View>
          <Pressable onPress={() => { setQuery(''); onClose(); Keyboard.dismiss(); }} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color="#888" />
          </Pressable>
        </View>
        {visible && (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.resultItem} onPress={() => { onClose(); item.onSelect(); }}>
                <Text style={styles.resultText}>{item.label}</Text>
                {item.meta ? <Text style={styles.resultMeta}>{item.meta}</Text> : null}
              </Pressable>
            )}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={query.trim().length > 0 ? <Text style={styles.empty}>Geen resultaten</Text> : null}
            style={{ maxHeight: 260 }}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedOverlay: {
    position: 'absolute',
    top: 24,
    right: 16,
    left: 0,
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  animatedBar: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    alignSelf: 'flex-end',
    minHeight: 48,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
    paddingVertical: 6,
  },
  closeBtn: {
    marginLeft: 8,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    color: '#111827',
  },
  resultMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 24,
  },
});
