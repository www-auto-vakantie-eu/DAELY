# Poort wijzigen voor Creator preview

Wil je de app op een andere poort draaien (bijvoorbeeld voor een Creator preview op http://localhost:8085), pas dan de `PORT` waarde aan in je `.env` bestand:

```
PORT=8085
```

Start daarna gewoon met `npm run dev`. De app draait dan op de gekozen poort.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DAELY — Elite Multi-Sport Performance System

**DAELY** is a comprehensive performance platform combining mobile app (Expo React Native) and web app (React + Node.js) for tracking sports, nutrition, mind/recovery, and community engagement.

---

## Quick Start

### Prerequisites
- Node.js 18+

### Installation & Running

1. Install root dependencies:
   ```bash
   npm install
   npm --prefix daely-rn install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY
   ```

3. Run the mobile app (default):
   ```bash
   npm run app
   ```
   - Scan QR code with **Expo Go** app (iOS/Android)
   - Or press `w` for web preview, `a` for Android, `i` for iOS

4. Run web variant:
   ```bash
   npm run web:dev
   ```

---

## Sprint Summary (March 27, 2026)

### ✅ Step 1: Stabilized App Startup
- ✅ Root scripts default to **Expo mobile** (not web)
- ✅ `npm run app` → Expo dev server
- ✅ `npm run web:dev` → Web variant (explicit)
- ✅ `start-dev.cmd` updated to launch app mode
- **Result:** No more accidental web launches; predictable startup

### ✅ Step 2: DAELY Rebrand Complete
- ✅ All `AURA` → `DAELY` renamed project-wide
- ✅ `auraPoints` → `daelyPoints` (all stores, screens, context)
- ✅ Theme constants, scheme, config files updated
- ✅ **Backward compatible:** old `auraPoints` users auto-migrate with zero data loss
- ✅ localStorage fallback for legacy `aura_account_country` key
- **Result:** Seamless rebrand; no user data loss

### ✅ Step 3: Settings UX Improved
- ✅ Settings organized into 4 sections: **Account** | **App** | **Privacy** | **Meldingen**
- ✅ Tab visibility toggles (Workouts, Progress, Plan, Habits) use **draft/save pattern**
- ✅ "Undo" reverts to last saved; "Save" only enabled on changes
- **Result:** Fewer accidental toggles; clearer UX flow

### ✅ Step 5: Quality & Security Hardened
- ✅ **Firestore rules** tightened:
  - `daelyPoints`: capped 0–1,000,000 (prevent overflow)
  - `durationMinutes`: enforced 1–1440 min (valid workout duration)
  - Permission isolation: users read/write own data only; admins override
- ✅ **Client-side guards:** all point calculations clamped (no negative/overflow)
- ✅ **Checklists:**
  - `QUALITY_CHECKLIST.md`: 5 critical flows + validation rules
  - `TESTING_GUIDE.md`: 8 test scenarios with expected outcomes
- **Result:** Secure, validated, predictable point system

---

## Project Structure

```
daely-project/
├── daely-rn/                    # React Native app (Expo)
│   ├── app/                     # Routes (Expo Router)
│   ├── components/              # Reusable UI components
│   ├── constants/               # Theme, icons, config
│   ├── contexts/                # App state providers
│   ├── hooks/                   # Custom React hooks
│   ├── app.config.ts            # Expo config (scheme: daelyrn)
│   └── package.json
├── src/                         # Web app (React + TypeScript)
│   ├── components/screens/      # Account, Disciplines, Nutrition, etc.
│   ├── context/                 # AppContext (global state)
│   ├── store/                   # Zustand stores
│   ├── services/                # API, Firebase, content
│   ├── hooks/                   # Custom hooks
│   ├── data/                    # Static data (themes, disciplines)
│   └── firebase.ts              # Firebase init
├── server.ts                    # Node.js + Express + Vite
├── firestore.rules              # Firestore security rules
├── QUALITY_CHECKLIST.md         # Critical flows checklist
├── TESTING_GUIDE.md             # Manual testing guide
└── README.md                    # This file
```

---

## Key Technologies

- **Frontend:** React 19, TypeScript, Tailwind CSS, Nativewind
- **Mobile:** Expo, React Native, Expo Router
- **Backend:** Node.js, Express, Vite
- **Database:** Firebase (Auth + Firestore)
- **AI:** Google Gemini API (server-side)
- **State:** Zustand, React Context

---

## Available Scripts

```bash
npm run app              # Start Expo dev server (mobile)
npm run dev / start      # Alias to app (default)
npm run web:dev          # Start web server + Vite
npm run android          # Build for Android emulator
npm run ios              # Build for iOS simulator
npm run build            # Build web app (vite build)
npm run preview          # Preview production build
npm run lint             # Lint code (if configured)
```

---

## Deployment

**For comprehensive step-by-step production launch instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).**

### Quick Checklist
- [ ] Run all tests in `TESTING_GUIDE.md`
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Test on iOS/Android devices
- [ ] QA sign-off on critical flows
- [ ] Environment variables configured (Gemini API, Firebase creds)
- [ ] Monitor Firestore rule violations

### Deployment Steps (Summary)
1. **Web:** `npm run build` → Deploy `dist/` to Firebase Hosting
2. **Mobile:** `eas build --platform ios/android` → Submit to App Store / Play Store
3. **Backend:** Push to hosting platform (Heroku, Render, Railway)
4. **Firestore:** `firebase deploy --only firestore:rules`
5. **Monitor:** Check Firestore costs, user errors, app store reviews

---

## Documentation & References

- **Quality & Security:** See [QUALITY_CHECKLIST.md](QUALITY_CHECKLIST.md)
- **Testing:** See [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md) — step-by-step production launch guide
- **Mobile App:** See [daely-rn/README.md](daely-rn/README.md)
- **Firebase Setup:** See [firebase-blueprint.json](firebase-blueprint.json)

---

## Notes

- AI chat runs server-side at `/api/ai/chat` (Gemini key stays secure)
- `npm run dev` / `npm start` default to Expo mobile flow
- To run web explicitly: `npm run web:dev` (not `npm run dev`)
- Firestore rules enforce user isolation + admin overrides
- Points system capped: min 0, max 1,000,000
