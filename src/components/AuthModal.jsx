import React, { useState } from 'react';
import { User, Key, Lock, ArrowRight, ShieldCheck, Sparkles, X, Code, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { sounds } from '../engine/soundManager';

const BACKEND_URL = 'http://localhost:5000';

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
        tip: 'Add numbers & special characters (@#$!) to strengthen.'
      };
    } else {
      return {
        score: 3,
        label: 'Strong Password 🟢',
        color: 'bg-emerald-500 text-emerald-400',
        width: '100%',
        tip: 'Excellent! Your password is secure.'
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
        body: JSON.stringify({ username, password, leetcodeUsername })
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative p-6">
        
        {/* Close Button */}
        <button
          onClick={() => { onClose(); sounds.playClick(); }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            {mode === 'login' ? 'Sign In to Arena' : 'Create Coder Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'Welcome back! Enter your handle & password to sign in.' : 'New coder? Register your unique handle & link LeetCode ID.'}
          </p>
        </div>

        {/* Sign In vs Register Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register New
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              User ID / Unique Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AlgoGod"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Password</span>
              {mode === 'register' && password && (
                <span className={`text-[10px] font-bold ${passStrength.color}`}>
                  {passStrength.label}
                </span>
              )}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none"
                required
              />
            </div>

            {/* Password Strength Progress Bar & Live Suggestions */}
            {mode === 'register' && password && (
              <div className="mt-2 space-y-1">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passStrength.color}`}
                    style={{ width: passStrength.width }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  💡 {passStrength.tip}
                </p>
              </div>
            )}
          </div>

          {/* Optional LeetCode Username Input */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>LeetCode Profile ID (Optional)</span>
                <span className="text-[10px] text-slate-500 font-mono">leetcode.com/u/ID</span>
              </label>
              <div className="relative">
                <Code className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="e.g. neetchod"
                  className="w-full bg-slate-950 border border-amber-500/30 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-xs text-amber-200 placeholder-slate-600 outline-none font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-4 pt-4 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">
            {mode === 'login' ? "New coder?" : "Already registered?"}
          </span>
          <button
            onClick={() => {
              setMode(prev => prev === 'login' ? 'register' : 'login');
              setErrorMsg('');
              sounds.playClick();
            }}
            className="ml-2 font-bold text-cyan-400 hover:underline"
          >
            {mode === 'login' ? 'Create an Account' : 'Sign In Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
