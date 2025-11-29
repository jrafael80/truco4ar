# Architecture

This document describes the high-level architecture of Truco4AR. The design is deliberately **stack-agnostic** to allow for technology changes without affecting core functionality.

## Design Philosophy

### Stack Agnosticism

The architecture focuses on **service boundaries, data flow, and responsibilities** rather than specific technologies. This allows the tech stack to evolve based on:
- Performance requirements
- Team expertise
- Deployment constraints
- Ecosystem maturity

### Core Principles

1. **Separation of Concerns**: Clear boundaries between different system responsibilities
2. **Single Responsibility**: Each service/module has one primary purpose
3. **Dependency Inversion**: Depend on abstractions, not implementations
4. **Open/Closed**: Open for extension, closed for modification
5. **Loose Coupling**: Services interact through well-defined interfaces

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Player View  │  │ Table View   │  │  Voice Input     │  │
│  │  (Mobile)    │  │  (Display)   │  │  Recognition     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ (WebSocket / Real-time Protocol)
┌─────────────────────────────────────────────────────────────┐
│                     Synchronization Layer                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Real-time State Synchronization Service       │   │
│  │  (Manages game state distribution to all devices)    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Game Logic  │  │ Bet Handler  │  │  Score Manager   │   │
│  │   Service   │  │   Service    │  │     Service      │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Session     │  │ Voice Score  │  │  QR Code         │   │
│  │ Manager     │  │ Processor    │  │  Generator       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Game State   │  │ Session      │  │  Player          │  │
│  │   Store      │  │   Store      │  │    Store         │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Service Boundaries

### 1. Game Logic Service

**Responsibility**: Implements core Truco game rules and mechanics

**Key Functions**:
- Card dealing and shuffling
- Card hierarchy evaluation
- Trick resolution (determining round winners)
- Hand winner calculation
- Rule enforcement (valid moves, game state transitions)

**Inputs**:
- Player actions (card plays, bet calls)
- Current game state

**Outputs**:
- Updated game state
- Action validity
- Round/hand results

**Independence Requirements**:
- Must work independently of UI
- Must be deterministic (same inputs = same outputs)
- Must be thoroughly unit-tested
- Should have no external dependencies

### 2. Bet Handler Service

**Responsibility**: Manages all betting logic (Envido, Truco, Flor)

**Key Functions**:
- Process bet calls (Envido, Truco, Retruco, etc.)
- Validate bet sequences (what bets are valid in current state)
- Calculate bet stakes
- Handle bet acceptance/declining
- Manage bet state machine

**Inputs**:
- Bet action (type, player)
- Current bet state
- Player cards (for Envido/Flor scoring)

**Outputs**:
- Updated bet state
- Points to award
- Valid next actions

**Independence Requirements**:
- Separate from game logic (betting can be tested independently)
- Clear state machine for bet progression
- Configurable rules (support different Truco variants)

### 3. Score Manager Service

**Responsibility**: Track and manage game scores

**Key Functions**:
- Update team scores
- Track score history
- Determine game winner (reached target score)
- Calculate Falta Envido stakes (points needed to win)

**Inputs**:
- Points to add (from game logic or bets)
- Team identifier

**Outputs**:
- Updated scores
- Game end status
- Score history

**Independence Requirements**:
- Simple, focused responsibility
- Audit trail of score changes
- Support for score rollback (if needed)

### 4. Session Manager Service

**Responsibility**: Manage game sessions and player connections

**Key Functions**:
- Create new game sessions
- Generate session codes
- Add/remove players from sessions
- Track player connections
- Handle player disconnections
- Session timeout and cleanup

**Inputs**:
- Session creation requests
- Player join requests
- Connection events

**Outputs**:
- Session IDs
- Player assignments
- Connection status

**Independence Requirements**:
- Handle multiple concurrent sessions
- Resilient to player disconnections
- Session persistence (for reconnection)

### 5. Real-time State Synchronization Service

**Responsibility**: Keep all connected devices in sync

**Key Functions**:
- Broadcast state changes to all clients
- Handle client subscriptions
- Manage message queuing
- Handle network issues and reconnection
- Conflict resolution

**Inputs**:
- State change events
- Client connection/disconnection events

**Outputs**:
- State updates to clients
- Connection status

**Technical Considerations**:
- WebSockets or similar real-time protocol
- Message ordering guarantees
- Reconnection with state recovery
- Efficient delta updates (only send changes)

### 6. Voice Score Processor Service

**Responsibility**: Process voice input and extract scoring information

**Key Functions**:
- Audio capture and preprocessing
- Speech-to-text conversion
- Score phrase recognition
- Confidence scoring
- Noise filtering

**Inputs**:
- Audio stream
- Current game context (expected score types)

