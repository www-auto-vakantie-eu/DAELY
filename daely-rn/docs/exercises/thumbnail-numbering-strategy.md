# DAELY Exercise Thumbnail Numbering Strategy

## 1. Status

De huidige status van exercise thumbnail assets:

- **Open asset wijzigingen**: Er staan open exercise asset wijzigingen die losstaan van Creator MVP
- **Oude assets**: Oude `assets/images/exercises/fitness/fitness-*.png` assets staan als deleted in git (200+ bestanden)
- **Nieuwe assets**: Nieuwe assets staan untracked onder:
  - `assets/images/exercises/fitness/Mannen/` — 312 bestanden
  - `assets/images/exercises/fitness/Vrouwen/` — 182 bestanden
- **Totaal nieuwe assets**: 494 bestanden
- **Manifest status**: Er is nog geen centraal manifest
- **Code status**: `app/discipline/[slug].tsx` gebruikt veel hardcoded `require()` verwijzingen
- **Content-audience**: `lib/content-audience.ts` bestaat al, maar wordt nog niet gebruikt voor thumbnails

**Belangrijk**: Deze documentatie verandert nog niets aan code of assets. Het is een strategisch document voor toekomstige implementatie.

## 2. Doel

Het doel van dit nummersysteem is:

- **Schaalbare thumbnailstructuur**: Eenvoudig uitbreidbaar naar andere disciplines (running, mind, etc.)
- **Korte consistente bestandsnamen**: Vermijden van lange beschrijvende Nederlandse namen
- **Gender/audience ondersteuning**: Ondersteuning voor male/female varianten met fallback
- **Minder foutgevoelige hardcoded paden**: Centrale manifestlaag in plaats van verspreide requires
- **Manifest als centrale laag**: Onderkoppeling van oefeningen en assets voor betere onderhoudbaarheid

## 3. Gekozen Mapstructuur

Gebruik voorlopig de bestaande Nederlandse mapnamen:

```text
assets/images/exercises/fitness/Mannen/
assets/images/exercises/fitness/Vrouwen/
```

**Reden voor deze keuze**:

- Nederlandse mappen sluiten aan bij huidige open assetstructuur
- Minimale migratie-impact op bestaande code
- Behoudt Nederlandse gebruikerservaring
- Later kan eventueel naar `male/` en `female/` migreerd worden, maar nu vermijden we extra migratierisico

**Toekomstige optie**: Als gewenst kan later gemigreerd worden naar volledig Engelse structuur (`male/`, `female/`), maar dit is niet noodzakelijk voor huidige implementatie.

## 4. Bestandsnaamstructuur

Gebruik de volgende structuur:

```text
m-01-001.png
f-01-001.png
```

Waarbij:

- **Eerste karakter** (`m`/`f`):
  - `m` = Mannen / male
  - `f` = Vrouwen / female
- **Tweede deel** (`01`): Spiergroepcode (zie sectie 5)
- **Derde deel** (`001`): Volgnummer binnen spiergroep (3 cijfers voor sorteerbaarheid)

**Voordeel van deze structuur**:

- Kort en consistent
- Sorteerbaar op naam
- Direct leesbaar (gender + spiergroep + volgnummer)
- Internationaal uitbreidbaar
- Makkelijk te scripten voor bulk-operaties

## 5. Spiergroepcodes

De spiergroepcodes zijn als volgt gedefinieerd:

| Code | Spiergroep | Beschrijving |
|------|------------|--------------|
| `01`  | borst      | Borstspieren |
| `02`  | biceps     | Biceps brachii |
| `03`  | triceps    | Triceps brachii |
| `04`  | schouders  | Deltoid spieren |
| `05`  | bovenrug   | Latissimus dorsi, trapezius |
| `06`  | onderrug   | Erector spinae |
| `07`  | buik-core  | Rectus abdominis, obliques |
| `08`  | billen-glutes | Gluteus spieren |
| `09`  | benen      | Quadriceps, hamstrings, calves |

**Uitbreidbaarheid**: Codes zijn extensief voor toekomstige spiergroepen (bijv. `10` voor calves-specific, etc.)

## 6. Voorbeelden

Concrete voorbeelden van de nieuwe bestandsnamen:

```text
assets/images/exercises/fitness/Mannen/m-01-001.png
assets/images/exercises/fitness/Mannen/m-05-012.png
assets/images/exercises/fitness/Vrouwen/f-01-001.png
assets/images/exercises/fitness/Vrouwen/f-09-014.png
```

**Interpretatie**:

- `m-01-001.png`: Male, borst, thumbnail 001
- `m-05-012.png`: Male, bovenrug, thumbnail 012
- `f-01-001.png`: Female, borst, thumbnail 001
- `f-09-014.png`: Female, benen, thumbnail 014

