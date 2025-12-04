import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
  },
  socket: {
    path: process.env.SOCKET_PATH || '/socket.io',
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '60000', 10),
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10)
  },
  game: {
    maxRooms: parseInt(process.env.MAX_ROOMS || '100', 10),
    maxPlayersPerRoom: parseInt(process.env.MAX_PLAYERS_PER_ROOM || '6', 10),
    roomTimeoutMinutes: parseInt(process.env.ROOM_TIMEOUT_MINUTES || '30', 10)
  }
};
