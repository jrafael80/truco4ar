# Truco4AR Roadmap

This document outlines the development roadmap for Truco4AR, organized by phases and milestones.

## Current Status: Phase 2 Complete ✅

**Completed**: Core game logic fully implemented with comprehensive testing (94.89% coverage).

---

## Phase 1: Foundation & Core Game Logic ✅ COMPLETE

**Status**: ✅ Complete
**Duration**: Completed
**Goal**: Establish project foundation with documentation, tooling, and basic game logic.

### Completed Deliverables

- ✅ **Project Setup**
  - Monorepo structure with npm workspaces
  - TypeScript configuration (strict mode)
  - Git Flow workflow
  - Conventional Commits standard

- ✅ **Documentation**
  - Product specifications
  - Argentine Truco rules
  - User flows
  - Architecture design (stack-agnostic)
  - Testing strategy
  - Contributing guidelines

- ✅ **Development Tools**
  - ESLint + Prettier configuration
  - Jest testing framework
  - Claude Code integration (slash commands + hooks)
  - CI/CD pipelines (GitHub Actions)

- ✅ **Core Game Logic** (`@truco4ar/shared`)
  - Card type system (Spanish deck)
  - Card hierarchy implementation
  - Comprehensive unit tests (29 tests, 97.72% coverage)
  - Framework-agnostic design

---

## Phase 2: Game State & Logic Expansion ✅ COMPLETE

**Status**: ✅ Complete
**Duration**: Completed
**Goal**: Complete game logic implementation with all Truco rules.

### Completed Deliverables

- ✅ **Deck Management** (26 tests, 100% coverage)
  - Deck creation and shuffling
  - Card dealing logic (2 or 4 players)
  - Hand management
  - Immutable data patterns

- ✅ **Player & Team Models** (48 tests, 100% coverage)
  - Player entity with state
  - Team formation (2 or 4 players)
  - Turn management and rotation
  - Player positions (0-3)
  - Helper functions for player/team queries

- ✅ **Game State Machine** (56 tests, 95-97% coverage)
  - Game phases (waiting, dealing, betting, playing, scoring, finished)
  - Hand management (tricks, winners)
  - Trick resolution with card hierarchy
  - Hand winner determination (complex Truco rules)
  - Edge case handling (pardas, ties)

- ✅ **Betting System** (181 tests, 93-98% coverage)
  - Envido logic and scoring (calculateEnvidoScore, determineEnvidoWinner)
  - Truco/Retruco/Vale Cuatro progression validation
  - Flor logic (hasFlor, calculateFlorScore, determineFlorWinner)
  - Bet state validation (phase checks, sequence validation)
  - Bet response handling (accept, decline, raise)
  - Points calculation (getTrucoPoints, getEnvidoPoints, getDeclinePoints)
  - Falta Envido calculation

- ✅ **Tests** (312 tests passing)
  - Comprehensive unit tests for all game logic
  - 94.89% statement coverage, 96.15% branch coverage
  - Edge case testing (pardas, ties, special cards)
  - Immutability tests

### Key Achievements

- **312 total tests** across all modules
- **94.89%** overall statement coverage
- **96.15%** branch coverage
- All core Truco rules implemented
- Framework-agnostic design maintained
- Comprehensive edge case handling

### Commits

1. `feat(shared): implement deck management system` - Deck creation, shuffling, dealing
2. `feat(shared): implement Player & Team Models` - Player entities, teams, turn management
3. `feat(shared): implement Game State Machine` - Phases, tricks, hand resolution
4. `feat(shared): implement Betting System` - Envido, Truco, Flor logic
5. `test(shared): add comprehensive tests for betting system` - Full test coverage

**Dependencies**: None (builds on Phase 1)

---

## Phase 3: Backend Implementation 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 3-4 weeks
**Goal**: Build real-time multiplayer backend with WebSockets.

### Deliverables

- [ ] **Backend Package** (`@truco4ar/backend`)
  - Node.js + TypeScript setup
  - Framework selection (Express/Fastify/Hono)
  - Integration with `@truco4ar/shared`

- [ ] **WebSocket Server**
  - Socket.io or native WebSocket implementation
  - Real-time state synchronization
  - Connection management
  - Reconnection handling

