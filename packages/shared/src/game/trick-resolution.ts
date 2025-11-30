/**
 * Trick resolution logic for Argentine Truco
 */

import { compareCards, getWinningCard } from './card-hierarchy';
import { PlayedCard, Trick, TrickResult, Hand } from '../types/game-state';
import { TeamId, PlayerPosition } from '../types/player';

/**
 * Resolves a trick to determine the winner
 * @param trick The completed trick
 * @param teams Team assignments (maps position to team)
 * @returns The result of the trick and winner position
 */
export function resolveTrick(
  trick: Trick,
  teams: Map<PlayerPosition, TeamId>
): { result: TrickResult; winnerPosition: PlayerPosition | null } {
  if (trick.playedCards.length === 0) {
    throw new Error('Cannot resolve empty trick');
  }

  // Get all cards in play order
  const cards = trick.playedCards.map(pc => pc.card);

  // Find winning card index (this gives first player advantage in ties)
  const winningIndex = getWinningCard(cards);
  const winningCard = cards[winningIndex];

  // Check if any other card ties with the winning card
  // If there's a tie between different players, it's a parda
  for (let i = 0; i < cards.length; i++) {
    if (i !== winningIndex) {
      const compareResult = compareCards(cards[i], winningCard);
      if (compareResult === 0) {
        // Found a tie - it's a parda
        return {
          result: TrickResult.PARDA,
          winnerPosition: null
        };
      }
    }
  }

  // No ties - we have a clear winner
  const winnerPosition = trick.playedCards[winningIndex].position;
  const winnerTeam = teams.get(winnerPosition);

  if (!winnerTeam) {
    throw new Error(`No team found for position ${winnerPosition}`);
  }

  const result = winnerTeam === 'team-1' ? TrickResult.TEAM1_WIN : TrickResult.TEAM2_WIN;

  return {
    result,
    winnerPosition
  };
}

/**
 * Determines the winner of a hand based on trick results
 * Following Truco rules:
 * - Win 2 tricks = win hand
 * - Win 1 trick + parda = win hand
 * - 3 pardas = first team to win a trick wins
 * - Win 1 each + parda = first team to win wins
 *
 * @param hand The hand to evaluate
 * @returns The winning team ID or null if hand is not complete
 */
export function determineHandWinner(hand: Hand): TeamId | null {
  // Count completed tricks
  const completedCount = hand.tricks.filter(t => t.result !== null).length;

  if (completedCount === 0) {
    return null;
  }

  // Count wins for each team in order
  let team1Wins = 0;
  let team2Wins = 0;
  let pardas = 0;
  let firstWinner: TeamId | null = null;

  // Process tricks in order to get first winner correctly
  for (const trick of hand.tricks) {
    if (trick.result === null) continue;

    if (trick.result === TrickResult.TEAM1_WIN) {
      team1Wins++;
      if (firstWinner === null) firstWinner = 'team-1';
    } else if (trick.result === TrickResult.TEAM2_WIN) {
      team2Wins++;
      if (firstWinner === null) firstWinner = 'team-2';
    } else if (trick.result === TrickResult.PARDA) {
      pardas++;
    }
  }

  // Win 2 tricks
  if (team1Wins >= 2) return 'team-1';
  if (team2Wins >= 2) return 'team-2';

  // If all 3 tricks are played
  if (completedCount === 3) {
    // Win 1 each + parda = first winner wins
    if (team1Wins === 1 && team2Wins === 1 && pardas === 1) {
      return firstWinner;
    }

    // 3 pardas = first to win wins (but there are no winners, so it's a tie)
    // In this case, we return the team that played first card in first trick
    if (pardas === 3 && hand.tricks[0].playedCards.length > 0) {
      // This is a rare edge case - typically doesn't happen
      return firstWinner;
    }
  }

  // If we have at least 2 tricks played
  if (completedCount >= 2) {
    // Win 1 trick + parda (and not the "1 each + parda" case)
    if (team1Wins === 1 && team2Wins === 0 && pardas >= 1) return 'team-1';
    if (team2Wins === 1 && team1Wins === 0 && pardas >= 1) return 'team-2';
  }

  // Hand not yet decided
  return null;
}

/**
 * Checks if a hand is complete (winner determined)
 * @param hand The hand to check
 * @returns True if hand has a winner
 */
export function isHandComplete(hand: Hand): boolean {
  return hand.winner !== null;
}

/**
 * Checks if another trick is needed in the hand
 * @param hand The hand to check
 * @returns True if another trick should be played
 */
export function needsAnotherTrick(hand: Hand): boolean {
  // If hand is already won, no more tricks needed
  if (hand.winner !== null) {
    return false;
  }

  // If we've played all 3 tricks, no more tricks
  if (hand.tricks.length >= 3 && hand.tricks[2].result !== null) {
    return false;
  }

  // Check if winner can be determined
  const winner = determineHandWinner(hand);

  // If winner determined, no more tricks needed
  if (winner !== null) {
    return false;
  }

  // Otherwise, we need another trick
  return true;
}

/**
 * Gets the starting position for the next trick
 * The winner of the previous trick leads the next one
 * If previous trick was parda, same player leads again
 *
 * @param hand Current hand
 * @param previousLeader Position of the player who led the current trick
 * @returns Position of player who should lead next trick
 */
export function getNextTrickLeader(
  hand: Hand,
  previousLeader: PlayerPosition
): PlayerPosition {
  const currentTrickIndex = hand.currentTrick;

  if (currentTrickIndex === 0) {
    // First trick, use the provided leader
    return previousLeader;
  }

  // Get the previous trick
  const previousTrick = hand.tricks[currentTrickIndex - 1];

  if (!previousTrick.result) {
    throw new Error('Previous trick has no result');
  }

  // If previous trick was parda, same player leads
  if (previousTrick.result === TrickResult.PARDA) {
    return previousLeader;
  }

  // Winner of previous trick leads
  if (previousTrick.winnerPosition === null) {
    throw new Error('Previous trick has winner result but no winner position');
  }

  return previousTrick.winnerPosition;
}
