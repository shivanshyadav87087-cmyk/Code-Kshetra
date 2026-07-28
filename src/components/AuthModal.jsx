import React, { useState } from 'react';
import { User, Key, Lock, ArrowRight, ShieldCheck, Sparkles, X, Code, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { sounds } from '../engine/soundManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Real-Time Password Strength Evaluator
  const evaluatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '', width: '0%', tip: '' };
    
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[@#$!%*?&-_]/.test(pass)) score += 1;

    if (pass.length < 6) {
      return {
        score: 1,
        label: 'Weak Password 🔴',
        color: 'bg-rose-500 text-rose-400',
        width: '25%',
        tip: 'Password must be at least 6 characters.'
      };
    } else if (score <= 2) {
      return {
        score: 2,
        label: 'Medium Password 🟡',
        color: 'bg-amber-500 text-amber-400',
        width: '60%',
        tip: 'Add numbers & special symbols (@#$!) to strengthen.'
      };
    } else {
      return {
        score: 3,
        label: 'Strong Password 🟢',
        color: 'bg-emerald-500 text-emerald-400',
        width: '100%',
        tip: 'Strong & secure password!'
      };
    }
  };

  const passStrength = evaluatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    sounds.playClick();

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
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

      sounds.playSubmitSuccess();
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
      sounds.playFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => { onClose(); sounds.playClick(); }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all btn-glow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center justify-center gap-1.5">
            <span>Code क्षेत्र Access</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {mode === 'login' ? 'Sign in to save your ELO rating & contest points' : 'Create an account to join 1v1 competitive duels'}
          </p>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2 rounded-lg btn-glow transition-all ${
              mode === 'login'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2 rounded-lg btn-glow transition-all ${
              mode === 'register'
                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-mono font-bold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Username Handle</span>
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. CodeMaster99"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </span>
              {mode === 'register' && passStrength.label && (
                <span className={`text-[10px] font-bold ${passStrength.color.split(' ')[1]}`}>
                  {passStrength.label}
                </span>
              )}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 outline-none transition-all"
            />

            {/* Live Password Strength Meter Bar */}
            {mode === 'register' && password && (
              <div className="space-y-1 pt-1">
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passStrength.color.split(' ')[0]}`}
                    style={{ width: passStrength.width }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {passStrength.tip}
                </p>
              </div>
            )}
          </div>

          {/* Optional LeetCode Handle for Register Mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-slate-400 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>LeetCode Username (Optional)</span>
              </label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. tourist"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-slate-100 placeholder:text-slate-600 outline-none transition-all text-amber-300"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-extrabold text-xs btn-glow-cyan transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

        </form>

      </div>
    </div>
  );
}
