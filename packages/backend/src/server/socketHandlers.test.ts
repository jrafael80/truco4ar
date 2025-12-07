import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { createApp } from './app';
import { createSocketServer } from './socket';
import { setupSocketHandlers } from './socketHandlers';
import { RoomManager } from '../game/RoomManager';

describe('Socket Handlers Integration', () => {
  let httpServer: HTTPServer;
  let io: SocketIOServer;
  let roomManager: RoomManager;
  let clientSocket: ClientSocket;
  let clientSocket2: ClientSocket;
  const port = 3002; // Use different port for tests

  beforeEach(done => {
    const { httpServer: server } = createApp();
    httpServer = server;
    io = createSocketServer(httpServer);
    roomManager = new RoomManager();
    setupSocketHandlers(io, roomManager);

    httpServer.listen(port, () => {
      done();
    });
  });

  afterEach(done => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    if (clientSocket2 && clientSocket2.connected) {
      clientSocket2.disconnect();
    }
    io.close();
    httpServer.close(() => {
      done();
    });
  });

  describe('Connection', () => {
    it('should connect to the server', done => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });
    });

    it('should disconnect from the server', done => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', () => {
        clientSocket.disconnect();
      });
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false);
        done();
      });
    });
  });

  describe('Create Room', () => {
    beforeEach(done => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });

    it('should create a room and return room code', done => {
      clientSocket.emit('createRoom', { playerName: 'Alice' });

      clientSocket.on('roomCreated', ({ roomId, roomCode }) => {
        expect(roomId).toBeDefined();
        expect(roomCode).toBeDefined();
        expect(roomCode).toHaveLength(6);
        done();
      });
    });

    it('should emit roomJoined after creating room', done => {
      clientSocket.emit('createRoom', { playerName: 'Alice' });

      clientSocket.on('roomJoined', ({ roomId, players }) => {
        expect(roomId).toBeDefined();
        expect(players).toHaveLength(1);
        done();
      });
    });

    it('should reject empty player name', done => {
      clientSocket.emit('createRoom', { playerName: '' });

      clientSocket.on('error', ({ message }) => {
        expect(message).toBe('Player name is required');
        done();
      });
    });

    it('should reject player name that is too long', done => {
      const longName = 'a'.repeat(51);
      clientSocket.emit('createRoom', { playerName: longName });

      clientSocket.on('error', ({ message }) => {
        expect(message).toBe('Player name is too long (max 50 characters)');
        done();
      });
    });
  });

  describe('Join Room', () => {
    let roomCode: string;

    beforeEach(done => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', () => {
        clientSocket.emit('createRoom', { playerName: 'Alice' });
        clientSocket.on('roomCreated', ({ roomCode: code }) => {
          roomCode = code;
          done();
        });
      });
    });

    it('should allow second player to join existing room', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode, playerName: 'Bob' });

        clientSocket2.on('roomJoined', ({ players }) => {
          expect(players).toHaveLength(2);
          done();
        });
      });
    });

    it('should notify existing players when new player joins', done => {
      clientSocket.on('playerJoined', ({ playerId, playerName }) => {
        expect(playerId).toBeDefined();
        expect(playerName).toBe('Bob');
        done();
      });

      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode, playerName: 'Bob' });
      });
    });

    it('should reject invalid room code', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode: 'INVALID', playerName: 'Bob' });

        clientSocket2.on('error', ({ message }) => {
          expect(message).toBe('Room not found');
          done();
        });
      });
    });

    it('should be case-insensitive for room codes', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode: roomCode.toLowerCase(), playerName: 'Bob' });

        clientSocket2.on('roomJoined', ({ players }) => {
          expect(players).toHaveLength(2);
          done();
        });
      });
    });

    it('should reject empty player name', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode, playerName: '' });

        clientSocket2.on('error', ({ message }) => {
          expect(message).toBe('Player name is required');
          done();
        });
      });
    });
  });

  describe('Leave Room', () => {
    let roomCode: string;

    beforeEach(done => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', () => {
        clientSocket.emit('createRoom', { playerName: 'Alice' });
        clientSocket.on('roomCreated', ({ roomCode: code }) => {
          roomCode = code;
          done();
        });
      });
    });

    it('should handle explicit leave room', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode, playerName: 'Bob' });
      });

      clientSocket.on('playerLeft', ({ playerId }) => {
        expect(playerId).toBeDefined();
        done();
      });

      clientSocket2.on('roomJoined', () => {
        clientSocket2.emit('leaveRoom');
      });
    });

    it('should notify other players when player disconnects', done => {
      clientSocket2 = Client(`http://localhost:${port}`);
      clientSocket2.on('connect', () => {
        clientSocket2.emit('joinRoom', { roomCode, playerName: 'Bob' });
      });

      clientSocket.on('playerLeft', ({ playerId }) => {
        expect(playerId).toBeDefined();
        done();
      });

      clientSocket2.on('roomJoined', () => {
        clientSocket2.disconnect();
      });
    });

    it('should delete room when last player leaves', done => {
      clientSocket.on('roomJoined', () => {
        clientSocket.emit('leaveRoom');

        // Give time for cleanup
        setTimeout(() => {
          const room = roomManager.getRoomByCode(roomCode);
          expect(room).toBeUndefined();
          done();
        }, 100);
      });
    }, 10000); // 10 second timeout for CI
  });

  describe('Multiple Players', () => {
    it('should handle 4 players in a room', done => {
      const clients: ClientSocket[] = [];
      let roomCode: string;
      let joinedCount = 0;
      const totalPlayers = 4;

      // First player creates room
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', () => {
        clientSocket.emit('createRoom', { playerName: 'Player1' });
      });

      clientSocket.on('roomCreated', ({ roomCode: code }) => {
        roomCode = code;
        joinedCount++; // Count the creator

        // Add 3 more players sequentially for better reliability
        setTimeout(() => {
          for (let i = 2; i <= totalPlayers; i++) {
            const client = Client(`http://localhost:${port}`);
            clients.push(client);

            client.on('connect', () => {
              client.emit('joinRoom', { roomCode, playerName: `Player${i}` });
            });

            client.on('roomJoined', ({ players }) => {
              joinedCount++;
              // Verify that the room has the expected number of players
              if (joinedCount === totalPlayers) {
                expect(players.length).toBe(totalPlayers);
                expect(joinedCount).toBe(totalPlayers);
                clients.forEach(c => c.disconnect());
                done();
              }
            });

            client.on('error', ({ message }) => {
              done(new Error(`Client ${i} error: ${message}`));
            });
          }
        }, 200); // Slightly longer delay for CI
      });

      clientSocket.on('error', ({ message }) => {
        done(new Error(`Creator error: ${message}`));
      });
    }, 15000);
  });
});
