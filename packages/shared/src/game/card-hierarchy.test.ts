/**
 * Unit tests for card hierarchy logic
 * Following testing strategy from docs/TESTING_STRATEGY.md
 */

import {
  compareCards,
  compareCardsWithOrder,
  isSpecialCard,
  getWinningCard,
  isValidCard
} from './card-hierarchy';
import { Suit, SPECIAL_CARDS, createCard } from '../types/card';

describe('CardHierarchy', () => {
  describe('compareCards', () => {
    describe('special cards', () => {
      it('should rank Ancho de Espadas as highest card', () => {
        const anchoEspadas = SPECIAL_CARDS.ANCHO_ESPADAS;
        const anchoBastos = SPECIAL_CARDS.ANCHO_BASTOS;

        expect(compareCards(anchoEspadas, anchoBastos)).toBe(1);
        expect(compareCards(anchoBastos, anchoEspadas)).toBe(-1);
      });

      it('should rank Ancho de Bastos higher than Siete de Espadas', () => {
        const anchoBastos = SPECIAL_CARDS.ANCHO_BASTOS;
        const sieteEspadas = SPECIAL_CARDS.SIETE_ESPADAS;

        expect(compareCards(anchoBastos, sieteEspadas)).toBe(1);
        expect(compareCards(sieteEspadas, anchoBastos)).toBe(-1);
      });

      it('should rank Siete de Espadas higher than Siete de Oro', () => {
        const sieteEspadas = SPECIAL_CARDS.SIETE_ESPADAS;
        const sieteOros = SPECIAL_CARDS.SIETE_OROS;

        expect(compareCards(sieteEspadas, sieteOros)).toBe(1);
        expect(compareCards(sieteOros, sieteEspadas)).toBe(-1);
      });

      it('should rank Siete de Oro higher than regular 3s', () => {
        const sieteOros = SPECIAL_CARDS.SIETE_OROS;
        const threeEspadas = createCard(3, Suit.ESPADAS);

        expect(compareCards(sieteOros, threeEspadas)).toBe(1);
        expect(compareCards(threeEspadas, sieteOros)).toBe(-1);
      });
    });

    describe('regular cards by rank', () => {
      it('should rank all 3s equally regardless of suit', () => {
        const threeEspadas = createCard(3, Suit.ESPADAS);
        const threeBastos = createCard(3, Suit.BASTOS);
        const threeOros = createCard(3, Suit.OROS);
        const threeCopas = createCard(3, Suit.COPAS);

        expect(compareCards(threeEspadas, threeBastos)).toBe(0);
        expect(compareCards(threeOros, threeCopas)).toBe(0);
        expect(compareCards(threeEspadas, threeOros)).toBe(0);
      });

      it('should rank 3s higher than 2s', () => {
        const three = createCard(3, Suit.ESPADAS);
        const two = createCard(2, Suit.BASTOS);

        expect(compareCards(three, two)).toBe(1);
        expect(compareCards(two, three)).toBe(-1);
      });

      it('should rank 2s higher than 1 of Oros/Copas', () => {
        const two = createCard(2, Suit.ESPADAS);
        const oneOros = createCard(1, Suit.OROS);
        const oneCopas = createCard(1, Suit.COPAS);

        expect(compareCards(two, oneOros)).toBe(1);
        expect(compareCards(two, oneCopas)).toBe(1);
        expect(compareCards(oneOros, two)).toBe(-1);
      });

      it('should rank 1 of Oros and 1 of Copas equally', () => {
        const oneOros = createCard(1, Suit.OROS);
        const oneCopas = createCard(1, Suit.COPAS);

        expect(compareCards(oneOros, oneCopas)).toBe(0);
      });

      it('should rank face cards correctly (King > Knight > Jack)', () => {
        const king = createCard(12, Suit.ESPADAS);
        const knight = createCard(11, Suit.BASTOS);
        const jack = createCard(10, Suit.OROS);

        expect(compareCards(king, knight)).toBe(1);
        expect(compareCards(knight, jack)).toBe(1);
        expect(compareCards(king, jack)).toBe(1);
      });

      it('should rank 7 of Bastos and 7 of Copas equally', () => {
        const sevenBastos = createCard(7, Suit.BASTOS);
        const sevenCopas = createCard(7, Suit.COPAS);

        expect(compareCards(sevenBastos, sevenCopas)).toBe(0);
      });

      it('should rank 4s as lowest cards', () => {
        const four = createCard(4, Suit.ESPADAS);
        const five = createCard(5, Suit.BASTOS);
        const six = createCard(6, Suit.OROS);

        expect(compareCards(four, five)).toBe(-1);
        expect(compareCards(four, six)).toBe(-1);
      });
    });

    describe('identical cards', () => {
      it('should return tie for identical cards', () => {
        const card1 = createCard(7, Suit.ESPADAS);
        const card2 = createCard(7, Suit.ESPADAS);

        expect(compareCards(card1, card2)).toBe(0);
      });
    });
  });

  describe('compareCardsWithOrder', () => {
    it('should give first card advantage in case of tie', () => {
      const three1 = createCard(3, Suit.ESPADAS);
      const three2 = createCard(3, Suit.BASTOS);

      // First played wins
      expect(compareCardsWithOrder(three1, three2)).toBe(1);
    });

    it('should follow normal hierarchy when cards are different', () => {
      const three = createCard(3, Suit.ESPADAS);
      const two = createCard(2, Suit.BASTOS);

      expect(compareCardsWithOrder(three, two)).toBe(1);
      expect(compareCardsWithOrder(two, three)).toBe(-1);
    });
  });

  describe('isSpecialCard', () => {
    it('should identify Ancho de Espadas as special', () => {
      expect(isSpecialCard(SPECIAL_CARDS.ANCHO_ESPADAS)).toBe(true);
    });

    it('should identify Ancho de Bastos as special', () => {
      expect(isSpecialCard(SPECIAL_CARDS.ANCHO_BASTOS)).toBe(true);
    });

    it('should identify Siete de Espadas as special', () => {
      expect(isSpecialCard(SPECIAL_CARDS.SIETE_ESPADAS)).toBe(true);
    });

    it('should identify Siete de Oro as special', () => {
      expect(isSpecialCard(SPECIAL_CARDS.SIETE_OROS)).toBe(true);
    });

    it('should not identify regular cards as special', () => {
      const regularCard = createCard(3, Suit.ESPADAS);
      expect(isSpecialCard(regularCard)).toBe(false);
    });

    it('should not identify other 1s as special', () => {
      const oneOros = createCard(1, Suit.OROS);
      const oneCopas = createCard(1, Suit.COPAS);

      expect(isSpecialCard(oneOros)).toBe(false);
      expect(isSpecialCard(oneCopas)).toBe(false);
    });

    it('should not identify other 7s as special', () => {
      const sevenBastos = createCard(7, Suit.BASTOS);
      const sevenCopas = createCard(7, Suit.COPAS);

      expect(isSpecialCard(sevenBastos)).toBe(false);
      expect(isSpecialCard(sevenCopas)).toBe(false);
    });
  });

  describe('getWinningCard', () => {
    it('should throw error with empty array', () => {
      expect(() => getWinningCard([])).toThrow('Cannot determine winner with no cards');
    });

    it('should return 0 for single card', () => {
      const cards = [createCard(3, Suit.ESPADAS)];
      expect(getWinningCard(cards)).toBe(0);
    });

    it('should return index of highest card', () => {
      const cards = [
        createCard(3, Suit.ESPADAS),
        SPECIAL_CARDS.ANCHO_ESPADAS,
        createCard(7, Suit.BASTOS)
      ];

      expect(getWinningCard(cards)).toBe(1); // Ancho Espadas wins
    });

    it('should handle ties by giving advantage to first card', () => {
      const cards = [
        createCard(3, Suit.ESPADAS),
        createCard(3, Suit.BASTOS),
        createCard(2, Suit.OROS)
      ];

      expect(getWinningCard(cards)).toBe(0); // First 3 wins (tie)
    });

    it('should work with 4 players', () => {
      const cards = [
        createCard(5, Suit.ESPADAS),
        createCard(12, Suit.BASTOS),
        createCard(3, Suit.OROS),
        createCard(6, Suit.COPAS)
      ];

      expect(getWinningCard(cards)).toBe(2); // The 3 wins
    });
  });

  describe('isValidCard', () => {
    it('should accept valid cards', () => {
      expect(isValidCard(createCard(1, Suit.ESPADAS))).toBe(true);
      expect(isValidCard(createCard(7, Suit.OROS))).toBe(true);
      expect(isValidCard(createCard(12, Suit.COPAS))).toBe(true);
    });

    it('should reject cards with invalid ranks', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidCard = { rank: 8 as any, suit: Suit.ESPADAS };
      expect(isValidCard(invalidCard)).toBe(false);
    });

    it('should reject cards with invalid suits', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidCard = { rank: 7 as any, suit: 'invalid' as any };
      expect(isValidCard(invalidCard)).toBe(false);
    });
  });
});
