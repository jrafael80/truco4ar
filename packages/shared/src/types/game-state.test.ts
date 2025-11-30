/**
 * Tests for Game State types
 */

import { Suit, createCard } from './card';
import {
  GamePhase,
  TrickResult,
  createTrick,
  createHand,
  createPlayedCard,
  addCardToTrick,
  isTrickComplete,
  setTrickResult,
  addTrickToHand,
  setHandWinner,
  setHandPoints
} from './game-state';

describe('Game State Types', () => {
  describe('createTrick', () => {
    it('should create an empty trick', () => {
      const trick = createTrick(1);

      expect(trick.trickNumber).toBe(1);
      expect(trick.playedCards).toEqual([]);
      expect(trick.result).toBeNull();
      expect(trick.winnerPosition).toBeNull();
    });

    it('should support all trick numbers', () => {
      const trick1 = createTrick(1);
      const trick2 = createTrick(2);
      const trick3 = createTrick(3);

      expect(trick1.trickNumber).toBe(1);
      expect(trick2.trickNumber).toBe(2);
      expect(trick3.trickNumber).toBe(3);
    });
  });

  describe('createHand', () => {
    it('should create a new hand with default values', () => {
      const hand = createHand(1);

      expect(hand.handNumber).toBe(1);
      expect(hand.tricks).toHaveLength(1);
      expect(hand.currentTrick).toBe(0);
      expect(hand.winner).toBeNull();
      expect(hand.pointsAtStake).toBe(1);
    });

    it('should create a hand with custom points', () => {
      const hand = createHand(1, 3);

      expect(hand.pointsAtStake).toBe(3);
    });

    it('should initialize with first trick', () => {
      const hand = createHand(1);

      expect(hand.tricks[0].trickNumber).toBe(1);
      expect(hand.tricks[0].playedCards).toEqual([]);
    });
  });

  describe('createPlayedCard', () => {
    it('should create a played card', () => {
      const card = createCard(1, Suit.ESPADAS);
      const playedCard = createPlayedCard('player-0', card, 0);

      expect(playedCard.playerId).toBe('player-0');
      expect(playedCard.card).toEqual(card);
      expect(playedCard.position).toBe(0);
    });
  });

  describe('addCardToTrick', () => {
    it('should add a card to an empty trick', () => {
      const trick = createTrick(1);
      const card = createCard(1, Suit.ESPADAS);
      const playedCard = createPlayedCard('player-0', card, 0);

      const updatedTrick = addCardToTrick(trick, playedCard);

      expect(updatedTrick.playedCards).toHaveLength(1);
      expect(updatedTrick.playedCards[0]).toEqual(playedCard);
    });

    it('should add multiple cards to a trick', () => {
      let trick = createTrick(1);
      const card1 = createCard(1, Suit.ESPADAS);
      const card2 = createCard(7, Suit.OROS);

      trick = addCardToTrick(trick, createPlayedCard('player-0', card1, 0));
      trick = addCardToTrick(trick, createPlayedCard('player-1', card2, 1));

      expect(trick.playedCards).toHaveLength(2);
    });

    it('should not modify original trick', () => {
      const trick = createTrick(1);
      const card = createCard(1, Suit.ESPADAS);
      const playedCard = createPlayedCard('player-0', card, 0);

      addCardToTrick(trick, playedCard);

      expect(trick.playedCards).toHaveLength(0);
    });
  });

  describe('isTrickComplete', () => {
    it('should return false for empty trick', () => {
      const trick = createTrick(1);
      expect(isTrickComplete(trick, 2)).toBe(false);
    });

    it('should return false for incomplete trick', () => {
      let trick = createTrick(1);
      const card = createCard(1, Suit.ESPADAS);
      trick = addCardToTrick(trick, createPlayedCard('player-0', card, 0));

      expect(isTrickComplete(trick, 2)).toBe(false);
    });

    it('should return true when all players have played (2 players)', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('player-0', createCard(1, Suit.ESPADAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('player-1', createCard(7, Suit.OROS), 1));

      expect(isTrickComplete(trick, 2)).toBe(true);
    });

    it('should return true when all players have played (4 players)', () => {
      let trick = createTrick(1);
      trick = addCardToTrick(trick, createPlayedCard('player-0', createCard(1, Suit.ESPADAS), 0));
      trick = addCardToTrick(trick, createPlayedCard('player-1', createCard(7, Suit.OROS), 1));
      trick = addCardToTrick(trick, createPlayedCard('player-2', createCard(3, Suit.COPAS), 2));
      trick = addCardToTrick(trick, createPlayedCard('player-3', createCard(2, Suit.BASTOS), 3));

      expect(isTrickComplete(trick, 4)).toBe(true);
    });
  });

  describe('setTrickResult', () => {
    it('should set trick result with winner', () => {
      const trick = createTrick(1);
      const updatedTrick = setTrickResult(trick, TrickResult.TEAM1_WIN, 0);

      expect(updatedTrick.result).toBe(TrickResult.TEAM1_WIN);
      expect(updatedTrick.winnerPosition).toBe(0);
    });

    it('should set parda result with no winner', () => {
      const trick = createTrick(1);
      const updatedTrick = setTrickResult(trick, TrickResult.PARDA, null);

      expect(updatedTrick.result).toBe(TrickResult.PARDA);
      expect(updatedTrick.winnerPosition).toBeNull();
    });

    it('should not modify original trick', () => {
      const trick = createTrick(1);
      setTrickResult(trick, TrickResult.TEAM1_WIN, 0);

      expect(trick.result).toBeNull();
      expect(trick.winnerPosition).toBeNull();
    });
  });

  describe('addTrickToHand', () => {
    it('should add a second trick to hand', () => {
      const hand = createHand(1);
      const updatedHand = addTrickToHand(hand, 2);

      expect(updatedHand.tricks).toHaveLength(2);
      expect(updatedHand.tricks[1].trickNumber).toBe(2);
      expect(updatedHand.currentTrick).toBe(1);
    });

    it('should add a third trick to hand', () => {
      let hand = createHand(1);
      hand = addTrickToHand(hand, 2);
      hand = addTrickToHand(hand, 3);

      expect(hand.tricks).toHaveLength(3);
      expect(hand.tricks[2].trickNumber).toBe(3);
      expect(hand.currentTrick).toBe(2);
    });

    it('should not modify original hand', () => {
      const hand = createHand(1);
      addTrickToHand(hand, 2);

      expect(hand.tricks).toHaveLength(1);
      expect(hand.currentTrick).toBe(0);
    });
  });

  describe('setHandWinner', () => {
    it('should set hand winner', () => {
      const hand = createHand(1);
      const updatedHand = setHandWinner(hand, 'team-1');

      expect(updatedHand.winner).toBe('team-1');
    });

    it('should not modify original hand', () => {
      const hand = createHand(1);
      setHandWinner(hand, 'team-1');

      expect(hand.winner).toBeNull();
    });
  });

  describe('setHandPoints', () => {
    it('should update points at stake', () => {
      const hand = createHand(1);
      const updatedHand = setHandPoints(hand, 3);

      expect(updatedHand.pointsAtStake).toBe(3);
    });

    it('should replace existing points', () => {
      const hand = createHand(1, 2);
      const updatedHand = setHandPoints(hand, 4);

      expect(updatedHand.pointsAtStake).toBe(4);
    });

    it('should not modify original hand', () => {
      const hand = createHand(1);
      setHandPoints(hand, 3);

      expect(hand.pointsAtStake).toBe(1);
    });
  });

  describe('GamePhase enum', () => {
    it('should have all expected phases', () => {
      expect(GamePhase.WAITING).toBe('waiting');
      expect(GamePhase.DEALING).toBe('dealing');
      expect(GamePhase.BETTING).toBe('betting');
      expect(GamePhase.PLAYING).toBe('playing');
      expect(GamePhase.SCORING).toBe('scoring');
      expect(GamePhase.FINISHED).toBe('finished');
    });
  });

  describe('TrickResult enum', () => {
    it('should have all expected results', () => {
      expect(TrickResult.TEAM1_WIN).toBe('team1_win');
      expect(TrickResult.TEAM2_WIN).toBe('team2_win');
      expect(TrickResult.PARDA).toBe('parda');
    });
  });
});
