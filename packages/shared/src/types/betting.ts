/**
 * Betting types for Argentine Truco (Envido, Truco, Flor)
 */

import { PlayerId, TeamId } from './player';

/**
 * Types of bets in Truco
 */
export enum BetType {
  // Truco bets (affect hand value)
  TRUCO = 'truco',
  RETRUCO = 'retruco',
  VALE_CUATRO = 'vale_cuatro',

  // Envido bets (side bet on card combinations)
  ENVIDO = 'envido',
  ENVIDO_ENVIDO = 'envido_envido',
  REAL_ENVIDO = 'real_envido',
  FALTA_ENVIDO = 'falta_envido',

  // Flor bet (three cards of same suit)
  FLOR = 'flor',
  CONTRA_FLOR = 'contra_flor',
  CONTRA_FLOR_AL_RESTO = 'contra_flor_al_resto'
}

/**
 * Response to a bet
 */
export enum BetResponse {
  ACCEPT = 'accept',      // Accept the bet (play for raised stakes)
  DECLINE = 'decline',    // Decline the bet (forfeit points)
  RAISE = 'raise'         // Raise the bet (counter with higher bet)
}

/**
 * Status of a bet
 */
export enum BetStatus {
  PENDING = 'pending',     // Waiting for response
  ACCEPTED = 'accepted',   // Bet accepted, play continues
  DECLINED = 'declined',   // Bet declined, points awarded
  RAISED = 'raised'        // Bet was raised to higher bet
}

/**
 * A single bet in the game
 */
export interface Bet {
  readonly type: BetType;
  readonly callerId: PlayerId;
  readonly callerTeamId: TeamId;
  readonly pointsAtStake: number;
  readonly status: BetStatus;
  readonly responderId?: PlayerId;
  readonly response?: BetResponse;
}

/**
 * Betting state for a hand
 */
export interface BettingState {
  readonly trucoBets: Bet[];           // Truco/Retruco/Vale Cuatro bets
  readonly envidoBets: Bet[];          // Envido bets
  readonly florBets: Bet[];            // Flor bets
  readonly currentTrucoValue: number;  // Current hand value from Truco (1, 2, 3, or 4)
  readonly envidoResolved: boolean;    // Whether Envido has been resolved
  readonly florResolved: boolean;      // Whether Flor has been resolved
}

/**
 * Creates a new bet
 * @param type Type of bet
 * @param callerId Player making the bet
 * @param callerTeamId Team of the caller
 * @param pointsAtStake Points at stake
 * @returns A new Bet object
 */
export function createBet(
  type: BetType,
  callerId: PlayerId,
  callerTeamId: TeamId,
  pointsAtStake: number
): Bet {
  return {
    type,
    callerId,
    callerTeamId,
    pointsAtStake,
    status: BetStatus.PENDING
  };
}

/**
 * Updates a bet with a response
 * @param bet The bet to update
 * @param response The response to the bet
 * @param responderId Player responding to the bet
 * @returns Updated bet
 */
export function respondToBet(
  bet: Bet,
  response: BetResponse,
  responderId: PlayerId
): Bet {
  const newStatus =
    response === BetResponse.ACCEPT ? BetStatus.ACCEPTED :
    response === BetResponse.DECLINE ? BetStatus.DECLINED :
    BetStatus.RAISED;

  return {
    ...bet,
    response,
    responderId,
    status: newStatus
  };
}

/**
 * Creates initial betting state
 * @returns A new BettingState with no bets
 */
export function createBettingState(): BettingState {
  return {
    trucoBets: [],
    envidoBets: [],
    florBets: [],
    currentTrucoValue: 1,
    envidoResolved: false,
    florResolved: false
  };
}

/**
 * Adds a bet to the betting state
 * @param state Current betting state
 * @param bet Bet to add
 * @returns Updated betting state
 */
export function addBet(state: BettingState, bet: Bet): BettingState {
  if (isTrucoBet(bet.type)) {
    return {
      ...state,
      trucoBets: [...state.trucoBets, bet]
    };
  } else if (isEnvidoBet(bet.type)) {
    return {
      ...state,
      envidoBets: [...state.envidoBets, bet]
    };
  } else if (isFlorBet(bet.type)) {
    return {
      ...state,
      florBets: [...state.florBets, bet]
    };
  }
  return state;
}

