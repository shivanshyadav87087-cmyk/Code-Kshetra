import React, { useState } from 'react';
import { X, Copy, Check, Trophy, FileCode, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function SolutionViewerModal({ isOpen, onClose, winningSolution }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !winningSolution) return null;

  const { winnerUsername, code, language, submittedAt, passedCount, totalCount, problemTitle, problemNumber } = winningSolution;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = submittedAt ? new Date(submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl font-sans animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative shadow-cyan-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-100">{winnerUsername}'s Solution</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Accepted (4/4 Passed)</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {problemTitle ? `#${problemNumber} ${problemTitle}` : '1v1 Duel Winning Solution'} • {formattedDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Language Badge & Copy Button */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold uppercase">{language || 'javascript'}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700 active:scale-95"
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

        {/* Syntax-Styled Read-Only Code Container */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-950 font-mono text-xs text-cyan-200 leading-relaxed select-text">
          <pre className="whitespace-pre-wrap break-words">
            {code || '// No code recorded'}
          </pre>
        </div>

        {/* Footer Banner */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Official Authoritative Server Snapshot</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
