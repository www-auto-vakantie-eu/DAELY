# Quick Testing Guide for Critical Flows

Use this guide to manually test the most important user journeys. Each flow should take 2-5 minutes.

---

## Test 1: Login & Account Creation (5 min)

**Objective:** Verify authentication works and new users get proper setup.

**Steps:**
1. Go to the app and clear any existing login
2. Click "Sign Up"
3. Enter email: `testuser.daely@example.com` (or unique variant)
4. Enter password: `TestPassword123` (min 8 chars, mixed case/numbers)
5. Verify account is created and you're logged in
6. Check Firestore console: `users/{uid}` doc should have:
   - `uid`, `email`, `role: 'user'`, `daelyPoints: 0`, `streak: 0`
   - `createdAt`, `updatedAt` timestamps
7. Close app, reopen → session should persist
8. Log out → session should clear

**Expected Outcomes:**
- ✅ New doc created in `users` collection
- ✅ Default `daelyPoints: 0`
- ✅ Session persists across refresh
- ✅ Logout clears session

---

## Test 2: Settings & Tab Visibility (3 min)

**Objective:** Verify settings save, visibility toggles work, and draft/save pattern is clear.

**Steps:**
1. Go to Settings (⚙️ icon)
2. Click "Account Configuratie"
3. Click "Visuele Instellingen"
4. Toggle "Mijn Workouts" OFF
5. Toggle "Mijn Voortgang" OFF
6. Note: toggles should change appearance but not all UI should crash
7. Click "Opslaan" button (should be enabled)
8. Go back to Home → "Mijn Workouts" and "Mijn Voortgang" sections should be hidden
9. Go back to Settings > Visuele Instellingen
10. Verify toggles show correct state (both OFF)
11. Toggle both back ON and click "Opslaan"

**Expected Outcomes:**
- ✅ Draft toggles update immediately
- ✅ "Opslaan" button only active when changes exist
- ✅ After save, Home hides/shows sections correctly
- ✅ State persists after browser refresh
- ✅ No errors in console

---

## Test 3: Workout Completion & Points (10 min)

**Objective:** Verify workout logging, points calculation, and focus mode penalty.

**Steps:**
1. Go to Home and find a workout
2. Click "Start" on any workout
3. For each exercise:
   - Enter weight (e.g., 20)
   - Enter reps (e.g., 8)
   - Toggle "Set Complete" checkbox
   - Rest timer should start (90 sec default)
4. After 2–3 exercises, click "Klaar" (finish)
5. You should see workout summary with:
   - Duration shown
   - Calories estimated
   - Completed sets count
   - **Points earned should display**
6. Go to Settings > Account Configuratie > Profile section
7. Check XP value at top (should have increased)
8. Check Firestore `users/{uid}/workoutHistory` → new doc should exist with:
   - `userId`, `workoutId`, `title`, `durationMinutes`, `completedAt`, `caloriesBurned`

**Expected Outcomes:**
- ✅ Workout saved to Firestore
- ✅ Points calculated: 50 + (duration / 10) * 10
- ✅ Points capped at 0 (min) and 1,000,000 (max)
- ✅ XP display updates
- ✅ No negative points possible
- ✅ Firestore doc validated (durationMinutes: 1–1440)

---

## Test 4: Data Migration (Legacy auraPoints → daelyPoints)

*Skip this test if you don't have a legacy account or Firestore access.*

**Objective:** Verify old users with `auraPoints` field auto-migrate to `daelyPoints`.

**Steps:**
1. In Firestore Console, manually create/edit a test user doc:
   ```
   uid: "legacy-user-id"
   email: "legacy@example.com"
   role: "user"
   auraPoints: 500        // OLD FIELD
   createdAt: (timestamp)
   updatedAt: (timestamp)
   ```
2. Log in as that user
3. Go to Settings > Profile
4. Check XP = 500 (migrated from `auraPoints`)
5. Refresh page
6. Check Firestore doc again → should now have:
   - `daelyPoints: 500` (NEW FIELD)
   - `auraPoints` field may remain or be gone (either is OK)