/**
 * Updates the current Truco value
 * @param state Current betting state
 * @param value New Truco value (1, 2, 3, or 4)
 * @returns Updated betting state
 */
export function setTrucoValue(state: BettingState, value: number): BettingState {
  return {
    ...state,
    currentTrucoValue: value
  };
}

/**
 * Marks Envido as resolved
 * @param state Current betting state
 * @returns Updated betting state
 */
export function resolveEnvido(state: BettingState): BettingState {
  return {
    ...state,
    envidoResolved: true
  };
}

/**
 * Marks Flor as resolved
 * @param state Current betting state
 * @returns Updated betting state
 */
export function resolveFlor(state: BettingState): BettingState {
  return {
    ...state,
    florResolved: true
  };
}

/**
 * Checks if a bet type is a Truco bet
 * @param type Bet type
 * @returns True if it's a Truco bet
 */
export function isTrucoBet(type: BetType): boolean {
  return type === BetType.TRUCO ||
         type === BetType.RETRUCO ||
         type === BetType.VALE_CUATRO;
}

/**
 * Checks if a bet type is an Envido bet
 * @param type Bet type
 * @returns True if it's an Envido bet
 */
export function isEnvidoBet(type: BetType): boolean {
  return type === BetType.ENVIDO ||
         type === BetType.ENVIDO_ENVIDO ||
         type === BetType.REAL_ENVIDO ||
         type === BetType.FALTA_ENVIDO;
}

/**
 * Checks if a bet type is a Flor bet
 * @param type Bet type
 * @returns True if it's a Flor bet
 */
export function isFlorBet(type: BetType): boolean {
  return type === BetType.FLOR ||
         type === BetType.CONTRA_FLOR ||
         type === BetType.CONTRA_FLOR_AL_RESTO;
}

/**
 * Gets the next valid Truco bet
 * @param currentBet Current Truco bet type
 * @returns Next bet in progression, or null if already at max
 */
export function getNextTrucoBet(currentBet: BetType | null): BetType | null {
  if (currentBet === null) return BetType.TRUCO;
  if (currentBet === BetType.TRUCO) return BetType.RETRUCO;
  if (currentBet === BetType.RETRUCO) return BetType.VALE_CUATRO;
  return null; // Already at maximum
}

/**
 * Gets the points value for a Truco bet
 * @param betType Truco bet type
 * @returns Points at stake
 */
export function getTrucoPoints(betType: BetType): number {
  switch (betType) {
    case BetType.TRUCO:
      return 2;
    case BetType.RETRUCO:
      return 3;
    case BetType.VALE_CUATRO:
      return 4;
    default:
      return 1;
  }
}

/**
 * Gets the points value for an Envido bet (individual value, not accumulated)
 * @param betType Envido bet type
 * @returns Points for this specific bet
 */
export function getEnvidoPoints(betType: BetType): number {
  switch (betType) {
    case BetType.ENVIDO:
      return 2;
    case BetType.ENVIDO_ENVIDO:
      return 2; // Adds 2 more to the chain
    case BetType.REAL_ENVIDO:
      return 3; // Adds 3 more to the chain
    case BetType.FALTA_ENVIDO:
      return -1; // Special case, calculated based on game state
    default:
      return 0;
  }
}

/**
 * Calculates the total accumulated points from all Envido bets in a chain
 * @param state Current betting state
 * @returns Total points at stake for all Envido bets
 */
export function calculateEnvidoChainPoints(state: BettingState): number {
  let total = 0;

  for (const bet of state.envidoBets) {
    const points = getEnvidoPoints(bet.type);
    if (points > 0) {
      total += points;
    }
  }

  return total;
}

/**
 * Calculates Falta Envido points
 * @param team1Score Current score of team 1
 * @param team2Score Current score of team 2
 * @param winningScore Score needed to win (default: 30)
 * @returns Points for Falta Envido (minimum points needed by either team)
 */
export function calculateFaltaEnvidoPoints(
  team1Score: number,
  team2Score: number,
  winningScore: number = 30
): number {
  const team1Needed = winningScore - team1Score;
  const team2Needed = winningScore - team2Score;
  return Math.min(team1Needed, team2Needed);
}
