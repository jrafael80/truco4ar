import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { config } from '../config/env.js';

export interface ServerToClientEvents {
  roomCreated: (data: { roomId: string; roomCode: string }) => void;
  roomJoined: (data: { roomId: string; players: string[] }) => void;
  playerJoined: (data: { playerId: string; playerName: string }) => void;
  playerLeft: (data: { playerId: string }) => void;
  roomClosed: () => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  createRoom: (data: { playerName: string }) => void;
  joinRoom: (data: { roomCode: string; playerName: string }) => void;
  leaveRoom: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId: string;
  playerName: string;
  roomId?: string;
}

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypedServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function createSocketServer(httpServer: HTTPServer): TypedServer {
  const io: TypedServer = new SocketIOServer(httpServer, {
    path: config.socket.path,
    pingTimeout: config.socket.pingTimeout,
    pingInterval: config.socket.pingInterval,
    cors: {
      origin: config.cors.allowedOrigins,
      credentials: true
    }
  });

  return io;
}
