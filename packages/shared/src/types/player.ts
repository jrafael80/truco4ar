/**
 * Player and Team types for Argentine Truco
 */

import { Card } from './card';

/**
 * Unique identifier for a player
 */
export type PlayerId = string;

/**
 * Unique identifier for a team
 */
export type TeamId = string;

/**
 * Player position in a 4-player game
 * Players 0 and 2 are on one team (sitting across from each other)
 * Players 1 and 3 are on the other team (sitting across from each other)
 */
export type PlayerPosition = 0 | 1 | 2 | 3;

/**
 * Player state during a game
 */
export interface Player {
  readonly id: PlayerId;
  readonly name: string;
  readonly teamId: TeamId;
  readonly position: PlayerPosition;
  readonly hand: Card[];
  readonly isDealer: boolean;
}

/**
 * Team state during a game
 */
export interface Team {
  readonly id: TeamId;
  readonly name: string;
  readonly playerIds: PlayerId[];
  readonly score: number;
}

/**
 * Creates a new player
 * @param id Unique player identifier
 * @param name Player name
 * @param teamId Team identifier
 * @param position Player position (0-3)
 * @param hand Player's cards (default: empty)
 * @param isDealer Whether this player is the dealer (default: false)
 * @returns A new Player object
 */
export function createPlayer(
  id: PlayerId,
  name: string,
  teamId: TeamId,
  position: PlayerPosition,
  hand: Card[] = [],
  isDealer: boolean = false
): Player {
  return {
    id,
    name,
    teamId,
    position,
    hand,
    isDealer
  };
}

/**
 * Creates a new team
 * @param id Unique team identifier
 * @param name Team name
 * @param playerIds Array of player IDs in this team
 * @param score Initial score (default: 0)
 * @returns A new Team object
 */
export function createTeam(
  id: TeamId,
  name: string,
  playerIds: PlayerId[] = [],
  score: number = 0
): Team {
  return {
    id,
    name,
    playerIds,
    score
  };
}

/**
 * Updates a player's hand
 * @param player The player to update
 * @param hand New hand of cards
 * @returns A new Player object with updated hand
 */
export function updatePlayerHand(player: Player, hand: Card[]): Player {
  return { ...player, hand };
}

/**
 * Removes a card from a player's hand
 * @param player The player to update
 * @param cardIndex Index of the card to remove
 * @returns A new Player object with the card removed
 * @throws Error if cardIndex is invalid
 */
export function removeCardFromHand(player: Player, cardIndex: number): Player {
  if (cardIndex < 0 || cardIndex >= player.hand.length) {
    throw new Error(`Invalid card index: ${cardIndex}`);
  }

  const newHand = [...player.hand];
  newHand.splice(cardIndex, 1);

  return { ...player, hand: newHand };
}

/**
 * Sets a player as the dealer
 * @param player The player to update
 * @param isDealer Whether this player is the dealer
 * @returns A new Player object with updated dealer status
 */
export function setPlayerDealer(player: Player, isDealer: boolean): Player {
  return { ...player, isDealer };
}

/**
 * Updates a team's score
 * @param team The team to update
 * @param score New score
 * @returns A new Team object with updated score
 */
export function updateTeamScore(team: Team, score: number): Team {
  return { ...team, score };
}

/**
 * Adds points to a team's score
 * @param team The team to update
 * @param points Points to add
 * @returns A new Team object with updated score
 */
export function addTeamPoints(team: Team, points: number): Team {
  return { ...team, score: team.score + points };
}

/**
 * Checks if a team has won the game
 * @param team The team to check
 * @param winningScore The score needed to win (default: 30)
 * @returns True if the team has won
 */
export function hasTeamWon(team: Team, winningScore: number = 30): boolean {
  return team.score >= winningScore;
}
