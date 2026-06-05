# DAELY Premium Hero Background Themes - Design Brief

**Project**: DAELY Today/Vandaag Hero Background Calling Cards
**Status**: Design Specifications (Placeholder Implementation)
**Last Updated**: 2025-06-05

---

## Global Design Guidelines

### Card Specifications
- **Aspect Ratio**: 16:9 (breed) of 3:2
- **Corner Radius**: 16-20px (afgeronde card)
- **Resolution**: Minimaal 800x450px voor mobile
- **Text Zone**: Links/midden 60% van de card moet rustig zijn
- **Date Zone**: Rechtsboven 20% moet rustig zijn
- **Overlay**: Donkere overlay rgba(0,0,0,0.3) → rgba(0,0,0,0.6) verticaal

### Common Visual Elements
- **Geen tekst in afbeeldingen**
- **Geen logo's of merken**
- **Geen mensen of fotorealistische gezichten**
- **Abstract en cinematografisch**
- **Soft gradients met subtiele depth**
- **Clean composition**
- **Premium mobile UI aesthetic**

---

## Theme 1: Badge Wall

### Mood & Sfeer
Trots, progressie, luxe, achievement-focused, premium gamification

### Kleurenpalet
- **Primary**: #1A1A2E (diep donkerblauw/zwart)
- **Secondary**: #16213E (antraciet)
- **Accent Gold**: #D4AF37 (luxe goud)
- **Accent Blue**: #4A90E2 (premium blauw)
- **Glow**: rgba(212, 175, 55, 0.3) (zachte gouden glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F0F1A 100%)

/* Glow Gradient */
background: radial-gradient(circle at 30% 40%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)
```

### Compositie Richtlijnen
- **Links/midden**: Subtiele badge silhouetten (shield-vormen, medailles)
- **Element grootte**: 20-40px badges, verspreid zonder overlapping
- **Diepte**: 2-3 lagen badges met verschillende opacity (0.1, 0.2, 0.3)
- **Glow punten**: 2-3 subtiele gouden lichtpunten verspreid
- **Rechtsboven**: Minimale visuele elementen, rustig voor datum

### Visual Elements
- Badge shapes: Shield, star, diamond (geometric, niet specifiek)
- Subtiele gouden lijnen/frames
- Zachte reflectie effecten (0.1-0.2 opacity)
- Geen tekst of getallen

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(26, 26, 46, 0.3) 0%, rgba(15, 15, 26, 0.6) 100%)
```

---

## Theme 2: Streak Fire

### Mood & Sfeer
Discipline, momentum, energie, consistentie, krachtige focus

