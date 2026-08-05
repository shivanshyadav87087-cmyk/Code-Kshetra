import React from 'react';
import { Swords, Trophy, User, Shield, Volume2, VolumeX, LogOut, Code, ExternalLink, Settings } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { getRatingTier } from '../engine/eloEngine';

export default function Navbar({ player, setPlayer, room, onLeaveRoom, onOpenAuth, onOpenLeaderboard, onOpenProfile, onSignOut }) {
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setMuted(!next);
    if (next) sounds.playClick();
  };

  const lcHandle = player?.leetcodeUsername;
  const avatarImage = player?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const currentRating = player?.rating || 0;
  const rankTier = getRatingTier(currentRating);

  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-xl px-4 py-3 font-sans">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onLeaveRoom && room && onLeaveRoom()}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wide flex items-center gap-1">
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
                <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold text-xl">क्षेत्र</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                1v1 Duel Arena
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-mono">
              Real-Time Competitive Coding Battleground
            </p>
          </div>
        </div>

        {/* Center: Current Room Status */}
        {room && (
          <div className="hidden md:flex items-center gap-3 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">ROOM CODE:</span>
            <span className="font-mono font-extrabold text-xs text-cyan-300 tracking-wider">
              {room.roomId}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Global Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* User Profile / Status Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded-2xl transition-all cursor-pointer"
          >
            <img
              src={avatarImage}
              alt={player?.name || 'User Avatar'}
              className="w-7 h-7 rounded-xl object-cover border border-cyan-500/30"
            />

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>{player?.name || 'Guest Coder'}</span>
                {lcHandle && (
                  <span className="text-[10px] text-cyan-400 font-mono">(@{lcHandle})</span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{currentRating} ELO</span>
                <span className="text-slate-500">•</span>
                <span className="text-purple-300 font-bold">{rankTier.name}</span>
              </div>
            </div>
          </button>

          {/* Leave Room / Forfeit Match Button */}
          {room && (
            <button
              onClick={onLeaveRoom}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
              title="Leave Current Room"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Leave Room</span>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
