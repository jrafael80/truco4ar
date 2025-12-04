import { describe, it, expect, beforeEach } from '@jest/globals';
import { RoomManager } from './RoomManager';
import { Player } from './types';

describe('RoomManager', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('createRoom', () => {
    it('creates a room with a unique ID and code', () => {
      const room = roomManager.createRoom();

      expect(room.id).toBeDefined();
      expect(room.code).toBeDefined();
      expect(room.code).toHaveLength(6);
      expect(room.players.size).toBe(0);
      expect(room.gameStarted).toBe(false);
    });

    it('creates multiple rooms with unique codes', () => {
      const room1 = roomManager.createRoom();
      const room2 = roomManager.createRoom();

      expect(room1.id).not.toBe(room2.id);
      expect(room1.code).not.toBe(room2.code);
    });

    it('sets default max players to 6', () => {
      const room = roomManager.createRoom();
      expect(room.maxPlayers).toBe(6);
    });

    it('allows custom max players', () => {
      const room = roomManager.createRoom({ maxPlayers: 4 });
      expect(room.maxPlayers).toBe(4);
    });
  });

  describe('getRoom', () => {
    it('retrieves a room by ID', () => {
      const createdRoom = roomManager.createRoom();
      const retrievedRoom = roomManager.getRoom(createdRoom.id);

      expect(retrievedRoom).toBe(createdRoom);
    });

    it('returns undefined for non-existent room', () => {
      const room = roomManager.getRoom('non-existent-id');
      expect(room).toBeUndefined();
    });
  });

  describe('getRoomByCode', () => {
    it('retrieves a room by code', () => {
      const createdRoom = roomManager.createRoom();
      const retrievedRoom = roomManager.getRoomByCode(createdRoom.code);

      expect(retrievedRoom).toBe(createdRoom);
    });

    it('is case-insensitive', () => {
      const createdRoom = roomManager.createRoom();
      const lowerCaseCode = createdRoom.code.toLowerCase();
      const retrievedRoom = roomManager.getRoomByCode(lowerCaseCode);

      expect(retrievedRoom).toBe(createdRoom);
    });

    it('returns undefined for non-existent code', () => {
      const room = roomManager.getRoomByCode('XXXXXX');
      expect(room).toBeUndefined();
    });

    it('returns undefined for invalid code format', () => {
      const room = roomManager.getRoomByCode('ABC');
      expect(room).toBeUndefined();
    });
  });

  describe('addPlayer', () => {
    it('adds a player to a room', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);

      expect(room.players.size).toBe(1);
      expect(room.players.get('player1')).toBe(player);
    });

    it('throws error if room does not exist', () => {
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      expect(() => {
        roomManager.addPlayer('non-existent', player);
      }).toThrow('Room not found');
    });

    it('throws error if room is full', () => {
      const room = roomManager.createRoom({ maxPlayers: 2 });

      const player1: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      const player2: Player = {
        id: 'player2',
        name: 'Bob',
        socketId: 'socket2',
        connected: true,
        joinedAt: new Date()
      };

      const player3: Player = {
        id: 'player3',
        name: 'Charlie',
        socketId: 'socket3',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player1);
      roomManager.addPlayer(room.id, player2);

      expect(() => {
        roomManager.addPlayer(room.id, player3);
      }).toThrow('Room is full');
    });

    it('throws error if player already in room', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);

      expect(() => {
        roomManager.addPlayer(room.id, player);
      }).toThrow('Player already in room');
    });
  });

  describe('removePlayer', () => {
    it('removes a player from a room', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);
      expect(room.players.size).toBe(1);

      roomManager.removePlayer(room.id, 'player1');
      expect(room.players.size).toBe(0);
    });

    it('deletes room when last player leaves', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);
      roomManager.removePlayer(room.id, 'player1');

      const retrievedRoom = roomManager.getRoom(room.id);
      expect(retrievedRoom).toBeUndefined();
    });

    it('does not delete room if players remain', () => {
      const room = roomManager.createRoom();
      const player1: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };
      const player2: Player = {
        id: 'player2',
        name: 'Bob',
        socketId: 'socket2',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player1);
      roomManager.addPlayer(room.id, player2);
      roomManager.removePlayer(room.id, 'player1');

      const retrievedRoom = roomManager.getRoom(room.id);
      expect(retrievedRoom).toBeDefined();
      expect(room.players.size).toBe(1);
    });
  });

  describe('getPlayer', () => {
    it('retrieves a player from a room', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);
      const retrievedPlayer = roomManager.getPlayer(room.id, 'player1');

      expect(retrievedPlayer).toBe(player);
    });

    it('returns undefined if player not in room', () => {
      const room = roomManager.createRoom();
      const player = roomManager.getPlayer(room.id, 'non-existent');

      expect(player).toBeUndefined();
    });

    it('returns undefined if room does not exist', () => {
      const player = roomManager.getPlayer('non-existent', 'player1');
      expect(player).toBeUndefined();
    });
  });

  describe('updatePlayerConnection', () => {
    it('updates player connection status', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);
      roomManager.updatePlayerConnection(room.id, 'player1', false);

      expect(player.connected).toBe(false);
    });
  });

  describe('findRoomBySocketId', () => {
    it('finds room by socket ID', () => {
      const room = roomManager.createRoom();
      const player: Player = {
        id: 'player1',
        name: 'Alice',
        socketId: 'socket1',
        connected: true,
        joinedAt: new Date()
      };

      roomManager.addPlayer(room.id, player);
      const foundRoomId = roomManager.findRoomBySocketId('socket1');

      expect(foundRoomId).toBe(room.id);
    });

    it('returns undefined if socket ID not found', () => {
      const foundRoomId = roomManager.findRoomBySocketId('non-existent-socket');
      expect(foundRoomId).toBeUndefined();
    });
  });

  describe('deleteRoom', () => {
    it('deletes a room', () => {
      const room = roomManager.createRoom();
      roomManager.deleteRoom(room.id);

      const retrievedRoom = roomManager.getRoom(room.id);
      expect(retrievedRoom).toBeUndefined();
    });

    it('removes room code mapping', () => {
      const room = roomManager.createRoom();
      roomManager.deleteRoom(room.id);

      const retrievedRoom = roomManager.getRoomByCode(room.code);
      expect(retrievedRoom).toBeUndefined();
    });
  });

  describe('getAllRooms', () => {
    it('returns all rooms', () => {
      roomManager.createRoom();
      roomManager.createRoom();
      roomManager.createRoom();

      const allRooms = roomManager.getAllRooms();
      expect(allRooms).toHaveLength(3);
    });

    it('returns empty array when no rooms exist', () => {
      const allRooms = roomManager.getAllRooms();
      expect(allRooms).toHaveLength(0);
    });
  });
});