## 7. Manifeststrategie

Er zal later een TypeScript manifest komen op de volgende locatie:

```
constants/exercise-thumbnail-manifest.ts
```

### Waarom TypeScript beter is dan JSON:

- **`require()` ondersteuning**: TypeScript ondersteunt React Native static requires
- **Type safety**: Compile-time validatie van manifest structuur
- **Fallbacklogica**: Kan helperfuncties bevatten voor complexe fallback logic
- **Betere controle**: Meer controle in React Native/Expo omgeving
- **Documentatie**: Kan comments en inline documentatie bevatten

### Manifeststructuur voorbeeld:

```typescript
import type { ImageSourcePropType } from 'react-native';

export type ExerciseThumbnailGender = 'male' | 'female';

export type ExerciseThumbnailMuscleGroup =
  | 'borst'
  | 'biceps'
  | 'triceps'
  | 'schouders'
  | 'bovenrug'
  | 'onderrug'
  | 'buik-core'
  | 'billen-glutes'
  | 'benen';

export interface ExerciseThumbnailEntry {
  muscleGroup: ExerciseThumbnailMuscleGroup;
  male: string | ImageSourcePropType;
  female?: string | ImageSourcePropType; // Optioneel
}

export const exerciseThumbnailManifest: Record<string, ExerciseThumbnailEntry> = {
  'lat-pulldown-close-grip': {
    muscleGroup: 'bovenrug',
    male: require('@/assets/images/exercises/fitness/Mannen/m-05-001.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-05-001.png'),
  },
  'barbell-bench-press': {
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-001.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-001.png'),
  },
};
```

### Helperfunctie voor manifest:

```typescript
export function getExerciseThumbnail(
  exerciseId: string,
  audience: 'male' | 'female' = 'male'
): string | ImageSourcePropType {
  const entry = exerciseThumbnailManifest[exerciseId];
  if (!entry) {
    // Return default fallback placeholder
    return require('@/assets/images/exercises/fitness/Mannen/m-00-000.png');
  }

  // Probeer audience-specifiek, fallback naar male
  if (audience === 'female' && entry.female) {
    return entry.female;
  }
  return entry.male;
}
```

## 8. Fallbackstrategie

De fallbackstrategie is als volgt gedefinieerd:

1. **Als female ontbreekt**: Fallback naar male variant
2. **Als male ontbreekt**: Fallback naar female variant
3. **Als beide ontbreken**: Fallback naar algemene placeholder thumbnail
4. **Placeholder thumbnail**: Een neutrale placeholder zoals `m-00-000.png` of `f-00-000.png`
5. **Rapportage**: Missende thumbnails moeten later in rapportage zichtbaar worden voor aanvulling

**Implementatie**:

```typescript
export function getExerciseThumbnailWithFallback(
  exerciseId: string,
  audience: 'male' | 'female' = 'male'
): string | ImageSourcePropType {
  const entry = exerciseThumbnailManifest[exerciseId];

  if (!entry) {
    console.warn(`No thumbnail entry for exercise: ${exerciseId}`);
    return require('@/assets/images/exercises/fitness/Mannen/m-00-000.png');
  }

  // Probeer audience-specifiek
  if (audience === 'female' && entry.female) {
    return entry.female;
  }

  // Fallback naar male
  if (entry.male) {
    return entry.male;
  }

  // Fallback naar placeholder
  console.warn(`No thumbnail available for exercise: ${exerciseId}`);
  return require('@/assets/images/exercises/fitness/Mannen/m-00-000.png');
}
```

## 9. Migratievolgorde

De migratie moet in kleine, gecontroleerde fases plaatsvinden:

1. **Strategie documenteren** (huidige stap)
   - Documentatie van gekozen nummersysteem
   - Commit: `docs(exercises): document thumbnail numbering strategy`

2. **Manifest foundation maken**
   - TypeScript manifest structuur aanmaken
   - Helperfuncties implementeren
   - Commit: `feat(exercises): add thumbnail manifest foundation`

3. **Bestaande code voorbereiden op manifest**
   - `app/discipline/[slug].tsx` aanpassen om manifest te gebruiken
   - Integratie met bestaande `content-audience` systeem
   - Commit: `refactor(exercises): use thumbnail manifest in discipline screen`

4. **Assets batchgewijs hernoemen**
   - Hernoemen per spiergroep in batches
   - Begin met één spiergroep als test
   - Commit per spiergroep of in kleine batches

5. **Manifest vullen per spiergroep**
   - Manifest updaten met nieuwe paden
   - Validatie van compleetheid per spiergroep
   - Commit per spiergroep

