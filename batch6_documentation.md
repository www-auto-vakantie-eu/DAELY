
# Daely Community & Creator Ecosystem

## 1. Creator Levels
- **Open**: Basic community members sharing free routines.
- **Pro**: Professional trainers who can offer individual programs for sale or via general subscription.
- **Verified**: Elite athletes and world-class specialists with dedicated profile customizations and exclusive Masterclass content.

## 2. Follow & Subscription System
- **Following**: A non-paid action. Following a creator prioritizes their suggested "Daily Protocol" on the user's Home dashboard. It allows users to see the creator in their "Quick Select" row.
- **Subscription**: A recurring monthly payment (e.g., Elena Zen @ €9.99). Subscribing unlocks the creator's "Premium" programs and allows for direct chat access (in future versions).

## 3. Commission Model
Daely uses a **70/30 Net Split**:
- **70%**: Goes directly to the Creator's digital wallet.
- **30%**: Daely platform fee for infrastructure, marketing, and processing.
This transparent model ensures that users know they are directly supporting the athletes they follow.

## 4. UX Integration (Home)
The "Home" screen dynamically updates based on followed creators:
- **Creator Row**: A horizontal list of followed creators at the top.
- **Perspective Swapping**: Tapping a creator's avatar swaps the "Today's Protocol" and "Focus" cards to match that creator's specific recommendations. This turns the app into a personalized experience for each trainer.

## 5. Technical Implementation
- **Logic**: Use `useMemo` to filter content based on `activeHomeCreatorId`.
- **State**: Persistent storage (via `localStorage` or backend) for `followedIds` and `subscribedIds`.
- **UI**: High-fidelity overlays with gesture-based closing for profile pages.
