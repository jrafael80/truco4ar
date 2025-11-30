/**
 * Game setup and turn management for Argentine Truco
 */

import { Player, Team, PlayerId, TeamId, PlayerPosition, createPlayer, createTeam } from '../types/player';

/**
 * Configuration for setting up a game
 */
export interface GameSetupConfig {
  numPlayers: 2 | 4;
  winningScore?: number;
  playerNames?: string[];
}

/**
 * Result of setting up a game
 */
export interface GameSetup {
  players: Player[];
  teams: Team[];
  dealerPosition: PlayerPosition;
}

/**
 * Sets up players and teams for a new game
 * @param config Game setup configuration
 * @returns Game setup with players and teams
 * @throws Error if configuration is invalid
 */
export function setupGame(config: GameSetupConfig): GameSetup {
  const { numPlayers, playerNames = [] } = config;

  if (numPlayers !== 2 && numPlayers !== 4) {
    throw new Error('Truco must be played with 2 or 4 players');
  }

  // Generate player names if not provided
  const names = Array.from({ length: numPlayers }, (_, i) =>
    playerNames[i] || `Player ${i + 1}`
  );

  // Create teams
  const team1Id: TeamId = 'team-1';
  const team2Id: TeamId = 'team-2';

  const team1 = createTeam(team1Id, 'Team 1');
  const team2 = createTeam(team2Id, 'Team 2');

  // Create players and assign to teams
  const players: Player[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const position = i as PlayerPosition;
    // Players 0 and 2 are on team 1, players 1 and 3 are on team 2
    const teamId = i % 2 === 0 ? team1Id : team2Id;
    const playerId: PlayerId = `player-${i}`;

    players.push(createPlayer(playerId, names[i], teamId, position));
  }

  // Update teams with player IDs
  const team1WithPlayers = {
    ...team1,
    playerIds: players.filter(p => p.teamId === team1Id).map(p => p.id)
  };

  const team2WithPlayers = {
    ...team2,
    playerIds: players.filter(p => p.teamId === team2Id).map(p => p.id)
  };

  // Dealer is initially player 0
  const dealerPosition: PlayerPosition = 0;
  players[dealerPosition] = { ...players[dealerPosition], isDealer: true };

  return {
    players,
    teams: [team1WithPlayers, team2WithPlayers],
    dealerPosition
  };
}

/**
 * Rotates the dealer to the next player (clockwise)
 * @param players Current players
 * @param currentDealerPosition Current dealer position
 * @returns Updated players with new dealer
 */
export function rotateDealer(players: Player[], currentDealerPosition: PlayerPosition): Player[] {
  const numPlayers = players.length;
  const nextDealerPosition = ((currentDealerPosition + 1) % numPlayers) as PlayerPosition;

  return players.map((player, index) => ({
    ...player,
    isDealer: index === nextDealerPosition
  }));
}

/**
 * Gets the first player (to the right of dealer, counterclockwise)
 * In a clockwise-seated game, "to the right" means the next position
 * @param dealerPosition Current dealer position
 * @param numPlayers Total number of players
 * @returns Position of the first player
 */
export function getFirstPlayer(dealerPosition: PlayerPosition, numPlayers: number): PlayerPosition {
  return ((dealerPosition + 1) % numPlayers) as PlayerPosition;
}

/**
 * Gets the next player in turn order (counterclockwise from current)
 * @param currentPosition Current player position
 * @param numPlayers Total number of players
 * @returns Position of the next player
 */
export function getNextPlayer(currentPosition: PlayerPosition, numPlayers: number): PlayerPosition {
  return ((currentPosition + 1) % numPlayers) as PlayerPosition;
}

/**
 * Gets players in turn order starting from a specific position
 * @param players All players
 * @param startPosition Position to start from
 * @returns Array of players in turn order
 */
export function getPlayersInTurnOrder(players: Player[], startPosition: PlayerPosition): Player[] {
  const numPlayers = players.length;
  const orderedPlayers: Player[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const position = ((startPosition + i) % numPlayers) as PlayerPosition;
    const player = players.find(p => p.position === position);
    if (player) {
      orderedPlayers.push(player);
    }
  }

  return orderedPlayers;
}

/**
 * Gets the player at a specific position
 * @param players All players
 * @param position Player position to find
 * @returns The player at that position
 * @throws Error if no player found at position
 */
export function getPlayerAtPosition(players: Player[], position: PlayerPosition): Player {
  const player = players.find(p => p.position === position);
  if (!player) {
    throw new Error(`No player found at position ${position}`);
  }
  return player;
}

/**
 * Gets all players on a team
 * @param players All players
 * @param teamId Team identifier
 * @returns Array of players on the team
 */
export function getTeamPlayers(players: Player[], teamId: TeamId): Player[] {
  return players.filter(p => p.teamId === teamId);
}

/**
 * Gets the team for a player
 * @param teams All teams
 * @param playerId Player identifier
 * @returns The team the player belongs to
 * @throws Error if team not found
 */
export function getPlayerTeam(teams: Team[], playerId: PlayerId): Team {
  const team = teams.find(t => t.playerIds.includes(playerId));
  if (!team) {
    throw new Error(`No team found for player ${playerId}`);
  }
  return team;
}

/**
 * Gets the opposing team
 * @param teams All teams (must be exactly 2)
 * @param teamId Current team identifier
 * @returns The opposing team
 * @throws Error if not exactly 2 teams or team not found
 */
export function getOpposingTeam(teams: Team[], teamId: TeamId): Team {
  if (teams.length !== 2) {
    throw new Error('Game must have exactly 2 teams');
  }

  // First verify the teamId exists
  const currentTeam = teams.find(t => t.id === teamId);
  if (!currentTeam) {
    throw new Error(`No opposing team found for ${teamId}`);
  }

  const opposingTeam = teams.find(t => t.id !== teamId);
  if (!opposingTeam) {
    throw new Error(`No opposing team found for ${teamId}`);
  }

  return opposingTeam;
}
