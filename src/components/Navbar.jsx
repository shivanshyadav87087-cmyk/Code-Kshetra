import React, { useState } from 'react';
import { Swords, Trophy, User, Shield, Volume2, VolumeX, LogOut, Code, ExternalLink, Settings, BookOpen, ChevronRight, Menu, X } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { getRatingTier } from '../engine/eloEngine';

export default function Navbar({
  isAuthenticated,
  player,
  room,
  onLeaveRoom,
  onOpenAuth,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenExplore,
  onOpenDuels,
  onOpenContest,
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
    <header className="bg-[#0A0B0F]/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl px-4 lg:px-6 py-3 font-sans selection:bg-[#14B8A6]/30 selection:text-[#14B8A6]">
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
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#14B8A6] via-emerald-400 to-[#8B5CF6] p-0.5 shadow-lg shadow-[#14B8A6]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A0B0F] rounded-[10px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wide flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#14B8A6] via-emerald-300 to-[#8B5CF6] bg-clip-text text-transparent font-['Outfit'] font-extrabold">CODE</span>
                <span className="text-[#F8FAFC] font-['Noto_Sans_Devanagari'] font-extrabold text-xl">क्षेत्र</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30 font-bold hidden sm:inline-block">
                1v1 Arena
              </span>
            </div>
          </div>

          {/* Center Links (Desktop Nav Links) */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#94A3B8]">
            <button
              onClick={() => { sounds.playClick(); if (onOpenExplore) onOpenExplore(); }}
              className="hover:text-[#14B8A6] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-[#14B8A6]" />
              <span>Explore</span>
            </button>
            
            <button
              onClick={() => { sounds.playClick(); if (onOpenDuels) onOpenDuels(); }}
              className="hover:text-[#14B8A6] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Swords className="w-4 h-4 text-[#14B8A6]" />
              <span>1v1 Duels</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); if (onOpenContest) onOpenContest(); }}
              className="hover:text-[#14B8A6] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              <span>Contest Arena</span>
            </button>
          </div>
        </div>

        {/* Center Room Code Pill (When in Active Match Room) */}
        {room && (
          <div className="hidden lg:flex items-center gap-3 bg-[#111318] px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="text-xs font-mono font-bold text-[#94A3B8]">ROOM:</span>
            <span className="font-mono font-black text-xs text-[#14B8A6] tracking-widest">
              {room.roomId}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-[10px] bg-[#111318] border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-[#14B8A6] transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#14B8A6]" /> : <VolumeX className="w-4 h-4 text-[#64748B]" />}
          </button>

          {/* Global Leaderboard Button */}
          <button
            onClick={() => { sounds.playClick(); if (onOpenLeaderboard) onOpenLeaderboard(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#111318] border border-white/10 hover:border-[#F59E0B]/40 text-[#F59E0B] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* SINGLE AUTH STATE UI SWITCHER */}
          {isAuthenticated ? (
            /* Logged-In User State: Profile Button + Sign Out (NO Sign In / Register buttons) */
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sounds.playClick(); if (onOpenProfile) onOpenProfile(); }}
                className="flex items-center gap-2.5 bg-[#111318] hover:bg-[#1A1D26] border border-white/10 hover:border-[#14B8A6]/40 px-3 py-1.5 rounded-[12px] transition-all cursor-pointer"
              >
                <img
                  src={avatarImage}
                  alt={player?.name || 'User Avatar'}
                  className="w-7 h-7 rounded-[8px] object-cover border border-[#14B8A6]/40 bg-[#0A0B0F]"
                />

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1">
                    <span>{player?.name || 'Coder'}</span>
                    {lcHandle && (
                      <span className="text-[10px] text-[#14B8A6] font-mono">(@{lcHandle})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <span className="text-[#22C55E] font-bold">{currentRating} ELO</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#8B5CF6] font-bold">{rankTier.name}</span>
                  </div>
                </div>
              </button>

              {/* Leave Room Button (Shown when in active match room - ONLY button shown) */}
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
                /* Sign Out Button (Shown ONLY when outside active match room) */
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onSignOut) onSignOut();
                  }}
                  className="p-2 rounded-[10px] bg-[#111318] border border-white/10 hover:border-[#EF4444]/40 text-[#94A3B8] hover:text-[#EF4444] transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* Logged-Out / Guest State: Sign In + Create Account Buttons ONLY */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="px-4 py-2 rounded-[10px] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-bold font-sans transition-colors cursor-pointer"
              >
                Sign In
              </button>
              
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenAuth) onOpenAuth('register');
                }}
                className="px-4 py-2 rounded-[10px] bg-[#14B8A6] hover:bg-[#0D9488] text-[#0A0B0F] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#14B8A6]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Create Account</span>
                <ChevronRight className="w-4 h-4 text-[#0A0B0F]" />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[10px] bg-[#111318] border border-white/10 text-[#94A3B8]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-3 font-sans text-xs">
          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenExplore) onOpenExplore(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#1A1D26] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <BookOpen className="w-4 h-4 text-[#14B8A6]" />
            <span>Explore Tracks</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenDuels) onOpenDuels(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#1A1D26] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <Swords className="w-4 h-4 text-[#14B8A6]" />
            <span>1v1 Speed Duels</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenContest) onOpenContest(); }}
            className="w-full text-left py-2 px-3 rounded-[8px] hover:bg-[#1A1D26] text-[#F8FAFC] flex items-center gap-2 font-bold"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>Contest Arena</span>
          </button>
        </div>
      )}
    </header>
  );
}
