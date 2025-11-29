# Product Specifications

## Product Vision

Truco4AR reimagines the traditional Argentine card game experience for the digital age. By combining the social dynamics of face-to-face gameplay with the convenience of digital tools, we create a seamless gaming experience that enhances rather than replaces the physical gathering around the table.

## Target Users

### Primary Users
- **Social Card Game Enthusiasts**: Groups of friends and family who enjoy playing Truco in person
- **Age Range**: 18-50 years old
- **Technical Proficiency**: Comfortable with smartphones and basic QR code scanning
- **Location**: Primarily Argentina, with potential expansion to other Spanish-speaking regions

### Use Cases
- **Home Gatherings**: Friends meeting at someone's home for a game night
- **Cafés and Bars**: Groups playing in public spaces
- **Family Events**: Multi-generational family gatherings
- **Tournaments**: Organized Truco competitions

## Core Features

### 1. Multi-Device Gameplay

**Description**: Each player uses their smartphone as their personal hand of cards, eliminating the need for physical cards while maintaining the social, in-person nature of the game.

**Value Proposition**:
- No need to carry physical cards
- Cards never get damaged or lost
- Digital cards can be easily shuffled and dealt
- Eliminates card marking or cheating concerns

**User Experience**:
- Players join the game from their personal devices
- Each player sees only their own cards
- Touch interactions for playing cards
- Real-time synchronization across all devices

### 2. QR Code Synchronization

**Description**: Simple, fast device pairing system that allows players to join a game table by scanning a QR code.

**Value Proposition**:
- No complex login or account creation required
- Instant joining process
- Works across different device types and brands
- Privacy-focused (no personal data needed)

**User Experience**:
- Host creates a new game table
- System generates a unique QR code
- Other players scan the code with their devices
- Automatic pairing and game start

### 3. Voice-Enabled Scoring

**Description**: Intelligent voice recognition system that listens to game announcements and automatically updates the score, with manual editing capabilities for corrections.

**Value Proposition**:
- Eliminates manual scorekeeping errors
- Reduces game interruptions
- Maintains game flow and social interaction
- Players can focus on gameplay rather than bookkeeping

**User Experience**:
- Voice recognition automatically detects score announcements
- Real-time score updates visible to all players
- Manual override available for corrections
- Score history tracking

**Technical Considerations**:
- Multi-language voice recognition (Spanish/English)
- Background noise filtering
- Confidence thresholds for automatic updates
- Fallback to manual input when confidence is low

### 4. Flexible Display Options

**Description**: Multiple viewing modes to accommodate different play scenarios and preferences.

#### Player View
- Personal device shows player's own cards
- Current game state and score
- Action buttons for playing cards and making moves
- Other players' visible information

#### Table View (Optional)
- Separate display device shows the shared playing area
- All cards played to the table visible
- Current score and round information
- Team arrangements
- Can be projected on TV, tablet, or computer screen

**Value Proposition**:
- Accommodates different physical setups
- Enhances spectator experience
- Useful for teaching new players
- Great for tournament settings

### 5. Argentine Truco Rules Implementation

**Description**: Complete implementation of traditional Argentine Truco rules with proper scoring, card hierarchy, and game flow.

**Includes**:
- Standard 40-card Spanish deck (without 8s, 9s, and 10s)
- Proper card hierarchy (Espada > Basto > Oro > Copa)
- Envido scoring system
- Truco, Retruco, Vale Cuatro progression
- Flor rules (optional variant)
- First to 30 points wins (configurable)

See [TRUCO_RULES.md](TRUCO_RULES.md) for complete rules documentation.

## Future Roadmap

### Phase 2: Progressive Web App (PWA)
- Offline gameplay support
- Install to home screen capability
- Background sync for game state
- Push notifications for turn reminders

### Phase 3: Additional Truco Variants
- Uruguayan Truco
- Paulista Truco
- Chilean Truco
- Custom rule configurations

### Phase 4: Social Features
- Friend lists and invitations
- Game history and statistics
- Leaderboards
- Tournament organization tools

### Phase 5: Advanced Features
- AI opponents for practice
- Tutorial mode for new players
- Replay system for reviewing games
- Streaming integration for broadcasting games

## Non-Goals (Current Scope)

- **Online Multiplayer**: Initial version requires all players to be physically present
- **Betting or Gambling**: No real-money transactions or betting mechanisms
- **Single Player Mode**: Focus is on social, multi-player experience
- **Account System**: No mandatory user accounts in initial version
- **Monetization**: No ads or in-app purchases in initial release

## Success Metrics

### User Engagement
- Active game sessions per week
- Average game duration
- Repeat usage rate
- Player retention after first game

### Technical Performance
- Device synchronization latency (<100ms)
- Voice recognition accuracy (>85%)
- App responsiveness (interactions <50ms)
- Crash rate (<0.1%)

### User Satisfaction
- Net Promoter Score (NPS)
- App store ratings
- User feedback and feature requests
- Word-of-mouth referrals

## Constraints and Considerations

### Technical Constraints
- Must work on modern smartphones (iOS 14+, Android 9+)
- Internet connectivity required for device synchronization
- Microphone access needed for voice scoring
- Camera access needed for QR code scanning

### Design Constraints
- Mobile-first design
- Portrait orientation primary (cards are vertical)
- Accessible color schemes (consider color blindness)
- Large touch targets for card interactions

### Privacy and Security
- Minimal data collection
- Local game data storage
- No personal information required
- Secure device-to-device communication

### Localization
- Spanish (primary)
- English (secondary)
- Traditional Truco terminology preserved
- Cultural context maintained in UI/UX
