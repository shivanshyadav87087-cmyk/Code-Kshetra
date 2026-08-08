import React, { useState } from 'react';
import { X, BookOpen, Swords, Trophy, Sparkles, CheckCircle2, ChevronRight, Zap, Target, Award, Code, Play } from 'lucide-react';
import { sounds } from '../engine/soundManager';

// 1. EXPLORE ROADMAP MODAL
export function ExploreModal({ isOpen, onClose, onStartPractice }) {
  const [activeTab, setActiveTab] = useState('dsa');

  if (!isOpen) return null;

  const tracks = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      subtitle: 'Master Core LeetCode Patterns',
      photo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      problemsCount: '350+ Problems',
      level: 'Beginner to Advanced',
      color: 'from-cyan-500/20 to-emerald-500/20 border-cyan-500/40 text-cyan-300',
      topics: ['Arrays & Hash Maps', 'Two Pointers & Sliding Window', 'Trees & Binary Search', 'Graph Traversal (BFS/DFS)']
    },
    {
      id: 'dp',
      title: 'Dynamic Programming & Graphs',
      subtitle: 'Conquer Hard Algorithmic Challenges',
      photo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      problemsCount: '180+ Problems',
      level: 'Intermediate to Expert',
      color: 'from-purple-500/20 to-rose-500/20 border-purple-500/40 text-purple-300',
      topics: ['Memoization & Tabulation', '0/1 Knapsack & Subset Sum', 'Shortest Paths (Dijkstra)', 'Topological Sorting']
    },
    {
      id: 'speed',
      title: '1v1 Speed Coding Tactics',
      subtitle: 'Optimize Execution Time under Pressure',
      photo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      problemsCount: '120+ Battle Drills',
      level: 'Competitive Duelists',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
      topics: ['Fast I/O & Memory Optimization', 'Monotone Stacks & Queues', 'Bit Manipulation Tricks', 'Corner Case Validation']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-2xl bg-[#1a1f2c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-left">
        
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              Explore Learning Tracks 📚
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Structured roadmaps with curated photos, LeetCode patterns, and interactive problem sets.
            </p>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-4 mb-6">
          {tracks.map((track) => (
            <div 
              key={track.id}
              className={`p-4 rounded-2xl bg-gradient-to-r ${track.color} border flex flex-col sm:flex-row items-center gap-4 transition-all hover:scale-[1.01]`}
            >
              <img 
                src={track.photo} 
                alt={track.title} 
                className="w-full sm:w-32 h-24 rounded-xl object-cover border border-slate-700/80 shadow"
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                    {track.problemsCount}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {track.level}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">{track.title}</h3>
                <p className="text-xs text-slate-300 font-sans">{track.subtitle}</p>

                {/* Topics Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {track.topics.map((tp, idx) => (
                    <span key={idx} className="text-[10px] font-sans bg-slate-950/70 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                      ✓ {tp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => { sounds.playSubmitSuccess(); onClose(); onStartPractice(); }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Start Practicing Track Problems ➔</span>
        </button>

      </div>
    </div>
  );
}

// 2. 1v1 DUELS MODAL
export function DuelsInfoModal({ isOpen, onClose, onStartDuel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-xl bg-[#1a1f2c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner Photo Header */}
        <div className="relative h-40 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-5 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" 
            alt="1v1 Battle Arena" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2c] via-[#1a1f2c]/60 to-transparent flex items-end p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/30 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">1v1 Speed Duel Arena ⚔️</h2>
                <p className="text-xs text-cyan-300 font-mono">Live Real-Time WebSocket Head-to-Head Battle</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Real-Time Code Sync
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Watch rival keystrokes, submission attempts, and testcases pass in real time.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-400" /> Dynamic ELO Ratings
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Win duels to gain +25 ELO points and climb from Coder to Knight & Guardian tier!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { sounds.playSubmitSuccess(); onClose(); onStartDuel(); }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4 text-white" />
          <span>Enter 1v1 Battle Arena ⚔️</span>
        </button>

      </div>
    </div>
  );
}

// 3. CONTEST ARENA MODAL
export function ContestArenaModal({ isOpen, onClose, onRegisterContest }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-xl bg-[#1a1f2c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner Photo Header */}
        <div className="relative h-40 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-5 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80" 
            alt="Contest Arena" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2c] via-[#1a1f2c]/60 to-transparent flex items-end p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-400 text-amber-300 flex items-center justify-center shadow">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">Weekly & Biweekly Contest Arena 🏆</h2>
                <p className="text-xs text-amber-300 font-mono">Global Speed Coding Tournament & ELO Ladder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Contest Cards */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-purple-500/20 border border-amber-500/40 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-mono">Weekly Contest 395</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">4 LeetCode Algorithmic Problems • 1h 30m Duration</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Starts in 2d 14h
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { sounds.playSubmitSuccess(); onClose(); onRegisterContest(); }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 fill-slate-950" />
          <span>Register for Weekly Contest 395 🏆</span>
        </button>

      </div>
    </div>
  );
}
