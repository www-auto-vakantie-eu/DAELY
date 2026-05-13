# React Native Migration Guide - DAELY Performance App

## ✅ Wat is al gedaan

### Stap 1: Project Setup
- ✅ Expo project gemaakt met React Native + Web support
- ✅ React Navigation geïnstalleerd
- ✅ Zustand, Firebase, Google GenAI geïnstalleerd
- ✅ TypeScript geconfigureerd

### Stap 2: Navigation
- ✅ Bottom tab navigation upgesteld met Expo Router
- ✅ Alle 6 screens aangemaakt (Home, Disciplines, Voeding, Mind, Community, Athlete)
- ✅ Home screen basis template gemaakt

### Stap 3: State Management
- ✅ AppContext gemaakt met alle centrale state
- ✅ Root layout wrapped met AppProvider
- ✅ Zustand gereed voor implementatie

---

## 📋 Volgende Stappen (In Volgorde)

### FASE 1: Basis Componenten (Priority)

#### 1. **Componenten omzetten**
Je huidige React web componenten moeten naar React Native:
- `Tailwind CSS` → `StyleSheet` of `NativeWind`
- `div` → `View`
- `button` → `Pressable` of `TouchableOpacity`
- `img` → `Image`

Aanbeveling: Installeer [NativeWind](https://www.nativewind.dev/) voor Tailwind support:
```bash
npm install nativewind
npm install --save-dev tailwindcss postcss
```

#### 2. **Icons omzetten**
Je huidige React componenten `<tab.icon className={...} />`:
- Ga naar `src/components/ui/Icons.tsx` in je oude app
- Zet ze om naar React Native icons met `expo-vector-icons` (al geïnstalleerd)
- Voorbeeld:
```tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';

<FontAwesome name="dumbbell" size={28} color="blue" />
```

#### 3. **Home Screen uitbouwen**
Voeg toe aan `app/(tabs)/index.tsx`:
- Carousel/Slider voor workouts
- Theme cards
- Activity dashboard
- Quick action buttons

#### 4. **Overige Screens uitbouwen**
- **Disciplines**: Muscle group selector, workout liste
- **Voeding**: Meal cards, nutrition tracking
- **Mind**: Meditation list, timer
- **Community**: User feed, social features
- **Athlete**: Settings, profile, stats

---

### FASE 2: Firebase Integration

Firestore/Authentication setup:
```tsx
// contexts/AppContext.tsx - voeg toe:
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  // Je config hier
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// In useEffect:
onAuthStateChanged(auth, (user) => {
  setIsLoggedIn(!!user);
});
```

---

### FASE 3: AI Chat Integration

Google Gemini setup in `contexts/AppContext.tsx`:
```tsx
const handleSendAiMessage = async (message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
  });
  // Handle response
};
```

---

### FASE 4: Platform-Specifieke Features

#### iOS/Android
- Push notifications: `expo-notifications`
- Device storage: `expo-file-system`
- Camera: `expo-camera`

#### Web
- Web-specific optimizations in `web/` folder
- PWA manifest

---

## 🔧 Commands

```bash
# Teruggaan naar project
cd c:\Development\daely-project\daely-rn

# Web starten
npm run web

# Android preview (requires emulator/device)
npm run android

# iOS preview (requires Mac + Xcode)
npm run ios

# Build for production
npm run build
```

---

## 📱 Platform-Specifieke Aanpassingen

### Windows & Web Development
Je werkt met Windows, dus:
- `npm run web` in VS Code browser
- Voor iOS testing: gebruik Expo Go app op je telefoon
- Voor Android: Emulator of fysiek device

---

## 🎨 Styling Migration

### Van Tailwind naar NativeWind:
```tsx
// OUD (Tailwind):
<div className="flex bg-white/80 backdrop-blur-3xl p-10 rounded-lg">
  
// NIEUW (NativeWind):
import { View } from 'react-native';
<View className="flex bg-white/80 backdrop-blur-3xl p-10 rounded-lg" />
```

---

## 📦 Essentiële Dependencies (al geïnstalleerd)

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "zustand": "^5.x",
  "firebase": "^12.x",
  "@google/genai": "^1.x",
  "react-i18next": "^16.x"
}
```

---

## 🚨 Veelgehoorde Problemen

### 1. **PowerShell execution policy**
```bash
# Use cmd instead:
cmd /c npm run web
```

### 2. **Tailwind not working**
```bash
npm install nativewind
npm install --save-dev tailwindcss postcss
```

### 3. **Icons not showing**
Zorg dat je `expo-vector-icons` gebruikt in plaats van custom SVG/PNG

### 4. **Context errors**
Zorg dat `<AppProvider>` je hele app wrapped in `app/_layout.tsx`

---

## 🎯 Prioriteit Roadmap

1. **Week 1**: Componenten omzetten, Home screen afmaken
2. **Week 2**: Firebase + Auth integratie
3. **Week 3**: AI Chat + alle screens afmaken
4. **Week 4**: Testing, bugfixes, production build

---

## 📞 Tips

- Ga naar [React Native docs](https://reactnative.dev/) voor component references
- Expo Router works like Next.js - file-based routing
- Test altijd met `npm run web` eerst voordat je naar native gaat
- Gebruik `console.log()` for debugging (Ctrl+J in web)

---

Je app is nu klaar voor omzetting! Start met de componenten in Fase 1. 🚀
