/**
 * Tests for Envido scoring
 */

import { Suit, createCard } from '../types/card';
import {
  getEnvidoValue,
  calculateEnvidoScore,
  hasFlor,
  calculateFlorScore,
  determineEnvidoWinner,
  determineFlorWinner
} from './envido';

describe('Envido', () => {
  describe('getEnvidoValue', () => {
    it('should return face value for cards 1-7', () => {
      expect(getEnvidoValue(createCard(1, Suit.ESPADAS))).toBe(1);
      expect(getEnvidoValue(createCard(7, Suit.OROS))).toBe(7);
    });

    it('should return 0 for face cards', () => {
      expect(getEnvidoValue(createCard(10, Suit.ESPADAS))).toBe(0);
      expect(getEnvidoValue(createCard(11, Suit.BASTOS))).toBe(0);
      expect(getEnvidoValue(createCard(12, Suit.COPAS))).toBe(0);
    });
  });

  describe('calculateEnvidoScore', () => {
    it('should calculate score for two cards of same suit', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.ESPADAS),
        createCard(2, Suit.BASTOS)
      ];
      expect(calculateEnvidoScore(hand)).toBe(33); // 7 + 6 + 20
    });

    it('should calculate score for three cards of same suit', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.ESPADAS),
        createCard(4, Suit.ESPADAS)
      ];
      expect(calculateEnvidoScore(hand)).toBe(33); // 7 + 6 + 20 (ignore 4)
    });

    it('should return highest card value when no suit match', () => {
      const hand = [
        createCard(5, Suit.ESPADAS),
        createCard(3, Suit.BASTOS),
        createCard(2, Suit.COPAS)
      ];
      expect(calculateEnvidoScore(hand)).toBe(5);
    });

    it('should handle face cards correctly', () => {
      const hand = [
        createCard(12, Suit.ESPADAS), // King = 0
        createCard(11, Suit.ESPADAS), // Knight = 0
        createCard(5, Suit.BASTOS)
      ];
      expect(calculateEnvidoScore(hand)).toBe(20); // 0 + 0 + 20
    });

    it('should handle empty hand', () => {
      expect(calculateEnvidoScore([])).toBe(0);
    });

    it('should calculate max score (33)', () => {
      const hand = [
        createCard(7, Suit.OROS),
        createCard(6, Suit.OROS),
        createCard(1, Suit.BASTOS)
      ];
      expect(calculateEnvidoScore(hand)).toBe(33);
    });
  });

  describe('hasFlor', () => {
    it('should return true for three cards of same suit', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.ESPADAS),
        createCard(4, Suit.ESPADAS)
      ];
      expect(hasFlor(hand)).toBe(true);
    });

    it('should return false for two cards of same suit', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.ESPADAS),
        createCard(4, Suit.BASTOS)
      ];
      expect(hasFlor(hand)).toBe(false);
    });

    it('should return false for no matching suits', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.BASTOS),
        createCard(4, Suit.COPAS)
      ];
      expect(hasFlor(hand)).toBe(false);
    });

    it('should return false for less than 3 cards', () => {
      const hand = [createCard(7, Suit.ESPADAS), createCard(6, Suit.ESPADAS)];
      expect(hasFlor(hand)).toBe(false);
    });
  });

  describe('calculateFlorScore', () => {
    it('should calculate Flor score', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.ESPADAS),
        createCard(4, Suit.ESPADAS)
      ];
      expect(calculateFlorScore(hand)).toBe(37); // 7 + 6 + 4 + 20
    });

    it('should return null for no Flor', () => {
      const hand = [
        createCard(7, Suit.ESPADAS),
        createCard(6, Suit.BASTOS),
        createCard(4, Suit.COPAS)
      ];
      expect(calculateFlorScore(hand)).toBeNull();
    });

    it('should handle face cards in Flor', () => {
      const hand = [
        createCard(12, Suit.OROS),
        createCard(11, Suit.OROS),
        createCard(10, Suit.OROS)
      ];
      expect(calculateFlorScore(hand)).toBe(20); // 0 + 0 + 0 + 20
    });
  });

  describe('determineEnvidoWinner', () => {
    it('should return team with higher score', () => {
      expect(determineEnvidoWinner(30, 25, 'team-1')).toBe(1);
      expect(determineEnvidoWinner(25, 30, 'team-1')).toBe(2);
    });

    it('should give win to non-caller on tie', () => {
      expect(determineEnvidoWinner(25, 25, 'team-1')).toBe(2);
      expect(determineEnvidoWinner(25, 25, 'team-2')).toBe(1);
    });
  });

  describe('determineFlorWinner', () => {
    it('should return null if neither has Flor', () => {
      expect(determineFlorWinner(null, null)).toBeNull();
    });

    it('should return team with Flor if only one has it', () => {
      expect(determineFlorWinner(30, null)).toBe(1);
      expect(determineFlorWinner(null, 30)).toBe(2);
    });

    it('should return team with higher Flor score', () => {
      expect(determineFlorWinner(35, 30)).toBe(1);
      expect(determineFlorWinner(30, 35)).toBe(2);
    });

    it('should return team 1 on tie', () => {
      expect(determineFlorWinner(30, 30)).toBe(1);
    });
  });
});
