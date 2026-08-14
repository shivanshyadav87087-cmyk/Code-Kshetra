import React, { useState } from 'react';
import { BookOpen, AlertCircle, Lightbulb, CheckCircle2, Tag, Hash, ExternalLink } from 'lucide-react';
import { DIFFICULTIES } from '../data/topics';

export default function ProblemDescription({ problem }) {
  const [activeTab, setActiveTab] = useState('description');

  if (!problem) return null;

  const diffObj = DIFFICULTIES.find(d => d.id === problem.difficulty) || {
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const officialUrl = problem.leetcodeUrl || `https://leetcode.com/problems/${problem.id}/`;

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between bg-slate-950/80 border-b border-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'description'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Problem Statement
          </button>

          <button
            onClick={() => setActiveTab('hints')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'hints'
                ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Strategy & Hints
          </button>
        </div>

        {/* LeetCode Official Direct Link */}
        {problem.number && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-xl transition-all"
            title="Open on official LeetCode.com"
          >
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>LeetCode #{problem.number}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-[#E2E8F0] text-sm sm:text-base leading-relaxed custom-scrollbar">
        {activeTab === 'description' ? (
          <>
            {/* Title & LeetRival Pill Badges */}
            <div className="space-y-3.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight font-sans">
                {problem.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 font-mono">
                {/* Difficulty Pill */}
                <span className={`px-2.5 py-1 rounded-[6px] text-xs font-extrabold border ${
                  problem.difficulty.toLowerCase() === 'easy'
                    ? 'bg-[#12281D] text-[#22C55E] border-[#1D4A33]'
                    : problem.difficulty.toLowerCase() === 'hard'
                    ? 'bg-[#2D1619] text-[#EF4444] border-[#592227]'
                    : 'bg-[#282312] text-[#EAB308] border-[#4D4018]'
                }`}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>

                {/* Test Cases Count Pill */}
                <span className="px-2.5 py-1 rounded-[6px] text-xs font-bold bg-[#1A1C24] text-[#94A3B8] border border-[#272A38]">
                  {problem.testCases?.length || 4} tests
                </span>

                {/* Topic Tag Pill */}
                <span className="px-2.5 py-1 rounded-[6px] text-xs font-bold bg-[#211B30] text-[#A78BFA] border border-[#3D2E5E]">
                  {problem.topic.toLowerCase()}
                </span>

                {/* Share Link Pill */}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Share link copied to clipboard!');
                    } catch (e) {}
                  }}
                  className="px-3 py-1 rounded-[6px] text-xs font-bold bg-[#1A1C24] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#272A38] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Share link</span>
                </button>
              </div>
            </div>

            {/* Problem Description Text */}
            <div className="text-[#D1D5DB] leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line bg-[#0E0F14] p-4 rounded-xl border border-[#1E202A]">
              {problem.description}
            </div>

            {/* Examples */}
            <div className="space-y-4">
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-[#12131A] border border-[#1F222E] rounded-xl p-4 space-y-2 font-mono text-xs sm:text-sm"
                >
                  <div className="text-[#A78BFA] font-extrabold tracking-wider uppercase text-[11px]">
                    EXAMPLE {idx + 1}
                  </div>
                  <div>
                    <span className="text-[#94A3B8] font-bold">Input: </span>
                    <span className="text-[#F472B6] font-mono">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] font-bold">Output: </span>
                    <span className="text-[#38BDF8] font-extrabold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[#94A3B8] text-xs font-sans border-t border-[#1F222E] pt-2 mt-1">
                      <span className="font-bold text-[#CBD5E1]">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-200 text-xs sm:text-sm uppercase tracking-wider font-mono">
                  Constraints
                </h3>
                <ul className="space-y-2 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 font-mono text-xs sm:text-sm text-amber-300/90">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          /* Strategy & Hints Tab */
          <div className="space-y-5">
            <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm sm:text-base">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>Optimal Solution Approach</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Below are conceptual hints to help you craft the optimal Time and Space complexity algorithm!
              </p>
            </div>

            {problem.hints && problem.hints.length > 0 ? (
              <div className="space-y-3">
                {problem.hints.map((hint, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-1.5">
                    <div className="text-xs font-mono font-bold text-cyan-400">Hint {idx + 1}:</div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{hint}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-400 italic">No extra hints provided for this problem. Focus on edge cases and optimal data structures!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
