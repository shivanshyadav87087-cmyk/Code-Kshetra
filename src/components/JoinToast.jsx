import React, { useEffect } from 'react';
import { Swords, UserCheck, Sparkles, X } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function JoinToast({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      sounds.playSubmitSuccess();
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all">
      <div className="bg-slate-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 rounded-2xl px-5 py-3.5 backdrop-blur-xl flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
          <Swords className="w-5 h-5 animate-pulse" />
        </div>

        <div>
          <div className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PLAYER JOINED THE ARENA!</span>
          </div>
          <div className="text-xs text-slate-100 font-semibold mt-0.5">
            <span className="text-emerald-400 font-bold">{notification.username}</span> has joined the duel!
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
