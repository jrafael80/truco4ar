/**
 * Tests for Game Setup and Turn Management
 */

import {
  setupGame,
  rotateDealer,
  getFirstPlayer,
  getNextPlayer,
  getPlayersInTurnOrder,
  getPlayerAtPosition,
  getTeamPlayers,
  getPlayerTeam,
  getOpposingTeam,
  getOpposingTeams
} from './game-setup';

describe('Game Setup', () => {
  describe('setupGame', () => {
    it('should set up a 2-player game', () => {
      const setup = setupGame({ numPlayers: 2 });

      expect(setup.players).toHaveLength(2);
      expect(setup.teams).toHaveLength(2);
      expect(setup.dealerPosition).toBe(0);
    });

    it('should set up a 4-player game', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(setup.players).toHaveLength(4);
      expect(setup.teams).toHaveLength(2);
      expect(setup.dealerPosition).toBe(0);
    });

    it('should assign players to alternating teams', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(setup.players[0].teamId).toBe('team-1');
      expect(setup.players[1].teamId).toBe('team-2');
      expect(setup.players[2].teamId).toBe('team-1');
      expect(setup.players[3].teamId).toBe('team-2');
    });

    it('should assign correct positions to players', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(setup.players[0].position).toBe(0);
      expect(setup.players[1].position).toBe(1);
      expect(setup.players[2].position).toBe(2);
      expect(setup.players[3].position).toBe(3);
    });

    it('should set player 0 as initial dealer', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(setup.players[0].isDealer).toBe(true);
      expect(setup.players[1].isDealer).toBe(false);
      expect(setup.players[2].isDealer).toBe(false);
      expect(setup.players[3].isDealer).toBe(false);
    });

    it('should use custom player names if provided', () => {
      const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const setup = setupGame({ numPlayers: 4, playerNames });

      expect(setup.players[0].name).toBe('Alice');
      expect(setup.players[1].name).toBe('Bob');
      expect(setup.players[2].name).toBe('Charlie');
      expect(setup.players[3].name).toBe('Diana');
    });

    it('should generate default names if not provided', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(setup.players[0].name).toBe('Player 1');
      expect(setup.players[1].name).toBe('Player 2');
      expect(setup.players[2].name).toBe('Player 3');
      expect(setup.players[3].name).toBe('Player 4');
    });

    it('should mix custom and default names', () => {
      const setup = setupGame({ numPlayers: 4, playerNames: ['Alice', 'Bob'] });

      expect(setup.players[0].name).toBe('Alice');
      expect(setup.players[1].name).toBe('Bob');
      expect(setup.players[2].name).toBe('Player 3');
      expect(setup.players[3].name).toBe('Player 4');
    });

    it('should populate team player IDs correctly', () => {
      const setup = setupGame({ numPlayers: 4 });

      const team1 = setup.teams.find(t => t.id === 'team-1');
      const team2 = setup.teams.find(t => t.id === 'team-2');

      expect(team1?.playerIds).toEqual(['player-0', 'player-2']);
      expect(team2?.playerIds).toEqual(['player-1', 'player-3']);
    });

    it('should initialize all players with empty hands', () => {
      const setup = setupGame({ numPlayers: 4 });

      setup.players.forEach(player => {
        expect(player.hand).toEqual([]);
      });
    });

    it('should initialize teams with zero score', () => {
      const setup = setupGame({ numPlayers: 4 });

      setup.teams.forEach(team => {
        expect(team.score).toBe(0);
      });
    });

    it('should set up a 6-player game', () => {
      const setup = setupGame({ numPlayers: 6 });

      expect(setup.players).toHaveLength(6);
      expect(setup.teams).toHaveLength(2);
      expect(setup.dealerPosition).toBe(0);
    });

    it('should assign players to alternating teams in 6-player game', () => {
      const setup = setupGame({ numPlayers: 6 });

      expect(setup.players[0].teamId).toBe('team-1');
      expect(setup.players[1].teamId).toBe('team-2');
      expect(setup.players[2].teamId).toBe('team-1');
      expect(setup.players[3].teamId).toBe('team-2');
      expect(setup.players[4].teamId).toBe('team-1');
      expect(setup.players[5].teamId).toBe('team-2');
    });

    it('should assign correct positions in 6-player game', () => {
      const setup = setupGame({ numPlayers: 6 });

      expect(setup.players[0].position).toBe(0);
      expect(setup.players[1].position).toBe(1);
      expect(setup.players[2].position).toBe(2);
      expect(setup.players[3].position).toBe(3);
      expect(setup.players[4].position).toBe(4);
      expect(setup.players[5].position).toBe(5);
    });

    it('should populate team player IDs correctly in 6-player game', () => {
      const setup = setupGame({ numPlayers: 6 });

      const team1 = setup.teams.find(t => t.id === 'team-1');
      const team2 = setup.teams.find(t => t.id === 'team-2');

      expect(team1?.playerIds).toEqual(['player-0', 'player-2', 'player-4']);
      expect(team2?.playerIds).toEqual(['player-1', 'player-3', 'player-5']);
    });

    it('should set up Pica Pica mode with 6 individual teams', () => {
      const setup = setupGame({ numPlayers: 6, picaPicaMode: true });

      expect(setup.players).toHaveLength(6);
      expect(setup.teams).toHaveLength(6); // Each player is their own team

      // Each player should have a unique team
      setup.players.forEach((player, index) => {
        expect(player.teamId).toBe(`team-${index}`);
      });

      // Each team should have exactly one player
      setup.teams.forEach((team, index) => {
        expect(team.playerIds).toEqual([`player-${index}`]);
      });
    });

    it('should throw error for Pica Pica mode with non-6 players', () => {
      expect(() => setupGame({ numPlayers: 4, picaPicaMode: true })).toThrow(
        'Pica Pica mode is only available for 6-player games'
      );
    });

    it('should throw error for invalid number of players', () => {
      expect(() => setupGame({ numPlayers: 3 as 2 | 4 | 6 })).toThrow(
        'Truco must be played with 2, 4, or 6 players'
      );
    });

    it('should handle 2-player team assignment', () => {
      const setup = setupGame({ numPlayers: 2 });

      expect(setup.players[0].teamId).toBe('team-1');
      expect(setup.players[1].teamId).toBe('team-2');

      const team1 = setup.teams.find(t => t.id === 'team-1');
      const team2 = setup.teams.find(t => t.id === 'team-2');

      expect(team1?.playerIds).toEqual(['player-0']);
      expect(team2?.playerIds).toEqual(['player-1']);
    });
  });

  describe('rotateDealer', () => {
    it('should rotate dealer from position 0 to 1', () => {
      const setup = setupGame({ numPlayers: 4 });
      const rotated = rotateDealer(setup.players, 0);

      expect(rotated[0].isDealer).toBe(false);
      expect(rotated[1].isDealer).toBe(true);
      expect(rotated[2].isDealer).toBe(false);
      expect(rotated[3].isDealer).toBe(false);
    });

    it('should rotate dealer from position 1 to 2', () => {
      const setup = setupGame({ numPlayers: 4 });
      const rotated = rotateDealer(setup.players, 1);

      expect(rotated[0].isDealer).toBe(false);
      expect(rotated[1].isDealer).toBe(false);
      expect(rotated[2].isDealer).toBe(true);
      expect(rotated[3].isDealer).toBe(false);
    });

    it('should wrap around from last player to first', () => {
      const setup = setupGame({ numPlayers: 4 });
      const rotated = rotateDealer(setup.players, 3);

      expect(rotated[0].isDealer).toBe(true);
      expect(rotated[1].isDealer).toBe(false);
      expect(rotated[2].isDealer).toBe(false);
      expect(rotated[3].isDealer).toBe(false);
    });

    it('should work with 2 players', () => {
      const setup = setupGame({ numPlayers: 2 });
      const rotated = rotateDealer(setup.players, 0);

      expect(rotated[0].isDealer).toBe(false);
      expect(rotated[1].isDealer).toBe(true);
    });

    it('should not modify original players array', () => {
      const setup = setupGame({ numPlayers: 4 });
      const original = [...setup.players];

      rotateDealer(setup.players, 0);

      expect(setup.players).toEqual(original);
    });
  });

  describe('getFirstPlayer', () => {
    it('should return player to the right of dealer (position 1)', () => {
      expect(getFirstPlayer(0, 4)).toBe(1);
    });

    it('should return player to the right of dealer (position 2)', () => {
      expect(getFirstPlayer(1, 4)).toBe(2);
    });

    it('should wrap around when dealer is last player', () => {
      expect(getFirstPlayer(3, 4)).toBe(0);
    });

    it('should work with 2 players', () => {
      expect(getFirstPlayer(0, 2)).toBe(1);
      expect(getFirstPlayer(1, 2)).toBe(0);
    });
  });

  describe('getNextPlayer', () => {
    it('should return next player position', () => {
      expect(getNextPlayer(0, 4)).toBe(1);
      expect(getNextPlayer(1, 4)).toBe(2);
      expect(getNextPlayer(2, 4)).toBe(3);
    });

    it('should wrap around after last player', () => {
      expect(getNextPlayer(3, 4)).toBe(0);
    });

    it('should work with 2 players', () => {
      expect(getNextPlayer(0, 2)).toBe(1);
      expect(getNextPlayer(1, 2)).toBe(0);
    });
  });

  describe('getPlayersInTurnOrder', () => {
    it('should return players in order starting from position 0', () => {
      const setup = setupGame({ numPlayers: 4 });
      const ordered = getPlayersInTurnOrder(setup.players, 0);

      expect(ordered.map(p => p.position)).toEqual([0, 1, 2, 3]);
    });

    it('should return players in order starting from position 1', () => {
      const setup = setupGame({ numPlayers: 4 });
      const ordered = getPlayersInTurnOrder(setup.players, 1);

      expect(ordered.map(p => p.position)).toEqual([1, 2, 3, 0]);
    });

    it('should return players in order starting from position 2', () => {
      const setup = setupGame({ numPlayers: 4 });
      const ordered = getPlayersInTurnOrder(setup.players, 2);

      expect(ordered.map(p => p.position)).toEqual([2, 3, 0, 1]);
    });

    it('should return players in order starting from position 3', () => {
      const setup = setupGame({ numPlayers: 4 });
      const ordered = getPlayersInTurnOrder(setup.players, 3);

      expect(ordered.map(p => p.position)).toEqual([3, 0, 1, 2]);
    });

    it('should work with 2 players', () => {
      const setup = setupGame({ numPlayers: 2 });
      const ordered = getPlayersInTurnOrder(setup.players, 1);

      expect(ordered.map(p => p.position)).toEqual([1, 0]);
    });

    it('should return all players', () => {
      const setup = setupGame({ numPlayers: 4 });
      const ordered = getPlayersInTurnOrder(setup.players, 1);

      expect(ordered).toHaveLength(4);
    });
  });

  describe('getPlayerAtPosition', () => {
    it('should return player at specified position', () => {
      const setup = setupGame({ numPlayers: 4 });
      const player = getPlayerAtPosition(setup.players, 2);

      expect(player.position).toBe(2);
      expect(player.id).toBe('player-2');
    });

    it('should work for all positions', () => {
      const setup = setupGame({ numPlayers: 4 });

      for (let pos = 0; pos < 4; pos++) {
        const player = getPlayerAtPosition(setup.players, pos as 0 | 1 | 2 | 3 | 4 | 5);
        expect(player.position).toBe(pos);
      }
    });

    it('should throw error for non-existent position', () => {
      const setup = setupGame({ numPlayers: 2 });

      expect(() => getPlayerAtPosition(setup.players, 2)).toThrow(
        'No player found at position 2'
      );
    });
  });

  describe('getTeamPlayers', () => {
    it('should return all players on team 1', () => {
      const setup = setupGame({ numPlayers: 4 });
      const teamPlayers = getTeamPlayers(setup.players, 'team-1');

      expect(teamPlayers).toHaveLength(2);
      expect(teamPlayers[0].position).toBe(0);
      expect(teamPlayers[1].position).toBe(2);
    });

    it('should return all players on team 2', () => {
      const setup = setupGame({ numPlayers: 4 });
      const teamPlayers = getTeamPlayers(setup.players, 'team-2');

      expect(teamPlayers).toHaveLength(2);
      expect(teamPlayers[0].position).toBe(1);
      expect(teamPlayers[1].position).toBe(3);
    });

    it('should work with 2 players', () => {
      const setup = setupGame({ numPlayers: 2 });
      const team1Players = getTeamPlayers(setup.players, 'team-1');
      const team2Players = getTeamPlayers(setup.players, 'team-2');

      expect(team1Players).toHaveLength(1);
      expect(team2Players).toHaveLength(1);
    });

    it('should return empty array for non-existent team', () => {
      const setup = setupGame({ numPlayers: 4 });
      const teamPlayers = getTeamPlayers(setup.players, 'team-999');

      expect(teamPlayers).toEqual([]);
    });
  });

  describe('getPlayerTeam', () => {
    it('should return team for player', () => {
      const setup = setupGame({ numPlayers: 4 });
      const team = getPlayerTeam(setup.teams, 'player-0');

      expect(team.id).toBe('team-1');
      expect(team.playerIds).toContain('player-0');
    });

    it('should work for all players', () => {
      const setup = setupGame({ numPlayers: 4 });

      const team0 = getPlayerTeam(setup.teams, 'player-0');
      const team1 = getPlayerTeam(setup.teams, 'player-1');
      const team2 = getPlayerTeam(setup.teams, 'player-2');
      const team3 = getPlayerTeam(setup.teams, 'player-3');

      expect(team0.id).toBe('team-1');
      expect(team1.id).toBe('team-2');
      expect(team2.id).toBe('team-1');
      expect(team3.id).toBe('team-2');
    });

    it('should throw error for non-existent player', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(() => getPlayerTeam(setup.teams, 'player-999')).toThrow(
        'No team found for player player-999'
      );
    });
  });

  describe('getOpposingTeam', () => {
    it('should return opposing team for team 1', () => {
      const setup = setupGame({ numPlayers: 4 });
      const opposing = getOpposingTeam(setup.teams, 'team-1');

      expect(opposing.id).toBe('team-2');
    });

    it('should return opposing team for team 2', () => {
      const setup = setupGame({ numPlayers: 4 });
      const opposing = getOpposingTeam(setup.teams, 'team-2');

      expect(opposing.id).toBe('team-1');
    });

    it('should throw error if not exactly 2 teams', () => {
      const setup = setupGame({ numPlayers: 4 });
      const threeTeams = [...setup.teams, { ...setup.teams[0], id: 'team-3' }];

      expect(() => getOpposingTeam(threeTeams, 'team-1')).toThrow(
        'getOpposingTeam requires exactly 2 teams (not applicable in Pica Pica mode)'
      );
    });

    it('should throw error for non-existent team', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(() => getOpposingTeam(setup.teams, 'team-999')).toThrow(
        'No opposing team found for team-999'
      );
    });
  });

  describe('getOpposingTeams', () => {
    it('should return all opposing teams in standard 2-team mode', () => {
      const setup = setupGame({ numPlayers: 4 });
      const opposing = getOpposingTeams(setup.teams, 'team-1');

      expect(opposing).toHaveLength(1);
      expect(opposing[0].id).toBe('team-2');
    });

    it('should return all opposing teams in Pica Pica mode', () => {
      const setup = setupGame({ numPlayers: 6, picaPicaMode: true });
      const opposing = getOpposingTeams(setup.teams, 'team-0');

      expect(opposing).toHaveLength(5);
      expect(opposing.map(t => t.id)).toEqual(['team-1', 'team-2', 'team-3', 'team-4', 'team-5']);
    });

    it('should work for any team in Pica Pica mode', () => {
      const setup = setupGame({ numPlayers: 6, picaPicaMode: true });
      const opposing = getOpposingTeams(setup.teams, 'team-3');

      expect(opposing).toHaveLength(5);
      expect(opposing.map(t => t.id)).toEqual(['team-0', 'team-1', 'team-2', 'team-4', 'team-5']);
    });

    it('should throw error for non-existent team', () => {
      const setup = setupGame({ numPlayers: 4 });

      expect(() => getOpposingTeams(setup.teams, 'team-999')).toThrow(
        'Team team-999 not found'
      );
    });
  });

  describe('6-player game turn order', () => {
    it('should work with 6 players', () => {
      const setup = setupGame({ numPlayers: 6 });
      const ordered = getPlayersInTurnOrder(setup.players, 2);

      expect(ordered.map(p => p.position)).toEqual([2, 3, 4, 5, 0, 1]);
    });

    it('should rotate dealer through all 6 positions', () => {
      const setup = setupGame({ numPlayers: 6 });

      let players = setup.players;
      expect(players[0].isDealer).toBe(true);

      players = rotateDealer(players, 0);
      expect(players[1].isDealer).toBe(true);

      players = rotateDealer(players, 1);
      expect(players[2].isDealer).toBe(true);

      players = rotateDealer(players, 2);
      expect(players[3].isDealer).toBe(true);

      players = rotateDealer(players, 3);
      expect(players[4].isDealer).toBe(true);

      players = rotateDealer(players, 4);
      expect(players[5].isDealer).toBe(true);

      players = rotateDealer(players, 5);
      expect(players[0].isDealer).toBe(true);
    });

    it('should get team players in 6-player game', () => {
      const setup = setupGame({ numPlayers: 6 });
      const team1Players = getTeamPlayers(setup.players, 'team-1');
      const team2Players = getTeamPlayers(setup.players, 'team-2');

      expect(team1Players).toHaveLength(3);
      expect(team1Players.map(p => p.position)).toEqual([0, 2, 4]);

      expect(team2Players).toHaveLength(3);
      expect(team2Players.map(p => p.position)).toEqual([1, 3, 5]);
    });
  });
});
