/**
 * Card types and interfaces for Argentine Truco
 * Based on docs/TRUCO_RULES.md
 */

/**
 * Card suits in Spanish deck
 */
export enum Suit {
  ESPADAS = 'espadas', // Swords
  BASTOS = 'bastos', // Clubs
  OROS = 'oros', // Coins/Gold
  COPAS = 'copas' // Cups
}

/**
 * Card ranks (1-7, Jack=10, Knight=11, King=12)
 * Note: 8, 9, 10 are not used in Truco
 */
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;

/**
 * Card interface
 */
export interface Card {
  readonly rank: Rank;
  readonly suit: Suit;
}

/**
 * Card value for Envido calculation
 * Face cards (10, 11, 12) have value 0 for Envido
 */
export type EnvidoValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Card comparison result
 * 1: first card wins
 * -1: second card wins
 * 0: tie (parda)
 */
export type CardComparison = 1 | -1 | 0;

/**
 * Special cards with unique hierarchy
 */
export const SPECIAL_CARDS = {
  ANCHO_ESPADAS: { rank: 1 as Rank, suit: Suit.ESPADAS }, // Highest
  ANCHO_BASTOS: { rank: 1 as Rank, suit: Suit.BASTOS },
  SIETE_ESPADAS: { rank: 7 as Rank, suit: Suit.ESPADAS },
  SIETE_OROS: { rank: 7 as Rank, suit: Suit.OROS }
} as const;

/**
 * Helper function to create a card
 */
export function createCard(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

/**
 * Helper function to check if two cards are equal
 */
export function cardsEqual(card1: Card, card2: Card): boolean {
  return card1.rank === card2.rank && card1.suit === card2.suit;
}

/**
 * Helper function to get card display name
 */
export function getCardName(card: Card): string {
  const rankNames: Record<Rank, string> = {
    1: 'Ace',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    10: 'Jack',
    11: 'Knight',
    12: 'King'
  };

  const suitNames: Record<Suit, string> = {
    [Suit.ESPADAS]: 'Swords',
    [Suit.BASTOS]: 'Clubs',
    [Suit.OROS]: 'Coins',
    [Suit.COPAS]: 'Cups'
  };

  return `${rankNames[card.rank]} of ${suitNames[card.suit]}`;
}
