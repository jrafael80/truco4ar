import { v4 as uuidv4 } from 'uuid';
import { Room, Player, RoomCreationOptions } from './types.js';
import { generateRoomCode, isValidRoomCode } from '../utils/roomCode.js';
import { config } from '../config/env.js';

export class RoomManager {
  private rooms: Map<string, Room>;
  private roomCodeToId: Map<string, string>;

  constructor() {
    this.rooms = new Map();
    this.roomCodeToId = new Map();
  }

  /**
   * Creates a new room with a unique room code
   */
  createRoom(options: RoomCreationOptions = {}): Room {
    if (this.rooms.size >= config.game.maxRooms) {
      throw new Error('Maximum number of rooms reached');
    }

    const roomId = uuidv4();
    let roomCode = generateRoomCode();

    // Ensure room code is unique
    while (this.roomCodeToId.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const room: Room = {
      id: roomId,
      code: roomCode,
      players: new Map(),
      maxPlayers: options.maxPlayers || config.game.maxPlayersPerRoom,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      gameStarted: false
    };

    this.rooms.set(roomId, room);
    this.roomCodeToId.set(roomCode, roomId);

    return room;
  }

  /**
   * Gets a room by its ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Gets a room by its code
   */
  getRoomByCode(roomCode: string): Room | undefined {
    const upperCode = roomCode.toUpperCase();

    if (!isValidRoomCode(upperCode)) {
      return undefined;
    }

    const roomId = this.roomCodeToId.get(upperCode);
    if (!roomId) {
      return undefined;
    }

    return this.rooms.get(roomId);
  }

  /**
   * Adds a player to a room
   */
  addPlayer(roomId: string, player: Player): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.players.size >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    if (room.players.has(player.id)) {
      throw new Error('Player already in room');
    }

    room.players.set(player.id, player);
    room.lastActivityAt = new Date();
  }

  /**
   * Removes a player from a room
   */
  removePlayer(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    room.players.delete(playerId);
    room.lastActivityAt = new Date();

    // Clean up empty rooms
    if (room.players.size === 0) {
      this.deleteRoom(roomId);
    }
  }

  /**
   * Gets a player from a room
   */
  getPlayer(roomId: string, playerId: string): Player | undefined {
    const room = this.rooms.get(roomId);
    if (!room) {
      return undefined;
    }

    return room.players.get(playerId);
  }

  /**
   * Updates a player's connection status
   */
  updatePlayerConnection(roomId: string, playerId: string, connected: boolean): void {
    const player = this.getPlayer(roomId, playerId);
    if (player) {
      player.connected = connected;
    }
  }

  /**
   * Deletes a room
   */
  deleteRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.roomCodeToId.delete(room.code);
      this.rooms.delete(roomId);
    }
  }

  /**
   * Gets all rooms (for debugging/admin purposes)
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Cleans up inactive rooms older than the configured timeout
   */
  cleanupInactiveRooms(): number {
    const timeoutMs = config.game.roomTimeoutMinutes * 60 * 1000;
    const now = Date.now();
    let cleanedCount = 0;

    for (const [roomId, room] of this.rooms.entries()) {
      const inactiveTime = now - room.lastActivityAt.getTime();
      if (inactiveTime > timeoutMs) {
        this.deleteRoom(roomId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Finds the room ID for a socket (by searching for player's socket ID)
   */
  findRoomBySocketId(socketId: string): string | undefined {
    for (const [roomId, room] of this.rooms.entries()) {
      for (const player of room.players.values()) {
        if (player.socketId === socketId) {
          return roomId;
        }
      }
    }
    return undefined;
  }
}
