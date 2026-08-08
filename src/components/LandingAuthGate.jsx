import React, { useState, useEffect, useRef } from 'react';
import { Swords, Lock, User, Key, ArrowRight, Camera, Code, Sparkles, Upload, CheckCircle2, AlertCircle, Loader2, Mail, Flame, RefreshCw, KeyRound, ShieldCheck, ChevronRight, BookOpen, Trophy, Globe, Code2 } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';
import FestivalBanner from './FestivalBanner';
import InstallPwaButton from './InstallPwaButton';
import AuthModal from './AuthModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LandingAuthGate({ onAuthSuccess }) {
  // Layer Step State: 1 = Clean Landing Page, 2 = Unique Handle Setup & Enter Contest
  const [step, setStep] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState('register'); // 'register' or 'login'

  const [email, setEmail] = useState('');
  const [userProfileData, setUserProfileData] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('Competitive Coder ⚔️ | LeetCode Challenger');
  const [location, setLocation] = useState('India 🇮🇳');
  const [handleStatus, setHandleStatus] = useState({ checking: false, available: true, error: null });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Photo file upload from device via FileReader
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result);
        sounds.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Auth Modal in Register Mode
  const handleOpenSignUp = () => {
    sounds.playClick();
    setAuthModalInitialMode('register');
    setAuthModalOpen(true);
  };

  // Open Auth Modal in Sign In Mode
  const handleOpenSignIn = () => {
    sounds.playClick();
    setAuthModalInitialMode('login');
    setAuthModalOpen(true);
  };

  // Callback when AuthModal completes sign up or sign in successfully
  const handleAuthModalSuccess = (userObj) => {
    setUserProfileData(userObj);
    if (userObj && userObj.username) {
      setUsernameInput(userObj.username);
    } else if (userObj && userObj.email) {
      setUsernameInput(userObj.email.split('@')[0]);
    }
    setStep(2); // Advance to Layer 2 handle setup & avatar selection
  };

  // Debounced Live Unique Username Check for Layer 2
  useEffect(() => {
    if (step !== 2) return;
    const cleanHandle = usernameInput.trim();
    if (!cleanHandle || cleanHandle.length < 3 || cleanHandle.length > 20) {
      setHandleStatus({ checking: false, available: false, error: 'Username must be 3-20 characters long.' });
      return;
    }

    setHandleStatus({ checking: true, available: true, error: null });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/check-handle?handle=${encodeURIComponent(cleanHandle)}`);
        const data = await res.json();
        if (data.available || (userProfileData && userProfileData.username === cleanHandle)) {
          setHandleStatus({ checking: false, available: true, error: null });
        } else {
          setHandleStatus({ checking: false, available: false, error: data.error || 'This handle is already taken. Choose another!' });
        }
      } catch (e) {
        setHandleStatus({ checking: false, available: true, error: null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [usernameInput, step, userProfileData]);

  // LAYER 2: Submit Unique Handle & Enter Contest
  const handleEnterContestSubmit = async (e) => {
    e.preventDefault();
    const finalHandle = usernameInput.trim();
    if (!finalHandle || finalHandle.length < 3) return;

    setLoading(true);
    sounds.playClick();

    const currentUser = userProfileData || JSON.parse(localStorage.getItem('codeclash_user') || '{}');
    const updatedUser = {
      ...currentUser,
      username: finalHandle,
      name: finalHandle,
      avatarUrl: avatarUrl || currentUser.avatarUrl,
      bio: bio || currentUser.bio,
      location: location || currentUser.location
    };

    localStorage.setItem('codeclash_user', JSON.stringify(updatedUser));

    try {
      if (currentUser.email || email) {
        await fetch(`${BACKEND_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email || email,
            username: finalHandle,
            avatarUrl: avatarUrl || currentUser.avatarUrl,
            bio: bio || currentUser.bio,
            location: location || currentUser.location
          })
        });
      }
    } catch (err) {
      console.warn('Profile update fallback:', err);
    } finally {
      setLoading(false);
      sounds.playSubmitSuccess();
      onAuthSuccess(updatedUser);
    }
  };

  const displayAvatar = avatarUrl || userProfileData?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  // LAYER 2 SETUP VIEW (Handle, Avatar & Contest Entry)
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#141822] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Background Animated Glow Grids */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-emerald-600/20 to-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-xl bg-[#1e2330] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-6 sm:p-8 my-6">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto mb-3">
              <div className="w-full h-full bg-[#141822] rounded-[14px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-7 h-7" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-wide">
              <span>Complete Your Coder Profile ⚔️</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Choose your unique handle, custom avatar, and enter the contest arena!
            </p>
          </div>

          <form onSubmit={handleEnterContestSubmit} className="space-y-5">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img
                  src={displayAvatar}
                  alt="Coder Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileUpload}
                className="hidden"
              />
              <span className="text-[11px] text-cyan-400 font-sans font-bold hover:underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                📸 Upload Custom Avatar Photo
              </span>
            </div>

            {/* Unique Handle Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans font-bold">
                <label className="text-slate-300">Unique Coder Handle</label>
                {handleStatus.checking ? (
                  <span className="text-cyan-400 text-[10px] flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking handle...
                  </span>
                ) : handleStatus.error ? (
                  <span className="text-rose-400 text-[10px] font-sans font-bold">{handleStatus.error}</span>
                ) : (
                  <span className="text-emerald-400 text-[10px] font-sans font-bold">✓ Handle Available</span>
                )}
              </div>
              <input
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. CodeMaster99"
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 outline-none"
              />
            </div>

            {/* LeetCode Username */}
            <div className="space-y-1">
              <label className="text-xs font-sans text-slate-300 font-bold">LeetCode Username (Optional)</label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. alex_leet"
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 outline-none"
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-1">
              <label className="text-xs font-sans text-slate-300 font-bold">Country / Flag</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#141822] border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm font-sans text-slate-100 outline-none"
              >
                {COUNTRIES.map((c, i) => (
                  <option key={i} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !handleStatus.available}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-teal-500/20 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-950" /> : <span>Enter Arena & Join Duels ⚔️</span>}
            </button>

          </form>

        </div>
      </div>
    );
  }

  // LAYER 1: MAIN CLEAN LANDING PAGE
  return (
    <div className="min-h-screen bg-[#141822] text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden">
      
      {/* Pop-up Auth Modal Overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthModalSuccess}
        initialMode={authModalInitialMode}
      />

      {/* 1. TOP LEETCODE NAVIGATION BAR */}
      <nav className="w-full bg-[#181c28]/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#141822] rounded-[10px] flex items-center justify-center">
                <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-5 h-5" />
              </div>
            </div>
            <span className="font-black text-xl tracking-wide flex items-center gap-1">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
              <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold text-xl">क्षेत्र</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 font-sans">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Explore
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> 1v1 Duels
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Contest Arena
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InstallPwaButton />

          <button
            onClick={handleOpenSignIn}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Sign In
          </button>
          
          <button
            onClick={handleOpenSignUp}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Account</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. LEETCODE-STYLE HERO DIAGONAL SECTION ("A New Way to Learn") */}
      <section className="relative w-full bg-[#1a1e2b] pt-16 pb-28 border-b border-slate-800/80 leetcode-skew-banner overflow-hidden">
        
        {/* Background Glow Accents */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: 3D Tablet Mockup & Dashboard Illustration */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-lg bg-[#202636] border-4 border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-cyan-950/40 relative animate-float-slow">
              
              {/* Tablet Header Dots */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-auto text-[10px] font-sans text-slate-400">Code क्षेत्र Arena Dashboard</span>
              </div>

              {/* Tablet Content Preview Mockup */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="h-16 rounded-xl bg-cyan-500/20 border border-cyan-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-cyan-300 font-sans font-bold">1v1 Rating</span>
                  <span className="text-base font-black text-cyan-400 font-sans">1850 ELO</span>
                </div>
                <div className="h-16 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-300 font-sans font-bold">Solved</span>
                  <span className="text-base font-black text-emerald-400 font-sans">245 / 500</span>
                </div>
                <div className="h-16 rounded-xl bg-purple-500/20 border border-purple-500/30 p-2 flex flex-col justify-between">
                  <span className="text-[10px] text-purple-300 font-sans font-bold">Win Rate</span>
                  <span className="text-base font-black text-purple-400 font-sans">87.5%</span>
                </div>
              </div>

              {/* Progress List Items */}
              <div className="space-y-2.5">
                {[
                  { name: 'Two Sum Algorithm', status: 'Accepted 🟢', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
                  { name: 'Longest Substring', status: 'Accepted 🟢', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
                  { name: 'Trapping Rain Water', status: 'Duel Won ⚔️', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold text-slate-200 font-sans">{item.name}</span>
                    </div>
                    <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border font-extrabold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: LeetCode Hero Headline & Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            
            <FestivalBanner />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans">
              A New Way to Learn & Duel
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              Code क्षेत्र is the best platform to help you enhance your skills, expand your knowledge, solve LeetCode algorithms, and prepare for technical duels.
            </p>

            <div className="pt-2">
              <button
                onClick={handleOpenSignUp}
                className="px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 font-sans"
              >
                <span>Create Account</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LEETCODE-STYLE "START EXPLORING" FEATURE SECTION */}
      <section className="relative w-full bg-[#141822] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Description */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <BookOpen className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight font-sans">
                Start Exploring
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0 font-sans">
              Explore is a well-organized tool that helps you get the most out of Code क्षेत्र by providing structure to guide your progress towards the next step in your programming career.
            </p>

            <button
              onClick={handleOpenSignUp}
              className="inline-flex items-center gap-1.5 text-teal-400 font-extrabold text-sm hover:underline cursor-pointer pt-2 group font-sans"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Floating Cards Feature Showcase */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl hover:border-cyan-500/40 transition-all font-sans">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">1v1 Real-Time Duels</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Race head-to-head against rival coders with live WebSocket code sync and real-time execution.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl hover:border-emerald-500/40 transition-all font-sans">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">LeetCode Editor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monaco Editor with LeetCode theme, line ligatures, Big-O complexity analyzer, and testcase judge.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
