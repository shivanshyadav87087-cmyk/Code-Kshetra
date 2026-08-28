import express from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

const router = express.Router();

// Fallback in-memory review store with seed reviews
const memoryReviews = [
  {
    _id: 'rev_1',
    username: 'CodeNinja99',
    rating: 5,
    comment: 'The 1v1 real-time duels are insane! Real-time code execution with C++ STL support works flawlessly.',
    role: 'Grandmaster Coder 🔴',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'rev_2',
    username: 'DevMasterX',
    rating: 5,
    comment: 'Best platform for speed programming & practicing LeetCode problems in Python & C++. Highly recommended!',
    role: 'Specialist 🟣',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'rev_3',
    username: 'AlgoQueen',
    rating: 5,
    comment: 'Love the anti-cheat system and instant ELO rating progression. Perfect platform for competitive programmers!',
    role: 'Master 🧡',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

// GET /api/reviews - Fetch all community reviews
router.get('/', async (req, res) => {
  try {
    let reviewsList = [];

    if (mongoose.connection.readyState === 1) {
      reviewsList = await Review.find().sort({ createdAt: -1 }).limit(50);
    }

    if (!reviewsList || reviewsList.length === 0) {
      reviewsList = memoryReviews;
    }

    const totalRating = reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avgRating = reviewsList.length > 0 ? (totalRating / reviewsList.length).toFixed(1) : '5.0';

    return res.json({
      reviews: reviewsList,
      totalCount: reviewsList.length,
      averageRating: Number(avgRating)
    });
  } catch (err) {
    return res.json({
      reviews: memoryReviews,
      totalCount: memoryReviews.length,
      averageRating: 5.0
    });
  }
});

// POST /api/reviews - Submit a new review
router.post('/', async (req, res) => {
  try {
    const { username, rating, comment, role, avatarUrl } = req.body;

    if (!username || !comment) {
      return res.status(400).json({ error: 'Username and review comment are required.' });
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const cleanComment = String(comment).trim().slice(0, 1000);
    const cleanName = String(username).trim().slice(0, 30);

    const reviewObj = {
      username: cleanName,
      rating: numericRating,
      comment: cleanComment,
      role: role || 'Competitive Coder ⚔️',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const newDoc = await Review.create(reviewObj);
      return res.json({ success: true, review: newDoc, message: 'Thank you! Your review has been submitted successfully.' });
    }

    const memoryDoc = { _id: 'rev_' + Date.now(), ...reviewObj };
    memoryReviews.unshift(memoryDoc);

    return res.json({ success: true, review: memoryDoc, message: 'Thank you! Your review has been submitted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error submitting review.' });
  }
});

export default router;
