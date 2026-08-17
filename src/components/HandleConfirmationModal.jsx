import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, CheckCircle2, AlertCircle, Loader2, UserCheck, Lock } from 'lucide-react';
import { sounds } from '../engine/soundManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function HandleConfirmationModal({ isOpen, initialName, email, onConfirm }) {
  const [handleInput, setHandleInput] = useState(initialName || '');
  const [handleStatus, setHandleStatus] = useState({ checking: false, available: true, error: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialName) {
      setHandleInput(initialName);
    }
  }, [initialName]);

  const cleanHandle = handleInput.replace(/<[^>]*>?/gm, '').trim();
  const isLengthValid = cleanHandle.length >= 3 && cleanHandle.length <= 20;

  // Debounced live handle check
  useEffect(() => {
    if (!isOpen) return;
    if (!cleanHandle || cleanHandle.length < 3 || cleanHandle.length > 20) {
      setHandleStatus({ checking: false, available: false, error: 'Handle must be between 3 and 20 characters.' });
      return;
    }

    setHandleStatus({ checking: true, available: true, error: null });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/check-handle?handle=${encodeURIComponent(cleanHandle)}`);
        const data = await res.json();
        if (data.available) {
          setHandleStatus({ checking: false, available: true, error: null });
        } else {
          setHandleStatus({ checking: false, available: false, error: data.error || 'This handle is already taken. Please pick another one.' });
        }
      } catch (e) {
        setHandleStatus({ checking: false, available: true, error: null });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [cleanHandle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLengthValid || !handleStatus.available || saving) return;

    setSaving(true);
    sounds.playClick();

    try {
      if (email) {
        await fetch(`${BACKEND_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            username: cleanHandle
          })
        });
      }
    } catch (e) {
      console.warn('Handle update fallback:', e);
    } finally {
      sounds.playSubmitSuccess();
      localStorage.setItem('codeclash_handle_prompted', 'true');
      setSaving(false);
      if (typeof onConfirm === 'function') {
        onConfirm(cleanHandle);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl font-sans animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative shadow-cyan-500/10">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 font-bold shadow-inner">
            <Shield className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Time Setup</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Confirm Your Arena Handle</h2>
            <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
              Before entering Code क्षेत्र duels, please confirm or customize your permanent display name.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>Player Handle (Username)</span>
              <span className="text-[10px] text-slate-500">3-20 Chars</span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                maxLength={20}
                placeholder="e.g. MasterCoder_99"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-slate-100 font-mono font-bold text-sm focus:outline-none transition-all ${
                  handleStatus.error
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : handleStatus.available && cleanHandle.length >= 3
                    ? 'border-emerald-500/60 focus:border-emerald-500'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
                autoFocus
              />

              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {handleStatus.checking ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : handleStatus.available && cleanHandle.length >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : handleStatus.error ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : null}
              </div>
            </div>

            {/* Status Message */}
            {handleStatus.error && (
              <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1 mt-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{handleStatus.error}</span>
              </p>
            )}
            {handleStatus.available && cleanHandle.length >= 3 && !handleStatus.checking && (
              <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Handle available! This name will be locked to your account.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isLengthValid || !handleStatus.available || saving}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isLengthValid && handleStatus.available && !saving
                ? 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving Handle...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm & Lock Handle 🔒</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
