/**
 * Tests for Trick Resolution
 */

import { Suit, createCard } from '../types/card';
import {
  createTrick,
  createHand,
  createPlayedCard,
  addCardToTrick,
  setTrickResult,
  addTrickToHand,
  setHandWinner,
  TrickResult
} from '../types/game-state';
import {
  resolveTrick,
  determineHandWinner,
  isHandComplete,
  needsAnotherTrick,
  getNextTrickLeader
} from './trick-resolution';

describe('Trick Resolution', () => {
  const createTeamMap = () => {
    const map = new Map();
    map.set(0, 'team-1');
    map.set(1, 'team-2');
    map.set(2, 'team-1');
    map.set(3, 'team-2');
    return map;
  };

  describe('resolveTrick', () => {
    it('should determine winner of a simple trick', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('p0', createCard(3, Suit.COPAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('p1', createCard(2, Suit.BASTOS), 1));

      const result = resolveTrick(trick, createTeamMap());

      expect(result.result).toBe(TrickResult.TEAM1_WIN);
      expect(result.winnerPosition).toBe(0);
    });

    it('should handle highest card winning', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('p0', createCard(4, Suit.COPAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('p1', createCard(1, Suit.ESPADAS), 1));

      const result = resolveTrick(trick, createTeamMap());

      expect(result.result).toBe(TrickResult.TEAM2_WIN);
      expect(result.winnerPosition).toBe(1);
    });

    it('should detect parda (tie)', () => {
      let trick = createTrick(1);
      // Both 3s are equal rank
      trick = addCardToTrick(trick, createPlayedCard('p0', createCard(3, Suit.COPAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('p1', createCard(3, Suit.BASTOS), 1));

      const result = resolveTrick(trick, createTeamMap());

      expect(result.result).toBe(TrickResult.PARDA);
      expect(result.winnerPosition).toBeNull();
    });

    it('should work with 4 players', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('p0', createCard(4, Suit.COPAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('p1', createCard(5, Suit.BASTOS), 1));
      trick = addCardToTrick(trick, createPlayedCard('p2', createCard(7, Suit.ESPADAS), 2));
      trick = addCardToTrick(trick, createPlayedCard('p3', createCard(2, Suit.OROS), 3));

      const result = resolveTrick(trick, createTeamMap());

      expect(result.result).toBe(TrickResult.TEAM1_WIN);
      expect(result.winnerPosition).toBe(2);
    });

    it('should throw error for empty trick', () => {
      const trick = createTrick(1);

      expect(() => resolveTrick(trick, createTeamMap())).toThrow('Cannot resolve empty trick');
    });

    it('should handle special cards correctly', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('p0', createCard(7, Suit.OROS), 0));
      trick = addCardToTrick(trick, createPlayedCard('p1', createCard(1, Suit.ESPADAS), 1));

      const result = resolveTrick(trick, createTeamMap());

      expect(result.result).toBe(TrickResult.TEAM2_WIN);
      expect(result.winnerPosition).toBe(1);
    });
  });

  describe('determineHandWinner', () => {
    it('should return null for hand with no tricks', () => {
      const hand = createHand(1);
      expect(determineHandWinner(hand)).toBeNull();
    });

    it('should determine winner with 2 wins', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM1_WIN, 0);

      expect(determineHandWinner(hand)).toBe('team-1');
    });

    it('should determine winner with 1 win + parda after 2 tricks', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.PARDA, null);

      expect(determineHandWinner(hand)).toBe('team-1');
    });

    it('should not determine winner with 1 win after 1 trick', () => {
      const hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);

      expect(determineHandWinner(hand)).toBeNull();
    });

    it('should determine winner with 1 win each + parda (first winner wins)', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM2_WIN, 1);
      hand = addTrickToHand(hand, 3);
      hand.tricks[2] = setTrickResult(hand.tricks[2], TrickResult.PARDA, null);

      expect(determineHandWinner(hand)).toBe('team-1');
    });

    it('should give win to team 2 if they win first', () => {
      const trick1 = setTrickResult(createTrick(1), TrickResult.TEAM2_WIN, 1);
      const trick2 = setTrickResult(createTrick(2), TrickResult.TEAM1_WIN, 0);
      const trick3 = setTrickResult(createTrick(3), TrickResult.PARDA, null);

      const hand = {
        handNumber: 1,
        tricks: [trick1, trick2, trick3],
        currentTrick: 2,
        winner: null,
        pointsAtStake: 1
      };

      expect(determineHandWinner(hand)).toBe('team-2');
    });

    it('should handle parda + win correctly', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.PARDA, null);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM2_WIN, 1);

      expect(determineHandWinner(hand)).toBe('team-2');
    });

    it('should return null for incomplete hand (1 win, 1 loss, no third trick)', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM2_WIN, 1);

      expect(determineHandWinner(hand)).toBeNull();
    });

    it('should handle 3 pardas (edge case)', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.PARDA, null);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.PARDA, null);
      hand = addTrickToHand(hand, 3);
      hand.tricks[2] = setTrickResult(hand.tricks[2], TrickResult.PARDA, null);

      // With no wins, should return null
      expect(determineHandWinner(hand)).toBeNull();
    });
  });

  describe('isHandComplete', () => {
    it('should return false for hand with no winner', () => {
      const hand = createHand(1);
      expect(isHandComplete(hand)).toBe(false);
    });

    it('should return true for hand with winner', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM1_WIN, 0);
      hand = setHandWinner(hand, 'team-1');

      expect(isHandComplete(hand)).toBe(true);
    });
  });

  describe('needsAnotherTrick', () => {
    it('should return true for new hand', () => {
      const hand = createHand(1);
      expect(needsAnotherTrick(hand)).toBe(true);
    });

    it('should return false when winner is set', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM1_WIN, 0);
      hand = setHandWinner(hand, 'team-1');

      expect(needsAnotherTrick(hand)).toBe(false);
    });

    it('should return false when winner can be determined', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM1_WIN, 0);

      expect(needsAnotherTrick(hand)).toBe(false);
    });

    it('should return true when more tricks needed', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM2_WIN, 1);

      expect(needsAnotherTrick(hand)).toBe(true);
    });

    it('should return false after 3 tricks', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 0);
      hand = addTrickToHand(hand, 2);
      hand.tricks[1] = setTrickResult(hand.tricks[1], TrickResult.TEAM2_WIN, 1);
      hand = addTrickToHand(hand, 3);
      hand.tricks[2] = setTrickResult(hand.tricks[2], TrickResult.PARDA, null);

      expect(needsAnotherTrick(hand)).toBe(false);
    });
  });

  describe('getNextTrickLeader', () => {
    it('should return provided leader for first trick', () => {
      const hand = createHand(1);
      expect(getNextTrickLeader(hand, 1)).toBe(1);
    });

    it('should return winner of previous trick', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.TEAM1_WIN, 2);
      hand = addTrickToHand(hand, 2);

      expect(getNextTrickLeader(hand, 1)).toBe(2);
    });

    it('should return same leader after parda', () => {
      let hand = createHand(1);
      hand.tricks[0] = setTrickResult(hand.tricks[0], TrickResult.PARDA, null);
      hand = addTrickToHand(hand, 2);

      expect(getNextTrickLeader(hand, 1)).toBe(1);
    });

    it('should throw error if previous trick has no result', () => {
      let hand = createHand(1);
      hand = addTrickToHand(hand, 2);

      expect(() => getNextTrickLeader(hand, 1)).toThrow('Previous trick has no result');
    });

    it('should throw error for winner result without position', () => {
      let hand = createHand(1);
      hand.tricks[0] = { ...hand.tricks[0], result: TrickResult.TEAM1_WIN, winnerPosition: null };
      hand = addTrickToHand(hand, 2);

      expect(() => getNextTrickLeader(hand, 1)).toThrow(
        'Previous trick has winner result but no winner position'
      );
    });
  });
});