**Outputs**:
- Recognized score/action
- Confidence level
- Suggested confirmation

**Independence Requirements**:
- Pluggable voice recognition backend
- Fallback to manual input
- Multi-language support
- Privacy-focused (no audio storage)

### 7. QR Code Generator Service

**Responsibility**: Generate and validate QR codes for session joining

**Key Functions**:
- Generate QR code from session ID
- Encode session metadata
- Generate backup alphanumeric codes
- Validate codes

**Inputs**:
- Session ID
- Session metadata

**Outputs**:
- QR code image
- Alphanumeric code
- Validation results

**Independence Requirements**:
- Standard QR code format
- URL-based codes (deep linking support)
- Short expiration for security

## Data Models

### Game State

```typescript
interface GameState {
  sessionId: string
  players: Player[]
  teams: Team[]
  currentDealer: PlayerID
  currentPlayer: PlayerID
  deck: Card[]
  hands: Map<PlayerID, Card[]>
  table: PlayedCard[]
  currentRound: number
  tricks: Trick[]
  betState: BetState
  scores: TeamScores
  gamePhase: GamePhase
  rules: GameRules
}
```

### Player

```typescript
interface Player {
  id: PlayerID
  deviceId: string
  team: TeamID
  position: number
  connected: boolean
  lastAction: Timestamp
}
```

### Bet State

```typescript
interface BetState {
  type: BetType  // Envido, Truco, Flor, None
  level: number  // Progression level
  caller: PlayerID
  responder: PlayerID
  stakes: number
  phase: BetPhase  // Pending, Accepted, Declined, Resolved
  envidoScores?: Map<TeamID, number>
}
```

### Session

```typescript
interface Session {
  id: SessionID
  code: string  // 6-digit alphanumeric
  qrCode: string  // Base64 encoded image
  hostDevice: string
  createdAt: Timestamp
  expiresAt: Timestamp
  maxPlayers: number
  rules: GameRules
  status: SessionStatus  // Waiting, InProgress, Completed
}
```

## Data Flow

### 1. Create Game Flow

```
Client (Host) → Session Manager → Create Session
                    ↓
              Generate Session ID + Code
                    ↓
            QR Code Generator → Generate QR Code
                    ↓
            Return Session Info to Host
                    ↓
            Sync Service → Broadcast Session Created
```

### 2. Join Game Flow

```
Client (Player) → Scan QR / Enter Code
                    ↓
            Session Manager → Validate Code
                    ↓
            Add Player to Session
                    ↓
            Sync Service → Broadcast Player Joined
                    ↓
            All Clients Updated
```

### 3. Play Card Flow

```
Client (Player) → Play Card Action
                    ↓
            Game Logic Service → Validate Action
                    ↓
            Update Game State
                    ↓
            Check Trick Complete?
                    ↓ (yes)
            Resolve Trick → Determine Winner
                    ↓
            Score Manager → Update if Hand Complete
                    ↓
            Sync Service → Broadcast State Update
                    ↓
            All Clients Receive Update
```

### 4. Bet Flow

```
Client (Player) → Call Bet (Truco/Envido)
                    ↓
            Bet Handler → Validate Bet
                    ↓
            Update Bet State
                    ↓
            Sync Service → Broadcast to Opponent
                    ↓
Client (Opponent) → Respond (Accept/Decline/Raise)
                    ↓
            Bet Handler → Process Response
                    ↓
            If Accepted → Continue Game with Stakes
            If Declined → Score Manager → Award Points
            If Raised → Loop Back to Original Caller
                    ↓
            Sync Service → Broadcast Resolution
```

### 5. Voice Scoring Flow

```
Client → Audio Stream → Voice Processor
                    ↓
            Speech Recognition
                    ↓
            Parse Score/Action
                    ↓
            Confidence > 85%? → Auto-accept
            Confidence 60-85%? → Request Confirmation
            Confidence < 60%? → Ignore
                    ↓
            If Confirmed → Score Manager → Update Score
                    ↓
            Sync Service → Broadcast Update
```

## Scalability Considerations

### Horizontal Scaling

**Stateless Services**:
- Game Logic Service
- Bet Handler Service
- Voice Processor Service
- QR Code Generator

These can run multiple instances behind a load balancer.

**Stateful Services**:
- Session Manager
- Synchronization Service

These require session affinity or shared state store.

### State Management

**In-Memory (Development/Small Scale)**:
- Fast, simple
- Session state in memory
- Lost on restart

**Persistent (Production/Large Scale)**:
- Redis or similar for session state
- Database for game history
- Message queue for state updates

### Real-time Communication

**Options**:
- WebSockets (bidirectional, low latency)
- Server-Sent Events (unidirectional, simpler)
- WebRTC (peer-to-peer, no server for game state)

