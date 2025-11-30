/**
 * Tests for Game Configuration
 */

import {
  FaltaEnvidoMode,
  DEFAULT_GAME_CONFIG,
  GAME_PRESETS,
  createGameConfig,
  validateGameConfig
} from './game-config';

describe('Game Configuration', () => {
  describe('DEFAULT_GAME_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_GAME_CONFIG.numPlayers).toBe(4);
      expect(DEFAULT_GAME_CONFIG.florEnabled).toBe(true);
      expect(DEFAULT_GAME_CONFIG.realEnvidoMultiple).toBe(false);
      expect(DEFAULT_GAME_CONFIG.faltaEnvidoMode).toBe(FaltaEnvidoMode.TO_LOSER);
      expect(DEFAULT_GAME_CONFIG.winningScore).toBe(30);
      expect(DEFAULT_GAME_CONFIG.lasBuenasThreshold).toBe(15);
      expect(DEFAULT_GAME_CONFIG.picaPicaMode).toBe(false);
    });
  });

  describe('createGameConfig', () => {
    it('should create config with default values', () => {
      const config = createGameConfig();
      expect(config).toEqual(DEFAULT_GAME_CONFIG);
    });

    it('should override specific values', () => {
      const config = createGameConfig({ numPlayers: 2 });
      expect(config.numPlayers).toBe(2);
      expect(config.florEnabled).toBe(true); // Still has defaults
    });

    it('should override multiple values', () => {
      const config = createGameConfig({
        numPlayers: 6,
        picaPicaMode: true,
        florEnabled: false
      });
      expect(config.numPlayers).toBe(6);
      expect(config.picaPicaMode).toBe(true);
      expect(config.florEnabled).toBe(false);
    });
  });

  describe('validateGameConfig', () => {
    it('should validate config with 2 players', () => {
      const config = createGameConfig({ numPlayers: 2 });
      expect(() => validateGameConfig(config)).not.toThrow();
    });

    it('should validate config with 4 players', () => {
      const config = createGameConfig({ numPlayers: 4 });
      expect(() => validateGameConfig(config)).not.toThrow();
    });

    it('should validate config with 6 players', () => {
      const config = createGameConfig({ numPlayers: 6 });
      expect(() => validateGameConfig(config)).not.toThrow();
    });

    it('should throw error for invalid number of players', () => {
      const config = { ...DEFAULT_GAME_CONFIG, numPlayers: 3 as 2 | 4 | 6 };
      expect(() => validateGameConfig(config)).toThrow(
        'Number of players must be 2, 4, or 6'
      );
    });

    it('should throw error for negative winning score', () => {
      const config = createGameConfig({ winningScore: -1 });
      expect(() => validateGameConfig(config)).toThrow(
        'Winning score must be positive'
      );
    });

    it('should throw error for zero winning score', () => {
      const config = createGameConfig({ winningScore: 0 });
      expect(() => validateGameConfig(config)).toThrow(
        'Winning score must be positive'
      );
    });

    it('should throw error for negative Las Buenas threshold', () => {
      const config = createGameConfig({ lasBuenasThreshold: -1 });
      expect(() => validateGameConfig(config)).toThrow(
        'Las Buenas threshold must be between 0 and winning score'
      );
    });

    it('should throw error for Las Buenas threshold equal to winning score', () => {
      const config = createGameConfig({ winningScore: 30, lasBuenasThreshold: 30 });
      expect(() => validateGameConfig(config)).toThrow(
        'Las Buenas threshold must be between 0 and winning score'
      );
    });

    it('should throw error for Las Buenas threshold greater than winning score', () => {
      const config = createGameConfig({ winningScore: 30, lasBuenasThreshold: 35 });
      expect(() => validateGameConfig(config)).toThrow(
        'Las Buenas threshold must be between 0 and winning score'
      );
    });

    it('should throw error for Pica Pica mode with non-6 players', () => {
      const config = createGameConfig({ numPlayers: 4, picaPicaMode: true });
      expect(() => validateGameConfig(config)).toThrow(
        'Pica Pica mode is only available for 6-player games'
      );
    });

    it('should allow Pica Pica mode with 6 players', () => {
      const config = createGameConfig({ numPlayers: 6, picaPicaMode: true });
      expect(() => validateGameConfig(config)).not.toThrow();
    });

    it('should return true for valid config', () => {
      const config = createGameConfig();
      expect(validateGameConfig(config)).toBe(true);
    });
  });

  describe('GAME_PRESETS', () => {
    describe('TRADITIONAL', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.TRADITIONAL;
        expect(config.numPlayers).toBe(4);
        expect(config.florEnabled).toBe(true);
        expect(config.realEnvidoMultiple).toBe(false);
        expect(config.faltaEnvidoMode).toBe(FaltaEnvidoMode.TO_LOSER);
        expect(config.winningScore).toBe(30);
        expect(config.lasBuenasThreshold).toBe(15);
        expect(config.picaPicaMode).toBe(false);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.TRADITIONAL)).not.toThrow();
      });
    });

    describe('TWO_PLAYER', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.TWO_PLAYER;
        expect(config.numPlayers).toBe(2);
        expect(config.florEnabled).toBe(false);
        expect(config.winningScore).toBe(30);
        expect(config.picaPicaMode).toBe(false);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.TWO_PLAYER)).not.toThrow();
      });
    });

    describe('SIX_PLAYER', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.SIX_PLAYER;
        expect(config.numPlayers).toBe(6);
        expect(config.florEnabled).toBe(true);
        expect(config.picaPicaMode).toBe(false);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.SIX_PLAYER)).not.toThrow();
      });
    });

    describe('PICA_PICA', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.PICA_PICA;
        expect(config.numPlayers).toBe(6);
        expect(config.florEnabled).toBe(false);
        expect(config.picaPicaMode).toBe(true);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.PICA_PICA)).not.toThrow();
      });
    });

    describe('QUICK', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.QUICK;
        expect(config.winningScore).toBe(15);
        expect(config.lasBuenasThreshold).toBe(8);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.QUICK)).not.toThrow();
      });
    });

    describe('FLEXIBLE_ENVIDO', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.FLEXIBLE_ENVIDO;
        expect(config.realEnvidoMultiple).toBe(true);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.FLEXIBLE_ENVIDO)).not.toThrow();
      });
    });

    describe('FALTA_TO_LEADER', () => {
      it('should have correct values', () => {
        const config = GAME_PRESETS.FALTA_TO_LEADER;
        expect(config.faltaEnvidoMode).toBe(FaltaEnvidoMode.TO_LEADER);
      });

      it('should be valid', () => {
        expect(() => validateGameConfig(GAME_PRESETS.FALTA_TO_LEADER)).not.toThrow();
      });
    });
  });

  describe('FaltaEnvidoMode', () => {
    it('should have TO_LEADER value', () => {
      expect(FaltaEnvidoMode.TO_LEADER).toBe('to_leader');
    });

    it('should have TO_LOSER value', () => {
      expect(FaltaEnvidoMode.TO_LOSER).toBe('to_loser');
    });
  });
});
