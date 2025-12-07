import { createApp } from './server/app.js';
import { createSocketServer } from './server/socket.js';
import { setupSocketHandlers } from './server/socketHandlers.js';
import { RoomManager } from './game/RoomManager.js';
import { config } from './config/env.js';

async function main() {
  // Create Express app and HTTP server
  const { httpServer } = createApp();

  // Create Socket.io server
  const io = createSocketServer(httpServer);

  // Create room manager
  const roomManager = new RoomManager();

  // Setup socket handlers
  setupSocketHandlers(io, roomManager);

  // Start server
  httpServer.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📡 Socket.io path: ${config.socket.path}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`✅ CORS origins: ${config.cors.allowedOrigins.join(', ')}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n📴 Shutting down server...');
    io.close(() => {
      console.log('Socket.io server closed');
      httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