**Recommendation**: Start with WebSockets, evaluate WebRTC for Phase 2.

## Security Considerations

### Session Security

- **Short-lived sessions**: Expire after inactivity
- **Random session IDs**: Cryptographically secure random generation
- **Rate limiting**: Prevent session creation abuse
- **Code expiration**: QR codes expire after time limit

### Client-Server Communication

- **HTTPS/WSS**: Encrypted communication
- **Input validation**: Server validates all actions
- **State verification**: Server is source of truth
- **Anti-cheating**: Server enforces rules, clients are display-only

### Privacy

- **No account required**: Minimal data collection
- **No audio storage**: Voice processing is transient
- **Local storage**: Game data stored locally where possible
- **Anonymous play**: No personal information required

## Performance Targets

### Latency

- **Action to update**: <100ms (perceived as instant)
- **State synchronization**: <50ms between devices
- **Voice recognition**: <500ms processing time

### Throughput

- **Concurrent games**: 1000+ simultaneous games (scaled deployment)
- **Players per game**: 2-6 players
- **Actions per second**: 10 actions/second per game (worst case)

### Reliability

- **Uptime**: 99.9% availability
- **Data consistency**: Strong consistency for game state
- **Crash recovery**: Automatic reconnection with state recovery
- **Error rate**: <0.1% action failures

## Technology Stack (To Be Determined)

### Factors to Consider

**Client**:
- Mobile-first (iOS, Android)
- Progressive Web App capabilities
- Offline support (Phase 2)
- Camera access (QR scanning)
- Microphone access (voice input)

**Server**:
- Real-time communication support
- Horizontal scalability
- Low latency
- Stateful session management

**Database**:
- Fast read/write for game state
- Optional: Persistence for history/stats

**Voice Recognition**:
- Multi-language (Spanish, English)
- Client-side or server-side processing
- Privacy-focused

### Example Stacks (Not Prescriptive)

**Option 1: JavaScript/TypeScript**
- Client: React/Vue + PWA
- Server: Node.js + Socket.io
- Database: Redis + PostgreSQL
- Voice: Web Speech API / Cloud service

**Option 2: Python**
- Client: Progressive Web App
- Server: FastAPI + WebSockets
- Database: Redis + PostgreSQL
- Voice: Whisper / Cloud service

**Option 3: Go**
- Client: Progressive Web App
- Server: Go + Gorilla WebSocket
- Database: Redis + PostgreSQL
- Voice: Cloud service

The stack decision will be made based on team expertise and specific requirements.

## Testing Strategy

See [TESTING_STRATEGY.md](TESTING_STRATEGY.md) for comprehensive testing approach.

### Architecture Testing

- **Service boundaries**: Each service testable in isolation
- **Integration points**: Well-defined interfaces for testing
- **Mocking**: Services can be mocked for testing dependents
- **Contract testing**: Verify interface contracts

## Deployment Architecture

### Development Environment

```
Developer Machine
├── All services running locally
├── In-memory state
├── Mock voice recognition
└── Local WebSocket server
```

### Production Environment (GCP Example)

```
Load Balancer
    ↓
Cloud Run / Kubernetes
├── Stateless Services (auto-scaled)
│   ├── Game Logic Service
│   ├── Bet Handler Service
│   └── Voice Processor Service
└── Stateful Services (persistent)
    ├── Session Manager
    └── Sync Service (with Redis backend)
        ↓
    Cloud Memorystore (Redis)
        ↓
    Cloud SQL (PostgreSQL) - Optional for history
```

### CI/CD Pipeline

```
GitHub → Actions → Run Tests
                      ↓
                Build Container Images
                      ↓
                Deploy to Dev Environment
                      ↓
                Run Integration Tests
                      ↓
                Manual Approval
                      ↓
                Deploy to Production
```

## Future Enhancements

### Phase 2: Offline Support (PWA)

- Service workers for offline gameplay
- Local state synchronization
- Background sync when reconnected
- Cached assets for performance

### Phase 3: Advanced Features

- **Spectator mode**: Watch games without playing
- **Replay system**: Save and replay game history
- **Analytics**: Game statistics and insights
- **AI opponents**: Practice against computer players

### Phase 4: Social Features

- **Friend lists**: Connect with regular players
- **Tournaments**: Organize and run tournaments
- **Leaderboards**: Global and friend rankings
- **Chat**: Optional in-game communication

## Conclusion

This architecture provides a solid foundation for Truco4AR that is:
- **Flexible**: Can adapt to different tech stacks
- **Scalable**: Can grow from prototype to production
- **Maintainable**: Clear boundaries and responsibilities
- **Testable**: Each component can be tested independently

The stack-agnostic approach ensures that technical decisions can be made based on actual requirements and constraints rather than premature optimization.
