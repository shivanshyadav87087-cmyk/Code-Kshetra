import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { Purchase } from '../models/Purchase.js';

const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    console.log('[Razorpay] Initialized with Key ID:', RAZORPAY_KEY_ID.substring(0, 8) + '...');
  } catch (err) {
    console.warn('[Razorpay Init Warning]', err.message);
  }
}

// In-memory fallback purchase store
const memoryPurchases = new Set();

// 1. Get Payment Configuration & Razorpay Public Key
router.get('/config', (req, res) => {
  const isConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
  res.json({
    keyId: RAZORPAY_KEY_ID || 'rzp_test_code_kshetra_19',
    isConfigured,
    amount: 19,
    currency: 'INR',
    notesTitle: '4-Week DSA & OOPS Mastery Homework Plan'
  });
});

// 2. Create Razorpay Order for ₹19
router.post('/create-order', async (req, res) => {
  try {
    const { username, email, notesId = '4-week-dsa-oops-plan', notesTitle = '4-Week DSA & OOPS Mastery Homework Plan' } = req.body;

    const amountInPaise = 19 * 100; // ₹19 = 1900 paise

    if (razorpayInstance) {
      try {
        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          notes: {
            notesId,
            notesTitle,
            username: username || 'Guest',
            email: email || ''
          }
        };

        const order = await razorpayInstance.orders.create(options);
        return res.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: RAZORPAY_KEY_ID,
          isDemo: false
        });
      } catch (rzpErr) {
        console.warn('[Razorpay Live Order Failed, Falling back to Test Order]', rzpErr.message);
      }
    }

    // Demo/Sandbox fallback order if real credentials are not supplied yet
    const demoOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`;
    return res.json({
      success: true,
      orderId: demoOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID || 'rzp_test_code_kshetra_19',
      isDemo: true,
      message: 'Demo order generated. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to env for live production UPI/card processing.'
    });
  } catch (err) {
    console.error('[Create Order Error]', err);
    return res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// 3. Verify Razorpay Payment Signature & Grant Access
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      username,
      email,
      userId,
      notesId = '4-week-dsa-oops-plan',
      notesTitle = '4-Week DSA & OOPS Mastery Homework Plan',
      isDemo = false
    } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment details.' });
    }

    let isValid = false;

    // Verify cryptographic signature if secret is configured
    if (RAZORPAY_KEY_SECRET && razorpay_signature && !isDemo) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
      }
    } else {
      // In demo mode or fallback test mode
      isValid = true;
    }

    const cleanUsername = String(username || 'Coder').trim();
    const cleanEmail = String(email || `${cleanUsername.toLowerCase()}@codekshetra.com`).trim().toLowerCase();

    // Persist to MongoDB if available
    let purchaseRecord = null;
    if (mongoose.connection.readyState === 1) {
      try {
        purchaseRecord = await Purchase.create({
          userId: userId || '',
          username: cleanUsername,
          email: cleanEmail,
          notesId,
          notesTitle,
          amount: 19,
          currency: 'INR',
          razorpayOrderId: razorpay_order_id || '',
          razorpayPaymentId: razorpay_payment_id,
          status: 'completed',
          createdAt: new Date()
        });
      } catch (dbErr) {
        console.warn('[DB Purchase Save Warning]', dbErr.message);
      }
    }

    // Also cache in memory
    const memoryKey = `${cleanEmail}:${notesId}`;
    const userKey = `${cleanUsername.toLowerCase()}:${notesId}`;
    memoryPurchases.add(memoryKey);
    memoryPurchases.add(userKey);

    return res.json({
      success: true,
      message: 'Payment verified successfully! Your DSA Notes have been unlocked.',
      purchaseId: purchaseRecord?._id || razorpay_payment_id,
      unlockedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Verify Payment Error]', err);
    return res.status(500).json({ success: false, error: 'Error verifying payment.' });
  }
});

// 4. Check if user has already unlocked the notes
router.get('/check-status', async (req, res) => {
  try {
    const rawEmail = String(req.query.email || '').trim().toLowerCase();
    const rawUsername = String(req.query.username || '').trim().toLowerCase();
    const notesId = String(req.query.notesId || '4-week-dsa-oops-plan').trim();

    if (!rawEmail && !rawUsername) {
      return res.json({ isPurchased: false });
    }

    // Check memory store
    if ((rawEmail && memoryPurchases.has(`${rawEmail}:${notesId}`)) ||
        (rawUsername && memoryPurchases.has(`${rawUsername}:${notesId}`))) {
      return res.json({ isPurchased: true });
    }

    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      const match = await Purchase.findOne({
        notesId,
        status: 'completed',
        $or: [
          { email: rawEmail || '__none__' },
          { username: { $regex: new RegExp(`^${rawUsername}$`, 'i') } }
        ]
      });

      if (match) {
        return res.json({ isPurchased: true, purchase: match });
      }
    }

    return res.json({ isPurchased: false });
  } catch (err) {
    return res.json({ isPurchased: false });
  }
});

export default router;
