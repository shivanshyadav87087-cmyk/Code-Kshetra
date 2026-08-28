import express from 'express';

const router = express.Router();

// Memory store for support tickets
const supportTickets = [];

// POST /api/support/ticket - Submit support ticket / bug report / feature request
router.post('/ticket', (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email address, and message are required.' });
    }

    const ticket = {
      id: 'ticket_' + Math.floor(Math.random() * 89999 + 10000),
      name: String(name).trim(),
      email: String(email).trim(),
      category: category || 'General Inquiry',
      subject: String(subject || 'Support Ticket').trim(),
      message: String(message).trim(),
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    supportTickets.push(ticket);
    console.log(`[Support Ticket Submitted] ID: ${ticket.id} | From: ${ticket.email} | Category: ${ticket.category}`);

    return res.json({
      success: true,
      ticketId: ticket.id,
      message: 'Support request received! Our engineering team will review your ticket promptly.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error processing support ticket.' });
  }
});

// GET /api/support/faq - Common FAQ list for help center
router.get('/faq', (req, res) => {
  res.json({
    faqs: [
      {
        q: 'How does 1v1 Matchmaking & ELO rating work?',
        a: 'Every player starts at 0 ELO (Newbie rating). Winning a duel against a real player grants +25 ELO points. Losing deducts -5 ELO. Rating bounds progress across 6 ranks: Newbie (0-499), Apprentice (500-899), Specialist (900-1299), Expert (1300-1699), Master (1700-2099), and Grandmaster (2100+).'
      },
      {
        q: 'What compilers and programming languages are supported?',
        a: 'Code क्षेत्र features a native multi-language online judge supporting C++ (GCC 17 with STL), Java 17, Python 3.10, C (GCC 11), and JavaScript (Node.js). All code is executed in sandboxed process environments with 2.0s Time Limit Exceeded (TLE) enforcement.'
      },
      {
        q: 'How does Fair Play & Anti-Cheat protection work?',
        a: 'During live 1v1 duels, the platform monitors tab switches, fullscreen exits, and large paste buffer attempts. Reaching 3 tab switches flags the match for anti-cheat audit. Solutions solved under 8 seconds are also flagged for sanity inspection.'
      },
      {
        q: 'Can I play as a Guest without creating an account?',
        a: 'Yes! Anyone can click "Instant Guest Access". You will automatically be assigned a sequential handle like Guest1, Guest2 ... GuestN with 0 starting ELO, allowing you to jump into duels immediately.'
      }
    ]
  });
});

export default router;
