import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { memoryUsers } from './authRoutes.js';

const router = express.Router();

// Get Global ELO Leaderboard sorted strictly by Rating Points Descending
router.get('/', async (req, res) => {
  try {
    const userMap = new Map();

    // 1. Fetch from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const dbUsers = await User.find()
          .select('username rating wins losses draws totalMatches avatarUrl location leetcodeUsername')
          .sort({ rating: -1, wins: -1 })
          .limit(50);

        dbUsers.forEach(u => {
          userMap.set(u.username.toLowerCase(), {
            username: u.username,
            rating: u.rating ?? 0,
            wins: u.wins || 0,
            losses: u.losses || 0,
            draws: u.draws || 0,
            totalMatches: u.totalMatches || 0,
            avatarUrl: u.avatarUrl,
            location: u.location,
            leetcodeUsername: u.leetcodeUsername
          });
        });
      } catch (e) {}
    }

    // 2. Fetch from Memory Store
    if (memoryUsers && memoryUsers.size > 0) {
      for (const [, memUser] of memoryUsers) {
        const key = memUser.username.toLowerCase();
        if (!userMap.has(key)) {
          userMap.set(key, {
            username: memUser.username,
            rating: memUser.rating ?? 0,
            wins: memUser.wins || 0,
            losses: memUser.losses || 0,
            draws: memUser.draws || 0,
            totalMatches: memUser.totalMatches || 0,
            avatarUrl: memUser.avatarUrl,
            location: memUser.location,
            leetcodeUsername: memUser.leetcodeUsername
          });
        } else {
          // Sync higher rating if updated in memory
          const existing = userMap.get(key);
          if ((memUser.rating ?? 0) >= (existing.rating ?? 0)) {
            existing.rating = memUser.rating ?? 0;
            existing.wins = memUser.wins || 0;
            existing.losses = memUser.losses || 0;
          }
        }
      }
    }

    // Convert map to array and sort strictly by rating descending, then wins descending
    const sortedLeaderboard = Array.from(userMap.values()).sort((a, b) => {
      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0); // Higher rating at top
      }
      return (b.wins || 0) - (a.wins || 0); // Tie-breaker by total wins
    });

    return res.json(sortedLeaderboard.slice(0, 50));
  } catch (err) {
    console.error('Leaderboard API error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

export default router;