6. **Runtime testen per spiergroep**
   - Testen of alle thumbnails correct laden
   - Validatie van fallback mechanismen
   - Performance meting

7. **Oude hardcoded requires verwijderen**
   - Verwijderen van oude `FITNESS_THUMBNAIL_MAP` requires
   - Code cleanup
   - Commit: `refactor(exercises): remove legacy thumbnail map`

8. **Oude assets pas verwijderen na succesvolle runtime-check**
   - Verwijderen van oude bestanden pas na validatie
   - Git cleanup van deleted files
   - Commit: `chore(assets): clean old fitness thumbnail paths`

9. **Alles in kleine commits vastleggen**
   - Geen grote monolithische commits
   - Elke fase als aparte commit met duidelijke message

## 10. Voorgestelde Commitvolgorde

De voorgestelde commitvolgorde voor de migratie:

1. `docs(exercises): document thumbnail numbering strategy`
   - Dit document aanmaken

2. `feat(exercises): add thumbnail manifest foundation`
   - `constants/exercise-thumbnail-manifest.ts` aanmaken
   - TypeScript types en helperfuncties

3. `refactor(exercises): use thumbnail manifest in discipline screen`
   - `app/discipline/[slug].tsx` aanpassen
   - Integratie met `content-audience` systeem

4. `chore(assets): migrate male fitness thumbnails to numbered structure`
   - Hernoemen van Mannen assets
   - Kan in meerdere commits per spiergroep

5. `chore(assets): migrate female fitness thumbnails to numbered structure`
   - Hernoemen van Vrouwen assets
   - Kan in meerdere commits per spiergroep

6. `chore(assets): clean old fitness thumbnail paths`
   - Verwijderen van oude deleted files
   - Git cleanup

**Optionele extra commits**:
- `test(exercises): add thumbnail manifest unit tests`
- `perf(exercises): optimize thumbnail lookup performance`

## 11. Risico's

De belangrijkste risico's bij deze migratie:

### Kritieke risico's:

1. **Broken `require()` paden**
   - Metro bundler kan static requires niet dynamisch oplossen
   - Runtime errors als paden niet kloppen
   - **Mitigatie**: Grondige runtime-validatie per spiergroep

2. **Hoofdlettergevoelige paden**
   - Nederlandse mapnamen `Mannen`/`Vrouwen` met hoofdletters
   - Case-sensitive bestandssystemen (Linux/Mac) kunnen problemen veroorzaken
   - **Mitigatie**: Consistente hoofdlettergebruik in code en bestandssysteem

3. **Ontbrekende male/female varianten**
   - Geen fallback mechanisme in huidige code
   - Kan leiden tot broken images voor specifieke gebruikers
   - **Mitigatie**: Robuuste fallbackstrategie in manifest

4. **Te grote commits**
   - 494 assets + code wijzigingen in één commit is onoverzichtelijk
   - Moet in kleine batches worden gecommit
   - **Mitigatie**: Gefaseerde migratie per spiergroep

5. **Deleted oude assets terwijl code nog oude paden gebruikt**
   - Als code nog naar oude paden verwijst na asset migratie
   - Kritieke runtime impact
   - **Mitigatie**: Runtime-validatie voor cleanup

### Medium risico's:

6. **Metro bundler/static require beperkingen**
   - Static requires moeten bekend zijn tijdens build time
   - Dynamische paden werken niet met `require()`
   - **Mitigatie**: Manifest met static requires tijdens build

7. **app/discipline/[slug].tsx wordt kwetsbaar**
   - Bestand wordt groot met 100+ requires
   - Moeilijk te onderhouden en te debuggen
   - **Mitigatie**: Manifest als centrale laag

### Lage risico's:

8. **Content-audience systeem bestaat al**
   - Er is al een goed fundament voor gender-specifieke content
   - Kan worden uitgebreid voor thumbnails
   - **Voordel**: Minder implementatie werk

## 12. Besluit

**Conclusie**:

- DAELY gaat richting nummersysteem + manifest voor exercise thumbnails
- De gekozen structuur is: Nederlandse mappen (`Mannen/`, `Vrouwen`) + Engelse bestandsnamen (`m-01-001.png`, `f-01-001.png`)
- Assets worden nog niet aangepast in deze documentatiefase
- Huidige open asset work blijft ongemoeid
- Implementatie pas na expliciete goedkeuring van deze strategie

**Volgende stappen** (na goedkeuring):

1. Goedkeuring van dit strategiedocument
2. Implementatie van manifest foundation
3. Gefaseerde migratie van assets
4. Runtime-validatie en testing

**Niet doen zonder goedkeuring**:

- Geen assets hernoemen
- Geen assets verwijderen
- Geen code wijzigen
- Geen commits uitvoeren op basis van dit document zonder expliciete toestemming