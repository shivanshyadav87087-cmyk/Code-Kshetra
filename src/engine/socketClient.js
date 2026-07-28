import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export const socket = io(BACKEND_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('[Socket.IO Connected] Connected to backend server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket.IO Disconnected] Connection lost to backend.');
});
