import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'codeclash_super_secret_jwt_key_99';

export const memoryUsers = new Map();

// Fast Instant 0ms SHA-256 Password Hash Helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Live Handle Availability Endpoint (Case-Insensitive Global Check)
router.get('/check-handle', async (req, res) => {
  try {
    const rawHandle = req.query.handle || '';
    const sanitized = String(rawHandle).replace(/<[^>]*>?/gm, '').trim();

    if (!sanitized || sanitized.length < 5) {
      return res.json({ available: false, error: 'Handle must be at least 5 characters long.' });
    }

    if (sanitized.length > 20) {
      return res.json({ available: false, error: 'Handle must not exceed 20 characters.' });
    }

    const lowerHandle = sanitized.toLowerCase();

    // 1. Check MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const existingDb = await User.findOne({ username: { $regex: new RegExp(`^${sanitized}$`, 'i') } });
      if (existingDb) {
        return res.json({ available: false, error: 'This handle is already taken. Please choose a different handle.' });
      }
    }

    // 2. Check Memory Store
    if (memoryUsers.has(lowerHandle)) {
      return res.json({ available: false, error: 'This handle is already taken. Please choose a different handle.' });
    }

    return res.json({ available: true, message: 'Handle is available!' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking handle.' });
  }
});

// Fetch Current User Profile with Real-Time Rating Stats
router.get('/me', async (req, res) => {
  try {
    const rawUsername = req.query.username || '';
    const sanitized = String(rawUsername).replace(/<[^>]*>?/gm, '').trim();

    if (!sanitized) {
      return res.status(400).json({ error: 'Username query parameter is required.' });
    }

    // 1. Fetch from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({ username: { $regex: new RegExp(`^${sanitized}$`, 'i') } });
      if (dbUser) {
        return res.json({ user: dbUser });
      }
    }

    // 2. Fetch from Memory Store
    const memUser = memoryUsers.get(sanitized.toLowerCase());
    if (memUser) {
      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser });
    }

    return res.status(404).json({ error: `User "${sanitized}" not found.` });
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

// Register Account (Unique Handle Check) - Default Rating = 0
router.post('/register', async (req, res) => {
  try {
    const { username, password, leetcodeUsername, avatarUrl, bio, location } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 5 || cleanUsername.length > 20) {
      return res.status(400).json({ error: 'Username must be between 5 and 20 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const passwordHash = hashPassword(password);
    const cleanLcUsername = (leetcodeUsername || '').trim().replace(/^@/, '');
    const userAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    const userBio = bio || 'Competitive Coder ⚔️ | Multi-Language Specialist';
    const userLocation = location || 'India 🇮🇳';

    // 1. Check MongoDB ONLY if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const existingDb = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
        if (existingDb) {
          return res.status(400).json({ error: 'This handle is already taken. Please choose a different handle.' });
        }

        const newUser = new User({
          username: cleanUsername,
          passwordHash,
          leetcodeUsername: cleanLcUsername,
          avatarUrl: userAvatar,
          bio: userBio,
          location: userLocation,
          rating: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          totalMatches: 0
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({ user: newUser, token });
      } catch (e) {
        if (e.code === 11000) {
          return res.status(400).json({ error: 'This handle is already taken. Please choose a different handle.' });
        }
      }
    }

    // 2. Fast Instant Memory Store Fallback
    if (memoryUsers.has(cleanUsername.toLowerCase())) {
      return res.status(400).json({ error: 'This handle is already taken. Please choose a different handle.' });
    }

    const userObj = {
      id: 'mem_' + Date.now(),
      username: cleanUsername,
      leetcodeUsername: cleanLcUsername,
      avatarUrl: userAvatar,
      bio: userBio,
      location: userLocation,
      rating: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalMatches: 0,
      passwordHash
    };
    memoryUsers.set(cleanUsername.toLowerCase(), userObj);

    const token = jwt.sign({ id: userObj.id, username: cleanUsername }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = userObj;
    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Sign In
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim();
    const passwordHash = hashPassword(password);

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
        if (user) {
          if (user.passwordHash !== passwordHash) {
            return res.status(400).json({ error: 'Incorrect password. Please try again.' });
          }
          const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ user, token });
        }
      } catch (e) {}
    }

    const memUser = memoryUsers.get(cleanUsername.toLowerCase());
    if (memUser) {
      if (memUser.passwordHash !== passwordHash) {
        return res.status(400).json({ error: 'Incorrect password. Please try again.' });
      }
      const token = jwt.sign({ id: memUser.id, username: memUser.username }, JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser, token });
    }

    return res.status(400).json({ error: `User "${cleanUsername}" not found. Please Register first!` });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Update Profile API
router.put('/profile', async (req, res) => {
  try {
    const { username, avatarUrl, bio, location, leetcodeUsername } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required.' });

    const cleanLcUsername = (leetcodeUsername || '').trim().replace(/^@/, '');

    if (mongoose.connection.readyState === 1) {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } },
          {
            $set: {
              avatarUrl: avatarUrl || undefined,
              bio: bio || undefined,
              location: location || undefined,
              leetcodeUsername: cleanLcUsername
            }
          },
          { new: true }
        );

        if (updatedUser) {
          return res.json({ user: updatedUser });
        }
      } catch (e) {}
    }

    const memUser = memoryUsers.get(username.trim().toLowerCase());
    if (memUser) {
      if (avatarUrl) memUser.avatarUrl = avatarUrl;
      if (bio) memUser.bio = bio;
      if (location) memUser.location = location;
      if (cleanLcUsername) memUser.leetcodeUsername = cleanLcUsername;

      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser });
    }

    return res.status(404).json({ error: 'User profile not found.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

// Update Rating & Match Stats API
router.put('/update-stats', async (req, res) => {
  try {
    const { username, ratingDelta, result } = req.body; // result: 'win' | 'loss' | 'draw'
    if (!username) return res.status(400).json({ error: 'Username is required.' });

    const cleanUsername = username.trim();

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
      if (user) {
        user.rating = Math.max(0, (user.rating || 0) + (ratingDelta || 0));
        if (result === 'win') user.wins = (user.wins || 0) + 1;
        else if (result === 'loss') user.losses = (user.losses || 0) + 1;
        else if (result === 'draw') user.draws = (user.draws || 0) + 1;
        user.totalMatches = (user.totalMatches || 0) + 1;
        await user.save();
        return res.json({ user });
      }
    }

    // 2. Update Memory Store fallback
    const memUser = memoryUsers.get(cleanUsername.toLowerCase());
    if (memUser) {
      memUser.rating = Math.max(0, (memUser.rating || 0) + (ratingDelta || 0));
      if (result === 'win') memUser.wins = (memUser.wins || 0) + 1;
      else if (result === 'loss') memUser.losses = (memUser.losses || 0) + 1;
      else if (result === 'draw') memUser.draws = (memUser.draws || 0) + 1;
      memUser.totalMatches = (memUser.totalMatches || 0) + 1;

      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser });
    }

    return res.status(404).json({ error: 'User profile not found.' });
  } catch (err) {
    console.error('Update stats error:', err);
    res.status(500).json({ error: 'Server error updating stats.' });
  }
});

export default router;
