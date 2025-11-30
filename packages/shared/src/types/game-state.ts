/**
 * Game state types for Argentine Truco
 */

import { Card } from './card';
import { Player, Team, PlayerId, TeamId, PlayerPosition } from './player';

/**
 * Game phase enumeration
 */
export enum GamePhase {
  WAITING = 'waiting', // Waiting for players
  DEALING = 'dealing', // Cards being dealt
  BETTING = 'betting', // Envido/Flor betting phase
  PLAYING = 'playing', // Playing tricks
  SCORING = 'scoring', // Calculating scores
  FINISHED = 'finished' // Game over
}

/**
 * Result of a single trick (baza)
 */
export enum TrickResult {
  TEAM1_WIN = 'team1_win',
  TEAM2_WIN = 'team2_win',
  PARDA = 'parda' // Tie
}

/**
 * Card played in a trick
 */
export interface PlayedCard {
  readonly playerId: PlayerId;
  readonly card: Card;
  readonly position: PlayerPosition;
}

/**
 * A single trick (baza) in a hand
 */
export interface Trick {
  readonly trickNumber: number; // 1, 2, or 3
  readonly playedCards: PlayedCard[];
  readonly result: TrickResult | null;
  readonly winnerPosition: PlayerPosition | null;
}

/**
 * A hand consists of up to 3 tricks
 */
export interface Hand {
  readonly handNumber: number;
  readonly tricks: Trick[];
  readonly currentTrick: number; // 0, 1, or 2
  readonly winner: TeamId | null;
  readonly pointsAtStake: number; // Points for winning this hand (Truco value)
}

/**
 * Complete game state
 */
export interface GameState {
  readonly phase: GamePhase;
  readonly players: Player[];
  readonly teams: Team[];
  readonly currentHand: Hand;
  readonly dealerPosition: PlayerPosition;
  readonly currentPlayerPosition: PlayerPosition;
  readonly deck: Card[];
}

/**
 * Creates a new trick
 * @param trickNumber The trick number (1, 2, or 3)
 * @returns A new empty Trick
 */
export function createTrick(trickNumber: number): Trick {
  return {
    trickNumber,
    playedCards: [],
    result: null,
    winnerPosition: null
  };
}

/**
 * Creates a new hand
 * @param handNumber The hand number
 * @param pointsAtStake Initial points at stake (default: 1)
 * @returns A new Hand
 */
export function createHand(handNumber: number, pointsAtStake: number = 1): Hand {
  return {
    handNumber,
    tricks: [createTrick(1)],
    currentTrick: 0,
    winner: null,
    pointsAtStake
  };
}

/**
 * Creates a played card
 * @param playerId Player who played the card
 * @param card The card played
 * @param position Player position
 * @returns A PlayedCard object
 */
export function createPlayedCard(
  playerId: PlayerId,
  card: Card,
  position: PlayerPosition
): PlayedCard {
  return {
    playerId,
    card,
    position
  };
}

/**
 * Adds a card to a trick
 * @param trick Current trick
 * @param playedCard The card to add
 * @returns Updated trick
 */
export function addCardToTrick(trick: Trick, playedCard: PlayedCard): Trick {
  return {
    ...trick,
    playedCards: [...trick.playedCards, playedCard]
  };
}

/**
 * Checks if a trick is complete (all players have played)
 * @param trick The trick to check
 * @param numPlayers Total number of players
 * @returns True if trick is complete
 */
export function isTrickComplete(trick: Trick, numPlayers: number): boolean {
  return trick.playedCards.length === numPlayers;
}

/**
 * Sets the result of a trick
 * @param trick The trick to update
 * @param result The result of the trick
 * @param winnerPosition Position of the winner (null for parda)
 * @returns Updated trick
 */
export function setTrickResult(
  trick: Trick,
  result: TrickResult,
  winnerPosition: PlayerPosition | null
): Trick {
  return {
    ...trick,
    result,
    winnerPosition
  };
}

/**
 * Adds a new trick to a hand
 * @param hand Current hand
 * @param trickNumber The trick number to add
 * @returns Updated hand
 */
export function addTrickToHand(hand: Hand, trickNumber: number): Hand {
  return {
    ...hand,
    tricks: [...hand.tricks, createTrick(trickNumber)],
    currentTrick: hand.currentTrick + 1
  };
}

/**
 * Sets the winner of a hand
 * @param hand The hand to update
 * @param winner The winning team ID
 * @returns Updated hand
 */
export function setHandWinner(hand: Hand, winner: TeamId): Hand {
  return {
    ...hand,
    winner
  };
}

/**
 * Updates the points at stake for a hand
 * @param hand The hand to update
 * @param points New points at stake
 * @returns Updated hand
 */
export function setHandPoints(hand: Hand, points: number): Hand {
  return {
    ...hand,
    pointsAtStake: points
  };
}
