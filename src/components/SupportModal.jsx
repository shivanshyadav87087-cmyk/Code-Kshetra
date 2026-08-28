import React, { useState } from 'react';
import { HelpCircle, Mail, ChevronDown, ChevronUp, Send, CheckCircle2, X, ShieldCheck, Cpu, Code2, AlertTriangle } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { Button } from './ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

const FAQS = [
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
];

export default function SupportModal({ isOpen, onClose, player }) {
  const [activeFaqIdx, setActiveFaqIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'faq'

  const [name, setName] = useState(player?.name || '');
  const [email, setEmail] = useState(player?.email || '');
  const [category, setCategory] = useState('General Inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email address, and message.');
      sounds.playFail();
      return;
    }

    setSubmitting(true);
    sounds.playClick();

    try {
      const res = await fetch(`${BACKEND_URL}/api/support/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          subject: subject.trim() || category,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit support ticket.');

      sounds.playSubmitSuccess();
      setTicketId(data.ticketId);
      setSuccessMsg(data.message || 'Support ticket submitted successfully!');
      setMessage('');
      setSubject('');
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting ticket.');
      sounds.playFail();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121827] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">

        {/* Header */}
        <div className="bg-[#0F172A] border-b border-[#1E293B] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Code क्षेत्र Support & Help Center</h2>
              <p className="text-xs text-[#94A3B8]">Get help, submit bug reports, or explore platform FAQs</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1E293B] bg-[#0A0B0F]/50 px-6 pt-3 gap-4">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('contact'); }}
            className={`pb-3 text-xs font-bold font-mono cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'border-[#38BDF8] text-[#38BDF8]'
                : 'border-transparent text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            <Mail className="w-4 h-4" />
            Contact Support & Tickets
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('faq'); }}
            className={`pb-3 text-xs font-bold font-mono cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'faq'
                ? 'border-[#38BDF8] text-[#38BDF8]'
                : 'border-transparent text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {activeTab === 'contact' ? (
            <div className="space-y-4">
              {successMsg && (
                <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ticket Submitted Successfully!</span>
                  </div>
                  <p>{successMsg}</p>
                  {ticketId && <p className="font-mono text-[11px] text-[#A7F3D0]">Ticket ID: <strong>{ticketId}</strong></p>}
                </div>
              )}

              {errorMsg && (
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#F87171] text-xs p-3 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Coder99"
                      className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#38BDF8] rounded-xl p-3 text-xs text-[#F8FAFC] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="coder@example.com"
                      className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#38BDF8] rounded-xl p-3 text-xs text-[#F8FAFC] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#38BDF8] rounded-xl p-3 text-xs text-[#F8FAFC] outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bug Report">Bug Report 🐛</option>
                      <option value="Feature Request">Feature Request 🚀</option>
                      <option value="Anti-Cheat / Fair Play">Anti-Cheat / Fair Play 🛡️</option>
                      <option value="Account / ELO Rating">Account / ELO Rating 🏆</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief topic..."
                      className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#38BDF8] rounded-xl p-3 text-xs text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Message / Issue Details *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or feedback in detail..."
                    rows={4}
                    className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#38BDF8] rounded-xl p-3 text-xs text-[#F8FAFC] outline-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white text-xs py-3 font-bold rounded-xl shadow-lg hover:shadow-[#38BDF8]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                </Button>
              </form>
            </div>
          ) : (
            /* FAQ Section */
            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveFaqIdx(activeFaqIdx === idx ? null : idx);
                    }}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-[#F8FAFC] hover:bg-[#1E293B]/50 transition-all cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {activeFaqIdx === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    )}
                  </button>

                  {activeFaqIdx === idx && (
                    <div className="px-4 pb-4 text-xs text-[#94A3B8] leading-relaxed border-t border-[#1E293B]/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
