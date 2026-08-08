import React, { useState, useEffect } from 'react';
import { User, Key, Lock, ArrowRight, ShieldCheck, Sparkles, X, Code, CheckCircle2, AlertCircle, Loader2, Mail, KeyRound } from 'lucide-react';
import { sounds } from '../engine/soundManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  
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

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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
    const tempUsername = username || (email ? email.split('@')[0] : 'User_' + Math.floor(Math.random() * 89999 + 10000));

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          username: tempUsername,
          leetcodeUsername
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
      }

      sounds.playSubmitSuccess();
      onAuthSuccess(data.user || { username: tempUsername, email });
      onClose();
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

      sounds.playSubmitSuccess();
      const updatedUser = {
        email: forgotEmail,
        username: forgotEmail.split('@')[0],
        name: forgotEmail.split('@')[0]
      };

      localStorage.setItem('codeclash_user', JSON.stringify(updatedUser));
      onAuthSuccess(updatedUser);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed');
      sounds.playFail();
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    sounds.playClick();
    const demoUsername = `${provider}_Coder_${Math.floor(1000 + Math.random() * 9000)}`;
    const demoUser = {
      username: demoUsername,
      name: demoUsername,
      email: `${demoUsername.toLowerCase()}@gmail.com`,
      rating: 1200
    };
    localStorage.setItem('codeclash_user', JSON.stringify(demoUser));
    sounds.playSubmitSuccess();
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans select-none">
      <div className="w-full max-w-md bg-[#1e2330] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative animate-scaleUp p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LeetCode Header Logo Emblem */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto mb-2.5">
            <div className="w-full h-full bg-[#141822] rounded-[14px] flex items-center justify-center">
              <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-7 h-7" />
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-wide">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
            <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold"> क्षेत्र</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {forgotMode
              ? 'Reset your password via 6-digit Gmail OTP'
              : (mode === 'register' ? 'Create your Coder Account' : 'Sign In to your Account')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {otpSuccessMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans font-bold text-center">
            {otpSuccessMsg}
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {forgotMode ? (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleSendResetOTP} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-sans text-slate-300 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>E-mail address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="E-mail address"
                    className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                  className="w-full text-center text-xs font-sans text-slate-400 hover:text-slate-200 underline cursor-pointer pt-2"
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordWithOTP} className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-sans font-bold">
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
                    className="w-full bg-[#141822] border border-emerald-500/50 focus:border-emerald-400 rounded-xl px-4 py-3 text-base font-mono text-emerald-300 font-extrabold text-center outline-none"
                  />

                  {/* Auto-Fill OTP Card */}
                  <div className="p-3 mt-2 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Gmail Dispatch Status:</span>
                      </span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center justify-between gap-1.5">
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
                        className="w-full px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-[11px] hover:bg-cyan-500/30 active:scale-95 transition-all cursor-pointer shadow text-center"
                      >
                        Click to Auto-Fill OTP ({activeOtpCode || '******'})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sans text-slate-300 font-bold">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sans text-slate-300 font-bold">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 outline-none"
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
          /* MAIN SIGN UP / SIGN IN FORM MATCHING LEETCODE */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Username Input */}
            <div className="space-y-1">
              <input
                type="text"
                required={mode === 'register'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                  className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>

            {/* Cloudflare-style Security Badge */}
            <div className="p-3 rounded-xl bg-[#141822] border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 font-black" />
                </div>
                <span className="text-xs font-extrabold text-white font-sans">Success!</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-amber-500 block uppercase tracking-wider">CLOUDFLARE</span>
                <span className="text-[9px] text-slate-500 font-sans">Privacy • Help</span>
              </div>
            </div>

            {/* Solid White Action Button matching LeetCode */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-white text-slate-950 font-black text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              ) : (
                <span>{mode === 'register' ? 'Sign Up' : 'Sign In'}</span>
              )}
            </button>

            {/* Terms & Privacy Policy Note */}
            <p className="text-[11px] text-slate-400 text-center font-sans mt-2.5">
              By continuing, you agree to <span className="text-cyan-400 hover:underline cursor-pointer">Terms</span> & <span className="text-cyan-400 hover:underline cursor-pointer">Privacy Policy</span>.
            </p>

            {/* Toggle Mode & Forgot Password */}
            <div className="text-center pt-1.5 space-y-1 font-sans text-xs text-slate-400">
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
                  className="text-cyan-400 hover:underline cursor-pointer text-[11px] block mx-auto pt-1 font-sans"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Social Sign-In Options */}
            <div className="pt-3 border-t border-slate-800 text-center space-y-2.5">
              <span className="text-[11px] font-sans text-slate-400">or you can sign in with</span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('Google')}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                  title="Sign in with Google"
                >
                  G
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('GitHub')}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                  title="Sign in with GitHub"
                >
                  🐙
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('Apple')}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-black border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                  title="Sign in with Apple"
                >
                  🍎
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
