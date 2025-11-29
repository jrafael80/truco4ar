/**
 * Card hierarchy logic for Argentine Truco
 * Implements rules from docs/TRUCO_RULES.md
 */

import { Card, CardComparison, Suit, cardsEqual, SPECIAL_CARDS } from '../types/card';

/**
 * Card hierarchy values (higher = stronger)
 * Based on Argentine Truco rules
 */
const CARD_HIERARCHY: ReadonlyMap<string, number> = new Map([
  // Special cards (highest to lowest)
  ['1-espadas', 14], // Ancho de Espadas (highest)
  ['1-bastos', 13], // Ancho de Bastos
  ['7-espadas', 12], // Siete de Espadas
  ['7-oros', 11], // Siete de Oro

  // Regular cards (by rank, suit doesn't matter)
  ['3-any', 10], // All 3s are equal
  ['2-any', 9], // All 2s are equal
  ['1-oros', 8], // 1 of Oros and Copas are equal
  ['1-copas', 8],
  ['12-any', 7], // All Kings are equal
  ['11-any', 6], // All Knights are equal
  ['10-any', 5], // All Jacks are equal
  ['7-bastos', 4], // 7 of Bastos and Copas are equal
  ['7-copas', 4],
  ['6-any', 3], // All 6s are equal
  ['5-any', 2], // All 5s are equal
  ['4-any', 1] // All 4s are equal (lowest)
]);

/**
 * Get hierarchy value for a card
 */
function getCardValue(card: Card): number {
  // Check if it's a special card
  const specialKey = `${card.rank}-${card.suit}`;
  if (CARD_HIERARCHY.has(specialKey)) {
    return CARD_HIERARCHY.get(specialKey)!;
  }

  // Check regular cards (suit doesn't matter)
  const genericKey = `${card.rank}-any`;
  if (CARD_HIERARCHY.has(genericKey)) {
    return CARD_HIERARCHY.get(genericKey)!;
  }

  // Should never happen with valid cards
  throw new Error(`Invalid card: ${card.rank} of ${card.suit}`);
}

/**
 * Compare two cards following Truco hierarchy rules
 *
 * Returns:
 * - 1 if card1 wins
 * - -1 if card2 wins
 * - 0 if they tie (parda)
 *
 * Important: When cards have equal hierarchy value (non-special cards),
 * the first card played wins. This function doesn't know play order,
 * so it returns 0 for equal values. The caller must handle this.
 */
export function compareCards(card1: Card, card2: Card): CardComparison {
  // Same card is always a tie
  if (cardsEqual(card1, card2)) {
    return 0;
  }

  const value1 = getCardValue(card1);
  const value2 = getCardValue(card2);

  if (value1 > value2) {
    return 1;
  } else if (value1 < value2) {
    return -1;
  } else {
    // Equal hierarchy value (e.g., two different 3s)
    // In actual game, first played wins, but we return 0 here
    return 0;
  }
}

/**
 * Compare cards with play order
 *
 * @param card1 First card (played first)
 * @param card2 Second card (played second)
 * @returns CardComparison - considering play order for ties
 */
export function compareCardsWithOrder(card1: Card, card2: Card): CardComparison {
  const result = compareCards(card1, card2);

  // If tied, first played wins
  if (result === 0) {
    return 1; // card1 was played first, so it wins
  }

  return result;
}

/**
 * Check if a card is a special card (Anchos or special 7s)
 */
export function isSpecialCard(card: Card): boolean {
  return (
    cardsEqual(card, SPECIAL_CARDS.ANCHO_ESPADAS) ||
    cardsEqual(card, SPECIAL_CARDS.ANCHO_BASTOS) ||
    cardsEqual(card, SPECIAL_CARDS.SIETE_ESPADAS) ||
    cardsEqual(card, SPECIAL_CARDS.SIETE_OROS)
  );
}

/**
 * Get the winning card from a list of played cards
 *
 * @param cards Array of cards in play order
 * @returns Index of the winning card
 */
export function getWinningCard(cards: Card[]): number {
  if (cards.length === 0) {
    throw new Error('Cannot determine winner with no cards');
  }

  if (cards.length === 1) {
    return 0;
  }

  let winningIndex = 0;
  let winningCard = cards[0];

  for (let i = 1; i < cards.length; i++) {
    const result = compareCards(winningCard, cards[i]);

    if (result === -1) {
      // Current card wins outright
      winningIndex = i;
      winningCard = cards[i];
    }
    // If result is 0 (tie), first card wins (winningCard stays the same)
    // If result is 1, winningCard stays the same
  }

  return winningIndex;
}

/**
 * Validate that a card is valid for Truco
 */
export function isValidCard(card: Card): boolean {
  const validRanks = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const validSuits = Object.values(Suit);

  return validRanks.includes(card.rank) && validSuits.includes(card.suit);
}
