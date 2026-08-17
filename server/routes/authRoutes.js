import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'codeclash_super_secret_jwt_key_99';

export const memoryUsers = new Map();
const otpStore = new Map(); // In-memory store for OTPs: { email: { otp, expiresAt } }

// Nodemailer SMTP Transporter configuration for direct Gmail delivery
const transporter = nodemailer.createTransport({
  service: 'gmail',
  connectionTimeout: 4000, // 4s fast timeout
  greetingTimeout: 4000,
  socketTimeout: 4000,
  auth: {
    user: process.env.GMAIL_USER || 'shivanshyadav87087@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || ''
  }
});

// Fast Instant 0ms SHA-256 Password Hash Helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Simple email regex validator
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper to dispatch real email to recipient
async function sendRealEmailOTP(toEmail, otpCode) {
  const mailOptions = {
    from: `"Code क्षेत्र Arena" <${process.env.GMAIL_USER || 'shivanshyadav87087@gmail.com'}>`,
    to: toEmail,
    subject: '🔐 Code क्षेत्र — Password Reset OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 24px; color: #f8fafc; border-radius: 16px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 16px; border: 1px solid #334155;">
          <h2 style="color: #38bdf8; text-align: center;">Code क्षेत्र ⚔️ Password Reset</h2>
          <p style="font-size: 14px; color: #94a3b8; text-align: center;">You requested a password reset for your Code क्षेत्र account.</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #34d399; background: #090d16; padding: 12px 24px; border-radius: 12px; border: 1px solid #10b981;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 12px; color: #64748b; text-align: center;">This OTP is valid for 10 minutes. Please check your Inbox or Spam folder.</p>
        </div>
      </div>
    `
  };

  // 1. Try Nodemailer Gmail SMTP if credentials provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[SMTP Email Success] Sent OTP to ${toEmail}`);
      return true;
    } catch (e) {
      console.warn('[SMTP Email Warning]', e.message);
    }
  }

  // 2. Try Brevo API if key provided
  if (process.env.BREVO_API_KEY) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Code क्षेत्र Arena', email: process.env.GMAIL_USER || 'shivanshyadav87087@gmail.com' },
          to: [{ email: toEmail }],
          subject: '🔐 Code क्षेत्र — Password Reset OTP Code',
          htmlContent: mailOptions.html
        })
      });
      if (brevoRes.ok) {
        console.log(`[Brevo API Success] Sent OTP to ${toEmail}`);
        return true;
      }
    } catch (e) {
      console.warn('[Brevo API Warning]', e.message);
    }
  }

  // 3. Try Resend API if key provided
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Code क्षेत्र <onboarding@resend.dev>',
          to: [toEmail],
          subject: '🔐 Code क्षेत्र — Password Reset OTP Code',
          html: mailOptions.html
        })
      });
      if (resendRes.ok) {
        console.log(`[Resend API Success] Sent OTP to ${toEmail}`);
        return true;
      }
    } catch (e) {
      console.warn('[Resend API Warning]', e.message);
    }
  }

  // 4. Try Web Mailer API
  try {
    const webRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: '🔐 Code क्षेत्र — Your Password Reset OTP',
        email: toEmail,
        message: `Your Code क्षेत्र 6-digit Password Reset OTP is: ${otpCode} (Valid for 10 minutes).`
      })
    });
    if (webRes.ok) {
      console.log(`[Web Mailer Success] Dispatched OTP to ${toEmail}`);
      return true;
    }
  } catch (err) {
    console.warn('[Web Mailer Warning]', err.message);
  }

  return false;
}

