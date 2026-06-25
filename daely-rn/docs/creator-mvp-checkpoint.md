# DAELY Creator MVP Checkpoint

## 1. Status

- Creator MVP foundation staat
- Test Creator login werkt
- Creator Dashboard is geherstructureerd
- Publieke creator profielpagina foundation staat
- DAELY Creators sectie in Community staat
- Geen productie-referral/payment/payout systeem
- Niets gepusht

## 2. Relevante commits

- `20af9f9` — `fix(themes): resolve premium theme scope errors` (Community + Nutrition hotfixes)
- `2b165c3` — `feat(creator): add test creator account foundation` (AppContext + Mijn + Dashboard)
- `b4c7abb` — `fix(auth): connect test creator login to creator account` (Login koppeling)
- `25dbfa7` — `feat(creator): improve creator dashboard structure` (Dashboard herstructurering)
- `9186222` — `feat(creator): add public creator profile foundation` (Publieke profielpagina)
- `d69bf15` — `feat(creator): improve creator visibility in community` (DAELY Creators sectie)

## 3. Testflow

**Login → Test Creator → Mila Creator → Mijn → Creator Dashboard → Community → Publiek Profiel**

- Test Creator op login activeert Mila Creator account
- Technisch `accountType` wordt gezet op `influencer`
- User-facing label is "DAELY Creator"
- Creator Dashboard is bereikbaar via Mijn tab (Creator Studio card)
- Community bevat DAELY Creators sectie met Mila Creator card
- Publiek profiel bereikbaar via `/community/creator/mila-creator`

## 4. Technische keuze accountType

- Technisch wordt `accountType: 'influencer'` gebruikt
- Dit is bewust gedaan om geen breaking AccountType-migratie te veroorzaken
- User-facing gebruiken we "DAELY Creator"
- Later kan eventueel een aparte `creator` rol worden onderzocht, maar niet nu

## 5. Mila Creator testdata

- Naam: Mila Creator
- accountType: `influencer`
- User-facing label: DAELY Creator
- Creator type: Athlete Creator
- Creator code: `DAELY-MILA`
- Referral link: `https://daely.app/invite/DAELY-MILA`
- Actieve betalende abonnees: 128
- Nieuwe abonnees deze maand: 34
- Gratis maanden: 7 (niet vergoed)
- Mislukte betalingen: 3 (niet vergoed)
- Reward rate: €0,99
- Verwachte maandvergoeding: €126,72

## 6. Creator Dashboard structuur

Het dashboard bestaat uit 7 MVP-blokken:

1. **Creator Identity** — Badge, naam, type, username, sport focus, bio, creator code
2. **Overzicht** — StatsGrid met 4 kaarten (actieve abonnees, nieuwe deze maand, maandvergoeding, reward rate)
3. **Link delen** — Referral link prominent met "Kopieer link" en "Delen" buttons (mock)
4. **Verdiensten** — Actieve betalende abonnees, gratis maanden, mislukte betalingen, expliciete berekening
5. **Groei** — Nieuwe abonnees deze maand met groeisamenvatting
6. **Privacy & regels** — Privacy safeguards en reward regels
7. **Binnenkort** — Compacte lijst van toekomstige features

## 7. Verdienmodel foundation

- Vergoeding is €0,99 per actieve betalende abonnee per maand
- Gratis maanden tellen niet mee voor vergoeding
- Mislukte betalingen tellen niet mee voor vergoeding
- Voorbeeldberekening: `128 × €0,99 = €126,72`
- Huidige waarden zijn mock/foundation data
- Geen echte payout of betaling

## 8. Privacygrenzen

- Creators zien alleen totalen en globale statistieken
- Geen persoonlijke gezondheidsdata
- Geen individuele gebruikerslijsten
- Geen ledenbeheer
- Geen facturatiegegevens
- Geen coach/trainer tools
- Geen Business Software data

## 9. Bewust niet gebouwd

- Geen echte referral tracking
- Geen echte payout/payment
- Geen facturatie
- Geen subscriber management
- Geen coach/trainer dashboard
- Geen Club App koppeling
- Geen Business Software koppeling
- Geen campagne analytics
- Geen officiële creator voorwaarden

## 10. Later / aanbevolen vervolgstappen

1. ~Publieke Creator profielpagina foundation~ ✅ (geïmplementeerd in commit `9186222`)
2. ~Creator zichtbaarheid in Community~ ✅ (geïmplementeerd in commit `d69bf15`)
3. Referral tracking foundation
4. Creator campagneprestaties
5. Payout status foundation
6. Juridische/financiële creator voorwaarden
7. Eventuele koppeling met DAELY Business Software voor echte financiële verwerking

## 11. Veiligheidsregels voor vervolgwerk

- Devin moet altijd starten met read-only audit
- Geen dubbele routes bouwen
- Geen bestaande routes/namen wijzigen zonder expliciete opdracht
- Sporters App, Business Software, Club App en Coach/Trainer gescheiden houden
- Creator blijft in beginfase onderdeel van Sporters App
- Echte financiële verwerking hoort later niet alleen in Sporters App

## 12. Technische bestanden

- `contexts/AppContext.tsx` — `activateTestCreatorAccount` functie en Mila Creator data
- `app/(auth)/login.tsx` — Test Creator button koppeling
- `app/(tabs)/mijn.tsx` — Creator Studio card en test activatie
- `app/creator-dashboard.tsx` — Dashboard met 7 blokken
- `app/community/creator/[id].tsx` — Publieke creator profielpagina
- `app/(tabs)/community.tsx` — DAELY Creators sectie en filters