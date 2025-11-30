/**
 * Envido score calculation for Argentine Truco
 */

import { Card, Suit, EnvidoValue } from '../types/card';

/**
 * Gets the Envido value of a card
 * Cards 1-7 have their face value
 * Face cards (10, 11, 12) have value 0
 * @param card The card to evaluate
 * @returns Envido value (0-7)
 */
export function getEnvidoValue(card: Card): EnvidoValue {
  if (card.rank >= 10) {
    return 0;
  }
  return card.rank as EnvidoValue;
}

/**
 * Calculates Envido score for a hand
 * Rules:
 * - Two cards of same suit: sum + 20
 * - Three cards of same suit: two highest + 20
 * - No cards of same suit: highest card value
 *
 * @param hand Array of cards (typically 3 cards)
 * @returns Envido score (0-33)
 */
export function calculateEnvidoScore(hand: Card[]): number {
  if (hand.length === 0) {
    return 0;
  }

  // Group cards by suit
  const cardsBySuit: Record<Suit, Card[]> = {
    [Suit.ESPADAS]: [],
    [Suit.BASTOS]: [],
    [Suit.OROS]: [],
    [Suit.COPAS]: []
  };

  for (const card of hand) {
    cardsBySuit[card.suit].push(card);
  }

  // Find the best Envido score
  let bestScore = 0;

  for (const suit of Object.values(Suit)) {
    const cardsOfSuit = cardsBySuit[suit];

    if (cardsOfSuit.length >= 2) {
      // Get Envido values and sort descending
      const values = cardsOfSuit.map(getEnvidoValue).sort((a, b) => b - a);

      // Take two highest cards + 20
      const score = values[0] + values[1] + 20;
      bestScore = Math.max(bestScore, score);
    } else if (cardsOfSuit.length === 1) {
      // Single card value (no +20)
      const score = getEnvidoValue(cardsOfSuit[0]);
      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore;
}

/**
 * Checks if a hand has Flor (three cards of the same suit)
 * @param hand Array of cards
 * @returns True if hand has Flor
 */
export function hasFlor(hand: Card[]): boolean {
  if (hand.length < 3) {
    return false;
  }

  // Group by suit
  const suitCounts: Record<Suit, number> = {
    [Suit.ESPADAS]: 0,
    [Suit.BASTOS]: 0,
    [Suit.OROS]: 0,
    [Suit.COPAS]: 0
  };

  for (const card of hand) {
    suitCounts[card.suit]++;
  }

  // Check if any suit has 3 or more cards
  return Object.values(suitCounts).some(count => count >= 3);
}

/**
 * Calculates Flor score for a hand
 * Flor score = sum of all three cards of same suit + 20
 *
 * @param hand Array of cards
 * @returns Flor score, or null if no Flor
 */
export function calculateFlorScore(hand: Card[]): number | null {
  if (!hasFlor(hand)) {
    return null;
  }

  // Find the suit with 3 cards
  const cardsBySuit: Record<Suit, Card[]> = {
    [Suit.ESPADAS]: [],
    [Suit.BASTOS]: [],
    [Suit.OROS]: [],
    [Suit.COPAS]: []
  };

  for (const card of hand) {
    cardsBySuit[card.suit].push(card);
  }

  for (const suit of Object.values(Suit)) {
    const cardsOfSuit = cardsBySuit[suit];
    if (cardsOfSuit.length >= 3) {
      // Sum the three cards + 20
      const sum = cardsOfSuit
        .slice(0, 3) // Take first 3 if more than 3
        .map(getEnvidoValue)
        .reduce((acc: number, val) => acc + val, 0);

      return sum + 20;
    }
  }

  return null;
}

/**
 * Determines the winner of an Envido bet
 * @param score1 Envido score of team 1
 * @param score2 Envido score of team 2
 * @param callerTeamId Team that called Envido
 * @returns 1 if team 1 wins, 2 if team 2 wins
 */
export function determineEnvidoWinner(
  score1: number,
  score2: number,
  callerTeamId: 'team-1' | 'team-2'
): 1 | 2 {
  if (score1 > score2) {
    return 1;
  } else if (score2 > score1) {
    return 2;
  } else {
    // Tie: team that didn't call wins
    return callerTeamId === 'team-1' ? 2 : 1;
  }
}

/**
 * Determines the winner of a Flor bet
 * @param score1 Flor score of team 1 (null if no Flor)
 * @param score2 Flor score of team 2 (null if no Flor)
 * @returns 1 if team 1 wins, 2 if team 2 wins, null if no one has Flor
 */
export function determineFlorWinner(score1: number | null, score2: number | null): 1 | 2 | null {
  // If neither has Flor
  if (score1 === null && score2 === null) {
    return null;
  }

  // If only one has Flor
  if (score1 !== null && score2 === null) {
    return 1;
  }
  if (score1 === null && score2 !== null) {
    return 2;
  }

  // Both have Flor - highest wins
  if (score1! > score2!) {
    return 1;
  } else if (score2! > score1!) {
    return 2;
  } else {
    // Tie in Flor is rare but team 1 wins by default
    return 1;
  }
}
