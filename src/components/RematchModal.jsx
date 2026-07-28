import React, { useState, useEffect } from 'react';
import { Swords, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function RematchModal({ isOpen = true, requesterName, readyStatusText, onAccept, onDecline }) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onDecline]);

  if (!isOpen) return null;

  const progressPercentage = (timeLeft / 30) * 100;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl font-sans animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 text-center shadow-cyan-500/20">
        
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Swords className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-100 tracking-wide">
          REMATCH CHALLENGE!
        </h3>

        <p className="text-sm font-semibold text-cyan-300 mt-2">
          <span className="font-bold text-white">{requesterName || 'Your Opponent'}</span> wants a rematch!
        </p>

        {readyStatusText && (
          <p className="text-xs font-mono text-slate-400 mt-1">
            {readyStatusText}
          </p>
        )}

        {/* 30-Second Countdown Visual Bar */}
        <div className="my-5 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Auto-declines in:</span>
            </span>
            <span className={`font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => { sounds.playClick(); onDecline(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>DECLINE</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); onAccept(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>ACCEPT REMATCH</span>
          </button>
        </div>

      </div>
    </div>
  );
}
