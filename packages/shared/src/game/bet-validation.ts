/**
 * Bet validation logic for Argentine Truco
 */

import { BetType, BettingState, isTrucoBet, isEnvidoBet, isFlorBet } from '../types/betting';
import { GamePhase } from '../types/game-state';
import { GameConfig, DEFAULT_GAME_CONFIG } from '../types/game-config';

/**
 * Validates if a Truco bet can be called
 * @param state Current betting state
 * @param betType Type of Truco bet
 * @returns True if bet is valid
 */
export function canCallTrucoBet(state: BettingState, betType: BetType): boolean {
  if (!isTrucoBet(betType)) {
    return false;
  }

  const lastTrucoBet = state.trucoBets[state.trucoBets.length - 1];

  // First Truco bet
  if (betType === BetType.TRUCO) {
    return state.trucoBets.length === 0 || lastTrucoBet.status !== 'pending';
  }

  // Retruco can only be called after Truco is accepted
  if (betType === BetType.RETRUCO) {
    return lastTrucoBet?.type === BetType.TRUCO &&
           lastTrucoBet.status === 'accepted';
  }

  // Vale Cuatro can only be called after Retruco is accepted
  if (betType === BetType.VALE_CUATRO) {
    return lastTrucoBet?.type === BetType.RETRUCO &&
           lastTrucoBet.status === 'accepted';
  }

  return false;
}

/**
 * Validates if an Envido bet can be called
 * @param state Current betting state
 * @param betType Type of Envido bet
 * @param phase Current game phase
 * @param config Game configuration (optional, uses default if not provided)
 * @returns True if bet is valid
 */
export function canCallEnvidoBet(
  state: BettingState,
  betType: BetType,
  phase: GamePhase,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  if (!isEnvidoBet(betType)) {
    return false;
  }

  // Envido must be called before first card is played
  if (phase !== GamePhase.BETTING && phase !== GamePhase.DEALING) {
    return false;
  }

  // Envido cannot be called if already resolved
  if (state.envidoResolved) {
    return false;
  }

  const lastEnvidoBet = state.envidoBets[state.envidoBets.length - 1];

  // First Envido bet
  if (betType === BetType.ENVIDO) {
    return state.envidoBets.length === 0 || lastEnvidoBet.status !== 'pending';
  }

  // Envido Envido can be called after Envido
  if (betType === BetType.ENVIDO_ENVIDO) {
    return lastEnvidoBet?.type === BetType.ENVIDO &&
           (lastEnvidoBet.status === 'accepted' || lastEnvidoBet.status === 'raised');
  }

  // Real Envido can be called after Envido or Envido Envido
  // If realEnvidoMultiple is enabled, it can be called multiple times
  if (betType === BetType.REAL_ENVIDO) {
    if (config.realEnvidoMultiple) {
      // Can be called after any Envido bet (except pending)
      return lastEnvidoBet !== undefined &&
             lastEnvidoBet.status !== 'pending';
    } else {
      // Traditional: only once after Envido or Envido Envido
      return (lastEnvidoBet?.type === BetType.ENVIDO ||
              lastEnvidoBet?.type === BetType.ENVIDO_ENVIDO) &&
             (lastEnvidoBet.status === 'accepted' || lastEnvidoBet.status === 'raised');
    }
  }

  // Falta Envido can be called after any Envido bet
  if (betType === BetType.FALTA_ENVIDO) {
    return lastEnvidoBet !== undefined &&
           (lastEnvidoBet.status === 'accepted' || lastEnvidoBet.status === 'raised');
  }

  return false;
}

/**
 * Validates if a Flor bet can be called
 * @param state Current betting state
 * @param betType Type of Flor bet
 * @param phase Current game phase
 * @param playerHasFlor Whether the calling player has Flor
 * @param config Game configuration (optional, uses default if not provided)
 * @returns True if bet is valid
 */
export function canCallFlorBet(
  state: BettingState,
  betType: BetType,
  phase: GamePhase,
  playerHasFlor: boolean,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  if (!isFlorBet(betType)) {
    return false;
  }

  // Flor must be enabled in game configuration
  if (!config.florEnabled) {
    return false;
  }

  // Flor must be called before Envido
  if (phase !== GamePhase.BETTING && phase !== GamePhase.DEALING) {
    return false;
  }

  // Cannot call Flor if already resolved
  if (state.florResolved) {
    return false;
  }

  // Player must have Flor to call it
  if (betType === BetType.FLOR && !playerHasFlor) {
    return false;
  }

  const lastFlorBet = state.florBets[state.florBets.length - 1];

  // First Flor bet
  if (betType === BetType.FLOR) {
    return state.florBets.length === 0;
  }

  // Contra Flor can be called in response to Flor
  if (betType === BetType.CONTRA_FLOR) {
    return lastFlorBet?.type === BetType.FLOR &&
           lastFlorBet.status === 'pending' &&
           playerHasFlor;
  }

  // Contra Flor al Resto can be called after Contra Flor
  if (betType === BetType.CONTRA_FLOR_AL_RESTO) {
    return lastFlorBet?.type === BetType.CONTRA_FLOR &&
           lastFlorBet.status === 'accepted';
  }

  return false;
}

/**
 * Validates if a player can respond to a bet
 * @param state Current betting state
 * @param betType Type of bet being responded to
 * @param playerId Player responding
 * @param originalCallerId Original caller of the bet
 * @returns True if player can respond
 */
export function canRespondToBet(
  state: BettingState,
  betType: BetType,
  playerId: string,
  originalCallerId: string
): boolean {
  // Player cannot respond to their own bet
  if (playerId === originalCallerId) {
    return false;
  }

  let lastBet;

  if (isTrucoBet(betType)) {
    lastBet = state.trucoBets[state.trucoBets.length - 1];
  } else if (isEnvidoBet(betType)) {
    lastBet = state.envidoBets[state.envidoBets.length - 1];
  } else if (isFlorBet(betType)) {
    lastBet = state.florBets[state.florBets.length - 1];
  } else {
    return false;
  }

  // Bet must be pending
  return lastBet !== undefined && lastBet.status === 'pending';
}

/**
 * Gets the points that would be awarded if a bet is declined
 * @param betType Type of bet
 * @param state Current betting state
 * @returns Points for decline
 */
export function getDeclinePoints(betType: BetType, state: BettingState): number {
  if (isTrucoBet(betType)) {
    // Declining Truco gives opponent the previous value
    if (betType === BetType.TRUCO) return 1;
    if (betType === BetType.RETRUCO) return 2;
    if (betType === BetType.VALE_CUATRO) return 3;
  }

  if (isEnvidoBet(betType)) {
    // Declining Envido gives opponent the cumulative previous bets
    const envidoBets = state.envidoBets;
    if (envidoBets.length === 0) return 0;

    // Sum points from all previous accepted/raised Envido bets
    let total = 0;
    for (let i = 0; i < envidoBets.length - 1; i++) {
      const bet = envidoBets[i];
      if (bet.type === BetType.ENVIDO) total += 2;
      else if (bet.type === BetType.ENVIDO_ENVIDO) total += 2; // Additional 2
      else if (bet.type === BetType.REAL_ENVIDO) total += 3; // Additional 3
    }
    return total || 1; // At least 1 point
  }

  if (isFlorBet(betType)) {
    if (betType === BetType.FLOR) return 3;
    if (betType === BetType.CONTRA_FLOR) return 6;
    if (betType === BetType.CONTRA_FLOR_AL_RESTO) return -1; // Special case
  }

  return 0;
}
