import React, { useState, useEffect } from 'react';
import { Swords, Sparkles, Trophy, Flame } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function Layer3MatchStartOverlay({ room, onComplete }) {
  const [count, setCount] = useState(3);
  const [isDone, setIsDone] = useState(false);

  const host = room?.host || room?.me || { name: 'Host Coder', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', rating: 0 };
  const guest = room?.guest || (room?.isBot ? { name: 'DevBot AI 🤖', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', rating: 1450 } : { name: 'Opponent', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', rating: 0 });

  useEffect(() => {
    sounds.playTick();
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sounds.playSubmitSuccess();
          setIsDone(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return 0;
        }
        sounds.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 font-sans text-slate-100 overflow-hidden animate-fade-in">
      
      {/* Background Pulsing Neon Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/30 via-amber-500/20 to-purple-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Header Banner: READY FOR THE TEST */}
      <div className="text-center mb-8 relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/30 text-amber-300 font-mono font-black text-sm tracking-widest uppercase animate-bounce">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>READY FOR THE TEST ⚔️</span>
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-slate-100 uppercase">
          1v1 CONTEST DUEL BATTLEGROUND
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300 font-mono font-semibold">
          Problem: <span className="text-white font-extrabold">{room?.problem?.title || 'Competitive Algorithm Challenge'}</span>
        </p>
      </div>

      {/* 1v1 VS Player Showcase Cards */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 relative z-10 w-full max-w-3xl my-4">
        
        {/* Host Player Card */}
        <div className="w-full sm:w-64 bg-slate-900/90 border-2 border-cyan-500/50 rounded-3xl p-5 text-center shadow-2xl shadow-cyan-500/20 relative overflow-hidden group transform hover:scale-105 transition-all">
          <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl font-mono">
            HOST
          </div>
          
          <img
            src={host.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={host.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 mx-auto mb-3 shadow-lg group-hover:rotate-2 transition-all"
          />
          <h2 className="text-lg font-black text-white truncate">{host.name || 'Host'}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-bold mt-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{host.rating !== undefined ? host.rating : 0} Rating</span>
          </div>
        </div>

        {/* Center Animated VS Emblem */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-1 shadow-2xl shadow-amber-500/40 animate-spin-slow">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-widest mt-2">VS</span>
        </div>

        {/* Guest Player Card */}
        <div className="w-full sm:w-64 bg-slate-900/90 border-2 border-purple-500/50 rounded-3xl p-5 text-center shadow-2xl shadow-purple-500/20 relative overflow-hidden group transform hover:scale-105 transition-all">
          <div className="absolute top-0 right-0 bg-purple-500 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl font-mono">
            {room?.isBot ? 'BOT' : 'CHALLENGER'}
          </div>

          <img
            src={guest.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'}
            alt={guest.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-400 mx-auto mb-3 shadow-lg group-hover:-rotate-2 transition-all"
          />
          <h2 className="text-lg font-black text-white truncate">{guest.name || 'Challenger'}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 font-bold mt-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{guest.rating !== undefined ? guest.rating : 0} Rating</span>
          </div>
        </div>

      </div>

      {/* 3-Second Countdown Display (Ulti Ginti) */}
      <div className="mt-6 text-center relative z-10">
        <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)] animate-scale-in">
          {count > 0 ? count : 'GO! 🔥'}
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mt-2 font-bold tracking-wider">
          {count > 0 ? 'CONTEST STARTING IN...' : 'DUEL BATTLEGROUND IS LIVE!'}
        </p>
      </div>

    </div>
  );
}
