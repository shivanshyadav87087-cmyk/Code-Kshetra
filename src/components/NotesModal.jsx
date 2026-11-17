import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  CreditCard,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../engine/soundManager';
import { DSA_NOTES_PLAN } from '../data/dsaNotesData';
import { Button } from './ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function NotesModal({ isOpen, onClose, player }) {
  const [activeWeek, setActiveWeek] = useState(1);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [copiedLinks, setCopiedLinks] = useState(false);

  // Solved problems tracker state (persisted locally)
  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('codeclash_solved_notes_problems');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const userName = player?.name || 'Coder';
  const userEmail = player?.email || `${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}@codekshetra.com`;

  // Check purchase status on open
  useEffect(() => {
    if (!isOpen) return;

    // Check localStorage first for instant offline access
    const localPurchased = localStorage.getItem(`codeclash_notes_unlocked_${userName}`) ||
                           localStorage.getItem('codeclash_notes_unlocked_global');
    if (localPurchased === 'true') {
      setIsPurchased(true);
    }

    // Verify with backend
    fetch(`${BACKEND_URL}/api/payment/check-status?email=${encodeURIComponent(userEmail)}&username=${encodeURIComponent(userName)}&notesId=${DSA_NOTES_PLAN.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.isPurchased) {
          setIsPurchased(true);
          localStorage.setItem(`codeclash_notes_unlocked_${userName}`, 'true');
        }
      })
      .catch(() => {});
  }, [isOpen, userName, userEmail]);

  const toggleProblemSolved = (problemId) => {
    sounds.playClick();
    setSolvedProblems(prev => {
      const updated = { ...prev, [problemId]: !prev[problemId] };
      localStorage.setItem('codeclash_solved_notes_problems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRazorpayPayment = async () => {
    setErrorMessage('');
    setIsProcessing(true);
    sounds.playClick();

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          email: userEmail,
          notesId: DSA_NOTES_PLAN.id,
          notesTitle: DSA_NOTES_PLAN.title
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay order.');
      }

      // Helper function to complete verification
      const completeVerification = async (verifyPayload) => {
        const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...verifyPayload,
            username: userName,
            email: userEmail,
            notesId: DSA_NOTES_PLAN.id,
            notesTitle: DSA_NOTES_PLAN.title
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setIsPurchased(true);
          localStorage.setItem(`codeclash_notes_unlocked_${userName}`, 'true');
          localStorage.setItem('codeclash_notes_unlocked_global', 'true');
          setPaymentSuccess(verifyData);
          sounds.playSubmitSuccess();

          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } else {
          throw new Error(verifyData.error || 'Payment signature verification failed.');
        }
      };

      // 2. Open Razorpay Checkout modal if SDK loaded & not demo mode
      if (window.Razorpay && !orderData.isDemo && orderData.keyId && !orderData.keyId.includes('test_code_kshetra')) {
        const rzpOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Code क्षेत्र',
          description: DSA_NOTES_PLAN.title,
          image: '/favicon.svg',
          order_id: orderData.orderId,
          prefill: {
            name: userName,
            email: userEmail,
            contact: ''
          },
          theme: {
            color: '#14B8A6'
          },
          handler: async function (response) {
            await completeVerification({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isDemo: false
            });
            setIsProcessing(false);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(`Payment Failed: ${response.error.description}`);
          setIsProcessing(false);
          sounds.playFail();
        });
        rzp.open();
      } else {
        // Instant Sandbox / Demo Gateway Simulator for seamless test verification
        await completeVerification({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_sim_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`,
          razorpay_signature: 'simulated_valid_signature',
          isDemo: true
        });
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('[Razorpay Checkout Error]', err);
      setErrorMessage(err.message || 'Payment initiation error. Please try again.');
      setIsProcessing(false);
      sounds.playFail();
    }
  };

  const handleCopyAllLinks = () => {
    sounds.playClick();
    const allLinks = [];
    DSA_NOTES_PLAN.weeks.forEach(w => {
      allLinks.push(`\n=== ${w.title} ===`);
      w.days.forEach(d => {
        allLinks.push(`\n${d.day}:`);
        d.problems.forEach((p, idx) => {
          allLinks.push(`${idx + 1}. ${p.name} (${p.difficulty}) -> ${p.url}`);
        });
      });
    });

    navigator.clipboard.writeText(allLinks.join('\n'));
    setCopiedLinks(true);
    setTimeout(() => setCopiedLinks(false), 3000);
  };

  const handlePrintOrDownloadPdf = () => {
    sounds.playClick();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${DSA_NOTES_PLAN.title} - Code क्षेत्र</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          h1 { color: #0f172a; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 4px; }
          .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
          .week-box { margin-bottom: 30px; page-break-inside: avoid; }
          .week-title { font-size: 18px; color: #0d9488; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          .day-title { font-size: 15px; font-weight: bold; color: #334155; margin-top: 12px; margin-bottom: 6px; }
          ul { margin-top: 4px; padding-left: 20px; }
          li { margin-bottom: 6px; font-size: 13px; }
          a { color: #0284c7; text-decoration: none; }
          .badge { display: inline-block; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px; margin-left: 6px; }
          .easy { background: #dcfce7; color: #166534; }
          .medium { background: #fef3c7; color: #92400e; }
          .hard { background: #fee2e2; color: #991b1b; }
          .oops-box { background: #f8fafc; border-left: 4px solid #8b5cf6; padding: 12px; margin-top: 14px; font-size: 12px; white-space: pre-wrap; font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>${DSA_NOTES_PLAN.title}</h1>
        <div class="subtitle">Curated 60+ LeetCode Algorithms & OOPS Interview Plan | Code क्षेत्र Official Notes</div>
        ${DSA_NOTES_PLAN.weeks.map(w => `
          <div class="week-box">
            <div class="week-title">${w.title}</div>
            <p style="font-size: 13px; color: #64748b;">${w.description}</p>
            ${w.days.map(d => `
              <div class="day-title">${d.day}</div>
              <ul>
                ${d.problems.map(p => `
                  <li>
                    <strong>${p.name}</strong> 
                    <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                    — Pattern: <em>${p.pattern}</em><br/>
                    URL: <a href="${p.url}" target="_blank">${p.url}</a>
                  </li>
                `).join('')}
              </ul>
            `).join('')}
            <div class="oops-box"><strong>OOPS Assignment:</strong>\n${w.oopsProblem.topic}\n\n${w.oopsProblem.description}</div>
          </div>
        `).join('')}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  // Calculate total problems & solved count
  const allProblems = DSA_NOTES_PLAN.weeks.flatMap(w => w.days.flatMap(d => d.problems));
  const totalProblemsCount = allProblems.length;
  const solvedCount = Object.values(solvedProblems).filter(Boolean).length;
  const progressPercent = Math.round((solvedCount / (totalProblemsCount || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0F]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121827] border border-[#1E293B] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B]/40 to-[#0F172A] border-b border-[#1E293B] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#14B8A6] to-[#8B5CF6] p-0.5 shadow-lg shadow-[#14B8A6]/20">
              <div className="w-full h-full bg-[#0A0B0F] rounded-[10px] flex items-center justify-center text-[#14B8A6]">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#F8FAFC]">
                  {DSA_NOTES_PLAN.title}
                </h2>
                <span className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  ₹19 Only
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] hidden sm:block">
                Curated 4-Week LeetCode Homework Plan & OOPS System Design Syllabus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPurchased && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] rounded-full text-xs font-mono font-bold">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                UNLOCKED
              </span>
            )}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* Pricing & Value Hero Card (When Not Purchased) */}
          {!isPurchased && (
            <div className="bg-gradient-to-r from-[#0F172A] via-[#131F37] to-[#0F172A] border border-[#14B8A6]/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/40 text-[#14B8A6] text-xs font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Razorpay Checkout (UPI / Cards / NetBanking)</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Complete 4-Week DSA & OOPS Placement Notes
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    60+ curated LeetCode homework questions, algorithm pattern categorization (Two Pointers, Sliding Window, Monotonic Stack, BST), and real-world OOPS assignments.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-[#CBD5E1]">
                    {DSA_NOTES_PLAN.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Action Box */}
                <div className="bg-[#0A0B0F]/80 border border-[#1E293B] rounded-xl p-5 text-center shrink-0 min-w-[220px] space-y-3">
                  <div>
                    <div className="text-xs text-[#64748B] line-through font-mono">
                      Regular Price: ₹{DSA_NOTES_PLAN.originalPrice}
                    </div>
                    <div className="text-3xl font-black text-[#14B8A6] font-mono tracking-tight flex items-center justify-center gap-1">
                      <span>₹19</span>
                      <span className="text-xs font-normal text-[#94A3B8]">/ lifetime</span>
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                      ★ 4.9/5 (1,400+ Coders)
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#14B8A6] via-emerald-500 to-[#0D9488] hover:from-[#0D9488] hover:to-[#047857] text-[#0A0B0F] font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-[#14B8A6]/25 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isProcessing ? 'Connecting Gateway...' : 'Pay ₹19 via Razorpay'}</span>
                  </Button>

                  <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>100% Secure Razorpay Payment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner when already unlocked */}
          {isPurchased && (
            <div className="bg-gradient-to-r from-[#064E3B]/60 via-[#0F172A] to-[#064E3B]/60 border border-[#10B981]/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Lifetime Access Active
                    <span className="text-[10px] bg-[#10B981]/20 text-[#34D399] px-2 py-0.5 rounded-full font-mono">
                      Verified
                    </span>
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Progress: <strong className="text-[#34D399]">{solvedCount}/{totalProblemsCount}</strong> problems marked solved ({progressPercent}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyAllLinks}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1E293B] hover:bg-[#334155] text-xs font-bold font-mono text-[#E2E8F0] rounded-xl border border-white/10 transition-all cursor-pointer"
                  title="Copy all LeetCode problem links"
                >
                  {copiedLinks ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#38BDF8]" />}
                  <span>{copiedLinks ? 'Copied Links!' : 'Copy Links'}</span>
                </button>

                <button
                  onClick={handlePrintOrDownloadPdf}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:from-[#0D9488] hover:to-[#047857] text-[#0A0B0F] text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Week Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1E293B]">
            {DSA_NOTES_PLAN.weeks.map((w) => (
              <button
                key={w.weekNumber}
                onClick={() => { sounds.playClick(); setActiveWeek(w.weekNumber); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeWeek === w.weekNumber
                    ? 'bg-[#14B8A6] text-[#0A0B0F] shadow-lg shadow-[#14B8A6]/20'
                    : 'bg-[#0F172A] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
                }`}
              >
                <span>Week {w.weekNumber}</span>
                {!isPurchased && <Lock className="w-3 h-3 text-[#64748B]" />}
              </button>
            ))}
          </div>

          {/* Active Week Curriculum Breakdown */}
          {(() => {
            const currentWeekData = DSA_NOTES_PLAN.weeks.find(w => w.weekNumber === activeWeek);
            if (!currentWeekData) return null;

            return (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {currentWeekData.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{currentWeekData.description}</p>
                </div>

                {/* Days Problem List */}
                <div className="space-y-4">
                  {currentWeekData.days.map((d, dIdx) => (
                    <div key={dIdx} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-2">
                        <span className="text-xs font-bold text-[#38BDF8] font-mono tracking-wide uppercase">
                          {d.day}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {d.problems.length} Problems
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {d.problems.map((prob) => {
                          const isSolved = Boolean(solvedProblems[prob.id]);

                          return (
                            <div
                              key={prob.id}
                              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                                isSolved
                                  ? 'bg-[#064E3B]/20 border-[#10B981]/40'
                                  : 'bg-[#0A0B0F] border-[#1E293B] hover:border-[#38BDF8]/40'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {isPurchased ? (
                                  <button
                                    onClick={() => toggleProblemSolved(prob.id)}
                                    className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
                                      isSolved
                                        ? 'bg-[#10B981] text-black font-bold'
                                        : 'border border-[#475569] hover:border-[#38BDF8]'
                                    }`}
                                    title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                                  >
                                    {isSolved && <Check className="w-3.5 h-3.5" />}
                                  </button>
                                ) : (
                                  <Lock className="w-4 h-4 text-[#64748B] shrink-0" />
                                )}

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs font-bold truncate ${isSolved ? 'line-through text-[#94A3B8]' : 'text-white'}`}>
                                      {prob.name}
                                    </span>
                                    <span
                                      className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                                        prob.difficulty === 'Easy'
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : prob.difficulty === 'Medium'
                                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                      }`}
                                    >
                                      {prob.difficulty}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#64748B] font-mono block truncate">
                                    Pattern: {prob.pattern}
                                  </span>
                                </div>
                              </div>

                              {/* LeetCode link or unlock button */}
                              {isPurchased ? (
                                <a
                                  href={prob.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#38BDF8] text-[#94A3B8] hover:text-[#0A0B0F] text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0"
                                >
                                  <span>Solve</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <button
                                  onClick={handleRazorpayPayment}
                                  className="px-2.5 py-1 rounded bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6] hover:text-black text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Unlock for ₹19</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* OOPS Problem of the Week Assignment Card */}
                {currentWeekData.oopsProblem && (
                  <div className="bg-[#1E1B4B]/30 border border-[#8B5CF6]/40 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#8B5CF6]/30 pb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#A855F7]" />
                        <span className="text-xs font-bold text-[#C084FC] uppercase tracking-wider font-mono">
                          OOPS Problem of the Week
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#8B5CF6]/20 text-[#D8B4FE] px-2 py-0.5 rounded-full font-mono">
                        Interview Design
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">
                      {currentWeekData.oopsProblem.topic}
                    </h4>

                    {isPurchased ? (
                      <div className="bg-[#0A0B0F] p-4 rounded-xl border border-[#1E293B] text-xs text-[#CBD5E1] whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-[300px]">
                        {currentWeekData.oopsProblem.description}
                      </div>
                    ) : (
                      <div className="bg-[#0A0B0F]/90 p-6 rounded-xl border border-[#1E293B] text-center space-y-2">
                        <Lock className="w-5 h-5 text-[#8B5CF6] mx-auto" />
                        <p className="text-xs text-[#94A3B8]">
                          Full OOPS design specifications, methods, and test case requirements are unlocked for ₹19.
                        </p>
                        <button
                          onClick={handleRazorpayPayment}
                          className="px-4 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>Unlock All OOPS Exercises</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

        </div>

        {/* Footer */}
        <div className="bg-[#0F172A] border-t border-[#1E293B] p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-[#64748B] font-mono">
            {isPurchased ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Notes Unlocked & Ready for Prep
              </span>
            ) : (
              <span>Instant Razorpay Access • ₹19 One-Time</span>
            )}
          </div>

          {!isPurchased && (
            <Button
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-[#0A0B0F] font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-lg hover:shadow-[#14B8A6]/20 flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing...' : 'Get Notes for ₹19'}</span>
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
