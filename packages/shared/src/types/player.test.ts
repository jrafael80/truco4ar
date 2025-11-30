/**
 * Tests for Player and Team types
 */

import { Suit, createCard } from './card';
import {
  createPlayer,
  createTeam,
  updatePlayerHand,
  removeCardFromHand,
  setPlayerDealer,
  updateTeamScore,
  addTeamPoints,
  hasTeamWon
} from './player';

describe('Player Types', () => {
  describe('createPlayer', () => {
    it('should create a player with all properties', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0);

      expect(player.id).toBe('p1');
      expect(player.name).toBe('Alice');
      expect(player.teamId).toBe('t1');
      expect(player.position).toBe(0);
      expect(player.hand).toEqual([]);
      expect(player.isDealer).toBe(false);
    });

    it('should create a player with custom hand', () => {
      const hand = [createCard(1, Suit.ESPADAS), createCard(7, Suit.OROS)];
      const player = createPlayer('p1', 'Alice', 't1', 0, hand);

      expect(player.hand).toEqual(hand);
      expect(player.hand).toHaveLength(2);
    });

    it('should create a player as dealer', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, [], true);

      expect(player.isDealer).toBe(true);
    });

    it('should support all valid positions', () => {
      const p0 = createPlayer('p0', 'Alice', 't1', 0);
      const p1 = createPlayer('p1', 'Bob', 't2', 1);
      const p2 = createPlayer('p2', 'Charlie', 't1', 2);
      const p3 = createPlayer('p3', 'Diana', 't2', 3);

      expect(p0.position).toBe(0);
      expect(p1.position).toBe(1);
      expect(p2.position).toBe(2);
      expect(p3.position).toBe(3);
    });
  });

  describe('updatePlayerHand', () => {
    it('should update player hand with new cards', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0);
      const newHand = [
        createCard(1, Suit.ESPADAS),
        createCard(7, Suit.OROS),
        createCard(3, Suit.COPAS)
      ];

      const updatedPlayer = updatePlayerHand(player, newHand);

      expect(updatedPlayer.hand).toEqual(newHand);
      expect(updatedPlayer.hand).toHaveLength(3);
    });

    it('should not modify original player', () => {
      const originalHand = [createCard(1, Suit.ESPADAS)];
      const player = createPlayer('p1', 'Alice', 't1', 0, originalHand);
      const newHand = [createCard(7, Suit.OROS)];

      updatePlayerHand(player, newHand);

      expect(player.hand).toEqual(originalHand);
    });

    it('should allow empty hand', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, [createCard(1, Suit.ESPADAS)]);
      const updatedPlayer = updatePlayerHand(player, []);

      expect(updatedPlayer.hand).toEqual([]);
    });
  });

  describe('removeCardFromHand', () => {
    it('should remove card at specified index', () => {
      const hand = [
        createCard(1, Suit.ESPADAS),
        createCard(7, Suit.OROS),
        createCard(3, Suit.COPAS)
      ];
      const player = createPlayer('p1', 'Alice', 't1', 0, hand);

      const updatedPlayer = removeCardFromHand(player, 1);

      expect(updatedPlayer.hand).toHaveLength(2);
      expect(updatedPlayer.hand[0]).toEqual(createCard(1, Suit.ESPADAS));
      expect(updatedPlayer.hand[1]).toEqual(createCard(3, Suit.COPAS));
    });

    it('should remove first card', () => {
      const hand = [createCard(1, Suit.ESPADAS), createCard(7, Suit.OROS)];
      const player = createPlayer('p1', 'Alice', 't1', 0, hand);

      const updatedPlayer = removeCardFromHand(player, 0);

      expect(updatedPlayer.hand).toHaveLength(1);
      expect(updatedPlayer.hand[0]).toEqual(createCard(7, Suit.OROS));
    });

    it('should remove last card', () => {
      const hand = [createCard(1, Suit.ESPADAS), createCard(7, Suit.OROS)];
      const player = createPlayer('p1', 'Alice', 't1', 0, hand);

      const updatedPlayer = removeCardFromHand(player, 1);

      expect(updatedPlayer.hand).toHaveLength(1);
      expect(updatedPlayer.hand[0]).toEqual(createCard(1, Suit.ESPADAS));
    });

    it('should not modify original player', () => {
      const hand = [createCard(1, Suit.ESPADAS), createCard(7, Suit.OROS)];
      const player = createPlayer('p1', 'Alice', 't1', 0, hand);

      removeCardFromHand(player, 0);

      expect(player.hand).toHaveLength(2);
    });

    it('should throw error for negative index', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, [createCard(1, Suit.ESPADAS)]);

      expect(() => removeCardFromHand(player, -1)).toThrow('Invalid card index: -1');
    });

    it('should throw error for index out of bounds', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, [createCard(1, Suit.ESPADAS)]);

      expect(() => removeCardFromHand(player, 1)).toThrow('Invalid card index: 1');
    });

    it('should throw error for empty hand', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, []);

      expect(() => removeCardFromHand(player, 0)).toThrow('Invalid card index: 0');
    });
  });

  describe('setPlayerDealer', () => {
    it('should set player as dealer', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0);
      const updatedPlayer = setPlayerDealer(player, true);

      expect(updatedPlayer.isDealer).toBe(true);
    });

    it('should remove dealer status', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0, [], true);
      const updatedPlayer = setPlayerDealer(player, false);

      expect(updatedPlayer.isDealer).toBe(false);
    });

    it('should not modify original player', () => {
      const player = createPlayer('p1', 'Alice', 't1', 0);
      setPlayerDealer(player, true);

      expect(player.isDealer).toBe(false);
    });
  });
});

