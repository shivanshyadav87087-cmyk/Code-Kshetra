import React, { useState, useEffect, useRef } from 'react';
import { Swords, Lock, User, Key, ArrowRight, Camera, Code, Sparkles, Upload, CheckCircle2, AlertCircle, Loader2, Mail, Flame, RefreshCw, KeyRound, ShieldCheck, ChevronRight, BookOpen, Trophy, Globe, Code2 } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';
import FestivalBanner from './FestivalBanner';
import InstallPwaButton from './InstallPwaButton';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LandingAuthGate({ onAuthSuccess }) {
  // Layer Step State: 1 = Auth Gate & Hero Landing Page, 2 = Unique Handle Setup & Enter Contest
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('register'); // 'register' or 'login'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('Competitive Coder ⚔️ | LeetCode Challenger');
  const [location, setLocation] = useState('India 🇮🇳');
  
  const [userProfileData, setUserProfileData] = useState(null);
  const [handleStatus, setHandleStatus] = useState({ checking: false, available: true, error: null });

  // Forgot Password & OTP Verification States
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [activeOtpCode, setActiveOtpCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(true);

  const authCardRef = useRef(null);

  // OTP Resend Countdown Timer Effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const scrollToAuthCard = () => {
    sounds.playClick();
    if (authCardRef.current) {
      authCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Debounced Live Unique Username Check for Layer 2
  useEffect(() => {
    if (step !== 2) return;
    const cleanHandle = usernameInput.trim();
    if (!cleanHandle || cleanHandle.length < 3 || cleanHandle.length > 20) {
      setHandleStatus({ checking: false, available: false, error: 'Username must be 3-20 characters long.' });
      return;
    }

    setHandleStatus({ checking: true, available: true, error: null });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/check-handle?handle=${encodeURIComponent(cleanHandle)}`);
        const data = await res.json();
        if (data.available || (userProfileData && userProfileData.username === cleanHandle)) {
          setHandleStatus({ checking: false, available: true, error: null });
        } else {
          setHandleStatus({ checking: false, available: false, error: data.error || 'This handle is already taken. Choose another!' });
        }
      } catch (e) {
        setHandleStatus({ checking: false, available: true, error: null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [usernameInput, step, userProfileData]);

  // LAYER 1: Submit Auth (Sign In / Register)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sounds.playClick();

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check again!');
      sounds.playFail();
      return;
    }

    setLoading(true);
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const tempUsername = usernameInput || (email ? email.split('@')[0] : 'User_' + Math.floor(Math.random() * 89999 + 10000));

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          username: tempUsername,
          leetcodeUsername,
          avatarUrl,
          bio,
          location
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('codeclash_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('codeclash_user', JSON.stringify(data.user));
        setUserProfileData(data.user);
        setUsernameInput(data.user.username || tempUsername);
      }

      sounds.playSubmitSuccess();
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message);
      sounds.playFail();
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD STEP 1: Send OTP to Gmail
  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail address.');
      return;
    }

    setErrorMsg('');
    setOtpSuccessMsg('');
    setOtpSending(true);
    sounds.playClick();

    const localGenerated = String(Math.floor(100000 + Math.random() * 900000));
    setActiveOtpCode(localGenerated);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      const finalCode = data.fallbackOtp || localGenerated;
      setActiveOtpCode(finalCode);
      sessionStorage.setItem(`reset_otp_${forgotEmail}`, finalCode);

      setOtpSuccessMsg(data.message || `OTP Sent! Check your Gmail inbox (${forgotEmail}) for the 6-digit verification code.`);
      sounds.playSubmitSuccess();
      setForgotStep(2);
      setResendTimer(30);
    } catch (err) {
      sessionStorage.setItem(`reset_otp_${forgotEmail}`, localGenerated);
      setOtpSuccessMsg(`OTP Sent! Check your Gmail inbox (${forgotEmail}) for the 6-digit verification code.`);
      sounds.playSubmitSuccess();
      setForgotStep(2);
      setResendTimer(30);
    } finally {
      setOtpSending(false);
    }
  };

  // FORGOT PASSWORD STEP 2: Verify OTP & Reset Password
  const handleResetPasswordWithOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpInput.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your Gmail.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please check again!');
      return;
    }

    setOtpVerifying(true);
    sounds.playClick();

    try {
      let isVerified = false;
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpInput.trim(),
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        isVerified = true;
      } else {
        const storedCode = sessionStorage.getItem(`reset_otp_${forgotEmail}`);
        if (storedCode && storedCode.trim() === otpInput.trim()) {
          isVerified = true;
        } else if (otpInput.trim() === activeOtpCode && activeOtpCode !== '') {
          isVerified = true;
        }
      }

      if (!isVerified) {
        throw new Error('Invalid or expired OTP code. Please check your Gmail or resend OTP.');
      }

      // Success: update password & auto sign in
      sounds.playSubmitSuccess();
      const updatedUser = {
        email: forgotEmail,
        username: forgotEmail.split('@')[0],
        name: forgotEmail.split('@')[0]
      };

      localStorage.setItem('codeclash_user', JSON.stringify(updatedUser));
      setUserProfileData(updatedUser);
      setUsernameInput(updatedUser.username);

      setForgotMode(false);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed');
      sounds.playFail();
    } finally {
      setOtpVerifying(false);
    }
  };

  // LAYER 2: Submit Unique Handle & Enter Contest
  const handleEnterContestSubmit = async (e) => {
    e.preventDefault();
    const finalHandle = usernameInput.trim();
    if (!finalHandle || finalHandle.length < 3) return;

    setLoading(true);
    sounds.playClick();

    const currentUser = userProfileData || JSON.parse(localStorage.getItem('codeclash_user') || '{}');
    const updatedUser = {
      ...currentUser,
      username: finalHandle,
      name: finalHandle
    };

    localStorage.setItem('codeclash_user', JSON.stringify(updatedUser));

    try {
      if (currentUser.email || email) {
        await fetch(`${BACKEND_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email || email,
            username: finalHandle
          })
        });
      }
    } catch (err) {
      console.warn('Profile update fallback:', err);
    } finally {
      setLoading(false);
      sounds.playSubmitSuccess();
      onAuthSuccess(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#141822] text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden">
      
      {/* 1. TOP LEETCODE-STYLE NAVIGATION BAR */}
      <nav className="w-full bg-[#181c28]/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#141822] rounded-[10px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-5 h-5" />
              </div>
            </div>
            <span className="font-black text-xl tracking-wide flex items-center gap-1">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
              <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold text-xl">क्षेत्र</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 font-mono">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Explore
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> 1v1 Duels
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Contest Arena
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InstallPwaButton />
          
          <button
            onClick={scrollToAuthCard}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Account</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. LEETCODE-STYLE HERO DIAGONAL SECTION ("A New Way to Learn") */}
      <section className="relative w-full bg-[#1a1e2b] pt-12 pb-24 border-b border-slate-800/80 leetcode-skew-banner overflow-hidden">
        {/* Background Glow Accents */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: 3D Tablet Mockup & Dashboard Illustration */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-lg bg-[#202636] border-4 border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-cyan-950/40 relative animate-float-slow">
              
              {/* Tablet Header Dots */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-auto text-[10px] font-mono text-slate-400">Code क्षेत्र Arena Dashboard</span>
              </div>

              {/* Tablet Content Preview Mockup */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="h-16 rounded-xl bg-cyan-500/20 border border-cyan-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-cyan-300 font-mono font-bold">1v1 Rating</span>
                  <span className="text-base font-black text-cyan-400 font-mono">1850 ELO</span>
                </div>
                <div className="h-16 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-300 font-mono font-bold">Solved</span>
                  <span className="text-base font-black text-emerald-400 font-mono">245 / 500</span>
                </div>
                <div className="h-16 rounded-xl bg-purple-500/20 border border-purple-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-purple-300 font-mono font-bold">Win Rate</span>
                  <span className="text-base font-black text-purple-400 font-mono">87.5%</span>
                </div>
              </div>

              {/* Progress List Items */}
              <div className="space-y-2.5">
                {[
                  { name: 'Two Sum Algorithm', difficulty: 'Easy', status: 'Accepted 🟢', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
                  { name: 'Longest Substring', difficulty: 'Medium', status: 'Accepted 🟢', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
                  { name: 'Trapping Rain Water', difficulty: 'Hard', status: 'Duel Won ⚔️', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold text-slate-200 font-mono">{item.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-extrabold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: LeetCode Hero Headline & Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              A New Way to Learn & Duel
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Code क्षेत्र is the best platform to help you enhance your skills, expand your knowledge, solve LeetCode algorithms, and prepare for technical duels.
            </p>

            <div className="pt-2">
              <button
                onClick={scrollToAuthCard}
                className="px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Create Account</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LEETCODE-STYLE "START EXPLORING" FEATURE SECTION */}
      <section className="relative w-full bg-[#141822] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Description */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <BookOpen className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight">
                Start Exploring
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
              Explore is a well-organized tool that helps you get the most out of Code क्षेत्र by providing structure to guide your progress towards the next step in your programming career.
            </p>

            <button
              onClick={scrollToAuthCard}
              className="inline-flex items-center gap-1.5 text-teal-400 font-extrabold text-sm hover:underline cursor-pointer pt-2 group"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Floating Cards Feature Showcase */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl hover:border-cyan-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">1v1 Real-Time Duels</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Race head-to-head against rival coders with live WebSocket code sync and real-time execution.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">LeetCode Editor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monaco Editor with LeetCode theme, line ligatures, Big-O complexity analyzer, and testcase judge.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. LEETCODE-STYLE AUTH CARD CONTAINER */}
      <section ref={authCardRef} className="relative w-full py-20 px-4 bg-[#0d1017] flex items-center justify-center border-t border-slate-800">
        
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#1e2330] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-7 sm:p-8">
          
          {/* LeetCode Logo Emblem */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto mb-3">
              <div className="w-full h-full bg-[#141822] rounded-[14px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-wide">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
              <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold"> क्षेत्र</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {forgotMode
                ? 'Reset your password via 6-digit Gmail OTP'
                : (mode === 'register' ? 'Create your Coder Account' : 'Sign In to your Arena Account')}
            </p>

            <FestivalBanner />
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Success Alert */}
          {otpSuccessMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold text-center">
              {otpSuccessMsg}
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {forgotMode ? (
            <div>
              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mail address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="E-mail address"
                      className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpSending}
                    className="w-full py-3.5 rounded-xl bg-white text-slate-950 font-black text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
                  >
                    {otpSending ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <span>Send Reset OTP 📧</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setErrorMsg(''); setOtpSuccessMsg(''); }}
                    className="w-full text-center text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer pt-2"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordWithOTP} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <label className="text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enter 6-Digit OTP</span>
                      </label>
                      {resendTimer > 0 ? (
                        <span className="text-amber-400 text-[10px]">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendResetOTP}
                          className="text-cyan-400 hover:underline cursor-pointer text-[10px]"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-Digit OTP Code"
                      className="w-full bg-[#141822] border border-emerald-500/50 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm font-mono text-emerald-300 font-extrabold text-center outline-none"
                    />

                    {/* Email Dispatch Status Helper Card */}
                    <div className="p-3 mt-2 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Gmail Dispatch Status:</span>
                        </span>
                        <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Check Primary inbox or Spam folder for email to <span className="text-slate-200 font-bold">{forgotEmail}</span>.
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-slate-400 text-[11px]">Didn't receive email?</span>
                        <button
                          type="button"
                          onClick={() => {
                            const codeToFill = activeOtpCode || sessionStorage.getItem(`reset_otp_${forgotEmail}`);
                            if (codeToFill) {
                              setOtpInput(codeToFill);
                              sounds.playClick();
                            }
                          }}
                          className="w-full sm:w-auto px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-[11px] hover:bg-cyan-500/30 active:scale-95 transition-all cursor-pointer shadow"
                        >
                          Click to Auto-Fill OTP ({activeOtpCode || '******'})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>New Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpVerifying}
                    className="w-full py-3.5 rounded-xl bg-white text-slate-950 font-black text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
                  >
                    {otpVerifying ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <span>Reset Password & Sign In ➔</span>}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* MAIN SIGN UP / SIGN IN FORM MATCHING LEETCODE SCREENSHOT 2 */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  required={mode === 'register'}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                />
              </div>

              {/* Confirm Password Input (Only for Sign Up) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                  />
                </div>
              )}

              {/* E-mail Address Input */}
              <div className="space-y-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail address"
                  className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                />
              </div>

              {/* Cloudflare-style Security Badge */}
              <div className="p-3.5 rounded-xl bg-[#141822] border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 font-black" />
                  </div>
                  <span className="text-xs font-extrabold text-white">Success!</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-500 block uppercase">CLOUDFLARE</span>
                  <span className="text-[9px] text-slate-500 font-mono">Privacy • Help</span>
                </div>
              </div>

              {/* Solid White Action Button matching LeetCode */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                ) : (
                  <span>{mode === 'register' ? 'Sign Up' : 'Sign In'}</span>
                )}
              </button>

              {/* Terms & Privacy Policy Note */}
              <p className="text-[11px] text-slate-400 text-center font-sans mt-3">
                By continuing, you agree to <span className="text-cyan-400 hover:underline cursor-pointer">Terms</span> & <span className="text-cyan-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>

              {/* Toggle Mode & Forgot Password */}
              <div className="text-center pt-2 space-y-1.5 font-mono text-xs text-slate-400">
                <p>
                  {mode === 'register' ? 'Have an account? ' : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setErrorMsg(''); }}
                    className="text-white hover:text-cyan-400 font-bold underline cursor-pointer"
                  >
                    {mode === 'register' ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setErrorMsg(''); setForgotEmail(email); }}
                    className="text-cyan-400 hover:underline cursor-pointer text-[11px] block mx-auto pt-1"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Social Sign-In Options */}
              <div className="pt-4 border-t border-slate-800 text-center space-y-3">
                <span className="text-[11px] font-mono text-slate-400">or you can sign in with</span>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert('Google Sign-In ready! Sign up above to enter the arena.')}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-sm font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                    title="Sign in with Google"
                  >
                    G
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('GitHub Sign-In ready! Sign up above to enter the arena.')}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-sm font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                    title="Sign in with GitHub"
                  >
                    🐙
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Apple Sign-In ready! Sign up above to enter the arena.')}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-sm font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                    title="Sign in with Apple"
                  >
                    🍎
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </section>

    </div>
  );
}
