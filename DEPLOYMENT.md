# Deployment Guide — DAELY Launch

This guide covers deployment to production for both mobile (iOS/Android) and web.

---

## Pre-Launch Checklist (1–2 days before)

### Code Quality
- [ ] All critical flows tested (see `TESTING_GUIDE.md`)
- [ ] No TypeScript errors: `npx tsc --noEmit` in root and `daely-rn/`
- [ ] Linting passes: `npm run lint` (if configured)
- [ ] Console clean: no warnings or errors
- [ ] Git commits clean and descriptive

### Security
- [ ] Firestore rules deployed: `firebase deploy --only firestore:rules`
- [ ] Firebase config verified (no test/staging credentials in production)
- [ ] Gemini API key rotated if needed
- [ ] Environment variables set in production environment
- [ ] CORS policies checked (if applicable)

### Data
- [ ] Database backup created
- [ ] Test migration scenario runs cleanly (old `auraPoints` → `daelyPoints`)
- [ ] Firestore test doc validates against rules

### Testing
- [ ] QA sign-off on critical flows:
  - Login/signup
  - Settings & tab visibility
  - Workout completion & points
  - Focus mode penalty
  - Data persistence across refresh
- [ ] Tested on real devices:
  - iOS 14+ (if targeting App Store)
  - Android 6+ (if targeting Play Store)

---

## Step 1: Prepare Production Build

### Web App

```bash
# From project root
npm run build
```

Expected output:
- `dist/` folder created
- No errors in build log
- All assets bundled and minified

### Mobile App (Expo)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login once
eas login

# From daely-rn/ (recommended managed workflow)
eas build --platform ios --profile default
eas build --platform android --profile default
```

---

## Step 2: Deploy Backend Server

### Option A: Firebase Hosting + Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy web app
firebase deploy --only hosting

# View logs
firebase functions:log
```

### Option B: Traditional VPS / Container (Heroku, Render, Railway, etc.)

1. **Build Docker image:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm ci
   EXPOSE 8081
   CMD ["npm", "run", "start"]
   ```

2. **Deploy to platform:**
   ```bash
   # Heroku example
   heroku login
   heroku create daely-production
   git push heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set GEMINI_API_KEY=sk-...
   heroku config:set FIREBASE_PROJECT_ID=daely-prod
   ```

---

## Step 3: Deploy Mobile Apps

### iOS to Apple App Store

1. **Prepare:**
   - Ensure Apple Developer account is active
   - Apps require provisioning profiles and certificates
   - Update `app.config.ts` with correct bundle identifier

2. **Build & Submit (Expo EAS):**
   ```bash
   eas build --platform ios --profile default
   eas submit --platform ios
   # Follow prompted steps
   ```

3. **Manual Process (Advanced):**
   - Export `.ipa` from Xcode
   - Upload to App Store Connect
   - Fill metadata, screenshots, description
   - Submit for review (usually 1–3 days)

### Android to Google Play Store

1. **Prepare:**
   - Android Developer account active ($25 one-time fee)
   - Signing keystore configured
   - Update `app.config.ts` with correct package name

2. **Build & Submit (Expo EAS):**
   ```bash
   eas build --platform android --profile default
   eas submit --platform android
   # Follow prompted steps
   ```

3. **Manual Process (Advanced):**
   - Export `.aab` (Android App Bundle) from Android Studio
   - Upload to Google Play Console
   - Add store listing, screenshots, description
   - Submit for review (typically 1–3 hours approval)

---

## Step 4: Verify Deployments

### Web App
```bash
curl https://your-domain.com/
# Should return 200 OK with HTML content

# Test API endpoint
curl https://your-domain.com/api/ai/chat -X POST
# Should return valid Gemini response or auth error
```

### Mobile Apps
- Download from Test Flight (iOS) or Open Testing (Android)
- Test critical flows:
  - Log in
  - Complete workout
  - Check XP increased
  - Toggle settings
  - Toggle tab visibility

### Firestore
```bash
# In Firebase Console:
# 1. Check Rules are deployed (should show timestamp)
# 2. Check first user doc created with correct schema
# 3. Try cross-user read (should fail)
```

---

## Step 5: Monitor & Rollback

### Real-Time Monitoring

1. **Firebase Console:**
   - Firestore usage (reads/writes, costs)
   - Authentication users created
   - Rule violations

2. **Server Logs:**
   - Check for errors in server logs
   - Monitor Gemini API quota
   - Watch for anomalies

3. **Client-Side Errors:**
   - Set up Sentry or Rollbar for React error tracking
   - Monitor browser/app crash reports

### Rollback Procedure

**If critical issue found:**

1. **Web:** Deploy previous build
   ```bash
   firebase hosting:rollback
   # or manually deploy previous dist/
   ```

2. **Mobile:** 
   - Deprecate current build in store
   - Push hotfix or previous version
   - Notify users in-app or via push notification

3. **Backend:**
   ```bash
   git revert <problematic-commit>
   git push  # CI/CD should auto-deploy
   ```

4. **Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules  # Deploy backup rules
   ```

---

## Step 6: Post-Launch (First 24–48 hrs)

### Active Monitoring
- [ ] Monitor server CPU/memory usage
- [ ] Check database read/write rates
- [ ] Track error rates (console errors, API failures)
- [ ] Monitor Firebase costs (especially Firestore)
- [ ] Check user feedback channels (support email, in-app reports)

### First Bug Response
- [ ] Acknowledge issue internally
- [ ] Reproduce locally or in staging
- [ ] Fix & test thoroughly (especially Firestore rules!)
- [ ] Deploy hotfix
- [ ] Notify affected users if needed

### User Communication
- [ ] Send launch announcement email
- [ ] Share feature highlights
- [ ] Provide support contact info
- [ ] Monitor app store reviews

---

## Long-Term Ops

### Weekly
- [ ] Review Firestore usage & costs
- [ ] Check for rule violations or permission errors
- [ ] Monitor app store ratings/reviews
- [ ] Backup Firestore data

### Monthly
- [ ] Performance review (load times, API latency)
- [ ] Security audit (check access logs, new vulnerabilities)
- [ ] Plan next feature release based on user feedback

---

## Troubleshooting Common Issues

### "Firestore rules reject my writes"
- Check Firestore Console > Rules > Test Rules
- Verify request matches rule conditions
- Ensure request.auth.uid matches user doc ID
- Check data schema against validation rules

### "daelyPoints showing 0 for migrated users"
- Verify old doc had `auraPoints` field
- Check migration code in AppContext onSnapshot
- Manually trigger update: `setDaelyPoints(data.auraPoints)` on first load

### "Web app not loading"
- Check Firebase hosting deployment: `firebase hosting:sites`
- Verify CORS settings if calling external APIs
- Check network tab for 404/500 errors
- Ensure environment variables are set

### "Mobile app crashes on startup"
- Check iOS/Android build logs for native errors
- Verify Expo SDK version compatibility
- Check Firebase config in `app.config.ts`
- Try clearing app cache and rebuilding

### "High Firestore costs"
- Review rule validators (may be inefficient queries)
- Check for runaway subscriptions in listeners
- Implement pagination/limits on large collections
- Consider denormalizing data to reduce reads

---

## Support & Escalation

**For critical issues:** Escalate to lead engineer immediately.

- **Firestore outage:** Check Firebase Status page
- **App Store rejection:** Review Apple guidelines; resubmit with fixes
- **Security vulnerability:** Disable affected feature; deploy patch urgently

---

## Sign-Off

- **Deployment Lead:** ___________________
- **Date:** ___________________
- **approved by:** ___________________

