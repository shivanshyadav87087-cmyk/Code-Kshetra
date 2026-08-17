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

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    maintenance: process.env.MAINTENANCE_MODE === 'true' || false,
    message: process.env.MAINTENANCE_MESSAGE || '⚙️ Code क्षेत्र is currently undergoing live feature updates and system maintenance.'
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
