import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 20
  },
  avatarUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  bio: {
    type: String,
    default: 'Competitive Coder ⚔️ | Multi-Language Specialist'
  },
  location: {
    type: String,
    default: 'India 🇮🇳'
  },
  githubUrl: {
    type: String,
    default: ''
  },
  leetcodeUsername: {
    type: String,
    default: ''
  },
  passwordHash: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  totalMatches: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Case-insensitive global unique index on username
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
