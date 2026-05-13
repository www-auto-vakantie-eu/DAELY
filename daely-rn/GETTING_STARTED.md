# Getting Started - React Native Version

## 🎯 Project Initialized ✅

Your DAELY Performance app is now a **cross-platform React Native** app with:
- ✅ Expo Router (file-based routing)
- ✅ React Navigation (bottom tab navigation)
- ✅ React Native Web support
- ✅ TypeScript
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ Firebase + Google Gemini
- ✅ AppContext for state management

---

## 🚀 Running Your App

### API Base URL (required for community content)

Create `.env` in `daely-rn` based on `.env.example` and set:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8081
```

For Android emulator use:

```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8081
```

For a physical phone use your machine LAN IP (example):

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.42:8081
```

### Web Version (Best for initial dev)
```bash
cd c:\Development\daely-project\daely-rn
npm run web
```

Then open http://localhost:8081 in your browser

### Android (Requires Android Emulator)
```bash
npm run android
```

### iOS (Requires Mac + Xcode)
```bash
npm run ios
```

---

## 📱 Project Structure

```
daely-rn/
├── app/                    # All screens & routing (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx       # Home screen
│   │   ├── disciplines.tsx # Disciplines screen
│   │   ├── nutrition.tsx   # Voeding screen
│   │   ├── mind.tsx        # Mind screen
│   │   ├── community.tsx   # Community screen
│   │   ├── athlete.tsx     # Athlete/Settings screen
│   │   └── _layout.tsx     # Tab navigation config
│   ├── _layout.tsx         # Root layout (AppProvider goes here)
│   └── modal.tsx
├── contexts/
│   └── AppContext.tsx      # State management (Zustand ready)
├── components/             # Reusable components
├── constants/              # Colors, theme, consts
├── hooks/                  # Custom hooks
└── tailwind.config.js      # Tailwind CSS config for NativeWind
```

---

## 🔧 Next Steps (Priority Order)

### 1. **Start with Web** (npm run web)
   - Easiest to debug
   - Can copy your existing React code

### 2. **Update Home Screen** (app/(tabs)/index.tsx)
   - Add carousel for workouts
   - Add theme cards
   - Add quick actions

### 3. **Convert Components**
   - Replace `<div>` with `<View>`
   - Replace Tailwind classes with NativeWind
   - Some components won't work (no `<a>`, `<table>`, etc)

### 4. **Add Firebase Auth**
   - See MIGRATION_GUIDE.md Phase 2

### 5. **Integrate AI Chat**
   - See MIGRATION_GUIDE.md Phase 3

---

## 🧩 Component Conversion Cheat Sheet

| Web (React) | React Native |
|---|---|
| `<div />` | `<View />` |
| `<span />` | `<Text />` |
| `<button />` | `<Pressable />` or `<TouchableOpacity />` |
| `<img />` | `<Image />` |
| `<input />` | `<TextInput />` |
| `<ScrollView />` | `<ScrollView />` (same) |
| Tailwind `className` | NativeWind `className` (same syntax!) |

---

## 🎨 Example: Converting one Component

### Before (React Web)
```jsx
<div className="flex justify-center items-center p-4 bg-blue-500 rounded-lg">
  <p className="text-white text-xl font-bold">Click Me</p>
</div>
```

### After (React Native)
```jsx
import { View, Text, Pressable } from 'react-native';

<Pressable className="flex justify-center items-center p-4 bg-blue-500 rounded-lg">
  <Text className="text-white text-xl font-bold">Click Me</Text>
</Pressable>
```

---

## ⚡ Quick Tips

- **Use NativeWind for styling** - it'll save you tons of time
- **Test on Web first** - faster than mobile simulation
- **Use `console.log()`** - press Ctrl+J in web dev tools
- **Hot reload** - changes save instantly in most cases
- **Screen size** - test responsive design with browser dev tools

---

## 📞 Troubleshooting

### App won't start?
```bash
npm run web
# Check terminal for errors
```

### Styles not applying?
- Make sure you're using `className` on NativeWind component
- Restart dev server

### Icons not showing?
- Check `app/(tabs)/_layout.tsx` for icon names
- Use expo-vector-icons icons only

---

## 🎓 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Router Docs](https://expo.github.io/router/)

---

**Happy coding! 🚀**
