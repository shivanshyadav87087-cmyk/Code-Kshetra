import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  roomId: String,
  problemId: String,
  problemTitle: String,
  host: {
    username: String,
    score: Number,
    passedCount: Number
  },
  guest: {
    username: String,
    score: Number,
    passedCount: Number
  },
  winnerUsername: String,
  isDraw: Boolean,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export const Match = mongoose.model('Match', matchSchema);
