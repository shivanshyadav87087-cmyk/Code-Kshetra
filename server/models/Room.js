import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  password: {
    type: String,
    default: ''
  },
  topic: {
    type: String,
    default: 'all'
  },
  difficulty: {
    type: String,
    default: 'all'
  },
  timeLimit: {
    type: Number,
    default: 10
  },
  host: {
    id: String,
    username: String,
    rating: Number
  },
  guest: {
    id: String,
    username: String,
    rating: Number
  },
  problemId: String,
  status: {
    type: String,
    enum: ['waiting', 'in-game', 'finished'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Auto cleanup after 1 hour
  }
});

export const Room = mongoose.model('Room', roomSchema);
