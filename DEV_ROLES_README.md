# Rollen & Feature-ontwikkeling

## Gebruikersrollen
- **user**: Sporters/gebruikers
- **influencer**: Influencers
- **partner**: Partners
- **event_manager**: Event managers

## Code structuur
- `src/components/user/` — Componenten alleen voor sporters
- `src/components/admin/` — Componenten alleen voor influencers/partners/event managers
- `src/components/OnlyFor.tsx` — Wrapper om content te tonen aan specifieke rollen

## Feature toevoegen voor een specifieke rol
1. Maak een component aan in de juiste map (`user` of `admin`).
2. Gebruik de `OnlyFor`-component om content te tonen aan de juiste rol(len):
   ```tsx
   <OnlyFor roles={["user"]}>
     {/* Alleen voor sporters */}
   </OnlyFor>
   <OnlyFor roles={["influencer", "partner", "event_manager"]}>
     {/* Alleen voor speciale rollen */}
   </OnlyFor>
   ```
3. Geef in je commit/pull request of prompt altijd aan voor wie de wijziging bedoeld is.

## Testen
- Test altijd met accounts van verschillende rollen.
- Controleer dat features niet zichtbaar zijn voor de verkeerde doelgroep.

## Communicatie
- Geef in prompts en code duidelijk aan voor wie een feature bedoeld is.
- Vraag om voorbeelden als je twijfelt.

---
Vragen? Check deze README of vraag het in het team!
