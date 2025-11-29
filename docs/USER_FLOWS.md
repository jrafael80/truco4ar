# User Flows

This document describes the detailed user experience flows for Truco4AR, covering all major user interactions and scenarios.

## Flow 1: Creating a New Game Table

**Actor**: Game Host

### Steps

1. **Launch Application**
   - User opens Truco4AR on their device
   - App loads to home screen

2. **Create New Game**
   - User taps "Create New Game" button
   - App presents game configuration options:
     - Number of players (2, 4, or 6)
     - Game mode (Standard, with Flor, custom)
     - Target score (15, 24, or 30 points)
     - Language preference (English/Spanish)

3. **Configure Game Settings**
   - User selects desired options
   - User confirms configuration
   - App creates new game session

4. **Generate Join Code**
   - App generates unique game session ID
   - App displays QR code for joining
   - App also displays 6-digit alphanumeric code (backup method)
   - Screen shows "Waiting for players..." status

5. **Monitor Player Joins**
   - Screen updates as each player joins
   - Shows player names/numbers
   - Shows current player count vs. required count
   - Host can see which positions are filled

6. **Start Game**
   - Once all positions are filled, "Start Game" button becomes active
   - Host taps "Start Game"
   - Game begins, cards are dealt to all players

### Alternative Flows

**A1: Not Enough Players**
- If host tries to start with incomplete team, app shows error
- "Need X more players to start game"

**A2: Cancel Game Creation**
- Host can tap "Cancel" at any time before starting
- App returns to home screen
- Game session is destroyed

---

## Flow 2: Joining a Game Table

**Actor**: Player

### Steps

1. **Launch Application**
   - Player opens Truco4AR on their device
   - App loads to home screen

2. **Select Join Method**
   - Player taps "Join Game" button
   - App presents two options:
     - "Scan QR Code"
     - "Enter Code Manually"

3A. **Join via QR Code** (Primary Method)
   - Player taps "Scan QR Code"
   - App requests camera permission (first time only)
   - Camera view opens with scanning frame
   - Player points camera at host's QR code
   - App automatically detects and scans code
   - Connection is established

3B. **Join via Manual Code** (Backup Method)
   - Player taps "Enter Code Manually"
   - App shows input field for 6-digit code
   - Player types code shown on host's screen
   - Player taps "Join"
   - App validates code and connects

4. **Connection and Assignment**
   - App connects to game session
   - Player is assigned to next available position
   - Player sees waiting screen with:
     - List of joined players
     - Their team assignment
     - "Waiting for game to start..." message

5. **Game Starts**
   - When host starts game, player's screen transitions
   - Player receives their hand of 3 cards
   - Game interface loads

### Alternative Flows

**A1: Invalid Code**
- If code doesn't exist, app shows error
- "Game not found. Please check the code and try again."
- Player remains on code entry screen

**A2: Game Full**
- If all positions filled, app shows error
- "This game is full. Please join a different game."
- Player returns to home screen

**A3: Game Already Started**
- If game in progress, app shows error
- "This game has already started. You cannot join."
- Player returns to home screen

**A4: Connection Issues**
- If network problems occur, app shows retry dialog
- "Connection failed. Retry?"
- Player can retry or cancel

---

## Flow 3: Playing a Round

**Actor**: Active Player (Player whose turn it is)

### Steps

1. **View Hand**
   - Player sees their 3 cards displayed
   - Cards show suit and rank clearly
   - Player's cards are face-up, visible only to them

2. **Decide on Bets** (Optional)
   - If first to act in round, player can:
     - Call "Envido" (if no cards played yet)
     - Call "Truco" (at any time)
     - Play a card without betting
   - If not first to act, player can:
     - Respond to opponent's bet
     - Raise the bet
     - Play a card

3. **Make Envido Bet** (Optional)
   - Player taps "Envido" button
   - Can chain bets: "Envido", "Real Envido", "Falta Envido"
   - Waits for opponent response

4. **Make Truco Bet** (Optional)
   - Player taps "Truco" button
   - If opponent has already called Truco, can "Retruco" or "Vale Cuatro"
   - Waits for opponent response

5. **Play Card**
   - Player taps on one of their cards
   - Card animates from hand to table
   - Card appears in table view (if enabled)
   - Card appears on all connected devices
   - Turn passes to next player

6. **Wait for Other Players**
   - Screen shows "Waiting for [Player Name]..."
   - Can see cards played by other players
   - Can see current trick status

