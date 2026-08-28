import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  role: {
    type: String,
    default: 'Competitive Coder ⚔️'
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
