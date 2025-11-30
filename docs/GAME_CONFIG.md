# Game Configuration

Truco4AR supports multiple game variants and rule customizations to accommodate different regional styles and preferences.

## Configuration Options

### Number of Players

- **2 players**: Head-to-head play (mano a mano)
- **4 players**: Team play with partners (traditional)

### Flor Betting

**`florEnabled: boolean`**

- `true`: Flor betting is available when a player has three cards of the same suit
- `false`: Flor betting is disabled (common in some regions)

**Default**: `true`

### Real Envido Multiple

**`realEnvidoMultiple: boolean`**

- `true`: Real Envido can be called multiple times, similar to Envido
- `false`: Real Envido can only be called once after Envido or Envido Envido (traditional)

**Default**: `false`

**Example with `realEnvidoMultiple: true`:**
```
Player A: "Envido"           → 2 points
Player B: "Real Envido"      → +3 points = 5 total
Player A: "Real Envido"      → +3 points = 8 total
Player B: "Quiero"           → 8 points at stake
```

### Falta Envido Mode

**`faltaEnvidoMode: FaltaEnvidoMode`**

#### TO_LOSER (Traditional)
Awards points based on game progression:
- **Both teams in "Las Malas" (< 15)**: Winner takes what the loser needs to reach 30
- **Leader in "Las Buenas" (≥ 15)**: Winner takes what the leader needs to win

**Example:**
- Team A: 10 points, Team B: 5 points
- Team A calls "Falta Envido"
- At stake: 25 points (what Team B needs to win)

#### TO_LEADER (Aggressive)
Always awards the points the leader needs to win, regardless of progression.

**Example:**
- Team A: 10 points, Team B: 5 points
- Team A calls "Falta Envido"
- At stake: 20 points (what Team A, the leader, needs to win)

**Default**: `FaltaEnvidoMode.TO_LOSER`

### Winning Score

**`winningScore: number`**

Points needed to win the game.

- `30`: Traditional full game (Las Malas 0-14, Las Buenas 15-29)
- `15`: Quick game

**Default**: `30`

### Las Buenas Threshold

**`lasBuenasThreshold: number`**

Score threshold for "Las Buenas" (the second half of the game).

**Default**: `15`

## Presets

Truco4AR includes several preset configurations:

### TRADITIONAL
```typescript
{
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: false,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LOSER,
  winningScore: 30,
  lasBuenasThreshold: 15
}
```

Classic 4-player Argentine Truco with Flor.

### TWO_PLAYER
```typescript
{
  numPlayers: 2,
  florEnabled: false,
  realEnvidoMultiple: false,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LOSER,
  winningScore: 30,
  lasBuenasThreshold: 15
}
```

Head-to-head play without Flor.

### QUICK
```typescript
{
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: false,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LOSER,
  winningScore: 15,
  lasBuenasThreshold: 8
}
```

Fast-paced game to 15 points.

### FLEXIBLE_ENVIDO
```typescript
{
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: true,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LOSER,
  winningScore: 30,
  lasBuenasThreshold: 15
}
```

Allows Real Envido to be called multiple times for higher stakes.

### FALTA_TO_LEADER
```typescript
{
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: false,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LEADER,
  winningScore: 30,
  lasBuenasThreshold: 15
}
```

More aggressive Falta Envido scoring favoring the leader.

## Usage Examples

### Creating a Custom Configuration

```typescript
import { createGameConfig, FaltaEnvidoMode } from '@truco4ar/shared';

// Create a custom 2-player game with flexible Real Envido
const config = createGameConfig({
  numPlayers: 2,
  florEnabled: false,
  realEnvidoMultiple: true
});
```

### Using a Preset

```typescript
import { GAME_PRESETS } from '@truco4ar/shared';

// Use the quick game preset
const config = GAME_PRESETS.QUICK;
```

### Validating Configuration

```typescript
import { validateGameConfig } from '@truco4ar/shared';

try {
  validateGameConfig(config);
  console.log('Configuration is valid');
} catch (error) {
  console.error('Invalid configuration:', error.message);
}
```

## Configuration in Game Logic

The game configuration affects various validation functions:

### Envido Betting
```typescript
import { canCallEnvidoBet } from '@truco4ar/shared';

// Pass config to enable flexible Real Envido
const canCall = canCallEnvidoBet(
  bettingState,
  BetType.REAL_ENVIDO,
  GamePhase.BETTING,
  config // Checks realEnvidoMultiple setting
);
```

### Flor Betting
```typescript
import { canCallFlorBet } from '@truco4ar/shared';

// Automatically checks if Flor is enabled
const canCall = canCallFlorBet(
  bettingState,
  BetType.FLOR,
  GamePhase.BETTING,
  playerHasFlor,
  config // Returns false if florEnabled is false
);
```

### Falta Envido Points
```typescript
import { calculateFaltaEnvidoPoints, FaltaEnvidoMode } from '@truco4ar/shared';

const points = calculateFaltaEnvidoPoints(
  team1Score,
  team2Score,
  config.winningScore,
  config.lasBuenasThreshold,
  config.faltaEnvidoMode === FaltaEnvidoMode.TO_LEADER ? 'to_leader' : 'to_loser'
);
```

## Regional Variations

Different regions play Truco with different rules. Here are common variations:

### Uruguay
- Often plays without Flor
- 2-player games are common
```typescript
const config = GAME_PRESETS.TWO_PLAYER;
```

### Argentina (Classic)
- Flor is standard
- 4-player team games
```typescript
const config = GAME_PRESETS.TRADITIONAL;
```

### Casual/Fast Games
- Reduced winning score for quicker games
```typescript
const config = GAME_PRESETS.QUICK;
```

## Advanced Customization

For tournament or custom house rules, you can create highly specific configurations:

```typescript
const tournamentConfig = createGameConfig({
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: true,  // More betting options
  faltaEnvidoMode: FaltaEnvidoMode.TO_LEADER, // Higher stakes
  winningScore: 30,
  lasBuenasThreshold: 15
});
```

## Configuration Persistence

When building a full application, store the game configuration:

- **In game sessions**: Include config in session state
- **In user preferences**: Let players save their preferred rules
- **In matchmaking**: Match players with compatible rule preferences

## Future Extensions

Potential future configuration options:

- Custom card values/hierarchy
- Alternative scoring systems
- Tournament brackets
- Time limits per action
- Automatic forfeit on disconnection
