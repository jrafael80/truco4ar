import { v4 as uuidv4 } from 'uuid';
import { TypedSocket, TypedServer } from './socket.js';
import { RoomManager } from '../game/RoomManager.js';
import { Player } from '../game/types.js';

export function setupSocketHandlers(io: TypedServer, roomManager: RoomManager) {
  io.on('connection', (socket: TypedSocket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle room creation
    socket.on('createRoom', ({ playerName }) => {
      try {
        // Validate player name
        if (!playerName || playerName.trim().length === 0) {
          socket.emit('error', { message: 'Player name is required' });
          return;
        }

        if (playerName.length > 50) {
          socket.emit('error', { message: 'Player name is too long (max 50 characters)' });
          return;
        }

        // Create room
        const room = roomManager.createRoom();

        // Create player
        const playerId = uuidv4();
        const player: Player = {
          id: playerId,
          name: playerName.trim(),
          socketId: socket.id,
          connected: true,
          joinedAt: new Date()
        };

        // Add player to room
        roomManager.addPlayer(room.id, player);

        // Store player data in socket
        socket.data.playerId = playerId;
        socket.data.playerName = player.name;
        socket.data.roomId = room.id;

        // Join socket.io room
        socket.join(room.id);

        // Emit success
        socket.emit('roomCreated', {
          roomId: room.id,
          roomCode: room.code
        });

        socket.emit('roomJoined', {
          roomId: room.id,
          players: [playerId]
        });

        console.log(`Room created: ${room.code} by ${playerName}`);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', {
          message: error instanceof Error ? error.message : 'Failed to create room'
        });
      }
    });

    // Handle joining a room
    socket.on('joinRoom', ({ roomCode, playerName }) => {
      try {
        // Validate inputs
        if (!roomCode || roomCode.trim().length === 0) {
          socket.emit('error', { message: 'Room code is required' });
          return;
        }

        if (!playerName || playerName.trim().length === 0) {
          socket.emit('error', { message: 'Player name is required' });
          return;
        }

        if (playerName.length > 50) {
          socket.emit('error', { message: 'Player name is too long (max 50 characters)' });
          return;
        }

        // Find room
        const room = roomManager.getRoomByCode(roomCode.trim().toUpperCase());
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Create player
        const playerId = uuidv4();
        const player: Player = {
          id: playerId,
          name: playerName.trim(),
          socketId: socket.id,
          connected: true,
          joinedAt: new Date()
        };

        // Add player to room
        roomManager.addPlayer(room.id, player);

        // Store player data in socket
        socket.data.playerId = playerId;
        socket.data.playerName = player.name;
        socket.data.roomId = room.id;

        // Join socket.io room
        socket.join(room.id);

        // Get all player IDs
        const playerIds = Array.from(room.players.keys());

        // Notify all players in room
        io.to(room.id).emit('playerJoined', {
          playerId,
          playerName: player.name
        });

        // Send room state to joining player
        socket.emit('roomJoined', {
          roomId: room.id,
          players: playerIds
        });

        console.log(`${playerName} joined room ${room.code}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', {
          message: error instanceof Error ? error.message : 'Failed to join room'
        });
      }
    });

    // Handle leaving a room
    socket.on('leaveRoom', () => {
      handlePlayerLeave(socket, roomManager, io);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      handlePlayerLeave(socket, roomManager, io);
    });
  });

  // Setup periodic cleanup
  setInterval(() => {
    const cleaned = roomManager.cleanupInactiveRooms();
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} inactive rooms`);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}

/**
 * Handles a player leaving a room (either explicitly or via disconnect)
 */
function handlePlayerLeave(socket: TypedSocket, roomManager: RoomManager, io: TypedServer) {
  const { playerId, roomId } = socket.data;

  if (!roomId || !playerId) {
    return;
  }

  // Remove player from room
  roomManager.removePlayer(roomId, playerId);

  // Leave socket.io room
  socket.leave(roomId);

  // Notify remaining players
  io.to(roomId).emit('playerLeft', { playerId });

  console.log(`Player ${playerId} left room ${roomId}`);

  // Check if room still exists (it's deleted if empty)
  const room = roomManager.getRoom(roomId);
  if (!room) {
    console.log(`Room ${roomId} was deleted (empty)`);
  }
}
