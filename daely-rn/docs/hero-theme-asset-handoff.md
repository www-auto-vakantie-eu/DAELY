# DAELY Hero Background Themes - Asset Handoff

**Project**: DAELY Today/Vandaag Hero Background Calling Cards
**Status**: Asset Generation Required
**Last Updated**: 2025-06-05

---

## Audit Summary

### Current Implementation
- **File**: `daely-rn/app/(tabs)/today.tsx`
- **Data Structure**: `HERO_BACKGROUND_OPTIONS` array with `HeroBackgroundOption` type
- **Image Loading**: `source?: ImageSourcePropType` using `require('../../assets/images/theme-[name].png')`
- **Asset Location**: `daely-rn/assets/images/`
- **Naming Convention**: `theme-[name].png`
- **Current Themes**: 8 active themes + 1 fallback (Pure Minimal) + 10 locked placeholders

### Asset Directory Structure
```
daely-rn/assets/images/
├── theme-classic.png (existing)
├── theme-ember.png (existing)
├── theme-rogue.png (existing)
├── theme-zen.ink.png (existing)
├── theme-pulse.png (existing)
├── theme-forest-breath.png (existing)
├── theme-retro-sport.png (existing)
├── [NEW] theme-badge-wall.png (to be added)
├── [NEW] theme-streak-fire.png (to be added)
├── [NEW] theme-level-up.png (to be added)
├── [NEW] theme-trophy-room.png (to be added)
├── [NEW] theme-hero-energy.png (to be added)
├── [NEW] theme-race-day.png (to be added)
├── [NEW] theme-data-pulse.png (to be added)
├── [NEW] theme-gym-blackout.png (to be added)
├── [NEW] theme-football-matchday.png (to be added)
└── [NEW] theme-neon-night.png (to be added)
```

---

## Asset Specifications

### Global Requirements
- **Format**: PNG
- **Aspect Ratio**: 16:9
- **Recommended Resolution**: 1600x900px
- **Minimum Resolution**: 800x450px
- **No Text**: No text in images
- **No Logos**: No logos or brands
- **No People**: No people or photorealistic faces
- **Text Zone**: Left/middle 60% must be calm (for overlay text)
- **Date Zone**: Top-right 20% must be calm (for date label)
- **Overlay Compatibility**: Must work with dark overlay rgba(0,0,0,0.3) → rgba(0,0,0,0.6)

---

## Asset Handoff Overview

| Theme ID | Theme Label | Filename | Location | Format | Resolution | Status |
|----------|-------------|----------|----------|--------|------------|--------|
| badgeWall | Badge Wall | theme-badge-wall.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| streakFire | Streak Fire | theme-streak-fire.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| levelUp | Level Up | theme-level-up.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| trophyRoom | Trophy Room | theme-trophy-room.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| heroEnergy | Hero Energy | theme-hero-energy.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| raceDay | Race Day | theme-race-day.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| dataPulse | Data Pulse | theme-data-pulse.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| gymBlackout | Gym Blackout | theme-gym-blackout.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| footballMatchday | Football Matchday | theme-football-matchday.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |
| neonNight | Neon Night | theme-neon-night.png | assets/images/ | PNG | 1600x900 (min 800x450) | ⏳ To be generated |

---

## Design Reference

For detailed design specifications, color palettes, gradient configurations, and composition guidelines for each theme, refer to:

**`docs/hero-theme-design-brief.md`**

This document contains:
- Mood & atmosphere for each theme
- Exact color palettes (hex codes)
- Gradient configurations
- Composition guidelines
- Visual elements
- Overlay specifications

---

## Implementation Notes (For Future Reference)

### Current Code Structure
```typescript
// In daely-rn/app/(tabs)/today.tsx

type HeroBackgroundOptionId = 'ownPhoto' | 'daelyClassic' | 'sunriseEnergy' | 'midnightFocus' | 'recoveryFlow' | 'performanceBlue' | 'forestBalance' | 'communityPulse' | 'pureMinimal' | 'badgeWall' | 'streakFire' | 'levelUp' | 'trophyRoom' | 'heroEnergy' | 'raceDay' | 'dataPulse' | 'gymBlackout' | 'footballMatchday' | 'neonNight';

type HeroBackgroundOption = {
  id: HeroBackgroundOptionId;
  label: string;
  source?: ImageSourcePropType;  // ← Add require() here when assets are ready
  disabled?: boolean;
  locked?: boolean;
  unlockLabel?: string;
  category?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};
```

### Current Locked State
All 10 new themes are currently set to `locked: true` without `source`:
```typescript
{ id: 'badgeWall', label: 'Badge Wall', locked: true, unlockLabel: 'Ontgrendel met je eerste badge', category: 'achievements', rarity: 'rare' },
```

### Future Implementation (When Assets Are Ready)
When assets are generated, update HERO_BACKGROUND_OPTIONS:
```typescript
{ id: 'badgeWall', label: 'Badge Wall', source: require('../../assets/images/theme-badge-wall.png'), locked: true, unlockLabel: 'Ontgrendel met je eerste badge', category: 'achievements', rarity: 'rare' },
```

Then implement unlock logic to set `locked: false` when conditions are met.

---

## Next Steps

1. **Generate Assets**: Use AI tools (Midjourney, DALL-E, Stable Diffusion) with specifications from `docs/hero-theme-design-brief.md`
2. **Place Assets**: Add generated PNG files to `daely-rn/assets/images/` with correct filenames
3. **Update Code**: Add `source: require('../../assets/images/theme-[name].png')` to HERO_BACKGROUND_OPTIONS
4. **Test**: Verify assets render correctly in hero picker with overlay
5. **Implement Unlock Logic**: Add conditional logic to set `locked: false` based on user achievements

---

## Quality Checklist

Before marking assets as complete:
- [ ] File format is PNG
- [ ] Resolution is at least 800x450px (preferably 1600x900px)
- [ ] Aspect ratio is 16:9
- [ ] No text in the image
- [ ] No logos or brands
- [ ] No people or faces
- [ ] Left/middle 60% is calm for text overlay
- [ ] Top-right 20% is calm for date label
- [ ] Works with dark overlay rgba(0,0,0,0.3) → rgba(0,0,0,0.6)
- [ ] File follows naming convention: `theme-[name].png`
- [ ] File is placed in correct location: `assets/images/`

---

**Document Version**: 1.0
**Author**: DAELY Design Team
**Status**: Ready for Asset Generation