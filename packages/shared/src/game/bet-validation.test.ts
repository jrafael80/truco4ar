/**
 * Tests for bet validation logic
 */

import {
  canCallTrucoBet,
  canCallEnvidoBet,
  canCallFlorBet,
  canRespondToBet,
  getDeclinePoints
} from './bet-validation';
import {
  BetType,
  createBet,
  respondToBet,
  createBettingState,
  addBet,
  BetResponse
} from '../types/betting';
import { GamePhase } from '../types/game-state';

describe('Bet Validation', () => {
  describe('canCallTrucoBet', () => {
    it('should allow calling TRUCO when no Truco bets exist', () => {
      const state = createBettingState();
      expect(canCallTrucoBet(state, BetType.TRUCO)).toBe(true);
    });

    it('should not allow calling TRUCO when pending bet exists', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(canCallTrucoBet(state, BetType.TRUCO)).toBe(false);
    });

    it('should allow calling TRUCO after previous bet is accepted', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedBet = respondToBet(bet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedBet);

      expect(canCallTrucoBet(state, BetType.TRUCO)).toBe(true);
    });

    it('should allow RETRUCO only after TRUCO is accepted', () => {
      let state = createBettingState();
      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedTruco = respondToBet(trucoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedTruco);

      expect(canCallTrucoBet(state, BetType.RETRUCO)).toBe(true);
    });

    it('should not allow RETRUCO when TRUCO is pending', () => {
      let state = createBettingState();
      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      state = addBet(state, trucoBet);

      expect(canCallTrucoBet(state, BetType.RETRUCO)).toBe(false);
    });

    it('should not allow RETRUCO when TRUCO is declined', () => {
      let state = createBettingState();
      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const declinedTruco = respondToBet(trucoBet, BetResponse.DECLINE, 'player-2');
      state = addBet(state, declinedTruco);

      expect(canCallTrucoBet(state, BetType.RETRUCO)).toBe(false);
    });

    it('should allow VALE_CUATRO only after RETRUCO is accepted', () => {
      let state = createBettingState();

      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedTruco = respondToBet(trucoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedTruco);

      const retrucoBet = createBet(BetType.RETRUCO, 'player-2', 'team-2', 3);
      const acceptedRetruco = respondToBet(retrucoBet, BetResponse.ACCEPT, 'player-1');
      state = addBet(state, acceptedRetruco);

      expect(canCallTrucoBet(state, BetType.VALE_CUATRO)).toBe(true);
    });

    it('should not allow VALE_CUATRO when RETRUCO is pending', () => {
      let state = createBettingState();

      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedTruco = respondToBet(trucoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedTruco);

      const retrucoBet = createBet(BetType.RETRUCO, 'player-2', 'team-2', 3);
      state = addBet(state, retrucoBet);

      expect(canCallTrucoBet(state, BetType.VALE_CUATRO)).toBe(false);
    });

    it('should not allow VALE_CUATRO without RETRUCO', () => {
      let state = createBettingState();
      const trucoBet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedTruco = respondToBet(trucoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedTruco);

      expect(canCallTrucoBet(state, BetType.VALE_CUATRO)).toBe(false);
    });

    it('should return false for non-Truco bet types', () => {
      const state = createBettingState();
      expect(canCallTrucoBet(state, BetType.ENVIDO)).toBe(false);
      expect(canCallTrucoBet(state, BetType.FLOR)).toBe(false);
    });
  });

  describe('canCallEnvidoBet', () => {
    it('should allow calling ENVIDO in BETTING phase', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should allow calling ENVIDO in DEALING phase', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.DEALING)).toBe(true);
    });

    it('should not allow calling ENVIDO in PLAYING phase', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.PLAYING)).toBe(false);
    });

    it('should not allow calling ENVIDO in SCORING phase', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.SCORING)).toBe(false);
    });

    it('should not allow calling ENVIDO after it is resolved', () => {
      const state = {
        ...createBettingState(),
        envidoResolved: true
      };
      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.BETTING)).toBe(false);
    });

    it('should not allow calling ENVIDO when pending bet exists', () => {
      let state = createBettingState();
      const bet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(canCallEnvidoBet(state, BetType.ENVIDO, GamePhase.BETTING)).toBe(false);
    });

    it('should allow ENVIDO_ENVIDO after ENVIDO is accepted', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedEnvido);

      expect(canCallEnvidoBet(state, BetType.ENVIDO_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should allow ENVIDO_ENVIDO after ENVIDO is raised', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const raisedEnvido = respondToBet(envidoBet, BetResponse.RAISE, 'player-2');
      state = addBet(state, raisedEnvido);

      expect(canCallEnvidoBet(state, BetType.ENVIDO_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should not allow ENVIDO_ENVIDO when ENVIDO is pending', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, envidoBet);

      expect(canCallEnvidoBet(state, BetType.ENVIDO_ENVIDO, GamePhase.BETTING)).toBe(false);
    });

    it('should allow REAL_ENVIDO after ENVIDO is accepted', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedEnvido);

      expect(canCallEnvidoBet(state, BetType.REAL_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should allow REAL_ENVIDO after ENVIDO_ENVIDO', () => {
      let state = createBettingState();

      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedEnvido);

      const envidoEnvidoBet = createBet(BetType.ENVIDO_ENVIDO, 'player-2', 'team-2', 4);
      const acceptedEnvidoEnvido = respondToBet(envidoEnvidoBet, BetResponse.ACCEPT, 'player-1');
      state = addBet(state, acceptedEnvidoEnvido);

      expect(canCallEnvidoBet(state, BetType.REAL_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should allow FALTA_ENVIDO after any accepted Envido bet', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedEnvido);

      expect(canCallEnvidoBet(state, BetType.FALTA_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should allow FALTA_ENVIDO after any raised Envido bet', () => {
      let state = createBettingState();
      const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      const raisedEnvido = respondToBet(envidoBet, BetResponse.RAISE, 'player-2');
      state = addBet(state, raisedEnvido);

      expect(canCallEnvidoBet(state, BetType.FALTA_ENVIDO, GamePhase.BETTING)).toBe(true);
    });

    it('should not allow FALTA_ENVIDO when no Envido bet exists', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.FALTA_ENVIDO, GamePhase.BETTING)).toBe(false);
    });

    it('should return false for non-Envido bet types', () => {
      const state = createBettingState();
      expect(canCallEnvidoBet(state, BetType.TRUCO, GamePhase.BETTING)).toBe(false);
      expect(canCallEnvidoBet(state, BetType.FLOR, GamePhase.BETTING)).toBe(false);
    });
  });

  describe('canCallFlorBet', () => {
    it('should allow calling FLOR in BETTING phase when player has Flor', () => {
      const state = createBettingState();
      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.BETTING, true)).toBe(true);
    });

    it('should allow calling FLOR in DEALING phase when player has Flor', () => {
      const state = createBettingState();
      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.DEALING, true)).toBe(true);
    });

    it('should not allow calling FLOR in PLAYING phase', () => {
      const state = createBettingState();
      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.PLAYING, true)).toBe(false);
    });

    it('should not allow calling FLOR when player does not have Flor', () => {
      const state = createBettingState();
      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.BETTING, false)).toBe(false);
    });

    it('should not allow calling FLOR after it is resolved', () => {
      const state = {
        ...createBettingState(),
        florResolved: true
      };
      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.BETTING, true)).toBe(false);
    });

    it('should not allow second FLOR call', () => {
      let state = createBettingState();
      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, florBet);

      expect(canCallFlorBet(state, BetType.FLOR, GamePhase.BETTING, true)).toBe(false);
    });

    it('should allow CONTRA_FLOR in response to pending FLOR when player has Flor', () => {
      let state = createBettingState();
      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, florBet);

      expect(canCallFlorBet(state, BetType.CONTRA_FLOR, GamePhase.BETTING, true)).toBe(true);
    });

    it('should not allow CONTRA_FLOR when FLOR is accepted', () => {
      let state = createBettingState();
      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      const acceptedFlor = respondToBet(florBet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedFlor);

      expect(canCallFlorBet(state, BetType.CONTRA_FLOR, GamePhase.BETTING, true)).toBe(false);
    });

    it('should not allow CONTRA_FLOR when player does not have Flor', () => {
      let state = createBettingState();
      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, florBet);

      expect(canCallFlorBet(state, BetType.CONTRA_FLOR, GamePhase.BETTING, false)).toBe(false);
    });

    it('should allow CONTRA_FLOR_AL_RESTO after CONTRA_FLOR is accepted', () => {
      let state = createBettingState();

      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, florBet);

      const contraFlorBet = createBet(BetType.CONTRA_FLOR, 'player-2', 'team-2', 6);
      const acceptedContraFlor = respondToBet(contraFlorBet, BetResponse.ACCEPT, 'player-1');
      state = addBet(state, acceptedContraFlor);

      expect(canCallFlorBet(state, BetType.CONTRA_FLOR_AL_RESTO, GamePhase.BETTING, true)).toBe(
        true
      );
    });

    it('should not allow CONTRA_FLOR_AL_RESTO when CONTRA_FLOR is pending', () => {
      let state = createBettingState();

      const florBet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, florBet);

      const contraFlorBet = createBet(BetType.CONTRA_FLOR, 'player-2', 'team-2', 6);
      state = addBet(state, contraFlorBet);

      expect(canCallFlorBet(state, BetType.CONTRA_FLOR_AL_RESTO, GamePhase.BETTING, true)).toBe(
        false
      );
    });

    it('should return false for non-Flor bet types', () => {
      const state = createBettingState();
      expect(canCallFlorBet(state, BetType.TRUCO, GamePhase.BETTING, true)).toBe(false);
      expect(canCallFlorBet(state, BetType.ENVIDO, GamePhase.BETTING, true)).toBe(false);
    });
  });

  describe('canRespondToBet', () => {
    it('should allow responding to pending Truco bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(canRespondToBet(state, BetType.TRUCO, 'player-2', 'player-1')).toBe(true);
    });

    it('should not allow responding to own bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(canRespondToBet(state, BetType.TRUCO, 'player-1', 'player-1')).toBe(false);
    });

    it('should not allow responding to accepted bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const acceptedBet = respondToBet(bet, BetResponse.ACCEPT, 'player-2');
      state = addBet(state, acceptedBet);

      expect(canRespondToBet(state, BetType.TRUCO, 'player-2', 'player-1')).toBe(false);
    });

    it('should not allow responding to declined bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.TRUCO, 'player-1', 'team-1', 2);
      const declinedBet = respondToBet(bet, BetResponse.DECLINE, 'player-2');
      state = addBet(state, declinedBet);

      expect(canRespondToBet(state, BetType.TRUCO, 'player-2', 'player-1')).toBe(false);
    });

    it('should allow responding to pending Envido bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
      state = addBet(state, bet);

      expect(canRespondToBet(state, BetType.ENVIDO, 'player-2', 'player-1')).toBe(true);
    });

    it('should allow responding to pending Flor bet', () => {
      let state = createBettingState();
      const bet = createBet(BetType.FLOR, 'player-1', 'team-1', 3);
      state = addBet(state, bet);

      expect(canRespondToBet(state, BetType.FLOR, 'player-2', 'player-1')).toBe(true);
    });

    it('should return false when no bet exists', () => {
      const state = createBettingState();
      expect(canRespondToBet(state, BetType.TRUCO, 'player-2', 'player-1')).toBe(false);
    });
  });

  describe('getDeclinePoints', () => {
    describe('Truco bets', () => {
      const state = createBettingState();

      it('should return 1 point for declining TRUCO', () => {
        expect(getDeclinePoints(BetType.TRUCO, state)).toBe(1);
      });

      it('should return 2 points for declining RETRUCO', () => {
        expect(getDeclinePoints(BetType.RETRUCO, state)).toBe(2);
      });

      it('should return 3 points for declining VALE_CUATRO', () => {
        expect(getDeclinePoints(BetType.VALE_CUATRO, state)).toBe(3);
      });
    });

    describe('Envido bets', () => {
      it('should return 1 point for declining first ENVIDO', () => {
        let state = createBettingState();
        const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
        state = addBet(state, envidoBet);

        expect(getDeclinePoints(BetType.ENVIDO, state)).toBe(1);
      });

      it('should return cumulative points for declining after accepted ENVIDO', () => {
        let state = createBettingState();

        const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
        const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
        state = addBet(state, acceptedEnvido);

        const envidoEnvidoBet = createBet(BetType.ENVIDO_ENVIDO, 'player-2', 'team-2', 4);
        state = addBet(state, envidoEnvidoBet);

        expect(getDeclinePoints(BetType.ENVIDO_ENVIDO, state)).toBe(2); // Previous ENVIDO
      });

      it('should return cumulative points for declining after ENVIDO + ENVIDO_ENVIDO', () => {
        let state = createBettingState();

        const envidoBet = createBet(BetType.ENVIDO, 'player-1', 'team-1', 2);
        const acceptedEnvido = respondToBet(envidoBet, BetResponse.ACCEPT, 'player-2');
        state = addBet(state, acceptedEnvido);

        const envidoEnvidoBet = createBet(BetType.ENVIDO_ENVIDO, 'player-2', 'team-2', 4);
        const acceptedEnvidoEnvido = respondToBet(envidoEnvidoBet, BetResponse.ACCEPT, 'player-1');
        state = addBet(state, acceptedEnvidoEnvido);

        const realEnvidoBet = createBet(BetType.REAL_ENVIDO, 'player-1', 'team-1', 5);
        state = addBet(state, realEnvidoBet);

        expect(getDeclinePoints(BetType.REAL_ENVIDO, state)).toBe(4); // ENVIDO (2) + ENVIDO_ENVIDO (2)
      });

      it('should return at least 1 point when no previous bets', () => {
        const state = createBettingState();
        expect(getDeclinePoints(BetType.ENVIDO, state)).toBe(0); // No bets in array
      });
    });

    describe('Flor bets', () => {
      const state = createBettingState();

      it('should return 3 points for declining FLOR', () => {
        expect(getDeclinePoints(BetType.FLOR, state)).toBe(3);
      });

      it('should return 6 points for declining CONTRA_FLOR', () => {
        expect(getDeclinePoints(BetType.CONTRA_FLOR, state)).toBe(6);
      });

      it('should return -1 (special case) for CONTRA_FLOR_AL_RESTO', () => {
        expect(getDeclinePoints(BetType.CONTRA_FLOR_AL_RESTO, state)).toBe(-1);
      });
    });

    it('should return 0 for unknown bet types', () => {
      const state = createBettingState();
      // Cast to avoid TypeScript error
      expect(getDeclinePoints('unknown' as BetType, state)).toBe(0);
    });
  });
});