**Expected Outcomes:**
- ✅ Old `auraPoints` value is read if no `daelyPoints` exists
- ✅ UI displays correct value
- ✅ `daelyPoints` is written on first load (one-time migration)
- ✅ No data loss

---

## Test 5: Browser Refresh & Session Persistence (2 min)

**Objective:** Verify state survives page refresh and offline resilience.

**Steps:**
1. Log in and complete settings changes (e.g., theme, visibility)
2. Make a note of your XP value
3. Press F5 or refresh the page
4. Verify:
   - You're still logged in
   - Tab visibility choices are unchanged
   - Theme is unchanged
   - XP value is the same
5. Open DevTools → Network tab → set to "Offline"
6. Try viewing Home, settings, etc. → should still render (cached)
7. Turn offline OFF and refresh

**Expected Outcomes:**
- ✅ Session survives refresh
- ✅ Settings hydrate from Firestore/localStorage
- ✅ App gracefully degrades offline
- ✅ UI doesn't show stale data conflicts

---

## Test 6: Points Boundary & Edge Cases (3 min)

**Objective:** Verify points never go negative and cap at 1M.

**Steps:**
1. Log in as test user
2. Go to any modal where you can lose points (if focus mode is enabled, trigger it)
3. Trigger point loss to approach 0:
   - If you have 5 XP and lose 10, you should end up at 0 (not negative)
4. Check Firestore: `daelyPoints` should be >= 0
5. In browser console, try:
   ```js
   // This should fail on server validation:
   db.collection('users').doc('YOUR_UID').update({ daelyPoints: -100 })
   ```
   → Should get a permission/validation error

**Expected Outcomes:**
- ✅ Points cannot go below 0
- ✅ Firestore rejects invalid negative values
- ✅ Client-side clamping works (prev => Math.max(0, ...))
- ✅ No negative XP in UI or database

---

## Test 7: Firestore Rules & Permissions (5 min)

*Requires Firestore Console access.*

**Objective:** Verify users cannot read/write other users' data.

**Steps:**
1. Log in as User A
2. Note their UID: `uid-a`
3. In Firestore Console, try to read User B's doc:
   - Path: `users/uid-b`
   - You should get "Missing or insufficient permissions"
4. Try to update another user's `daelyPoints`:
   ```js
   db.collection('users').doc('uid-b').update({ daelyPoints: 9999 })
   ```
   → Should fail with permission error
5. Log in as User B and confirm their `daelyPoints` is unchanged
6. As User A, verify you CAN read and write your own doc

**Expected Outcomes:**
- ✅ Cross-user reads blocked by Firestore rules
- ✅ Cross-user writes blocked
- ✅ Own user doc is readable and writable
- ✅ Invalid data is rejected (e.g., negative points, invalid email)

---

## Test 8: Admin Override (If implemented)

*Skip if not yet implemented.*

**Objective:** Verify admins can bypass user restrictions.

**Steps:**
1. Set an admin flag on User A's account in Firestore: `role: 'admin'`
2. Log in as User A
3. Try to read User B's doc via API or console
4. Admin should have access (in code, via `isAdmin()` helper)

**Expected Outcomes:**
- ✅ Admin can read other users' docs
- ✅ Regular users still cannot
- ✅ Admin role is enforced in Firestore rules

---

## Troubleshooting

### Points not updating?
- Check browser console for errors
- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check user's auth state in AppContext

### Settings not persisting?
- Check localStorage is not cleared (browser > settings)
- Verify Firestore write completed (check Network tab)
- Ensure user is authenticated before update

### Offline not working?
- IndexedDB cache might be disabled; check browser settings
- Firestore offline persistence requires setup in initializer
- In web, offline is limited (requires explicit config)

### Migration not happening?
- Check old doc has `auraPoints` field
- Verify user is logged in and triggers `onSnapshot` in AppContext
- Check browser console for migration errors

---

## Sign-Off

- **Tester:** [Your Name]
- **Date:** ___________
- **All Tests Passed:** ☐ YES   ☐ NO
- **Issues Found:** (list here)

