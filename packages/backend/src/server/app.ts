import express, { Express } from 'express';
import cors from 'cors';
import { createServer, Server as HTTPServer } from 'http';
import { config } from '../config/env.js';

export function createApp(): { app: Express; httpServer: HTTPServer } {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: config.cors.allowedOrigins,
      credentials: true
    })
  );
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API info endpoint
  app.get('/api', (req, res) => {
    res.json({
      name: 'Truco4AR Backend',
      version: '0.1.0',
      endpoints: {
        health: '/health',
        socket: config.socket.path
      }
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return { app, httpServer };
}