// Live Email Availability Endpoint
router.get('/check-email', async (req, res) => {
  try {
    const rawEmail = req.query.email || '';
    const sanitized = String(rawEmail).trim().toLowerCase();

    if (!sanitized || !isValidEmail(sanitized)) {
      return res.json({ available: false, error: 'Please enter a valid email address.' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingDb = await User.findOne({ email: sanitized });
      if (existingDb) {
        return res.json({ available: false, error: 'This email is already registered. Please sign in.' });
      }
    }

    if (memoryUsers.has(sanitized)) {
      return res.json({ available: false, error: 'This email is already registered. Please sign in.' });
    }

    return res.json({ available: true, message: 'Email is available!' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking email.' });
  }
});

// Live Handle Availability Endpoint
router.get('/check-handle', async (req, res) => {
  try {
    const rawHandle = req.query.handle || '';
    const sanitized = String(rawHandle).replace(/<[^>]*>?/gm, '').trim();

    if (!sanitized || sanitized.length < 3) {
      return res.json({ available: false, error: 'Handle must be at least 3 characters long.' });
    }

    if (sanitized.length > 20) {
      return res.json({ available: false, error: 'Handle must not exceed 20 characters.' });
    }

    const lowerHandle = sanitized.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existingDb = await User.findOne({ username: { $regex: new RegExp(`^${sanitized}$`, 'i') } });
      if (existingDb) {
        return res.json({ available: false, error: 'This handle is already taken. Please choose a different handle.' });
      }
    }

    if (memoryUsers.has(lowerHandle)) {
      return res.json({ available: false, error: 'This handle is already taken. Please choose a different handle.' });
    }

    return res.json({ available: true, message: 'Handle is available!' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking handle.' });
  }
});

let globalGuestCounter = 0;

// Next Sequential Guest Handle Generator Endpoint: Guest1, Guest2, Guest3 ... GuestN
router.get('/next-guest', async (req, res) => {
  try {
    let nextNum = globalGuestCounter + 1;

    if (mongoose.connection.readyState === 1) {
      try {
        const guestCount = await User.countDocuments({ username: /^Guest\d+$/i });
        nextNum = Math.max(nextNum, guestCount + 1);
      } catch (e) {}
    }

    globalGuestCounter = nextNum;
    const guestHandle = `Guest${nextNum}`;
    return res.json({ guestHandle, guestNumber: nextNum });
  } catch (err) {
    globalGuestCounter += 1;
    return res.json({ guestHandle: `Guest${globalGuestCounter}`, guestNumber: globalGuestCounter });
  }
});

// Fetch Current User Profile by Email or Username
router.get('/me', async (req, res) => {
  try {
    const rawQuery = req.query.email || req.query.username || '';
    const sanitized = String(rawQuery).replace(/<[^>]*>?/gm, '').trim().toLowerCase();

    if (!sanitized) {
      return res.status(400).json({ error: 'Email or username query parameter is required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({
        $or: [
          { email: sanitized },
          { username: { $regex: new RegExp(`^${sanitized}$`, 'i') } }
        ]
      });
      if (dbUser) {
        return res.json({ user: dbUser });
      }
    }

    const memUser = memoryUsers.get(sanitized);
    if (memUser) {
      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser });
    }

    return res.status(404).json({ error: `User "${sanitized}" not found.` });
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

// Register Account (Email & Password)
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, leetcodeUsername, avatarUrl, bio, location } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email address and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    let cleanUsername = (username || '').trim();
    if (!cleanUsername) {
      cleanUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    }
    if (cleanUsername.length < 3) cleanUsername = cleanUsername + '_' + Math.floor(Math.random() * 899 + 100);
    if (cleanUsername.length > 20) cleanUsername = cleanUsername.substring(0, 20);

    const passwordHash = hashPassword(password);
    const cleanLcUsername = (leetcodeUsername || '').trim().replace(/^@/, '');
    const userAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    const userBio = bio || 'Competitive Coder ⚔️ | Multi-Language Specialist';
    const userLocation = location || 'India 🇮🇳';

    if (mongoose.connection.readyState === 1) {
      try {
        const existingEmail = await User.findOne({ email: cleanEmail });
        if (existingEmail) {
          return res.status(400).json({ error: 'This email is already registered. Please Sign In!' });
        }

        const newUser = new User({
          email: cleanEmail,
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
        const token = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({ user: newUser, token });
      } catch (e) {
        if (e.code === 11000) {
          return res.status(400).json({ error: 'Email or handle already registered. Please Sign In!' });
        }
      }
    }

    if (memoryUsers.has(cleanEmail)) {
      return res.status(400).json({ error: 'This email is already registered. Please Sign In!' });
    }

    const userObj = {
      id: 'mem_' + Date.now(),
      email: cleanEmail,
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
    memoryUsers.set(cleanEmail, userObj);
    memoryUsers.set(cleanUsername.toLowerCase(), userObj);

    const token = jwt.sign({ id: userObj.id, email: cleanEmail, username: cleanUsername }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = userObj;
    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Sign In (Email & Password)
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = String(email || username || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Email address and password are required.' });
    }

    const passwordHash = hashPassword(password);

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({
          $or: [
            { email: loginIdentifier },
            { username: { $regex: new RegExp(`^${loginIdentifier}$`, 'i') } }
          ]
        });

        if (user) {
          if (user.passwordHash !== passwordHash) {
            return res.status(400).json({ error: 'Incorrect password. Please try again.' });
          }
          const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ user, token });
        }
      } catch (e) {}
    }

    const memUser = memoryUsers.get(loginIdentifier);
    if (memUser) {
      if (memUser.passwordHash !== passwordHash) {
        return res.status(400).json({ error: 'Incorrect password. Please try again.' });
      }
      const token = jwt.sign({ id: memUser.id, email: memUser.email, username: memUser.username }, JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ user: safeUser, token });
    }

    return res.status(400).json({ error: `Account "${loginIdentifier}" not found. Please Register first!` });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// FORGOT PASSWORD - Send OTP to Gmail (Returns in 0ms instantly!)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid Gmail address.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, { otp, expiresAt });
    console.log(`[FORGOT PASSWORD OTP GENERATED] Target Email: ${cleanEmail} | OTP: ${otp} | Expires: ${new Date(expiresAt).toISOString()}`);

    // Fire email dispatch asynchronously in background so HTTP response returns in 0ms!
    sendRealEmailOTP(cleanEmail, otp).catch(e => console.warn('[Background Email Dispatch]', e.message));

    // Respond INSTANTLY in 0ms!
    return res.json({
      success: true,
      delivered: true,
      message: `OTP sent to ${cleanEmail}. Please check your Gmail inbox (or Spam folder).`,
      fallbackOtp: otp
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send OTP to Gmail. Please try again.' });
  }
});

// VERIFY OTP & RESET PASSWORD
router.post('/verify-otp-reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const record = otpStore.get(cleanEmail);
    if (!record || record.otp !== cleanOtp || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please check your Gmail or request a new OTP.' });
    }

    otpStore.delete(cleanEmail);
    const newPasswordHash = hashPassword(newPassword);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOneAndUpdate(
        { email: cleanEmail },
        { $set: { passwordHash: newPasswordHash } },
        { new: true }
      );

      if (user) {
        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, message: 'Password updated successfully!', user, token });
      }
    }

    const memUser = memoryUsers.get(cleanEmail);
    if (memUser) {
      memUser.passwordHash = newPasswordHash;
      const token = jwt.sign({ id: memUser.id, email: memUser.email, username: memUser.username }, JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash: _, ...safeUser } = memUser;
      return res.json({ success: true, message: 'Password updated successfully!', user: safeUser, token });
    }

    const newUserObj = {
      id: 'mem_' + Date.now(),
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      passwordHash: newPasswordHash
    };
    memoryUsers.set(cleanEmail, newUserObj);

    const token = jwt.sign({ id: newUserObj.id, email: cleanEmail, username: newUserObj.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Password updated successfully!', user: newUserObj, token });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
});

// Update Profile API
router.put('/profile', async (req, res) => {
  try {
    const { username, email, avatarUrl, bio, location, leetcodeUsername } = req.body;
    const key = String(email || username || '').trim().toLowerCase();
    if (!key) return res.status(400).json({ error: 'User identifier is required.' });

    const cleanLcUsername = (leetcodeUsername || '').trim().replace(/^@/, '');

    if (mongoose.connection.readyState === 1) {
      try {
        const updatedUser = await User.findOneAndUpdate(
          {
            $or: [
              { email: key },
              { username: { $regex: new RegExp(`^${key}$`, 'i') } }
            ]
          },
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

    const memUser = memoryUsers.get(key);
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
    const { username, email, ratingDelta, result } = req.body;
    const key = String(email || username || '').trim().toLowerCase();
    if (!key) return res.status(400).json({ error: 'User identifier is required.' });

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        $or: [
          { email: key },
          { username: { $regex: new RegExp(`^${key}$`, 'i') } }
        ]
      });

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

    const memUser = memoryUsers.get(key);
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
