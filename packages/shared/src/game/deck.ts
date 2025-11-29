/**
 * Deck management for Argentine Truco
 * Handles deck creation, shuffling, and card dealing
 */

import { Card, Rank, Suit, createCard } from '../types/card';

/**
 * All valid ranks in a Spanish deck used for Truco
 * 8, 9, and 10 are not used in the Spanish deck
 */
const VALID_RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

/**
 * All suits in a Spanish deck
 */
const ALL_SUITS: Suit[] = [Suit.ESPADAS, Suit.BASTOS, Suit.OROS, Suit.COPAS];

/**
 * Creates a standard 40-card Spanish deck for Truco
 * @returns An unshuffled array of 40 cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of ALL_SUITS) {
    for (const rank of VALID_RANKS) {
      deck.push(createCard(rank, suit));
    }
  }

  return deck;
}

/**
 * Shuffles a deck using the Fisher-Yates algorithm
 * Creates a new shuffled array without modifying the original
 * @param deck The deck to shuffle
 * @returns A new shuffled deck
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Result of dealing cards from a deck
 */
export interface DealResult {
  hands: Card[][];
  remainingDeck: Card[];
}

/**
 * Deals cards to players from the deck
 * In Truco, each player gets 3 cards per hand
 * @param deck The deck to deal from
 * @param numPlayers Number of players (2 or 4)
 * @param cardsPerPlayer Number of cards per player (default: 3)
 * @returns Object containing player hands and remaining deck
 * @throws Error if deck doesn't have enough cards
 */
export function dealCards(
  deck: Card[],
  numPlayers: number,
  cardsPerPlayer: number = 3
): DealResult {
  const totalCardsNeeded = numPlayers * cardsPerPlayer;

  if (deck.length < totalCardsNeeded) {
    throw new Error(
      `Not enough cards in deck. Need ${totalCardsNeeded}, have ${deck.length}`
    );
  }

  if (numPlayers !== 2 && numPlayers !== 4) {
    throw new Error('Truco must be played with 2 or 4 players');
  }

  const hands: Card[][] = [];
  const deckCopy = [...deck];

  for (let player = 0; player < numPlayers; player++) {
    const hand: Card[] = [];
    for (let card = 0; card < cardsPerPlayer; card++) {
      hand.push(deckCopy.shift()!);
    }
    hands.push(hand);
  }

  return {
    hands,
    remainingDeck: deckCopy
  };
}

/**
 * Creates and shuffles a new deck ready for dealing
 * Convenience function that combines createDeck and shuffleDeck
 * @returns A shuffled 40-card Spanish deck
 */
export function createShuffledDeck(): Card[] {
  return shuffleDeck(createDeck());
}
