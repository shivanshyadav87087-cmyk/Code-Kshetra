import React, { useState, useEffect } from 'react';
import { Trophy, Frown, RefreshCw, LogOut, CheckCircle2, XCircle, Code, Clock, Zap, Sparkles, Hourglass, FileCode, ShieldAlert } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { getRatingTier } from '../engine/eloEngine';

export default function PostMatchModal({ room, mySubmission, opponentSubmission, onRematch, onNewDuel, onViewSolution }) {
  const [requestedRematch, setRequestedRematch] = useState(false);

  if (!room) return null;

  const totalCases = room.problem?.testCases?.length || 4;

  const myPassed = mySubmission?.passedCount ?? 0;
  const oppPassed = opponentSubmission?.passedCount ?? 0;

  const isForfeitWin = room.matchEndReason === 'opponent-forfeit' || (mySubmission?.code === '// Won by opponent forfeit');

  let isWinner = false;

  if (isForfeitWin) {
    isWinner = true;
  } else if (mySubmission && !opponentSubmission) {
    if (myPassed === totalCases) {
      isWinner = true;
    }
  } else if (myPassed > oppPassed) {
    isWinner = true;
  } else if (myPassed === oppPassed && myPassed > 0) {
    const myTime = mySubmission?.runtimeMs || 99999;
    const oppTime = opponentSubmission?.runtimeMs || 99999;
    isWinner = myTime <= oppTime;
  } else if (room.winnerUsername) {
    isWinner = room.winnerUsername === room.me?.name || room.winnerUsername === room.me?.username;
  }

  const currentRating = room.me?.rating !== undefined ? room.me.rating : 0;
  const tier = getRatingTier(currentRating);

  useEffect(() => {
    if (isWinner) {
      sounds.playSubmitSuccess();
    } else {
      sounds.playFail();
    }
  }, [isWinner]);

  const handleRematchClick = () => {
    setRequestedRematch(true);
    sounds.playClick();
    onRematch();
  };

  const showViewSolution = !isForfeitWin && (room.matchEndReason === 'accepted-submission' || Boolean(room.winningSolution));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
        
        {/* Victory / Defeat Header Badge */}
        <div className="mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 shadow-2xl ${
            isWinner
              ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-emerald-500/30'
              : 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-rose-500/30'
          }`}>
            {isWinner ? <Trophy className="w-10 h-10 animate-bounce" /> : <Frown className="w-10 h-10" />}
          </div>

          <h2 className={`text-3xl font-extrabold tracking-wider ${
            isWinner ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isWinner ? 'VICTORY! 🎉' : 'MATCH DEFEAT'}
          </h2>

          <p className="text-sm font-semibold text-slate-300 mt-2">
            {isForfeitWin
              ? 'The opponent left the match.'
              : isWinner
              ? 'You solved all test cases first!'
              : 'Keep practicing and challenge your opponent again!'}
          </p>

          {/* Rating Tier Badge */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${tier.bg} ${tier.color}`}>
              <span>{tier.badge}</span>
              <span>{tier.name} Tier</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 font-mono text-xs font-extrabold">
              <span className="text-slate-400">Rating:</span>
              <span className={isWinner ? 'text-emerald-400' : 'text-rose-400'}>
                {isWinner ? (isForfeitWin ? '+10 Rating (Forfeit)' : '+25 Rating') : '-10 Rating'}
              </span>
            </div>
          </div>
        </div>

        {/* 1v1 DUEL COMPARISON TABLE */}
        {isForfeitWin ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl mb-6 text-xs flex items-center justify-center gap-2 text-amber-300 font-mono font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Win Reason: Opponent Forfeited (Match Ended Early)</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-5 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-cyan-500/30">
              <div className="font-bold text-slate-400 text-[10px] uppercase mb-1">YOUR SCORE</div>
              <div className="text-xl font-mono font-extrabold text-cyan-300">
                {myPassed}/{totalCases}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Passed Test Cases
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-fuchsia-500/30">
              <div className="font-bold text-slate-400 text-[10px] uppercase mb-1">OPPONENT SCORE</div>
              <div className="text-xl font-mono font-extrabold text-fuchsia-300">
                {oppPassed}/{totalCases}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Passed Test Cases
              </div>
            </div>
          </div>
        )}

        {/* VIEW WINNER SOLUTION BUTTON (Only rendered for accepted submissions, NOT for forfeits!) */}
        {showViewSolution && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => { onViewSolution(); sounds.playClick(); }}
              className="w-full py-3 px-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 font-extrabold text-xs border border-purple-500/40 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>📜 VIEW WINNING SOLUTION</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onNewDuel(); sounds.playClick(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Lobby</span>
          </button>

          <button
            onClick={handleRematchClick}
            disabled={requestedRematch}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              requestedRematch
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20'
            }`}
          >
            {requestedRematch ? (
              <>
                <Hourglass className="w-4 h-4 text-amber-400 animate-spin" />
                <span>REMATCH REQUESTED...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Request Rematch</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
