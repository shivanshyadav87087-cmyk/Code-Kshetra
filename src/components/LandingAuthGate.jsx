import React, { useState } from 'react';
import { Swords, Code, BookOpen, Trophy, ChevronRight, Zap, Target, Award, ShieldCheck, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import { ExploreModal, DuelsInfoModal, ContestArenaModal } from './ExploreModals';
import InstallPwaButton from './InstallPwaButton';
import FestivalBanner from './FestivalBanner';
import { Button, Card, Badge } from './ui';

export default function LandingAuthGate({ isAuthenticated, player, onAuthSuccess, onSignOut }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [duelsModalOpen, setDuelsModalOpen] = useState(false);
  const [contestModalOpen, setContestModalOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    sounds.playClick();
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleDirectEnterArena = () => {
    sounds.playClick();
    sounds.playSubmitSuccess();

    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('codeclash_user') || 'null');
    } catch (e) {}

    const guestHandle = savedUser?.username || savedUser?.name || 'Coder_' + Math.floor(Math.random() * 899 + 100);
    const userObj = {
      id: savedUser?.id || savedUser?._id || ('user_' + Math.floor(Math.random() * 89999 + 10000)),
      email: savedUser?.email || '',
      username: guestHandle,
      name: guestHandle,
      rating: savedUser?.rating !== undefined ? savedUser.rating : 1200,
      avatarUrl: savedUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    localStorage.setItem('codeclash_token', savedUser?.token || 'guest_token_' + Date.now());
    localStorage.setItem('codeclash_user', JSON.stringify(userObj));

    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess(userObj);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F8FAFC] font-sans selection:bg-[#14B8A6]/30 selection:text-[#14B8A6] overflow-x-hidden flex flex-col">
      
      {/* 1. SINGLE UNIFIED NAVBAR */}
      <Navbar
        isAuthenticated={isAuthenticated}
        player={player}
        onOpenAuth={handleOpenAuth}
        onOpenLeaderboard={() => setAuthModalOpen(false)}
        onOpenProfile={() => setAuthModalOpen(false)}
        onOpenExplore={() => setExploreModalOpen(true)}
        onOpenDuels={() => setDuelsModalOpen(true)}
        onOpenContest={() => setContestModalOpen(true)}
        onSignOut={onSignOut}
      />

      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={onAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Feature Modals */}
      <ExploreModal
        isOpen={exploreModalOpen}
        onClose={() => setExploreModalOpen(false)}
        onStartPractice={handleDirectEnterArena}
      />

      <DuelsInfoModal
        isOpen={duelsModalOpen}
        onClose={() => setDuelsModalOpen(false)}
        onStartDuel={handleDirectEnterArena}
      />

      <ContestArenaModal
        isOpen={contestModalOpen}
        onClose={() => setContestModalOpen(false)}
        onRegisterContest={handleDirectEnterArena}
      />

      {/* 2. HERO SECTION (Min-Height 85vh) */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-[#0A0B0F] py-16 px-4 lg:px-8 border-b border-white/10 overflow-hidden">
        
        {/* Radial Hero Background Accent Glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-radial from-[#14B8A6]/10 via-transparent to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left 55%: Animated Dashboard Mockup Card */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex justify-center">
            <Card variant="glass" className="w-full max-w-xl p-6 border-white/15 animate-float-slow">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 font-mono text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#EAB308]" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <span className="font-bold text-[#14B8A6]">Code क्षेत्र Live Arena HUD</span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-5 font-mono">
                <div className="p-3 rounded-[12px] bg-[#1A1D26] border border-[#14B8A6]/30 text-left">
                  <span className="text-[10px] text-[#94A3B8] font-bold block uppercase">1v1 Rating</span>
                  <span className="text-lg font-black text-[#14B8A6]">1850 ELO</span>
                </div>
                <div className="p-3 rounded-[12px] bg-[#1A1D26] border border-[#22C55E]/30 text-left">
                  <span className="text-[10px] text-[#94A3B8] font-bold block uppercase">Solved</span>
                  <span className="text-lg font-black text-[#22C55E]">245 / 500</span>
                </div>
                <div className="p-3 rounded-[12px] bg-[#1A1D26] border border-[#8B5CF6]/30 text-left">
                  <span className="text-[10px] text-[#94A3B8] font-bold block uppercase">Win Rate</span>
                  <span className="text-lg font-black text-[#8B5CF6]">87.5%</span>
                </div>
              </div>

              {/* Recent Activity Stream */}
              <div className="space-y-2.5 font-sans text-xs">
                {[
                  { name: 'Two Sum Algorithm', status: 'Accepted ✅', color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30' },
                  { name: 'Longest Substring Without Repeating', status: 'Accepted ✅', color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30' },
                  { name: 'Trapping Rain Water (Hard)', status: 'Duel Won ⚔️ +25 ELO', color: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-[10px] bg-[#0A0B0F] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                      <span className="font-bold text-[#F8FAFC]">{item.name}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold border ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

            </Card>
          </div>

          {/* Right 45%: Hero Copy & Primary CTAs */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            
            <FestivalBanner />

            {/* Eyebrow Label */}
            <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-[#14B8A6] flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <span>Real-Time Competitive Coding Battleground</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.1] font-['Outfit']">
              A New Way to Learn & Duel
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#94A3B8] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              Code क्षेत्र is the premier platform to master LeetCode algorithms, test your code under time pressure, and compete in live 1v1 WebSocket duels.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleOpenAuth('register')}
                icon={Swords}
                className="w-full sm:w-auto"
              >
                Create Free Account 🚀
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleDirectEnterArena}
                className="w-full sm:w-auto"
              >
                Guest Quick Play ⚔️
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SOCIAL PROOF STRIP */}
      <section className="py-8 bg-[#111318] border-b border-white/10 text-center font-mono text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#14B8A6]">2,400+</span>
            <span>coders dueling daily</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#8B5CF6]">500+</span>
            <span>LeetCode problems</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#22C55E]">Live</span>
            <span>WebSocket sync</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES 3-COLUMN GRID */}
      <section className="py-20 px-6 bg-[#0A0B0F]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-[#F8FAFC] font-['Outfit']">
              Engineered for Competitive Developers
            </h2>
            <p className="text-sm text-[#94A3B8] font-sans">
              Built with WebSocket live state sync, Monaco Editor, and real-time ELO rating calculation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <Card
              variant="elevated"
              className="p-6 space-y-4 cursor-pointer group"
              onClick={() => setDuelsModalOpen(true)}
            >
              <div className="w-12 h-12 rounded-[14px] bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-lg font-bold text-[#F8FAFC]">1v1 Real-Time Duels</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Head-to-head live battles with real-time code sync, progress tracking, and instant testcase verification.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card
              variant="elevated"
              className="p-6 space-y-4 cursor-pointer group"
              onClick={() => setExploreModalOpen(true)}
            >
              <div className="w-12 h-12 rounded-[14px] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-lg font-bold text-[#F8FAFC]">LeetCode Judge & Monaco</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Full Monaco Editor shell supporting C++, Python, Java, JavaScript, TypeScript, and Go with custom testcase execution.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card
              variant="elevated"
              className="p-6 space-y-4 cursor-pointer group"
              onClick={() => setContestModalOpen(true)}
            >
              <div className="w-12 h-12 rounded-[14px] bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-lg font-bold text-[#F8FAFC]">Contest Arena & ELO Ladder</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Weekly algorithmic tournaments with ELO rating progression from Newbie to Specialist, Knight, and Guardian.
                </p>
              </div>
            </Card>

          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto bg-[#111318] border-t border-white/10 py-10 px-6 font-sans text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-black text-lg text-[#F8FAFC] tracking-wide font-['Outfit']">
                CODE <span className="font-['Noto_Sans_Devanagari']">क्षेत्र</span>
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              © 2026 Code क्षेत्र. All rights reserved. Real-Time Competitive Coding Platform.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <button onClick={() => setExploreModalOpen(true)} className="hover:text-[#14B8A6] cursor-pointer">Explore</button>
            <button onClick={() => setDuelsModalOpen(true)} className="hover:text-[#14B8A6] cursor-pointer">1v1 Duels</button>
            <button onClick={() => setContestModalOpen(true)} className="hover:text-[#14B8A6] cursor-pointer">Contest Arena</button>
          </div>

          {/* Single PWA Install Location */}
          <div>
            <InstallPwaButton />
          </div>

        </div>
      </footer>

    </div>
  );
}
