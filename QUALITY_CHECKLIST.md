# Quality & Security Checklist

## Critical User Flows

### 1. Authentication & Login
- [ ] User can sign up with email and password
- [ ] User receives verification email (if required)
- [ ] User can log in with correct credentials
- [ ] Login fails with incorrect email/password
- [ ] User session persists after browser refresh
- [ ] User can sign out and session clears
- [ ] Password reset flow works and email is sent
- [ ] Duplicate email registration is prevented

**Guard Rails:**
- Email validation at sign-up (format check)
- Password minimum requirements enforced (8+ chars, mix of case/numbers)
- Rate limiting on failed login attempts (prevent brute force)
- Secure session tokens stored in httpOnly cookies

---

### 2. Settings & Preferences
- [ ] User can toggle tab visibility (workout, progress, plan, habits)
- [ ] Visibility changes save and persist after browser refresh
- [ ] User can change language preference
- [ ] User can change theme without breaking UI
- [ ] User can update content gender preference (none/male/female)
- [ ] Settings permissions: only own user can modify own settings
- [ ] Admin can view/modify other user settings (if needed)

**Guard Rails:**
- All visibility toggles stored in user doc + validated server-side
- Language must be one of: EN, NL, DE, ES, FR
- Theme ID must exist in THEMES list
- Gender pref must be one of: 'none', 'man', 'woman'

---

### 3. Workout Completion
- [ ] User can start a workout session
- [ ] User can log sets/reps/weight for each exercise
- [ ] User can mark exercises complete
- [ ] User receives DAELY points on workout finish (50 base + 10 per 10 mins)
- [ ] Streak updates if workout completed yesterday (or day before at latest)
- [ ] Focus mode penalty deducts points if user leaves app >5 seconds
- [ ] Workout history saves with all details (exercises, sets, volume, calories)
- [ ] Users cannot manually edit other user's workout history

**Guard Rails:**
- `daelyPoints` cannot go below 0
- `daelyPoints` limited to reasonable max (e.g., 1,000,000 to prevent overflow)
- Workout duration must be >= 1 minute and < 24 hours
- All exercise data must pass schema validation before save
- Duplicate workout entries prevented (timestamp-based check)

---

### 4. Data Integrity & Migration
- [ ] Users with legacy `auraPoints` auto-migrate to `daelyPoints` on first load
- [ ] No data loss during migration
- [ ] Web app localStorage keys fallback from `daely_account_country` → `aura_account_country`
- [ ] New users get `daelyPoints: 0` on account creation

**Guard Rails:**
- Migration is one-time, idempotent (safe to run multiple times)
- Fallback order for localStorage prevents gaps
- Audit log tracks migration if needed (optional: log to Backend)

---

### 5. Admin & Role-Based Access
- [ ] Admin can read any user's data
- [ ] Admin access works only via `users/{uid}.role == 'admin'`
- [ ] Non-admin users CANNOT read other users' data
- [ ] Non-admin users CANNOT escalate their role
- [ ] Delete user operations only allowed for admin

**Guard Rails:**
- `isAdmin()` function uses role-based access only
- UID must match auth.uid for all read/write (except admin reads)
- createdAt is immutable; cannot be changed after creation

---

## Firestore Rules Validation

### User Document
✅ Fields validated:
- `uid`: string, 1–127 chars, immutable
- `email`: valid email format, immutable
- `role`: 'admin' | 'user' only
- `daelyPoints`: number, >= 0 (NEW: capped at 1,000,000)
- `streak`: number, >= 0
- `displayName`: optional, <= 100 chars
- `followedCreators`: list, <= 100 items
- `activeHomeCreatorId`: optional, <= 128 chars or null

### Workout History
✅ Fields validated:
- `userId`: matches auth.uid, immutable
- `workoutId`: 1–127 chars
- `title`: 1–255 chars
- `durationMinutes`: >= 1, <= 1440 (24 hours)
- `completedAt`: timestamp, immutable
- `caloriesBurned`: optional, >= 0

---

## Testing Recommendations

### Unit Tests Needed
1. **Points & Streak Logic** (`src/context/AppContext.tsx`)
   - Test points calculation: 50 + (duration / 10) * 10
   - Test streak increment logic (consecutive days)
   - Test points floor (cannot go below 0)

2. **Data Migration** (`src/context/AppContext.tsx`)
   - Test `auraPoints` → `daelyPoints` migration
   - Test idempotence (running migration twice is safe)
   - Test fallback for legacy localStorage keys

3. **Firestore Rules** 
   - Test user can read own doc
   - Test user CANNOT read other user's doc
   - Test invalid data is rejected (e.g., daelyPoints: -100)
   - Test admin can override read/write restrictions

### Manual Testing Checklist
- [ ] Fresh account creation → verify `daelyPoints: 0` in Firestore
- [ ] Complete workout → verify points awarded and Firestore updated
- [ ] Toggle tab visibilities in settings → verify state persists
- [ ] Switch language, theme → verify UI updates and Firestore saves
- [ ] Old user with `auraPoints` logs in → verify migration occurs
- [ ] Sign in on different browser → verify session works (or requires re-auth)
- [ ] Open admin dashboard → verify can see other users (if implemented)

---

## Security Hardening TODO

1. **Rate Limiting:**
   - [ ] Limit login attempts (5 per minute per email)
   - [ ] Limit workout submissions (1 per minute per user)
   - [ ] Limit settings updates (10 per minute per user)

2. **Input Sanitization:**
   - [ ] Sanitize displayName to prevent XSS
   - [ ] Validate all strings before rendering in UI
   - [ ] Escape URLs in photoURL fields

3. **Audit Logging:**
   - [ ] Log all user account modifications (email change, role change)
   - [ ] Log all admin actions (delete, modify)
   - [ ] Consider log retention policy

4. **Backup & Recovery:**
   - [ ] Regular Firestore backups enabled
   - [ ] Point-in-time recovery tested
   - [ ] Data export tested

---

## Sign-Off

- **Completed By:** [Agent]
- **Date:** March 27, 2026
- **Status:** In Progress
