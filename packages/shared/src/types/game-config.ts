/**
 * Game configuration options for Truco4AR
 * Allows customization of game rules and variants
 */

/**
 * Falta Envido scoring mode
 */
export enum FaltaEnvidoMode {
  /** Falta Envido is worth points needed by the leader to win */
  TO_LEADER = 'to_leader',
  /** Falta Envido is worth points needed by the loser to win (traditional) */
  TO_LOSER = 'to_loser'
}

/**
 * Game configuration for Truco rules
 */
export interface GameConfig {
  /** Number of players (2 or 4) */
  readonly numPlayers: 2 | 4;

  /** Enable Flor betting */
  readonly florEnabled: boolean;

  /** Allow Real Envido to be called multiple times (like Envido) */
  readonly realEnvidoMultiple: boolean;

  /** Falta Envido scoring mode */
  readonly faltaEnvidoMode: FaltaEnvidoMode;

  /** Score needed to win the game */
  readonly winningScore: number;

  /** Threshold for "Las Buenas" (typically 15) */
  readonly lasBuenasThreshold: number;
}

/**
 * Default game configuration (traditional Argentine Truco)
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  numPlayers: 4,
  florEnabled: true,
  realEnvidoMultiple: false,
  faltaEnvidoMode: FaltaEnvidoMode.TO_LOSER,
  winningScore: 30,
  lasBuenasThreshold: 15
};

/**
 * Creates a game configuration with custom options
 * @param options Partial configuration options
 * @returns Complete game configuration
 */
export function createGameConfig(options: Partial<GameConfig> = {}): GameConfig {
  return {
    ...DEFAULT_GAME_CONFIG,
    ...options
  };
}

/**
 * Validates game configuration
 * @param config Game configuration to validate
 * @returns True if configuration is valid
 * @throws Error if configuration is invalid
 */
export function validateGameConfig(config: GameConfig): boolean {
  if (config.numPlayers !== 2 && config.numPlayers !== 4) {
    throw new Error('Number of players must be 2 or 4');
  }

  if (config.winningScore <= 0) {
    throw new Error('Winning score must be positive');
  }

  if (config.lasBuenasThreshold < 0 || config.lasBuenasThreshold >= config.winningScore) {
    throw new Error('Las Buenas threshold must be between 0 and winning score');
  }

  return true;
}

/**
 * Preset configurations for common game variants
 */
export const GAME_PRESETS = {
  /** Traditional 4-player game with Flor */
  TRADITIONAL: createGameConfig(),

  /** 2-player game without Flor */
  TWO_PLAYER: createGameConfig({
    numPlayers: 2,
    florEnabled: false
  }),

  /** Quick game to 15 points */
  QUICK: createGameConfig({
    winningScore: 15,
    lasBuenasThreshold: 8
  }),

  /** Flexible Envido rules (Real Envido can be called multiple times) */
  FLEXIBLE_ENVIDO: createGameConfig({
    realEnvidoMultiple: true
  }),

  /** Falta Envido to leader (more aggressive) */
  FALTA_TO_LEADER: createGameConfig({
    faltaEnvidoMode: FaltaEnvidoMode.TO_LEADER
  })
} as const;
