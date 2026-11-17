import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  notesId: {
    type: String,
    default: '4-week-dsa-oops-plan'
  },
  notesTitle: {
    type: String,
    default: '4-Week DSA & OOPS Mastery Homework Plan'
  },
  amount: {
    type: Number,
    required: true,
    default: 19
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['created', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on email and username for quick purchase lookups
purchaseSchema.index({ email: 1, notesId: 1 });
purchaseSchema.index({ username: 1, notesId: 1 });

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