7. **Trick Resolution**
   - Once all players have played, app determines trick winner
   - Winner's name is highlighted
   - Brief animation shows trick being "collected"
   - Next trick begins (if hand not over)

8. **Hand Resolution**
   - After tricks are complete, winner is determined
   - Points are awarded and displayed
   - Animation shows points being added to team score
   - New hand begins (cards dealt)

### Alternative Flows

**A1: Responding to Bet**
- Opponent calls bet (Envido or Truco)
- Player sees modal: "Opponent called [Bet Name]"
- Options displayed:
  - "Accept" (Quiero)
  - "Decline" (No Quiero)
  - "Raise" (if applicable)
- Player must respond before continuing

**A2: Team Signals**
- Player can make signals to partner
- Tap partner's avatar to send predefined signals
- "Signals" menu shows options (if enabled in settings)

**A3: Going to the Mazo (Folding)**
- Player can tap "Fold" button
- Confirmation dialog: "Are you sure you want to fold?"
- If confirmed, player forfeits hand
- Points awarded to opponent

---

## Flow 4: Voice Scoring Interaction

**Actor**: Any Player or System

### Steps

1. **Automatic Listening**
   - App continuously listens during gameplay
   - Microphone indicator shows when listening is active
   - Background noise filtering applies

2. **Voice Detection**
   - Player announces score verbally (e.g., "Envido, 27")
   - System detects speech and processes
   - Confidence level is calculated

3. **High Confidence Recognition** (>85%)
   - System automatically updates score
   - Visual feedback shows recognized phrase
   - Score updates on all devices
   - Subtle animation confirms update

4. **Medium Confidence Recognition** (60-85%)
   - System shows suggestion modal
   - "Did you say: Envido, 27?"
   - Options: "Yes" / "No" / "Edit"
   - Waits for confirmation