- [ ] **Session Management**
  - Create/join game sessions
  - Session code generation (6-digit alphanumeric)
  - QR code generation for easy joining
  - Session cleanup and timeouts

- [ ] **Game API**
  - RESTful endpoints for session management
  - WebSocket events for game actions
  - State broadcasting to all players
  - Input validation and sanitization

- [ ] **State Persistence**
  - Redis for active game sessions
  - Optional PostgreSQL for game history
  - Session recovery on reconnection

- [ ] **Security**
  - Input validation
  - Rate limiting
  - CORS configuration
  - WebSocket authentication

- [ ] **Testing**
  - Integration tests with Supertest
  - WebSocket connection tests
  - Session management tests
  - Load testing (baseline metrics)

**Dependencies**: Phase 2 complete

---

## Phase 4: Frontend Implementation 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 4-5 weeks
**Goal**: Build responsive React frontend with real-time gameplay.

### Deliverables

- [ ] **Frontend Package** (`@truco4ar/frontend`)
  - React 18 + TypeScript
  - Vite for build tooling
  - Integration with `@truco4ar/shared`

- [ ] **State Management**
  - Selection: Context API / Zustand / Redux
  - Real-time state synchronization
  - Optimistic updates
  - Offline state handling

- [ ] **Core UI Components**
  - Card component with Spanish deck graphics
  - Hand display
  - Table view
  - Player list with turn indicators
  - Score display

- [ ] **Game Screens**
  - Home/landing page
  - Create game screen
  - Join game screen (QR scanner + code input)
  - Waiting room
  - Active game view
  - Game over screen

- [ ] **Real-time Features**
  - WebSocket connection management
  - State updates from server
  - Action broadcasting
  - Connection status indicator

- [ ] **Responsive Design**
  - Mobile-first approach
  - Portrait orientation primary
  - Landscape support
  - Touch-optimized controls

- [ ] **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - High contrast mode

- [ ] **Testing**
  - Component tests with React Testing Library
  - Integration tests
  - E2E tests (Playwright/Cypress)

**Dependencies**: Phase 3 complete

---

## Phase 5: Voice Recognition System 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 2-3 weeks
**Goal**: Implement voice-based score tracking with Web Speech API.

### Deliverables

- [ ] **Voice Recognition Service** (`@truco4ar/voice-service`)
  - Web Speech API integration
  - Spanish and English language models
  - Voice command parser
  - Confidence scoring system

- [ ] **Score Command Recognition**
  - Envido score phrases ("Envido", "Real Envido", "Falta Envido")
  - Truco commands ("Truco", "Retruco", "Vale Cuatro")
  - Score announcements ("Tengo X", "Son buenas")
  - Common game phrases recognition

- [ ] **Frontend Voice Integration**
  - Microphone access and permissions
  - Voice input UI (push-to-talk button)
  - Real-time transcription display
  - Confidence indicator
  - Manual confirmation for medium confidence (60-85%)
  - Auto-accept for high confidence (>85%)
  - Reject/ignore low confidence (<60%)

- [ ] **Fallback & Error Handling**
  - Manual input always available
  - Graceful degradation without microphone
  - Browser compatibility detection
  - Noise/error recovery

- [ ] **Testing**
  - Voice command unit tests
  - Parser accuracy tests
  - Mock speech recognition for automated tests
  - Manual testing with real users

- [ ] **User Experience**
  - Onboarding/tutorial for voice commands
  - Visual feedback during recognition
  - Clear error messages
  - Settings to enable/disable voice

**Dependencies**: Phase 4 complete

---

## Phase 6: Table Management Service 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 2-3 weeks
**Goal**: Build independent table/session management service with QR codes.

### Architecture Note
The Table Management Service is **independent** from the Game Service:
- **Table Service**: Manages session creation, player joining, QR codes, lobby state
- **Game Service**: Handles WebSocket connections for active games, game state synchronization
- Each table creates a WebSocket session when game starts

### Deliverables

- [ ] **Table Management Service** (`@truco4ar/table-service`)
  - RESTful API for table operations
  - Session/table creation and lifecycle
  - 6-digit alphanumeric code generation
  - Table state management (waiting/active/completed)
  - Player roster management
  - Table timeout and cleanup