### Kleurenpalet
- **Primary**: #0D0D0D (diep zwart)
- **Secondary**: #1A1A1A (antraciet zwart)
- **Accent Orange**: #FF5722 (intens oranje)
- **Accent Red**: #E53935 (diep rood)
- **Glow**: rgba(255, 87, 34, 0.25) (gecontroleerde vlam glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(145deg, #0D0D0D 0%, #1A1A1A 60%, #0F0F0F 100%)

/* Fire Gradient */
background: linear-gradient(45deg, rgba(255, 87, 34, 0.15) 0%, rgba(229, 57, 53, 0.1) 50%, transparent 100%)
```

### Compositie Richtlijnen
- **Links/midden**: Gecontroleerde vlam-gradient, niet druk
- **Vlam richting**: Van links-bottom naar rechts-midden
- **Intensity**: Zacht, geen vlammen die "branden"
- **Diepte**: 2 lagen gradient met verschillende opacity
- **Rechtsboven**: Minimal, rustig voor datum

### Visual Elements
- Subtiele vlam-achtige gradient (geen echte vlammen)
- Horizontale energie lijnen (0.05-0.1 opacity)
- Zachte rood/oranje glow punten
- Geen tekst of getallen

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(13, 13, 13, 0.3) 0%, rgba(15, 15, 15, 0.65) 100%)
```

---

## Theme 3: Level Up

### Mood & Sfeer
Progressie, groei, modern, premium gamification, XP energy

### Kleurenpalet
- **Primary**: #1E3A5F (diep marineblauw)
- **Secondary**: #2C5282 (premium blauw)
- **Accent Purple**: #805AD5 (XP purple)
- **Accent Cyan**: #38B2AC (moderne cyan)
- **Glow**: rgba(128, 90, 213, 0.25) (XP glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(160deg, #1E3A5F 0%, #2C5282 50%, #1A365D 100%)

/* XP Gradient */
background: linear-gradient(90deg, rgba(128, 90, 213, 0.15) 0%, rgba(56, 178, 172, 0.1) 100%)
```

### Compositie Richtlijnen
- **Links/midden**: Abstracte pijlen omhoog, progressie lijnen
- **Pijl richting**: Van bottom-left naar top-right
- **XP bar element**: Horizontale balk met gradient (30-40px hoog)
- **Rank lijnen**: Verticale lijnen met variërende opacity (0.05-0.15)
- **Rechtsboven**: Subtiele level indicator (geen getal), rustig voor datum

### Visual Elements
- Geometric pijlen (triangle, chevron)
- Horizontale progressie bars
- Subtiele cirkel/XP icon silhouetten
- Zachte purple/cyan glow

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(30, 58, 95, 0.25) 0%, rgba(26, 54, 93, 0.6) 100%)
```

---

## Theme 4: Trophy Room

### Mood & Sfeer
Winning, luxe, champagne, prestige, trots, celebration

### Kleurenpalet
- **Primary**: #1A1A1A (diep zwart)
- **Secondary**: #2D2D2D (donker grijs)
- **Accent Gold**: #FFD700 (champagne goud)
- **Accent Champagne**: #F5E6CA (zacht champagne)
- **Glow**: rgba(255, 215, 0, 0.2) (luxe gouden glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)

/* Gold Gradient */
background: radial-gradient(ellipse at 50% 60%, rgba(255, 215, 0, 0.15) 0%, transparent 60%)
```

### Compositie Richtlijnen
- **Links/midden**: Subtiele trofee silhouetten (cup, medaion)
- **Trofee grootte**: 30-50px, niet dominant
- **Spotlight effect**: Van boven, zacht neerwaarts
- **Reflecties**: Subtiele horizontale lijnen (0.05-0.1 opacity)
- **Rechtsboven**: Minimal, rustig voor datum

### Visual Elements
- Trofee silhouetten (cup, bowl, star)
- Subtiele champagne reflecties
- Zachte gouden lichtpunten (2-3)
- Geen tekst of getallen

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(26, 26, 26, 0.25) 0%, rgba(26, 26, 26, 0.6) 100%)
```

---

## Theme 5: Hero Energy

### Mood & Sfeer
Kracht, actie, energie, superhero-inspired maar origineel, modern

### Kleurenpalet
- **Primary**: #0F0F23 (diep space blauw/zwart)
- **Secondary**: #1E1E3F (space purple)
- **Accent Red**: #E53E3E (action red)
- **Accent Blue**: #3182CE (hero blue)
- **Accent Gold**: #D69E2E (power goud)
- **Glow**: rgba(225, 62, 62, 0.2) (action glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(135deg, #0F0F23 0%, #1E1E3F 50%, #0A0A1A 100%)

/* Energy Gradient */
background: radial-gradient(circle at 70% 30%, rgba(49, 130, 206, 0.2) 0%, rgba(225, 62, 62, 0.15) 40%, transparent 70%)
```

### Compositie Richtlijnen
- **Links/midden**: Krachtige lichtstralen van links-bottom
- **Straal richting**: Diagonaal omhoog naar rechts-midden
- **Intensity**: Clean, niet druk, 2-3 stralen
- **Diepte**: 3 lagen met verschillende opacity en grootte
- **Rechtsboven**: Subtiele energy burst, rustig voor datum

### Visual Elements
- Lichtstraal gradients (conical/radial)
- Subtiele power lines (horizontaal)
- Zachte red/blue/gold accenten
- Geen specifieke superhero styling

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(15, 15, 35, 0.25) 0%, rgba(10, 10, 26, 0.6) 100%)
```

---

## Theme 6: Race Day

### Mood & Sfeer
Snelheid, competitie, finishline, performance, wedstrijdspanning

### Kleurenpalet
- **Primary**: #0D1117 (race track zwart)
- **Secondary**: #161B22 (asfalt grijs)
- **Accent Red**: #FF4444 (finishline rood)
- **Accent Blue**: #0066FF (speed blauw)
- **Accent Neon**: #00FF88 (race neon)
- **Glow**: rgba(0, 102, 255, 0.2) (speed glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(90deg, #0D1117 0%, #161B22 50%, #0D1117 100%)

/* Speed Gradient */
background: linear-gradient(45deg, rgba(0, 102, 255, 0.15) 0%, rgba(255, 68, 68, 0.1) 50%, rgba(0, 255, 136, 0.05) 100%)
```

### Compositie Richtlijnen
- **Links/midden**: Snelheidslijnen (motion blur effect)
- **Lijn richting**: Horizontaal, van links naar rechts
- **Finishline element**: Subtiele verticale strepen (30-40px hoog)
- **Motion effect**: Diagonale lijnen met variërende opacity (0.05-0.15)
- **Rechtsboven**: Subtiele finishline indicator, rustig voor datum

### Visual Elements
- Motion blur lijnen
- Finishline chevrons (subtiel)
- Zachte speed glow
- Geen tekst of getallen

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(13, 17, 23, 0.3) 0%, rgba(13, 17, 23, 0.65) 100%)
```

---

## Theme 7: Data Pulse

### Mood & Sfeer
Sportdata, tracking, technologie, hartslag, moderne metrics

### Kleurenpalet
- **Primary**: #0A192F (diep tech blauw)
- **Secondary**: #172A45 (tech marine)
- **Accent Cyan**: #64FFDA (data cyan)
- **Accent Green**: #00E676 (hartslag groen)
- **Accent Blue**: #00B4D8 (tech blauw)
- **Glow**: rgba(100, 255, 218, 0.2) (data glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(160deg, #0A192F 0%, #172A45 50%, #0A1628 100%)

/* Pulse Gradient */
background: radial-gradient(circle at 40% 50%, rgba(100, 255, 218, 0.15) 0%, rgba(0, 230, 118, 0.1) 40%, transparent 70%)
```

### Compositie Richtlijnen
- **Links/midden**: Hartslag lijn (ECG/EKG style)
- **Lijn stijl**: Smooth curve, niet druk, 0.1-0.15 opacity
- **Data punten**: Subtiele cirkels op de lijn
- **Grafiek element**: Horizontale grid lines (0.03-0.08 opacity)
- **Rechtsboven**: Subtiele data indicator, rustig voor datum

### Visual Elements
- Hartslag/ECG curve
- Data dots (kleine cirkels)
- Grid lines (horizontaal/verticaal)
- Zachte cyan/green glow

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(10, 25, 47, 0.25) 0%, rgba(10, 22, 40, 0.6) 100%)
```

---

## Theme 8: Gym Blackout

### Mood & Sfeer
Krachttraining, premium gym, metaal, schaduwen, discipline

### Kleurenpalet
- **Primary**: #0F0F0F (gym zwart)
- **Secondary**: #1A1A1A (donker metaal)
- **Accent Silver**: #C0C0C0 (metaal zilver)
- **Accent Steel**: #4682B4 (staal blauw)
- **Glow**: rgba(70, 130, 180, 0.15) (staal glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(180deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)

/* Metal Gradient */
background: linear-gradient(135deg, rgba(192, 192, 192, 0.08) 0%, rgba(70, 130, 180, 0.05) 50%, rgba(192, 192, 192, 0.08) 100%)
```

### Compositie Richtlijnen
- **Links/midden**: Metaalstructuur, subtiele texture
- **Textuur**: Horizontale lijnen/brush strokes (0.05-0.1 opacity)
- **Schaduw effect**: Diepte lagen met variërende opacity
- **Lichtbanen**: Subtiele verticale lichtlijnen (2-3)
- **Rechtsboven**: Minimal, rustig voor datum

### Visual Elements
- Metaal texture (lines, brush strokes)
- Subtiele reflectie lijnen
- Zachte staal/zilver accenten
- Geen apparaten of mensen

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(15, 15, 15, 0.3) 0%, rgba(15, 15, 15, 0.65) 100%)
```

---

## Theme 9: Football Matchday

### Mood & Sfeer
Voetbal, stadium, wedstrijd, focus, sport, rustig genoeg voor tekst

### Kleurenpalet
- **Primary**: #1B4D3E (donkergroen veld)
- **Secondary**: #2D5A4A (veld marine)
- **Accent Green**: #4CAF50 (gras groen)
- **Accent White**: #FFFFFF (stadium licht)
- **Accent Gold**: #FFD700 (bal goud)
- **Glow**: rgba(76, 175, 80, 0.15) (veld glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(180deg, #1B4D3E 0%, #2D5A4A 50%, #1A3D32 100%)

/* Field Gradient */
background: radial-gradient(ellipse at 50% 70%, rgba(76, 175, 80, 0.1) 0%, transparent 60%)
```

### Compositie Richtlijnen
- **Links/midden**: Subtiele veldlijnen (horizontaal)
- **Veldlijnen**: 3-4 lijnen met 0.05-0.1 opacity
- **Stadium lights**: Zachte lichtpunten van boven (2-3)
- **Mist effect**: Subtiele vertical gradient (0.05-0.1 opacity)
- **Rechtsboven**: Minimal, rustig voor datum

### Visual Elements
- Veldlijnen (subtiel)
- Stadium light spots
- Zachte mist gradient
- Geen bal of spelers

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(27, 77, 62, 0.3) 0%, rgba(26, 61, 50, 0.6) 100%)
```

---

## Theme 10: Neon Night

### Mood & Sfeer
Avondtraining, urban, modern, strak, neon, energie

### Kleurenpalet
- **Primary**: #1A1A2E (night navy)
- **Secondary**: #16213E (deep purple)
- **Accent Purple**: #9B59B6 (neon paars)
- **Accent Blue**: #3498DB (neon blauw)
- **Accent Pink**: #E91E63 (neon pink)
- **Glow**: rgba(155, 89, 182, 0.25) (neon glow)

### Gradient Configuratie
```css
/* Background Gradient */
background: linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F0F1A 100%)

/* Neon Gradient */
background: linear-gradient(45deg, rgba(155, 89, 182, 0.2) 0%, rgba(52, 152, 219, 0.15) 50%, rgba(233, 30, 99, 0.1) 100%)
```

### Compositie Richtlijnen
- **Links/midden**: Urban neon lijnen, strak en modern
- **Neon lijnen**: Verticaal/diagonaal, 0.1-0.15 opacity
- **City lights**: Subtiele lichtpunten verspreid (3-4)
- **Energy vibe**: Zachte purple/blue/pink glow
- **Rechtsboven**: Minimal, rustig voor datum

### Visual Elements
- Neon lijnen (vertical/diagonal)
- City light spots
- Zachte purple/blue/pink accenten
- Geen gebouwen of straat

### Overlay Specificaties
```css
/* Leesbaarheid Overlay */
background: linear-gradient(to bottom, rgba(26, 26, 46, 0.25) 0%, rgba(15, 15, 26, 0.6) 100%)
```

---

## Implementation Notes

### React Native Gradient Implementation
```typescript
import { LinearGradient } from 'expo-linear-gradient';

// Example: Badge Wall
<LinearGradient
  colors={['#1A1A2E', '#16213E', '#0F0F1A']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.cardBackground}
>
  {/* Add visual elements here */}
</LinearGradient>
```

### Asset Naming Convention
- `theme-badge-wall.png`
- `theme-streak-fire.png`
- `theme-level-up.png`
- `theme-trophy-room.png`
- `theme-hero-energy.png`
- `theme-race-day.png`
- `theme-data-pulse.png`
- `theme-gym-blackout.png`
- `theme-football-matchday.png`
- `theme-neon-night.png`

### File Specifications
- **Format**: PNG (transparantie support)
- **Resolution**: 800x450px minimum (16:9)
- **Color Depth**: 24-bit RGB
- **Compression**: Lossless PNG voor kwaliteit

---

## Next Steps

1. **Generate visuals** using AI tools (Midjourney, DALL-E, Stable Diffusion) with these specifications
2. **Create assets** in `assets/images/` directory
3. **Update HERO_BACKGROUND_OPTIONS** in `today.tsx` with actual image sources
4. **Test overlay** with actual text to ensure readability
5. **Refine gradients** based on actual device rendering

---

**Document Version**: 1.0
**Author**: DAELY Design Team
**Review Status**: Ready for Asset Generation