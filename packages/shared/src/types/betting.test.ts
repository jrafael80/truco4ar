/**
 * Tests for betting types and state management
 */

import {
  BetType,
  BetResponse,
  BetStatus,
  Bet,
  BettingState,
  createBet,
  respondToBet,
  createBettingState,
  addBet,
  setTrucoValue,
  resolveEnvido,
  resolveFlor,
  isTrucoBet,
  isEnvidoBet,
  isFlorBet,
  getNextTrucoBet,
  getTrucoPoints,
  getEnvidoPoints,
  calculateEnvidoChainPoints,
  calculateFaltaEnvidoPoints
} from './betting';

describe('Betting Types', () => {
  describe('createBet', () => {
    it('should create a new bet with pending status', () => {
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);

      expect(bet.type).toBe(BetType.TRUCO);
      expect(bet.callerId).toBe('player-1');
      expect(bet.callerTeamId).toBe('team-1');
      expect(bet.pointsAtStake).toBe(2);
      expect(bet.status).toBe(BetStatus.PENDING);
      expect(bet.responderId).toBeUndefined();
      expect(bet.response).toBeUndefined();
    });

    it('should create an Envido bet', () => {
      const bet = createBet(BetType.ENVIDO, 'player-2', 'team-2', 2);

      expect(bet.type).toBe(BetType.ENVIDO);
      expect(bet.callerTeamId).toBe('team-2');
    });

    it('should create a Flor bet', () => {
      const bet = createBet(BetType.FLOR, 'player-3', 'team-1', 3);

      expect(bet.type).toBe(BetType.FLOR);
      expect(bet.pointsAtStake).toBe(3);
    });
  });

  describe('respondToBet', () => {
    let bet: Bet;

    beforeEach(() => {
      bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
    });

    it('should accept a bet', () => {
      const updated = respondToBet(bet, BetResponse.ACCEPT, 'player-2');

      expect(updated.response).toBe(BetResponse.ACCEPT);
      expect(updated.responderId).toBe('player-2');
      expect(updated.status).toBe(BetStatus.ACCEPTED);
    });

    it('should decline a bet', () => {
      const updated = respondToBet(bet, BetResponse.DECLINE, 'player-2');

      expect(updated.response).toBe(BetResponse.DECLINE);
      expect(updated.responderId).toBe('player-2');
      expect(updated.status).toBe(BetStatus.DECLINED);
    });

    it('should raise a bet', () => {
      const updated = respondToBet(bet, BetResponse.RAISE, 'player-2');

      expect(updated.response).toBe(BetResponse.RAISE);
      expect(updated.responderId).toBe('player-2');
      expect(updated.status).toBe(BetStatus.RAISED);
    });

    it('should not modify original bet', () => {
      respondToBet(bet, BetResponse.ACCEPT, 'player-2');

      expect(bet.status).toBe(BetStatus.PENDING);
      expect(bet.response).toBeUndefined();
      expect(bet.responderId).toBeUndefined();
    });
  });

  describe('createBettingState', () => {
    it('should create initial betting state with no bets', () => {
      const state = createBettingState();

      expect(state.trucoBets).toEqual([]);
      expect(state.envidoBets).toEqual([]);
      expect(state.florBets).toEqual([]);
      expect(state.currentTrucoValue).toBe(1);
      expect(state.envidoResolved).toBe(false);
      expect(state.florResolved).toBe(false);
    });
  });

  describe('addBet', () => {
    let state: BettingState;

    beforeEach(() => {
      state = createBettingState();
    });

    it('should add Truco bet to trucoBets array', () => {
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const updated = addBet(state, bet);

      expect(updated.trucoBets).toHaveLength(1);
      expect(updated.trucoBets[0]).toBe(bet);
      expect(updated.envidoBets).toHaveLength(0);
      expect(updated.florBets).toHaveLength(0);
    });

    it('should add Retruco bet to trucoBets array', () => {
      const bet = createBet(BetType.RETRUCO, 'player-1', 'team-1', 3);
      const updated = addBet(state, bet);

      expect(updated.trucoBets).toHaveLength(1);
      expect(updated.trucoBets[0]).toBe(bet);
    });

    it('should add Envido bet to envidoBets array', () => {
      const bet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const updated = addBet(state, bet);

      expect(updated.envidoBets).toHaveLength(1);
      expect(updated.envidoBets[0]).toBe(bet);
      expect(updated.trucoBets).toHaveLength(0);
    });

    it('should add Real Envido bet to envidoBets array', () => {
      const bet = createBet(BetType.REAL_ENVIDO, 'player-1', 'team-1', 5);
      const updated = addBet(state, bet);

      expect(updated.envidoBets).toHaveLength(1);
    });

    it('should add Flor bet to florBets array', () => {
      const bet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      const updated = addBet(state, bet);

      expect(updated.florBets).toHaveLength(1);
      expect(updated.florBets[0]).toBe(bet);
      expect(updated.trucoBets).toHaveLength(0);
      expect(updated.envidoBets).toHaveLength(0);
    });

    it('should add Contra Flor bet to florBets array', () => {
      const bet = createBet(BetType.CONTRA_FLOR, 'player-1', 'team-1', 6);
      const updated = addBet(state, bet);

      expect(updated.florBets).toHaveLength(1);
    });

    it('should not modify original state', () => {
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      addBet(state, bet);

      expect(state.trucoBets).toHaveLength(0);
    });

    it('should add multiple bets of same type', () => {
      const bet1 = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const bet2 = createBet(BetType.RETRUCO, 'player-2', 'team-2', 3);

      let updated = addBet(state, bet1);
      updated = addBet(updated, bet2);

      expect(updated.trucoBets).toHaveLength(2);
      expect(updated.trucoBets[0]).toBe(bet1);
      expect(updated.trucoBets[1]).toBe(bet2);
    });
  });

  describe('setTrucoValue', () => {
    it('should update current Truco value', () => {
      const state = createBettingState();
      const updated = setTrucoValue(state, 3);

      expect(updated.currentTrucoValue).toBe(3);
    });

    it('should not modify original state', () => {
      const state = createBettingState();
      setTrucoValue(state, 4);

      expect(state.currentTrucoValue).toBe(1);
    });
  });

  describe('resolveEnvido', () => {
    it('should mark Envido as resolved', () => {
      const state = createBettingState();
      const updated = resolveEnvido(state);

      expect(updated.envidoResolved).toBe(true);
    });

    it('should not modify original state', () => {
      const state = createBettingState();
      resolveEnvido(state);

      expect(state.envidoResolved).toBe(false);
    });
  });

  describe('resolveFlor', () => {
    it('should mark Flor as resolved', () => {
      const state = createBettingState();
      const updated = resolveFlor(state);

      expect(updated.florResolved).toBe(true);
    });

    it('should not modify original state', () => {
      const state = createBettingState();
      resolveFlor(state);

      expect(state.florResolved).toBe(false);
    });
  });

  describe('Type Guards', () => {
    describe('isTrucoBet', () => {
      it('should return true for Truco bets', () => {
        expect(isTrucoBet(BetType.TRUCO)).toBe(true);
        expect(isTrucoBet(BetType.RETRUCO)).toBe(true);
        expect(isTrucoBet(BetType.VALE_CUATRO)).toBe(true);
      });

      it('should return false for non-Truco bets', () => {
        expect(isTrucoBet(BetType.ENVIDO)).toBe(false);
        expect(isTrucoBet(BetType.REAL_ENVIDO)).toBe(false);
        expect(isTrucoBet(BetType.FLOR)).toBe(false);
        expect(isTrucoBet(BetType.CONTRA_FLOR)).toBe(false);
      });
    });

    describe('isEnvidoBet', () => {
      it('should return true for Envido bets', () => {
        expect(isEnvidoBet(BetType.ENVIDO)).toBe(true);
        expect(isEnvidoBet(BetType.ENVIDO_ENVIDO)).toBe(true);
        expect(isEnvidoBet(BetType.REAL_ENVIDO)).toBe(true);
        expect(isEnvidoBet(BetType.FALTA_ENVIDO)).toBe(true);
      });

      it('should return false for non-Envido bets', () => {
        expect(isEnvidoBet(BetType.TRUCO)).toBe(false);
        expect(isEnvidoBet(BetType.RETRUCO)).toBe(false);
        expect(isEnvidoBet(BetType.FLOR)).toBe(false);
      });
    });

    describe('isFlorBet', () => {
      it('should return true for Flor bets', () => {
        expect(isFlorBet(BetType.FLOR)).toBe(true);
        expect(isFlorBet(BetType.CONTRA_FLOR)).toBe(true);
        expect(isFlorBet(BetType.CONTRA_FLOR_AL_RESTO)).toBe(true);
      });

      it('should return false for non-Flor bets', () => {
        expect(isFlorBet(BetType.TRUCO)).toBe(false);
        expect(isFlorBet(BetType.ENVIDO)).toBe(false);
        expect(isFlorBet(BetType.REAL_ENVIDO)).toBe(false);
      });
    });
  });

  describe('Betting Progression', () => {
    describe('getNextTrucoBet', () => {
      it('should return TRUCO when current is null', () => {
        expect(getNextTrucoBet(null)).toBe(BetType.TRUCO);
      });

      it('should return RETRUCO after TRUCO', () => {
        expect(getNextTrucoBet(BetType.TRUCO)).toBe(BetType.RETRUCO);
      });

      it('should return VALE_CUATRO after RETRUCO', () => {
        expect(getNextTrucoBet(BetType.RETRUCO)).toBe(BetType.VALE_CUATRO);
      });

      it('should return null after VALE_CUATRO (max)', () => {
        expect(getNextTrucoBet(BetType.VALE_CUATRO)).toBeNull();
      });

      it('should return null for non-Truco bets', () => {
        expect(getNextTrucoBet(BetType.ENVIDO)).toBeNull();
        expect(getNextTrucoBet(BetType.FLOR)).toBeNull();
      });
    });

    describe('getTrucoPoints', () => {
      it('should return 2 for TRUCO', () => {
        expect(getTrucoPoints(BetType.TRUCO)).toBe(2);
      });

      it('should return 3 for RETRUCO', () => {
        expect(getTrucoPoints(BetType.RETRUCO)).toBe(3);
      });

      it('should return 4 for VALE_CUATRO', () => {
        expect(getTrucoPoints(BetType.VALE_CUATRO)).toBe(4);
      });

      it('should return 1 for non-Truco bets', () => {
        expect(getTrucoPoints(BetType.ENVIDO)).toBe(1);
        expect(getTrucoPoints(BetType.FLOR)).toBe(1);
      });
    });

    describe('getEnvidoPoints', () => {
      it('should return 2 for ENVIDO', () => {
        expect(getEnvidoPoints(BetType.ENVIDO)).toBe(2);
      });

      it('should return 2 for ENVIDO_ENVIDO (adds to chain)', () => {
        expect(getEnvidoPoints(BetType.ENVIDO_ENVIDO)).toBe(2);
      });

      it('should return 3 for REAL_ENVIDO (adds to chain)', () => {
        expect(getEnvidoPoints(BetType.REAL_ENVIDO)).toBe(3);
      });

      it('should return -1 for FALTA_ENVIDO (special case)', () => {
        expect(getEnvidoPoints(BetType.FALTA_ENVIDO)).toBe(-1);
      });

      it('should return 0 for non-Envido bets', () => {
        expect(getEnvidoPoints(BetType.TRUCO)).toBe(0);
        expect(getEnvidoPoints(BetType.FLOR)).toBe(0);
      });
    });
  });

  describe('calculateEnvidoChainPoints', () => {
    it('should return 0 for empty Envido chain', () => {
      const state = createBettingState();
      expect(calculateEnvidoChainPoints(state)).toBe(0);
    });

    it('should return 2 for single ENVIDO', () => {
      let state = createBettingState();
      const bet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(calculateEnvidoChainPoints(state)).toBe(2);
    });

    it('should return 4 for ENVIDO + ENVIDO', () => {
      let state = createBettingState();

      const bet1 = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet1);

      const bet2 = createBet(BetType.ENVIDO_ENVIDO, 'player-2', 'team-2', 2);
      state = addBet(state, bet2);

      expect(calculateEnvidoChainPoints(state)).toBe(4); // 2 + 2
    });

    it('should return 7 for ENVIDO + ENVIDO + REAL_ENVIDO', () => {
      let state = createBettingState();

      const bet1 = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet1);

      const bet2 = createBet(BetType.ENVIDO_ENVIDO, 'player-2', 'team-2', 2);
      state = addBet(state, bet2);

      const bet3 = createBet(BetType.REAL_ENVIDO, 'player-1', 'team-1', 3);
      state = addBet(state, bet3);

      expect(calculateEnvidoChainPoints(state)).toBe(7); // 2 + 2 + 3
    });

    it('should return 5 for ENVIDO + REAL_ENVIDO', () => {
      let state = createBettingState();

      const bet1 = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet1);

      const bet2 = createBet(BetType.REAL_ENVIDO, 'player-2', 'team-2', 3);
      state = addBet(state, bet2);

      expect(calculateEnvidoChainPoints(state)).toBe(5); // 2 + 3
    });

    it('should ignore FALTA_ENVIDO in calculation', () => {
      let state = createBettingState();

      const bet1 = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet1);

      const bet2 = createBet(BetType.FALTA_ENVIDO, 'player-2', 'team-2', -1);
      state = addBet(state, bet2);

      expect(calculateEnvidoChainPoints(state)).toBe(2); // Only ENVIDO counts
    });
  });

  describe('calculateFaltaEnvidoPoints', () => {
    it('should return minimum points needed by either team', () => {
      expect(calculateFaltaEnvidoPoints(20, 25, 30)).toBe(5); // Team 2 needs 5
      expect(calculateFaltaEnvidoPoints(25, 20, 30)).toBe(5); // Team 1 needs 10, team 2 needs 10 -> min is 10
    });

    it('should calculate correctly when team 1 needs fewer points', () => {
      expect(calculateFaltaEnvidoPoints(28, 20, 30)).toBe(2); // Team 1 needs 2
    });

    it('should calculate correctly when team 2 needs fewer points', () => {
      expect(calculateFaltaEnvidoPoints(10, 29, 30)).toBe(1); // Team 2 needs 1
    });

    it('should handle equal scores', () => {
      expect(calculateFaltaEnvidoPoints(15, 15, 30)).toBe(15); // Both need 15
    });

    it('should use default winning score of 30', () => {
      expect(calculateFaltaEnvidoPoints(20, 25)).toBe(5);
    });

    it('should work with custom winning scores', () => {
      expect(calculateFaltaEnvidoPoints(20, 25, 40)).toBe(15); // Team 2 needs 15
      expect(calculateFaltaEnvidoPoints(10, 5, 15)).toBe(5); // Team 2 needs 10, team 1 needs 5 -> min is 5
    });

    it('should calculate max possible points (30 with scores at 0)', () => {
      expect(calculateFaltaEnvidoPoints(0, 0, 30)).toBe(30);
    });

    it('should calculate when one team is close to winning', () => {
      expect(calculateFaltaEnvidoPoints(29, 15, 30)).toBe(1); // Team 1 needs 1
    });
  });
});
