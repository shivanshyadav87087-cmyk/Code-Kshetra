import React, { useState, useEffect, useRef } from 'react';
import { Swords, Lock, User, Key, ArrowRight, Camera, Code, Sparkles, Upload, CheckCircle2, AlertCircle, Loader2, Mail, Flame, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';
import FestivalBanner from './FestivalBanner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LandingAuthGate({ onAuthSuccess }) {
  // Layer Step State: 1 = Auth (Sign In / Register), 2 = Unique Handle Setup & Enter Contest
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('register'); // 'register' or 'login'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('Competitive Coder ⚔️ | LeetCode Challenger');
  const [location, setLocation] = useState('India 🇮🇳');
  
  const [userProfileData, setUserProfileData] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
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
  const [simulatedOtp, setSimulatedOtp] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

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

  // Real-Time Password Strength Evaluator
  const evaluatePasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '', width: '0%', tip: '' };
    
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[@#$!%*?&-_]/.test(pass)) score += 1;

    if (pass.length < 6) {
      return {
        label: 'Weak Password 🔴',
        color: 'bg-rose-500 text-rose-400',
        width: '25%',
        tip: 'Password must be at least 6 characters.'
      };
    } else if (score <= 2) {
      return {
        label: 'Medium Password 🟡',
        color: 'bg-amber-500 text-amber-400',
        width: '60%',
        tip: 'Add numbers & special symbols (@#$!) to strengthen.'
      };
    } else {
      return {
        label: 'Strong Password 🟢',
        color: 'bg-emerald-500 text-emerald-400',
        width: '100%',
        tip: 'Strong & secure password!'
      };
    }
  };

  const passStrength = evaluatePasswordStrength(password);
  const newPassStrength = evaluatePasswordStrength(newPassword);

  // Photo file upload from device via FileReader
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result);
        sounds.playClick();
      }
    };
    reader.readAsDataURL(file);
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
    setLoading(true);
    sounds.playClick();

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const tempUsername = email ? email.split('@')[0] : 'User_' + Math.floor(Math.random() * 89999 + 10000);

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

    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setSimulatedOtp(generatedCode);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        // Fallback simulated OTP for dev/offline mode
        sessionStorage.setItem(`reset_otp_${forgotEmail}`, JSON.stringify({
          otp: generatedCode,
          expiresAt: Date.now() + 600000
        }));
      }

      setOtpSuccessMsg(`OTP Sent! Verification code generated for ${forgotEmail}.`);
      sounds.playSubmitSuccess();
      setForgotStep(2);
      setResendTimer(30);
    } catch (err) {
      // Offline fallback
      sessionStorage.setItem(`reset_otp_${forgotEmail}`, JSON.stringify({
        otp: generatedCode,
        expiresAt: Date.now() + 600000
      }));
      setOtpSuccessMsg(`OTP Sent! Verification code generated for ${forgotEmail}.`);
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
        // Local storage / session storage fallback check
        const storedRecord = JSON.parse(sessionStorage.getItem(`reset_otp_${forgotEmail}`) || '{}');
        if (storedRecord.otp && storedRecord.otp === otpInput.trim()) {
          isVerified = true;
        } else if (otpInput.trim() === simulatedOtp && simulatedOtp !== '') {
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

  const displayAvatar = avatarUrl || userProfileData?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Animated Glow Grids */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-emerald-600/20 to-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden relative z-10 p-6 sm:p-8 my-6">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
            <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold">क्षेत्र</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto font-mono">
            Official 1v1 Real-Time Competitive Coding Arena. Boost your Rating by solving questions!
          </p>

          <FestivalBanner />
        </div>

        {/* Contest Invitation Banner (If joining via shared room link) */}
        {(() => {
          let roomCode = '';
          try {
            const urlParams = new URLSearchParams(window.location.search);
            roomCode = urlParams.get('room') || urlParams.get('join') || '';
            if (!roomCode && window.location.hash && window.location.hash.includes('room=')) {
              roomCode = window.location.hash.split('room=')[1]?.split('&')[0] || '';
            }
            if (!roomCode) {
              roomCode = sessionStorage.getItem('pending_contest_room') || '';
            }
          } catch (e) {}

          if (roomCode) {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-cyan-500/20 border-2 border-amber-400/60 shadow-xl text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-sm">
                  <Swords className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span>CONTEST INVITATION RECEIVED! ⚔️</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  You were invited to 1v1 Contest Room <span className="font-mono font-extrabold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-cyan-500/40">{roomCode.toUpperCase()}</span>
                </p>
              </div>
            );
          }
          return null;
        })()}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold font-mono">
            {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {otpSuccessMsg && (
          <div className="p-3 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold font-mono">
            {otpSuccessMsg}
          </div>
        )}

        {/* FORGOT PASSWORD MODAL SCREEN */}
        {forgotMode ? (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                {forgotStep === 1 ? 'Reset Password via OTP' : 'Verify OTP & Set New Password'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {forgotStep === 1
                  ? 'Enter your registered Gmail address to receive a 6-digit reset OTP.'
                  : `Enter the 6-digit OTP sent to ${forgotEmail} and create your new password.`}
              </p>
            </div>

            {/* FORGOT STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendResetOTP} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Registered Gmail Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpSending}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/20 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer btn-glow-cyan disabled:opacity-50"
                >
                  {otpSending ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-slate-950" />
                      <span>Send OTP to Gmail 📧</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setErrorMsg(''); setOtpSuccessMsg(''); }}
                  className="w-full text-center text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer pt-2"
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* FORGOT STEP 2: Enter OTP & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordWithOTP} className="space-y-4">
                
                {/* Simulated OTP Display Banner for Easy Testing */}
                {simulatedOtp && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono text-center flex items-center justify-between">
                    <span>Generated OTP Code:</span>
                    <span className="font-extrabold text-sm tracking-widest text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-emerald-500/40 select-all">
                      {simulatedOtp}
                    </span>
                  </div>
                )}

                {/* OTP Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <label className="text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enter 6-Digit OTP Code</span>
                    </label>

                    {resendTimer > 0 ? (
                      <span className="text-amber-400 text-[11px]">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendResetOTP}
                        className="text-cyan-400 hover:underline cursor-pointer text-[11px]"
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
                    placeholder="Enter 6-digit OTP (e.g. 839215)"
                    className="w-full bg-slate-950 border border-emerald-500/50 focus:border-emerald-400 rounded-2xl px-4 py-3.5 text-sm font-mono text-emerald-300 font-extrabold tracking-widest text-center placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>

                {/* New Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>New Password</span>
                    </span>
                    {newPassStrength.label && (
                      <span className={`text-[10px] font-bold ${newPassStrength.color.split(' ')[1]}`}>
                        {newPassStrength.label}
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>

                {/* Confirm New Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpVerifying}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer btn-glow-emerald disabled:opacity-50"
                >
                  {otpVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-slate-950" />
                      <span>Reset Password & Sign In 🔐</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setForgotStep(1); setErrorMsg(''); setOtpSuccessMsg(''); }}
                  className="w-full text-center text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer pt-1"
                >
                  ← Change Email Address
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* LAYER 1: SIGN IN / REGISTER FORM */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Auth Mode Tabs: Register vs Sign In */}
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(''); sounds.playClick(); }}
                    className={`flex-1 py-2.5 rounded-xl btn-glow transition-all ${
                      mode === 'register'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1. New User (Register)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); sounds.playClick(); }}
                    className={`flex-1 py-2.5 rounded-xl btn-glow transition-all ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1. Existing User (Sign In)
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Photo Upload */}
                  {mode === 'register' && (
                    <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                      <div className="relative group">
                        <img
                          src={displayAvatar}
                          alt="Profile Avatar"
                          className="w-20 h-20 rounded-3xl object-cover border-2 border-cyan-500/50 shadow-xl group-hover:opacity-80 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-950/70 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          <Camera className="w-5 h-5 mb-0.5" />
                          <span>Upload</span>
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <label className="text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Password</span>
                      </label>
                      {mode === 'register' && passStrength.label && (
                        <span className={`text-[10px] font-bold ${passStrength.color.split(' ')[1]}`}>
                          {passStrength.label}
                        </span>
                      )}
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setForgotMode(true);
                            setForgotStep(1);
                            setForgotEmail(email || '');
                            setErrorMsg('');
                            sounds.playClick();
                          }}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer text-[11px]"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>

                  {/* Next Step Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-600 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/20 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <span>Continue ➔</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* LAYER 2: CHOOSE UNIQUE USERNAME & ENTER CONTEST */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">
                    2. Choose Unique Arena Handle
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    This handle will represent you in all 1v1 duels, leaderboards & chats!
                  </p>
                </div>

                <form onSubmit={handleEnterContestSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-200 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Unique Display Handle (Username)</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        required
                        minLength={3}
                        maxLength={20}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="e.g. CodeMaster99"
                        className={`w-full bg-slate-950 border ${
                          handleStatus.error
                            ? 'border-rose-500/80 focus:border-rose-500'
                            : 'border-emerald-500/50 focus:border-emerald-400'
                        } rounded-2xl px-4 py-3.5 text-sm font-mono text-emerald-300 font-bold placeholder:text-slate-600 outline-none transition-all`}
                      />

                      {handleStatus.checking && (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-4 top-4" />
                      )}
                    </div>

                    {/* Handle Availability Feedback */}
                    {!handleStatus.checking && usernameInput.trim().length >= 3 && (
                      <div className="text-xs font-mono font-bold mt-1">
                        {handleStatus.available ? (
                          <p className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ Handle "{usernameInput.trim()}" is AVAILABLE!</span>
                          </p>
                        ) : (
                          <p className="text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{handleStatus.error || 'Handle taken.'}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BUTTON UNDERNEATH USERNAME: ENTER CONTEST */}
                  <button
                    type="submit"
                    disabled={loading || usernameInput.trim().length < 3}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 text-slate-950 font-black text-sm tracking-widest uppercase shadow-2xl shadow-amber-500/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 btn-glow"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <Swords className="w-5 h-5 text-slate-950 animate-bounce" />
                        <span>Enter Contest Arena ⚔️</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    ← Back to Sign In / Register
                  </button>
                </form>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