describe('Team Types', () => {
  describe('createTeam', () => {
    it('should create a team with all properties', () => {
      const team = createTeam('t1', 'Team Alpha');

      expect(team.id).toBe('t1');
      expect(team.name).toBe('Team Alpha');
      expect(team.playerIds).toEqual([]);
      expect(team.score).toBe(0);
    });

    it('should create a team with player IDs', () => {
      const playerIds = ['p1', 'p2'];
      const team = createTeam('t1', 'Team Alpha', playerIds);

      expect(team.playerIds).toEqual(playerIds);
    });

    it('should create a team with initial score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 15);

      expect(team.score).toBe(15);
    });
  });

  describe('updateTeamScore', () => {
    it('should update team score', () => {
      const team = createTeam('t1', 'Team Alpha');
      const updatedTeam = updateTeamScore(team, 10);

      expect(updatedTeam.score).toBe(10);
    });

    it('should replace existing score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 5);
      const updatedTeam = updateTeamScore(team, 20);

      expect(updatedTeam.score).toBe(20);
    });

    it('should not modify original team', () => {
      const team = createTeam('t1', 'Team Alpha', [], 5);
      updateTeamScore(team, 20);

      expect(team.score).toBe(5);
    });
  });

  describe('addTeamPoints', () => {
    it('should add points to team score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 10);
      const updatedTeam = addTeamPoints(team, 5);

      expect(updatedTeam.score).toBe(15);
    });

    it('should add to zero score', () => {
      const team = createTeam('t1', 'Team Alpha');
      const updatedTeam = addTeamPoints(team, 7);

      expect(updatedTeam.score).toBe(7);
    });

    it('should handle negative points', () => {
      const team = createTeam('t1', 'Team Alpha', [], 10);
      const updatedTeam = addTeamPoints(team, -3);

      expect(updatedTeam.score).toBe(7);
    });

    it('should not modify original team', () => {
      const team = createTeam('t1', 'Team Alpha', [], 10);
      addTeamPoints(team, 5);

      expect(team.score).toBe(10);
    });
  });

  describe('hasTeamWon', () => {
    it('should return true when team reaches winning score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 30);
      expect(hasTeamWon(team)).toBe(true);
    });

    it('should return true when team exceeds winning score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 35);
      expect(hasTeamWon(team)).toBe(true);
    });

    it('should return false when team is below winning score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 29);
      expect(hasTeamWon(team)).toBe(false);
    });

    it('should support custom winning score', () => {
      const team = createTeam('t1', 'Team Alpha', [], 15);
      expect(hasTeamWon(team, 15)).toBe(true);
    });

    it('should return false for custom winning score not reached', () => {
      const team = createTeam('t1', 'Team Alpha', [], 14);
      expect(hasTeamWon(team, 15)).toBe(false);
    });

    it('should handle zero score', () => {
      const team = createTeam('t1', 'Team Alpha');
      expect(hasTeamWon(team)).toBe(false);
    });
  });
});
