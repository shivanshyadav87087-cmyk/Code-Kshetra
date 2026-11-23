import React, { useState } from 'react';
import { Swords, Trophy, User, Shield, Volume2, VolumeX, LogOut, Code, ExternalLink, Settings, BookOpen, ChevronRight, Menu, X, MessageSquare, HelpCircle, Snowflake } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { getRatingTier } from '../engine/eloEngine';
import LiveUsersBadge from './LiveUsersBadge';

export default function Navbar({
  isAuthenticated,
  player,
  room,
  snowEnabled = true,
  onToggleSnow,
  onLeaveRoom,
  onOpenAuth,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenExplore,
  onOpenDuels,
  onOpenContest,
  onOpenReview,
  onOpenSupport,
  onSignOut
}) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-[#0A0E1A]/90 border-b border-sky-500/20 sticky top-0 z-40 backdrop-blur-xl px-4 lg:px-6 py-3 font-sans selection:bg-sky-500/30 selection:text-sky-300 shadow-sm shadow-sky-950/40">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        
        {/* Left: Brand Logo & 1v1 Pill */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              sounds.playClick();
              if (room && onLeaveRoom) onLeaveRoom();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-sky-400 via-cyan-300 to-blue-500 p-0.5 shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wide flex items-center gap-1">
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent font-['Outfit'] font-extrabold">CODE</span>
                <span className="text-[#F8FAFC] font-['Noto_Sans_Devanagari'] font-extrabold text-xl">क्षेत्र</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-200 border border-sky-400/30 font-bold hidden sm:inline-flex items-center gap-1 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <Snowflake className="w-2.5 h-2.5 text-sky-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Winter 1v1</span>
              </span>
            </div>
          </div>

          {/* Center Links (Desktop Nav Links) */}
          <div className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-300">
            <LiveUsersBadge />

            <button
              onClick={() => { sounds.playClick(); if (onOpenExplore) onOpenExplore(); }}
              className="hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Explore</span>
            </button>
            
            <button
              onClick={() => { sounds.playClick(); if (onOpenDuels) onOpenDuels(); }}
              className="hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>1v1 Duels</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); if (onOpenContest) onOpenContest(); }}
              className="hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Contest Arena</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); if (onOpenReview) onOpenReview(); }}
              className="hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); if (onOpenSupport) onOpenSupport(); }}
              className="hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Support</span>
            </button>
          </div>
        </div>

        {/* Center Room Code Pill (When in Active Match Room) */}
        {room && (
          <div className="hidden lg:flex items-center gap-3 bg-[#0B132B] px-4 py-1.5 rounded-full border border-sky-500/30 shadow-inner">
            <span className="text-xs font-mono font-bold text-slate-400">ROOM:</span>
            <span className="font-mono font-black text-xs text-sky-300 tracking-widest">
              {room.roomId}
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,1)]" />
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Snowfall Effect Toggle */}
          {onToggleSnow && (
            <button
              onClick={() => {
                sounds.playClick();
                onToggleSnow();
              }}
              className={`p-2 rounded-[10px] border transition-all cursor-pointer ${
                snowEnabled
                  ? 'bg-sky-500/15 border-sky-400/50 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'bg-[#0B132B] border-white/10 text-slate-500 hover:text-slate-300'
              }`}
              title={snowEnabled ? 'Pause Snowfall Effect ❄️' : 'Enable Snowfall Effect ❄️'}
            >
              <Snowflake className={`w-4 h-4 ${snowEnabled ? 'text-sky-300 animate-pulse' : 'text-slate-500'}`} />
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-[10px] bg-[#0B132B] border border-sky-500/20 hover:border-sky-400/40 text-slate-400 hover:text-sky-300 transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Global Leaderboard Button */}
          <button
            onClick={() => { sounds.playClick(); if (onOpenLeaderboard) onOpenLeaderboard(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#0B132B] border border-sky-500/20 hover:border-amber-400/40 text-amber-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* SINGLE AUTH STATE UI SWITCHER */}
          {isAuthenticated ? (
            /* Logged-In User State: Profile Button + Sign Out */
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sounds.playClick(); if (onOpenProfile) onOpenProfile(); }}
                className="flex items-center gap-2.5 bg-[#0B132B] hover:bg-[#111C38] border border-sky-500/30 hover:border-sky-400/60 px-3 py-1.5 rounded-[12px] transition-all cursor-pointer"
              >
                <img
                  src={avatarImage}
                  alt={player?.name || 'User Avatar'}
                  className="w-7 h-7 rounded-[8px] object-cover border border-sky-400/40 bg-[#0A0B0F]"
                />

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1">
                    <span>{player?.name || 'Coder'}</span>
                    {lcHandle && (
                      <span className="text-[10px] text-sky-300 font-mono">(@{lcHandle})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <span className="text-sky-300 font-bold">{currentRating} ELO</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-blue-300 font-bold">{rankTier.name}</span>
                  </div>
                </div>
              </button>

              {/* Leave Room Button (Shown when in active match room) */}
              {room ? (
                <button
                  onClick={() => { sounds.playClick(); if (onLeaveRoom) onLeaveRoom(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Leave Current Room"
                >
                  <LogOut className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-sans font-bold">Leave Room</span>
                </button>
              ) : (
                /* Sign Out Button */
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onSignOut) onSignOut();
                  }}
                  className="p-2 rounded-[10px] bg-[#0B132B] border border-sky-500/20 hover:border-rose-400/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* Logged-Out / Guest State: Sign In + Create Account Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="px-4 py-2 rounded-[10px] text-slate-300 hover:text-[#F8FAFC] text-xs font-bold font-sans transition-colors cursor-pointer"
              >
                Sign In
              </button>
              
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenAuth) onOpenAuth('register');
                }}
                className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 hover:from-sky-300 hover:via-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Create Account</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[10px] bg-[#0B132B] border border-sky-500/20 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-sky-500/20 mt-3 space-y-3 font-sans text-xs">
          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenExplore) onOpenExplore(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#111C38] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Explore Tracks</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenDuels) onOpenDuels(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#111C38] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>1v1 Speed Duels</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenContest) onOpenContest(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#111C38] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Contest Arena</span>
          </button>
        </div>
      )}
    </header>
  );
}