5. **Low Confidence Recognition** (<60%)
   - System ignores input (doesn't show anything)
   - Player can use manual input instead

6. **Manual Override Available**
   - At any time, player can tap score area
   - Manual input dialog appears
   - Player enters correct score
   - Score updates for all players

### Alternative Flows

**A1: Disputed Score**
- If system recognizes conflicting scores
- Shows "Score conflict detected" warning
- Pauses game briefly
- Asks players to confirm correct score manually

**A2: Microphone Off**
- If microphone permission denied or hardware issue
- App shows permanent notification
- "Voice scoring unavailable. Using manual mode."
- Player must enter all scores manually

**A3: Noisy Environment**
- If background noise too high
- App shows warning: "Environment too noisy for voice detection"
- Suggests manual mode
- Player can continue with reduced accuracy or switch to manual

---

## Flow 5: Table View Setup

**Actor**: Any Player (typically host or spectator)

### Steps

1. **Enable Table View**
   - Player opens app on a separate device (tablet, laptop, TV)
   - Selects "Table View Mode" from home screen
   - App prompts for game code

2. **Connect to Game**
   - Player enters game code or scans QR code
   - App connects as spectator/display (not as player)
   - App confirms "Connected as Table View"

3. **Display Configuration**
   - Table view shows:
     - Playing area in center
     - All cards currently on table
     - Team scores in corners
     - Current round/hand indicator
     - Turn indicator (whose turn it is)

4. **Real-Time Updates**
   - As players play cards, they appear in center
   - Animations show cards being played
   - Trick winners highlighted
   - Score updates shown with animations

5. **Game Progression**
   - View updates throughout entire game
   - Shows game end screen when game completes
   - "Game Complete - [Team Name] Wins!"

### Alternative Flows

**A1: Disconnect and Reconnect**
- If table view disconnects (network issue)
- App shows "Connection lost. Reconnecting..."
- Automatically attempts to reconnect
- When reconnected, syncs current game state

**A2: Multiple Table Views**
- Multiple devices can connect as table view
- All show same information
- Useful for large gatherings or tournaments

---

## Flow 6: Responding to Bets (Envido/Truco)

**Actor**: Defending Player

### Steps

1. **Bet Notification**
   - Opponent calls "Envido", "Truco", or other bet
   - Player's screen shows modal overlay
   - Modal displays:
     - Bet name and stakes
     - Current score
     - Available options

2. **Evaluate Options**
   - Player reviews their hand
   - Considers current score and situation
   - Decides on response

3. **Select Response**
   - Player taps one of the options:
     - **"Accept" (Quiero)**: Plays for stated stakes
     - **"Decline" (No Quiero)**: Forfeits points
     - **"Raise"** (if available): Increases stakes

4. **Confirm Selection**
   - Some critical decisions show confirmation
   - "Accept Falta Envido? Stakes: 15 points"
   - Player confirms or cancels

5. **Resolution**
   - If accepted: Game continues with raised stakes
   - If declined: Points awarded immediately, new hand starts
   - If raised: Opponent must respond to new bet

### Alternative Flows

**A1: Partner Signals**
- Before responding, player can:
  - Look at partner's signals
  - Request time to consult (within rules)
  - Consider team strategy

**A2: Timeout**
- If player doesn't respond within 30 seconds
- App shows warning: "Please respond to [Bet Name]"
- After 60 seconds total, auto-declines
- Message: "No response. Bet declined automatically."

---

## Flow 7: Game End and Results

**Actor**: All Players

### Steps

1. **Winning Condition Reached**
   - A team reaches 30 points (or configured target)
   - Game immediately ends
   - No further plays allowed

2. **Results Screen**
   - Large animation celebrates winning team
   - Final score displayed prominently:
     - Team A: X points
     - Team B: Y points
   - Game statistics:
     - Total hands played
     - Longest hand
     - Highest Envido
     - Most Trucos called

3. **Options Presented**
   - **"Play Again"**: Start new game with same players
   - **"New Game"**: Return to home, create/join different game
   - **"View Details"**: See detailed game log
   - **"Share Results"**: Export game summary (optional)

4. **Play Again Flow**
   - If "Play Again" selected:
   - Asks "Keep same teams?"
   - If yes: Same configuration, new game starts
   - If no: Players can choose new positions
   - Game starts with 0-0 score

5. **Exit Game**
   - Any player can exit at any time
   - "Leave Game" button in menu
   - Confirmation: "Are you sure you want to leave?"
   - If host leaves: Game ends for all players

### Alternative Flows

**A1: Disconnect Before End**
- If player disconnects before game ends
- App attempts to reconnect
- If reconnection fails within 2 minutes:
  - Game can continue with remaining players (if possible)
  - Or game ends and points are forfeit

**A2: Timeout/Inactive Game**
- If no activity for 30 minutes
- App shows "Still playing?" warning
- After 60 minutes total: Game auto-ends
- State saved for potential resume (optional feature)

---

## Flow 8: Error Recovery

**Actor**: System and Players

### Connection Lost

1. **Detection**
   - System detects lost connection to server
   - Immediate notification: "Connection lost"

2. **Automatic Retry**
   - App attempts to reconnect (3 attempts)
   - Shows progress: "Reconnecting... Attempt 2/3"

3. **Successful Reconnection**
   - "Reconnected!" message
   - Game state syncs
   - Play resumes from last confirmed state

4. **Failed Reconnection**
   - "Unable to reconnect" message
   - Options:
     - "Retry Manually"
     - "End Game"
   - If all players disconnect: Game session ends

### Sync Issues

1. **State Mismatch Detected**
   - System detects inconsistent state between devices
   - Game pauses
   - "Sync issue detected. Resolving..."

2. **Resolution**
   - Server determines authoritative state
   - All devices sync to correct state
   - "Sync complete. Resuming game."
   - Game continues

3. **Unresolvable Conflict**
   - If conflict cannot be resolved
   - "Unable to sync game state"
   - Game ends, no points awarded
   - Players can start new game

---

## Common UI Elements

### Navigation Bar
- **Home**: Return to home screen (with confirmation if game active)
- **Settings**: Access game settings and preferences
- **Help**: View rules and tutorial
- **Profile**: View player stats (if implemented)

### In-Game Menu
- **Pause Game**: Pause current game (with consensus)
- **View Rules**: Quick reference to Truco rules
- **Leave Game**: Exit current game
- **Report Issue**: Report bugs or problems

### Notifications
- **Turn Indicators**: "Your turn" subtle vibration and highlight
- **Bet Alerts**: Modal overlays for bet decisions
- **Score Updates**: Visual and audio feedback
- **Player Actions**: "Player X played [Card Name]"

### Accessibility
- **Color Blind Mode**: Alternative color schemes for cards
- **Large Text**: Increased font sizes
- **Screen Reader**: VoiceOver/TalkBack support
- **Haptic Feedback**: Vibration for key actions
