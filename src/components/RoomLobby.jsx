import React, { useState, useEffect } from 'react';
import { Swords, Bot, Shield, Clock, PlusCircle, LogIn, Search, Tag, Key, Sparkles, Hash, CheckCircle2, Eye, AlertCircle, Lock, Loader2, Info, RotateCcw, Heart, UserCheck } from 'lucide-react';
import { TOPICS, DIFFICULTIES } from '../data/topics';
import { PROBLEM_BANK } from '../data/problemBank';
import { sounds } from '../engine/soundManager';
import FestivalBanner from './FestivalBanner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function RoomLobby({ onCreateRoom, onJoinRoom, player, setPlayer }) {
  const [activeTab, setActiveTab] = useState('create');
  
  const [userName, setUserName] = useState(player?.name || '');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [timeLimit, setTimeLimit] = useState(10);
  const [roomPassword, setRoomPassword] = useState('');
  const [isBotMatch, setIsBotMatch] = useState(false);

  const [problemQuery, setProblemQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  const [spectatorPrompt, setSpectatorPrompt] = useState(null);

  // One-time Handle Setup Modal State
  const [newHandleInput, setNewHandleInput] = useState('');
  const [showHandleSetupModal, setShowHandleSetupModal] = useState(false);
  const [handleStatus, setHandleStatus] = useState({ checking: false, available: true, error: null });
  const [savingHandle, setSavingHandle] = useState(false);

  // Sync player username on mount
  useEffect(() => {
    if (player && player.name) {
      setUserName(player.name);
    }
    setShowHandleSetupModal(false);
  }, [player?.name]);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room') || urlParams.get('code');
      if (roomParam) {
        const cleanCode = roomParam.trim().toUpperCase();
        setJoinRoomId(cleanCode);
        setActiveTab('join');
      }
    } catch (e) {}
  }, []);

  const handleTrimmed = (showHandleSetupModal ? newHandleInput : userName).replace(/<[^>]*>?/gm, '').trim();
  const isNameTooShort = handleTrimmed.length > 0 && handleTrimmed.length < 3;
  const isNameTooLong = handleTrimmed.length > 20;
  const isNameValid = handleTrimmed.length >= 3 && handleTrimmed.length <= 20 && handleStatus.available;

  // Mutual exclusion flags
  const isTopicOrDifficultySelected = selectedTopic !== 'all' || selectedDifficulty !== 'all';
  const isCustomProblemSelected = selectedProblem !== null;

  // Debounced Live Handle Availability Check (400ms)
  useEffect(() => {
    if (!showHandleSetupModal) return;
    if (!handleTrimmed || handleTrimmed.length < 3 || handleTrimmed.length > 20) {
      setHandleStatus({ checking: false, available: false, error: null });
      return;
    }

    setHandleStatus({ checking: true, available: true, error: null });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/check-handle?handle=${encodeURIComponent(handleTrimmed)}`);
        const data = await res.json();
        if (data.available) {
          setHandleStatus({ checking: false, available: true, error: null });
        } else {
          setHandleStatus({ checking: false, available: false, error: data.error || 'This handle is already taken. Please choose a different handle.' });
        }
      } catch (e) {
        setHandleStatus({ checking: false, available: true, error: null });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [handleTrimmed, showHandleSetupModal]);

  const handleSavePermanentHandle = async (e) => {
    e.preventDefault();
    if (!isNameValid || handleTrimmed.length < 3) return;

    setSavingHandle(true);
    sounds.playClick();

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: player?.email,
          username: handleTrimmed
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save handle');

      const updatedName = data.user?.username || handleTrimmed;
      setUserName(updatedName);
      setPlayer(prev => {
        const updated = { ...prev, name: updatedName };
        localStorage.setItem('codeclash_user', JSON.stringify(updated));
        return updated;
      });

      setShowHandleSetupModal(false);
      sounds.playSubmitSuccess();
    } catch (err) {
      if (!player?.email || err.message?.toLowerCase().includes('not found')) {
        localStorage.removeItem('codeclash_token');
        localStorage.removeItem('codeclash_user');
        window.location.reload();
        return;
      }
      alert(err.message);
      sounds.playFail();
    } finally {
      setSavingHandle(false);
    }
  };

  const triggerFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const filteredProblems = PROBLEM_BANK.filter(p => {
    if (isTopicOrDifficultySelected) return false;
    const q = problemQuery.trim().toLowerCase();
    if (!q) return false;
    return (
      p.title.toLowerCase().includes(q) ||
      String(p.number).includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q)
    );
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    let nameToUse = (userName || '').trim();
    if (!nameToUse || nameToUse.length < 3) {
      nameToUse = player?.email ? player.email.split('@')[0] : 'Coder_' + Math.floor(Math.random() * 899 + 100);
      setUserName(nameToUse);
      if (typeof setPlayer === 'function') {
        setPlayer(prev => ({ ...prev, name: nameToUse }));
      }
    }

    // Pre-check combined problem pool availability if specific question is not picked
    if (!selectedProblem && (selectedTopic !== 'all' || selectedDifficulty !== 'all')) {
      const matchingPool = PROBLEM_BANK.filter(p => {
        const tMatch = selectedTopic === 'all' || p.topic.toLowerCase().includes(selectedTopic.toLowerCase());
        const dMatch = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        return tMatch && dMatch;
      });

      if (matchingPool.length === 0) {
        sounds.playFail();
        alert(`No problems available for Topic "${selectedTopic.toUpperCase()}" with Difficulty "${selectedDifficulty.toUpperCase()}". Please select a different topic or difficulty combination!`);
        return;
      }
    }

    triggerFullscreen();
    sounds.playClick();

    onCreateRoom({
      userName: nameToUse,
      topic: selectedProblem ? selectedProblem.topic : selectedTopic,
      difficulty: selectedProblem ? selectedProblem.difficulty : selectedDifficulty,
      timeLimit: Number(timeLimit),
      password: roomPassword,
      isBot: isBotMatch,
      customProblem: selectedProblem
    });
  };

  const handleJoinSubmit = (e, asSpectator = false) => {
    e.preventDefault();
    let nameToUse = (userName || '').trim();
    if (!nameToUse || nameToUse.length < 3) {
      nameToUse = player?.email ? player.email.split('@')[0] : 'Coder_' + Math.floor(Math.random() * 899 + 100);
      setUserName(nameToUse);
      if (typeof setPlayer === 'function') {
        setPlayer(prev => ({ ...prev, name: nameToUse }));
      }
    }

    if (!joinRoomId.trim()) {
      alert('Please enter a valid Room Code.');
      return;
    }

    if (!asSpectator) triggerFullscreen();
    sounds.playClick();

    onJoinRoom({
      roomId: joinRoomId.trim().toUpperCase(),
      password: joinPassword,
      userName: userName,
      asSpectator
    }, (res) => {
      if (res && !res.success) {
        sounds.playFail();
        if (res.canSpectate) {
          setSpectatorPrompt({
            roomId: joinRoomId.trim().toUpperCase(),
            message: res.error || 'Room player slots full (2/2). Would you like to join as a Spectator?'
          });
        } else {
          alert(res.error || 'Failed to join room.');
        }
      }
    });
  };

  const handleResetTopicDifficulty = () => {
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    sounds.playClick();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 relative max-w-5xl mx-auto w-full font-sans">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="text-center mb-8 space-y-2 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-mono font-bold uppercase tracking-widest">
          <Swords className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Real-Time 1v1 Code Arena</span>
        </div>

        {/* Dynamic Festival & Holiday Greetings Banner */}
        <FestivalBanner />

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight flex items-center justify-center gap-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-300">CODE</span>
          <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold">क्षेत्र</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-mono">
          Challenge rival coders in live speed duels on Code क्षेत्र. Execute code in real-time, solve LeetCode algorithms, and climb the global ELO ladder!
        </p>
      </div>

      {/* Main Lobby Card */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Permanent Player Handle Badge */}
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 px-5 py-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400 font-mono">Permanent Arena Handle</div>
              <div className="text-base font-extrabold text-slate-100 font-mono flex items-center gap-2">
                <span>{userName || 'Anonymous Coder'}</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400 inline" />
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl font-bold">
            Saved & Locked 🔒
          </div>
        </div>

        {/* Tab Navigation (Create Room vs Join Room) */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => {
              setActiveTab('create');
              sounds.playClick();
            }}
            className={`flex-1 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 btn-glow transition-all ${
              activeTab === 'create'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5 text-cyan-400" />
            <span>Create 1v1 Duel Room</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('join');
              sounds.playClick();
            }}
            className={`flex-1 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 btn-glow transition-all ${
              activeTab === 'join'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4.5 h-4.5 text-emerald-400" />
            <span>Join Existing Room</span>
          </button>
        </div>

        {/* CREATE ROOM FORM */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            
            {/* MUTUAL EXCLUSION BANNERS */}
            {isCustomProblemSelected ? (
              <div className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-sm font-mono text-cyan-300 font-bold">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Custom Question Selected (Topic & Difficulty Locked)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProblem(null);
                      setProblemQuery('');
                      sounds.playClick();
                    }}
                    className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl text-xs font-bold btn-glow-rose transition-all cursor-pointer"
                  >
                    Clear Custom Question ✕
                  </button>
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center gap-3">
                  <span>Selected: <strong className="text-cyan-200">{selectedProblem.number}. {selectedProblem.title}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span>Topic: <strong className="text-emerald-300">{selectedProblem.topic}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span>Difficulty: <strong className="text-amber-300">{selectedProblem.difficulty}</strong></span>
                </div>
              </div>
            ) : isTopicOrDifficultySelected ? (
              <div className="bg-purple-950/40 border border-purple-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-sm font-mono text-purple-300 font-bold">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>Topic / Difficulty Filter Active (Specific Question Search Disabled)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetTopicDifficulty}
                    className="text-purple-200 hover:text-white bg-purple-900/80 hover:bg-purple-800 px-3 py-1 rounded-xl text-xs font-bold btn-glow-purple transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
                    <span>Reset Topic & Difficulty to All</span>
                  </button>
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center gap-3">
                  <span>Selected Topic: <strong className="text-cyan-300">{selectedTopic.toUpperCase()}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span>Selected Difficulty: <strong className="text-amber-300">{selectedDifficulty.toUpperCase()}</strong></span>
                </div>
              </div>
            ) : null}

            {/* Topic & Difficulty Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Topic Selector */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>Problem Topic / Category</span>
                  </span>
                  {isCustomProblemSelected && <span className="text-xs text-amber-400 font-bold">Locked by Question</span>}
                </label>

                <select
                  disabled={isCustomProblemSelected}
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    if (selectedProblem) {
                      setSelectedProblem(null);
                      setProblemQuery('');
                    }
                    sounds.playClick();
                  }}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-cyan-300 outline-none transition-all cursor-pointer ${
                    isCustomProblemSelected ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : 'focus:border-cyan-500/50 hover:border-slate-700'
                  }`}
                >
                  <option value="all">Select Topic (All Categories)</option>
                  {TOPICS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selector */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Difficulty Level</span>
                  </span>
                  {isCustomProblemSelected && <span className="text-xs text-amber-400 font-bold">Locked by Question</span>}
                </label>

                <select
                  disabled={isCustomProblemSelected}
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    if (selectedProblem) {
                      setSelectedProblem(null);
                      setProblemQuery('');
                    }
                    sounds.playClick();
                  }}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-amber-300 outline-none transition-all cursor-pointer ${
                    isCustomProblemSelected ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : 'focus:border-amber-500/50 hover:border-slate-700'
                  }`}
                >
                  <option value="all">Select Difficulty (Any Difficulty)</option>
                  {DIFFICULTIES.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Time Limit & Optional Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Time Limit */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-slate-300 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Match Time Limit (Minutes)</span>
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => {
                    setTimeLimit(Number(e.target.value));
                    sounds.playClick();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-slate-100 outline-none focus:border-emerald-500/50 cursor-pointer font-bold"
                >
                  <option value={5}>5 Minutes (Blitz Duel)</option>
                  <option value={10}>10 Minutes (Standard 1v1)</option>
                  <option value={15}>15 Minutes (Extended)</option>
                  <option value={20}>20 Minutes (Hard Challenge)</option>
                </select>
              </div>

              {/* Private Room Password */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-slate-300 font-bold flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Private Password (Optional)</span>
                </label>
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Leave blank for public room"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-500/50"
                />
              </div>

            </div>

            {/* Search & Select Custom LeetCode Problem */}
            <div className="space-y-2 border-t border-slate-800/80 pt-5">
              <label className="text-sm font-mono text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Search & Select Specific LeetCode Question</span>
                </span>
                {isTopicOrDifficultySelected && (
                  <span className="text-xs text-purple-400 font-bold">Disabled by Topic/Difficulty Filter</span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  disabled={isTopicOrDifficultySelected}
                  value={problemQuery}
                  onChange={(e) => {
                    setProblemQuery(e.target.value);
                    if (!e.target.value) setSelectedProblem(null);
                  }}
                  placeholder={
                    isTopicOrDifficultySelected
                      ? 'Question search disabled while Topic/Difficulty filter is active. Reset filters to search.'
                      : 'Type question title or number (e.g. Two Sum, Valid Anagram, 242)...'
                  }
                  className={`w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-cyan-300 placeholder:text-slate-600 outline-none transition-all font-bold ${
                    isTopicOrDifficultySelected ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : 'focus:border-cyan-500/50'
                  }`}
                />
                
                {filteredProblems.length > 0 && !isTopicOrDifficultySelected && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl max-h-56 overflow-y-auto z-50 shadow-2xl">
                    {filteredProblems.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProblem(p);
                          setProblemQuery(`${p.number}. ${p.title}`);
                          sounds.playClick();
                        }}
                        className="px-4 py-3 text-sm font-mono hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/50 transition-all"
                      >
                        <span className="text-slate-100 font-extrabold">{p.number}. {p.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold">{p.topic}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-lg font-extrabold ${
                            p.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            p.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {p.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DevBot Match Toggle */}
            <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-sm font-bold text-slate-100">Practice vs DevBot AI 🤖</div>
                  <div className="text-xs text-slate-400 font-mono">Instant 1v1 duel match against AI bot</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isBotMatch}
                onChange={(e) => {
                  setIsBotMatch(e.target.checked);
                  sounds.playClick();
                }}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Submit Create Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-base btn-glow-cyan transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Swords className="w-5 h-5 text-slate-950" />
              <span>{isBotMatch ? 'Start AI Practice Match' : 'Create 1v1 Room Code & Wait for Opponent'}</span>
            </button>

          </form>
        )}

        {/* JOIN ROOM FORM */}
        {activeTab === 'join' && (
          <form onSubmit={(e) => handleJoinSubmit(e, false)} className="space-y-6">
            
            {/* Room Code Input */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-200 font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>Enter 6-Character Room Code</span>
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="e.g. M1V0IZ"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl px-4 py-3.5 text-base font-mono text-emerald-300 placeholder:text-slate-600 outline-none uppercase font-black tracking-widest"
              />
            </div>

            {/* Optional Join Password */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-300 font-bold flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Room Password (If Private)</span>
              </label>
              <input
                type="password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                placeholder="Enter password if required"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-2xl px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>

            {/* Action Buttons: Join as Player vs Spectate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="submit"
                disabled={!joinRoomId.trim()}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm btn-glow-emerald transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-5 h-5 text-slate-950" />
                <span>Join Match as Player (1v1)</span>
              </button>

              <button
                type="button"
                disabled={!joinRoomId.trim()}
                onClick={(e) => handleJoinSubmit(e, true)}
                className="w-full py-4 px-5 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-black text-sm border border-purple-500/60 btn-glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-5 h-5 text-purple-300 animate-pulse" />
                <span>Watch Live as Spectator 👁️</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Sleek Footer */}
      <footer className="text-center text-xs text-slate-400 font-mono mt-6 flex items-center justify-center gap-1.5 py-2">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>by</span>
        <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent tracking-widest text-sm">NOVA</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">Code क्षेत्र 1v1 Arena</span>
      </footer>

      {/* ONE-TIME PERMANENT HANDLE SETUP MODAL */}
      {showHandleSetupModal && (
        <div className="fixed inset-0 z-100 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 font-sans">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 mx-auto shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <UserCheck className="w-7 h-7" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-100">Set Your Permanent Arena Handle</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Choose a unique display handle for all 1v1 duels, leaderboards, & chats. This is set **once** and saved permanently to your account!
              </p>
            </div>

            <form onSubmit={handleSavePermanentHandle} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold flex items-center justify-between">
                  <span>Display Handle</span>
                  <span className={`text-[10px] ${isNameTooShort || isNameTooLong || handleStatus.error ? 'text-rose-400 font-bold' : handleTrimmed.length >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {handleTrimmed.length} / 20 chars
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={20}
                    value={newHandleInput}
                    onChange={(e) => setNewHandleInput(e.target.value)}
                    placeholder="e.g. CodeMaster99"
                    className={`w-full bg-slate-950 border rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all ${
                      handleStatus.error || isNameTooShort || isNameTooLong
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : handleStatus.available && isNameValid
                        ? 'border-emerald-500/80 focus:border-emerald-400'
                        : 'border-slate-800 focus:border-cyan-500/50'
                    }`}
                  />
                  {handleStatus.checking && (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-3.5" />
                  )}
                </div>

                {isNameTooShort && (
                  <p className="text-[10px] text-rose-400 pt-0.5">Min 3 characters required.</p>
                )}
                {handleStatus.error && !isNameTooShort && (
                  <p className="text-[10px] text-rose-400 font-bold pt-0.5">{handleStatus.error}</p>
                )}
                {!handleStatus.checking && handleStatus.available && isNameValid && (
                  <p className="text-[10px] text-emerald-400 font-bold pt-0.5">Handle "{handleTrimmed}" is available!</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isNameValid || savingHandle}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm btn-glow-cyan transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>{savingHandle ? 'Saving...' : 'Save Permanent Handle & Enter Arena'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spectator Fallback Modal */}
      {spectatorPrompt && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-purple-500/50 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
              <Eye className="w-5 h-5 text-purple-400" />
              <span>Player Slots Full</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm">
              {spectatorPrompt.message}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={(e) => {
                  setSpectatorPrompt(null);
                  handleJoinSubmit(e, true);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm btn-glow-purple transition-all shadow-md"
              >
                Join as Spectator
              </button>
              
              <button
                onClick={() => setSpectatorPrompt(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
