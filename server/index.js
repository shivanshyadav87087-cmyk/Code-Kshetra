import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import { setupRoomSockets } from './sockets/roomSockets.js';

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Increase JSON Body Limit to 10MB to support profile photo DataURL uploads!
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect Database
connectDB();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Code क्षेत्र Backend & Socket Server', serverTime: new Date().toISOString() });
});

// Serve frontend build output if present on server (Render single-service deployment)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Code क्षेत्र Backend Server</title></head>
        <body style="background:#0A0B0F;color:#F8FAFC;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;padding:2rem;background:#111318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
            <h1 style="color:#14B8A6;">⚔️ Code क्षेत्र Backend Server is Live & Ready!</h1>
            <p style="color:#94A3B8;">REST API & Socket.IO server running smoothly.</p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupRoomSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
======================================================
 ⚔️ CODE क्षेत्र 1v1 BACKEND SERVER READY
 ➜ Server listening on: http://localhost:${PORT}
 ➜ REST API Health:     http://localhost:${PORT}/api/health
======================================================
  `);
});
