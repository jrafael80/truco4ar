/**
 * Tests for deck management
 */

import { Suit, createCard, cardsEqual } from '../types/card';
import { createDeck, shuffleDeck, dealCards, createShuffledDeck } from './deck';

describe('Deck Management', () => {
  describe('createDeck', () => {
    it('should create a deck with exactly 40 cards', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(40);
    });

    it('should create a deck with 10 cards per suit', () => {
      const deck = createDeck();

      const espadas = deck.filter(card => card.suit === Suit.ESPADAS);
      const bastos = deck.filter(card => card.suit === Suit.BASTOS);
      const oros = deck.filter(card => card.suit === Suit.OROS);
      const copas = deck.filter(card => card.suit === Suit.COPAS);

      expect(espadas).toHaveLength(10);
      expect(bastos).toHaveLength(10);
      expect(oros).toHaveLength(10);
      expect(copas).toHaveLength(10);
    });

    it('should include all valid ranks (1-7, 10-12)', () => {
      const deck = createDeck();
      const validRanks = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

      for (const suit of [Suit.ESPADAS, Suit.BASTOS, Suit.OROS, Suit.COPAS]) {
        for (const rank of validRanks) {
          const card = deck.find(c => c.rank === rank && c.suit === suit);
          expect(card).toBeDefined();
        }
      }
    });

    it('should not include ranks 8 or 9', () => {
      const deck = createDeck();
      const invalidCards = deck.filter(
        card => (card.rank as number) === 8 || (card.rank as number) === 9
      );
      expect(invalidCards).toHaveLength(0);
    });

    it('should not have duplicate cards', () => {
      const deck = createDeck();
      const uniqueCards = new Set(deck.map(card => `${card.rank}-${card.suit}`));
      expect(uniqueCards.size).toBe(40);
    });

    it('should create a new deck instance each time', () => {
      const deck1 = createDeck();
      const deck2 = createDeck();

      expect(deck1).not.toBe(deck2);
      expect(deck1).toEqual(deck2);
    });
  });

  describe('shuffleDeck', () => {
    it('should return a deck with the same cards', () => {
      const originalDeck = createDeck();
      const shuffled = shuffleDeck(originalDeck);

      expect(shuffled).toHaveLength(40);

      for (const card of originalDeck) {
        const found = shuffled.find(c => cardsEqual(c, card));
        expect(found).toBeDefined();
      }
    });

    it('should not modify the original deck', () => {
      const originalDeck = createDeck();
      const originalFirst = originalDeck[0];
      shuffleDeck(originalDeck);

      expect(originalDeck[0]).toEqual(originalFirst);
      expect(originalDeck).toHaveLength(40);
    });

    it('should produce a different order (statistical test)', () => {
      const originalDeck = createDeck();
      let differentCount = 0;
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const shuffled = shuffleDeck(originalDeck);
        let differences = 0;

        for (let j = 0; j < originalDeck.length; j++) {
          if (!cardsEqual(originalDeck[j], shuffled[j])) {
            differences++;
          }
        }

        if (differences > 0) {
          differentCount++;
        }
      }

      expect(differentCount).toBeGreaterThan(iterations * 0.9);
    });

    it('should handle an empty deck', () => {
      const emptyDeck = shuffleDeck([]);
      expect(emptyDeck).toHaveLength(0);
    });

    it('should handle a single card deck', () => {
      const singleCard = [createCard(1, Suit.ESPADAS)];
      const shuffled = shuffleDeck(singleCard);

      expect(shuffled).toHaveLength(1);
      expect(cardsEqual(shuffled[0], singleCard[0])).toBe(true);
    });
  });

  describe('dealCards', () => {
    it('should deal 3 cards to each of 2 players by default', () => {
      const deck = createDeck();
      const result = dealCards(deck, 2);

      expect(result.hands).toHaveLength(2);
      expect(result.hands[0]).toHaveLength(3);
      expect(result.hands[1]).toHaveLength(3);
    });

    it('should deal 3 cards to each of 4 players', () => {
      const deck = createDeck();
      const result = dealCards(deck, 4);

      expect(result.hands).toHaveLength(4);
      result.hands.forEach(hand => {
        expect(hand).toHaveLength(3);
      });
    });

    it('should return the remaining deck after dealing', () => {
      const deck = createDeck();
      const result = dealCards(deck, 2);

      expect(result.remainingDeck).toHaveLength(34); // 40 - (2 * 3)
    });

    it('should deal cards from the top of the deck', () => {
      const deck = createDeck();
      const expectedPlayer1 = [deck[0], deck[1], deck[2]];
      const expectedPlayer2 = [deck[3], deck[4], deck[5]];

      const result = dealCards(deck, 2);

      expect(result.hands[0]).toEqual(expectedPlayer1);
      expect(result.hands[1]).toEqual(expectedPlayer2);
    });

    it('should not modify the original deck', () => {
      const deck = createDeck();
      const originalLength = deck.length;
      const originalFirst = deck[0];

      dealCards(deck, 2);

      expect(deck).toHaveLength(originalLength);
      expect(deck[0]).toEqual(originalFirst);
    });

    it('should throw error if deck does not have enough cards', () => {
      const smallDeck = [createCard(1, Suit.ESPADAS), createCard(2, Suit.ESPADAS)];

      expect(() => dealCards(smallDeck, 2)).toThrow(
        'Not enough cards in deck. Need 6, have 2'
      );
    });

    it('should throw error for invalid number of players (1 player)', () => {
      const deck = createDeck();

      expect(() => dealCards(deck, 1)).toThrow('Truco must be played with 2 or 4 players');
    });

    it('should throw error for invalid number of players (3 players)', () => {
      const deck = createDeck();

      expect(() => dealCards(deck, 3)).toThrow('Truco must be played with 2 or 4 players');
    });

    it('should throw error for invalid number of players (5 players)', () => {
      const deck = createDeck();

      expect(() => dealCards(deck, 5)).toThrow('Truco must be played with 2 or 4 players');
    });

    it('should support custom cards per player', () => {
      const deck = createDeck();
      const result = dealCards(deck, 2, 5);

      expect(result.hands[0]).toHaveLength(5);
      expect(result.hands[1]).toHaveLength(5);
      expect(result.remainingDeck).toHaveLength(30);
    });

    it('should not have duplicate cards across hands', () => {
      const deck = createDeck();
      const result = dealCards(deck, 4);

      const allDealtCards = result.hands.flat();
      const uniqueCards = new Set(allDealtCards.map(card => `${card.rank}-${card.suit}`));

      expect(uniqueCards.size).toBe(12); // 4 players * 3 cards
    });

    it('should not have cards in hands that are in remaining deck', () => {
      const deck = createDeck();
      const result = dealCards(deck, 2);

      const dealtCards = result.hands.flat();

      for (const dealtCard of dealtCards) {
        const foundInRemaining = result.remainingDeck.find(c => cardsEqual(c, dealtCard));
        expect(foundInRemaining).toBeUndefined();
      }
    });
  });

  describe('createShuffledDeck', () => {
    it('should create a deck with 40 cards', () => {
      const deck = createShuffledDeck();
      expect(deck).toHaveLength(40);
    });

    it('should contain all valid cards', () => {
      const deck = createShuffledDeck();
      const originalDeck = createDeck();

      for (const card of originalDeck) {
        const found = deck.find(c => cardsEqual(c, card));
        expect(found).toBeDefined();
      }
    });

    it('should produce different orders on multiple calls (statistical test)', () => {
      const deck1 = createShuffledDeck();
      const deck2 = createShuffledDeck();

      let differences = 0;
      for (let i = 0; i < deck1.length; i++) {
        if (!cardsEqual(deck1[i], deck2[i])) {
          differences++;
        }
      }

      expect(differences).toBeGreaterThan(30);
    });
  });
});
