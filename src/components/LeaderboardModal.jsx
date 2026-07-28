import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, X, User, Code, ExternalLink, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { getRatingTier } from '../engine/eloEngine';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`${BACKEND_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Explicitly sort by rating points descending (highest at top)
          const sorted = [...data].sort((a, b) => {
            if ((b.rating || 0) !== (a.rating || 0)) {
              return (b.rating || 0) - (a.rating || 0);
            }
            return (b.wins || 0) - (a.wins || 0);
          });
          setLeaderboard(sorted);
        }
      })
      .catch(() => {
        // Fallback sample data sorted by rating descending
        setLeaderboard([
          { username: 'GrandmasterNinja', rating: 2250, wins: 45, losses: 5, leetcodeUsername: 'gmninja' },
          { username: 'MasterCoder', rating: 1850, wins: 32, losses: 8, leetcodeUsername: 'mastercoder' },
          { username: 'ExpertByte', rating: 1420, wins: 22, losses: 10, leetcodeUsername: 'expertbyte' }
        ]);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            <div>
              <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                <span>Code क्षेत्र Global Leaderboard</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">Ranked strictly by highest ELO Rating Points</p>
            </div>
          </div>
          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-all btn-glow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar text-xs">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 animate-spin" />
              <span>Fetching live global ELO standings...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono">No players on the leaderboard yet!</div>
          ) : (
            leaderboard.map((user, idx) => {
              const tier = getRatingTier(user.rating || 0);
              const isTop3 = idx < 3;

              return (
                <div
                  key={user.username || idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : idx === 1
                      ? 'bg-slate-800/40 border-slate-400/50 shadow-md'
                      : idx === 2
                      ? 'bg-amber-900/20 border-amber-700/50 shadow-md'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-xl font-black font-mono text-xs flex items-center justify-center shrink-0 ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : idx === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40 shadow-sm'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx === 0 ? (
                        <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                      ) : idx === 1 ? (
                        <Medal className="w-4 h-4 text-slate-300" />
                      ) : idx === 2 ? (
                        <Medal className="w-4 h-4 text-amber-500" />
                      ) : (
                        <span>#{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="font-extrabold text-slate-100 flex items-center gap-2">
                        <span>{user.username}</span>
                        {/* Rank Tier Pill */}
                        <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tier.bg} ${tier.color}`}>
                          <span>{tier.badge}</span>
                          <span>{tier.name}</span>
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{user.wins || 0} Wins</span>
                        <span className="text-slate-600">•</span>
                        <span>{user.losses || 0} Losses</span>
                        {user.location && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-300">{user.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Points Display */}
                  <div className="text-right">
                    <div className="font-mono font-black text-base text-cyan-300 tracking-tight">
                      {user.rating || 0}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                      ELO Rating Points
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
