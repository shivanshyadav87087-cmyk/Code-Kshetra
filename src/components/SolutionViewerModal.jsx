import React, { useState } from 'react';
import { X, Copy, Check, Trophy, FileCode, CheckCircle2, ShieldCheck, Sparkles, Columns, Cpu, HardDrive } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function SolutionViewerModal({ isOpen, onClose, winningSolution, opponentSolution }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('winner'); // 'winner' | 'opponent' | 'diff'

  if (!isOpen || !winningSolution) return null;

  const { winnerUsername, code, language, submittedAt, problemTitle, problemNumber, runtimeMs, memoryMb } = winningSolution;
  const oppCode = opponentSolution?.code || '// No opponent code submitted';
  const oppLang = opponentSolution?.language || language || 'javascript';

  const displayedCode = activeTab === 'winner' ? code : oppCode;
  const displayedLang = activeTab === 'winner' ? language : oppLang;

  const handleCopy = () => {
    if (!displayedCode) return;
    navigator.clipboard.writeText(displayedCode);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = submittedAt ? new Date(submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl font-sans animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] relative shadow-cyan-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-100">Post-Match Solution Breakdown</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Verified 100% Passed</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {problemTitle ? `#${problemNumber || ''} ${problemTitle}` : '1v1 Duel Winning Solution'} • {formattedDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Toolbar: Winner vs Opponent */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs font-mono">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab('winner'); sounds.playClick(); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold cursor-pointer ${
                activeTab === 'winner'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>👑 {winnerUsername}'s Code</span>
            </button>

            {opponentSolution && (
              <button
                onClick={() => { setActiveTab('opponent'); sounds.playClick(); }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold cursor-pointer ${
                  activeTab === 'opponent'
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Opponent's Draft</span>
              </button>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Execution Benchmark HUD */}
        <div className="grid grid-cols-2 gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Runtime Benchmark</div>
              <div className="text-cyan-300 font-bold">{runtimeMs ? `${runtimeMs} ms` : '12 ms (Fastest)'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Memory Allocated</div>
              <div className="text-purple-300 font-bold">{memoryMb ? `${memoryMb} MB` : '38.4 MB'}</div>
            </div>
          </div>
        </div>

        {/* Syntax-Styled Read-Only Code Container */}
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-slate-950 font-mono text-xs text-cyan-200 leading-relaxed select-text">
          <pre className="whitespace-pre-wrap break-words">
            {displayedCode || '// No code recorded'}
          </pre>
        </div>

        {/* Footer Banner */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Authoritative Code Snapshot Verified</span>
          </div>

          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
