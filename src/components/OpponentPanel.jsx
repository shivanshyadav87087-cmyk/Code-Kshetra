import React, { useState, useEffect } from 'react';
import { Timer, Swords, UserCheck, Bot, Zap, CheckCircle2, Trophy, Activity, Clock, MessageSquare, Share2, Eye, Hourglass } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function OpponentPanel({
  room,
  myProgress,
  opponentProgress,
  timeLimitMinutes,
  onTimeExpired,
  onOpenChat,
  onOpenShare,
  unreadChatCount,
  isSpectator,
  spectateTarget,
  onSwitchSpectateTarget
}) {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(timeLimitMinutes * 60);

  // Server-Authoritative Synchronized Countdown Timer Calculation
  useEffect(() => {
    const isWaiting = room?.status === 'waiting-for-players' || !room?.matchStartTime;

    if (isWaiting) {
      setTimeLeftSeconds(timeLimitMinutes * 60);
      return;
    }

    const matchStartTime = room.matchStartTime;
    const totalDurationMs = timeLimitMinutes * 60 * 1000;

    const computeTime = () => {
      const elapsedMs = Date.now() - matchStartTime;
      const remainingMs = totalDurationMs - elapsedMs;
      const seconds = Math.max(0, Math.floor(remainingMs / 1000));
      
      setTimeLeftSeconds(seconds);

      if (seconds <= 10 && seconds > 0) {
        sounds.playTick();
      }

      if (seconds <= 0) {
        onTimeExpired();
      }
    };

    computeTime();
    const timer = setInterval(computeTime, 1000);

    return () => clearInterval(timer);
  }, [timeLimitMinutes, room?.matchStartTime, room?.status, room?.roomId]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeftSeconds <= 60 && room?.status === 'in-progress';

  const totalCases = room?.problem?.testCases?.length || 4;
  const isWaitingForOpponent = room?.status === 'waiting-for-players';

  const hostName = room?.host?.username || room?.host?.name || 'Player 1 (Host)';
  const guestName = room?.isBot ? 'DevBot AI 🤖' : (room?.guest?.username || room?.guest?.name || 'Player 2 (Guest)');
  const spectatorCount = room?.spectators?.length || 0;

  const myName = room?.me?.name || room?.me?.username || 'You';
  const isHost = Boolean(room?.host?.username === myName || room?.host?.name === myName || (room?.me?.id && room?.host?.id === room?.me?.id));

  let opponentName = 'Waiting for Opponent...';
  if (room?.isBot) {
    opponentName = 'DevBot AI 🤖';
  } else if (isHost) {
    opponentName = room?.guest?.username || room?.guest?.name || 'Player 2 (Guest)';
  } else {
    opponentName = room?.host?.username || room?.host?.name || 'Player 1 (Host)';
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-xl backdrop-blur-md font-sans">
      
      {/* SPECTATOR HUD BAR */}
      {isSpectator ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold shrink-0">
              <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>LIVE SPECTATOR</span>
              <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800 font-mono">
                👀 {spectatorCount}/3 Watching
              </span>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold flex-1 md:flex-none">
              <button
                type="button"
                onClick={() => onSwitchSpectateTarget('host')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  spectateTarget === 'host'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👤 {hostName}</span>
                {spectateTarget === 'host' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => onSwitchSpectateTarget('guest')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  spectateTarget === 'guest'
                    ? 'bg-fuchsia-500 text-white font-bold shadow-md shadow-fuchsia-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👤 {guestName}</span>
                {spectateTarget === 'guest' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {isWaitingForOpponent ? (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono font-semibold animate-pulse">
                <Hourglass className="w-3.5 h-3.5 text-amber-400" />
                <span>Waiting for Player 2 to Join...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🟢 Live Match in Progress</span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-extrabold text-sm">{formattedTime}</span>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD 1v1 MATCHUP HUD */
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Left: Matchup */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* YOU */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl px-3 py-1.5 min-w-[160px]">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-xs shrink-0">
                YOU
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-100 truncate">
                  {room?.me?.name || room?.me?.username || 'You'}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {isWaitingForOpponent ? 'Waiting...' : (myProgress?.status || 'Coding...')}
                </div>
              </div>
            </div>

            <div className="font-extrabold text-xs text-slate-600 uppercase tracking-widest shrink-0">
              VS
            </div>

            {/* OPPONENT */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-fuchsia-500/30 rounded-xl px-3 py-1.5 min-w-[170px]">
              <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center font-bold text-fuchsia-300 text-xs shrink-0">
                {room?.isBot ? <Bot className="w-3.5 h-3.5" /> : <Swords className="w-3.5 h-3.5" />}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-100 truncate">
                  {opponentName}
                </div>
                <div className={`text-[10px] font-mono ${isWaitingForOpponent ? 'text-amber-400 animate-pulse font-bold' : 'text-fuchsia-400'}`}>
                  {isWaitingForOpponent ? '⌛ Opponent Joining...' : (opponentProgress?.status || 'Coding...')}
                </div>
              </div>
            </div>

            {spectatorCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>👀 {spectatorCount}/3</span>
              </div>
            )}
          </div>

          {/* Center: Timer & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isWaitingForOpponent ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs animate-pulse">
                <Hourglass className="w-4 h-4 text-amber-400" />
                <span>WAITING FOR OPPONENT TO JOIN...</span>
              </div>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                isUrgent
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-cyan-300'
              }`} title="Server-Authoritative Match Countdown">
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-cyan-400'}`} />
                <span className="font-mono font-extrabold text-base tracking-wider">
                  {formattedTime}
                </span>
              </div>
            )}

            <button
              onClick={() => { onOpenShare(); sounds.playClick(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Share Room Link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => { onOpenChat(); sounds.playClick(); }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all"
              title="Opponent Live Chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Chat</span>
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-md">
                  {unreadChatCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Live Progress Comparison */}
          <div className="flex items-center gap-3 w-full lg:w-auto min-w-[220px]">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Your Passes</span>
                <span className="text-cyan-300 font-bold">{myProgress?.passed || 0}/{totalCases}</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.round(((myProgress?.passed || 0) / totalCases) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Opponent Passes</span>
                <span className="text-fuchsia-300 font-bold">{opponentProgress?.passed || 0}/{totalCases}</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.round(((opponentProgress?.passed || 0) / totalCases) * 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