- [ ] **QR Code System**
  - QR code generation library integration
  - Encode table session ID + metadata
  - Generate unique QR per table
  - QR code expiration (security)
  - Deep link URL format (e.g., `truco4ar.app/join/ABC123`)

- [ ] **Table Joining Flow**
  - Scan QR code with device camera
  - Manual code entry as fallback
  - Validate table code
  - Add player to table roster
  - Broadcast player joined to waiting players

- [ ] **Table View Mode**
  - Separate display option for central screen
  - Shows all played cards on table
  - Current trick display
  - Score and game state
  - Read-only mode (no player actions)
  - Syncs with game WebSocket session

- [ ] **Service Integration**
  - Table Service → Game Service handoff
  - Create WebSocket session when game starts
  - Link table ID to WebSocket session
  - Maintain player mappings
  - Handle reconnections to existing sessions

- [ ] **Frontend Components**
  - Create table screen
  - Join table screen (QR scanner + manual input)
  - Waiting lobby (player list)
  - Table settings (rules, # of players)
  - Start game button (host only)

- [ ] **Security & Validation**
  - Rate limiting on table creation
  - Code expiration after inactivity
  - Table ownership validation
  - Maximum players enforcement
  - Prevent duplicate joins

- [ ] **Testing**
  - Table lifecycle tests
  - QR code generation/validation tests
  - Concurrent table creation tests
  - Service integration tests
  - Camera/QR scanning tests

**Dependencies**: Phase 4 complete (can run parallel to Phase 5)

---

## Phase 7: PWA & Polish 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 2 weeks
**Goal**: Progressive Web App features and user experience polish.

### Deliverables

- [ ] **PWA Features**
  - Service worker setup with Workbox
  - Offline functionality
  - App manifest with icons
  - Install prompt
  - Push notifications (game invites)
  - Splash screen

- [ ] **User Experience Polish**
  - Smooth animations and transitions
  - Card flip animations
  - Sound effects (optional, with mute)
  - Haptic feedback on actions
  - Loading states and skeletons
  - Error handling and recovery
  - Toast notifications

- [ ] **Performance Optimization**
  - Code splitting by route
  - Lazy loading components
  - Image optimization
  - Bundle size optimization
  - WebSocket message optimization (delta updates)
  - Lighthouse score > 90

- [ ] **Accessibility Improvements**
  - Keyboard navigation enhancements
  - Screen reader improvements
  - ARIA labels audit
  - Color contrast checks
  - Focus management

- [ ] **Testing & QA**
  - Cross-browser testing
  - Device compatibility testing
  - Performance benchmarks
  - Accessibility audit
  - User acceptance testing

**Dependencies**: Phases 5 and 6 complete

---

## Phase 8: Deployment & Monitoring 🔜

**Status**: 🔜 Planned
**Estimated Duration**: 2-3 weeks
**Goal**: Deploy to production with monitoring and analytics.

### Deliverables

- [ ] **GCP Deployment**
  - Cloud Run or App Engine setup
  - Redis cluster (Cloud Memorystore)
  - PostgreSQL setup (Cloud SQL) - optional
  - Load balancer configuration
  - SSL/TLS certificates

- [ ] **CI/CD Enhancement**
  - Automated deployment pipelines
  - Blue-green deployment strategy
  - Rollback mechanisms
  - Environment-specific configs

- [ ] **Monitoring & Observability**
  - Application logging
  - Error tracking (Sentry)
  - Performance monitoring (APM)
  - Uptime monitoring
  - Alert configuration

- [ ] **Analytics**
  - User analytics (privacy-focused)
  - Game statistics
  - Performance metrics
  - Conversion funnels

- [ ] **Documentation**
  - Deployment guide
  - Operations runbook
  - Troubleshooting guide
  - API documentation

**Dependencies**: Phase 7 complete

---

## Phase 9: Advanced Features (Future) 💡

**Status**: 💡 Future Ideas
**Goal**: Extended functionality and community features.

### Potential Features

- [ ] **Game Variants**
  - Different regional Truco rules
  - Configurable game settings
  - Custom scoring rules

- [ ] **Social Features**
  - Friend lists
  - Game invitations
  - Player profiles
  - Statistics and achievements

- [ ] **AI Opponent**
  - Single-player practice mode
  - AI difficulty levels
  - Strategy learning

- [ ] **Tournaments**
  - Tournament creation and management
  - Bracket system
  - Leaderboards

- [ ] **Replay System**
  - Game recording
  - Replay viewer
  - Share game highlights

- [ ] **Multi-language Support**
  - Additional language translations
  - Regional variations support

- [ ] **Alternative Tech Stacks**
  - Rust backend experiment
  - Go backend experiment
  - Alternative frontends (Leptos, Svelte)
  - Performance comparisons

**Dependencies**: Phase 8 complete

---

## Phase 10: Community & Growth 💡

**Status**: 💡 Future Ideas
**Goal**: Build community and scale the platform.

### Potential Initiatives

- [ ] **Community Building**
  - Discord server
  - User forums
  - Content creation (tutorials, guides)
  - Community events

- [ ] **Marketing & Growth**
  - Landing page optimization
  - SEO optimization
  - Social media presence
  - User acquisition campaigns

- [ ] **Monetization (Optional)**
  - Premium features
  - Cosmetic items
  - Tournament entry fees
  - Donations/support

- [ ] **Mobile Apps**
  - Native iOS app
  - Native Android app
  - App store optimization

**Dependencies**: Platform maturity and user base

---

## Success Metrics

### Phase 2-3 (Game Logic & Backend)
- All game rules implemented and tested
- 80%+ test coverage maintained
- WebSocket latency < 50ms
- Session creation time < 100ms

### Phase 4 (Frontend)
- Responsive on all devices
- Load time < 2 seconds
- 90+ Lighthouse score
- Zero critical accessibility issues

### Phase 5-6 (Voice & Table Management)
- Voice recognition accuracy > 85%
- Table creation time < 200ms
- QR code scan success rate > 95%
- Concurrent tables supported > 100

### Phase 7 (PWA & Polish)
- PWA installable on all platforms
- Lighthouse score > 90
- Offline mode functional
- User satisfaction score > 4.5/5

### Phase 8 (Deployment)
- 99.9% uptime
- < 100ms API response time (p95)
- Zero data loss incidents
- < 5 minute rollback time

---

## Technology Decisions

### Current Stack (Phase 1-8)
- **Shared**: TypeScript (strict), Jest
- **Game Service**: Node.js 18+, Socket.io/WebSockets, Redis
- **Table Service**: Node.js 18+, Express/Fastify, Redis
- **Voice Service**: Web Speech API (client-side)
- **Frontend**: React 18, Vite, Workbox PWA
- **Deployment**: GCP (Cloud Run for services), GitHub Actions
- **Monitoring**: Sentry, Cloud Monitoring

### Service Architecture
```
┌─────────────────────────────────────────────┐
│              Load Balancer                   │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼──────┐    ┌────────▼─────────┐
│ Table Service│    │  Game Service    │
│ (REST API)   │    │  (WebSockets)    │
│              │    │                  │
│ - Create     │───▶│ - Game state     │
│ - Join       │    │ - Real-time sync │
│ - QR codes   │    │ - Player actions │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       └──────┬──────────────┘
              │
        ┌─────▼─────┐
        │   Redis   │
        │ (Shared)  │
        └───────────┘
```

### Future Experiments (Phase 9+)
- **Alternative Backends**: Rust (Actix-web), Go (Gorilla)
- **Alternative Frontends**: Leptos (Rust WASM), Svelte
- **Native Apps**: React Native, Flutter, or native Swift/Kotlin

---

## Risk Management

### Technical Risks
1. **WebSocket scalability**: Mitigate with Redis pub/sub and horizontal scaling
2. **Voice recognition accuracy**: Provide manual fallback, iterative improvement
3. **Browser compatibility**: Progressive enhancement, polyfills
4. **Offline sync complexity**: Start simple, iterate based on usage

### Product Risks
1. **User adoption**: Focus on MVP, gather feedback early
2. **Rule complexity**: Comprehensive documentation and tutorials
3. **Multi-device coordination**: Thorough testing with real users

---

## Contributing

This roadmap is a living document. See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to propose changes or new features.

## Questions or Feedback?

Open an issue on GitHub to discuss roadmap priorities or suggest new features.
