import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { SUPPORTED_LANGUAGES } from '../data/topics';
import { Code2, RotateCcw, Copy, Check, Eye, Lock, Maximize2, Minimize2, AlertTriangle, CheckCircle2, Shield, ShieldAlert } from 'lucide-react';
import { socket } from '../engine/socketClient';
import { sounds } from '../engine/soundManager';

export default function CodeEditor({ problem, selectedLanguage, onLanguageChange, code, setCode, readOnly = false, room = null }) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const [savedStatus, setSavedStatus] = useState(false);
  const [pasteBlockedWarning, setPasteBlockedWarning] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Load starter template or saved draft from localStorage
  useEffect(() => {
    if (!readOnly && problem) {
      const draftKey = `codeclash_draft_${problem.id}_${selectedLanguage}`;
      const savedDraft = localStorage.getItem(draftKey);

      if (savedDraft) {
        setCode(savedDraft);
      } else if (problem.starterTemplates) {
        const template = problem.starterTemplates[selectedLanguage] || problem.starterTemplates.javascript || '// Write solution here';
        setCode(template);
      }
    }
  }, [problem?.id, problem?.number, selectedLanguage, readOnly]);

  // Anti-Cheat Tab-Switch & Blur Detection
  useEffect(() => {
    if (readOnly || !room || room.status !== 'in-progress') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sounds.playFail();
        socket.emit('anti_cheat_event', {
          roomId: room.roomId,
          eventType: 'tab_switch',
          timestamp: Date.now()
        });
      }
    };

    const handleWindowBlur = () => {
      if (!document.hidden) {
        sounds.playFail();
        socket.emit('anti_cheat_event', {
          roomId: room.roomId,
          eventType: 'tab_switch',
          timestamp: Date.now()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [room?.roomId, room?.status, readOnly]);

  // Anti-Cheat Exit Fullscreen Detection
  useEffect(() => {
    if (readOnly || !room || room.status !== 'in-progress') return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        sounds.playFail();
        socket.emit('anti_cheat_event', {
          roomId: room.roomId,
          eventType: 'fullscreen_exit',
          timestamp: Date.now()
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [room?.roomId, room?.status, readOnly]);

  // Debounced Auto-Save Draft to LocalStorage
  useEffect(() => {
    if (readOnly || !problem || !code) return;

    setSavedStatus(false);
    const timer = setTimeout(() => {
      const draftKey = `codeclash_draft_${problem.id}_${selectedLanguage}`;
      localStorage.setItem(draftKey, code);
      setSavedStatus(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [code, problem?.id, selectedLanguage, readOnly]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Listen to Monaco Paste Event to block pastes exceeding 50 characters
    editor.onDidPaste((e) => {
      if (readOnly || !room || room.status !== 'in-progress') return;

      const model = editor.getModel();
      if (!model) return;

      const pastedRange = e.range;
      const pastedText = model.getValueInRange(pastedRange);

      if (pastedText && pastedText.length > 50) {
        // Revert large paste!
        editor.executeEdits('anti-cheat-paste-block', [{
          range: pastedRange,
          text: '',
          forceMoveMarkers: true
        }]);

        sounds.playFail();
        setPasteBlockedWarning(true);
        setTimeout(() => setPasteBlockedWarning(false), 3500);

        socket.emit('anti_cheat_event', {
          roomId: room.roomId,
          eventType: 'large_paste_attempt',
          length: pastedText.length
        });
      }
    });

    // Listen to Monaco language diagnostics/markers for live problem count badge
    const updateMarkers = () => {
      const model = editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        setProblemCount(markers.length);
      }
    };

    const disposable = monaco.editor.onDidChangeMarkers(() => {
      updateMarkers();
    });

    updateMarkers();

    return () => {
      disposable.dispose();
    };
  };

  const handleResetCode = () => {
    if (readOnly) return;
    if (problem && problem.starterTemplates) {
      const template = problem.starterTemplates[selectedLanguage] || '// Write solution here';
      setCode(template);
      if (problem.id) {
        localStorage.removeItem(`codeclash_draft_${problem.id}_${selectedLanguage}`);
      }
      sounds.playClick();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div
      onContextMenu={(e) => {
        if (!readOnly && room?.status === 'in-progress') {
          e.preventDefault();
        }
      }}
      className={`flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md relative transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-80 rounded-none border-none shadow-2xl'
          : 'h-full'
      }`}
    >
      
      {/* Spectator Read-Only Banner */}
      {readOnly && (
        <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-b border-purple-800/80 px-4 py-2 flex items-center justify-between text-xs text-purple-200 font-bold z-20 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="tracking-wide">SPECTATOR MODE: Watching Live Duel (Strictly Read-Only)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Editing Disabled</span>
          </div>
        </div>
      )}

      {/* Blocked Large Paste Overlay Notification */}
      {pasteBlockedWarning && (
        <div className="bg-rose-950/90 border-b border-rose-600/80 px-4 py-2 flex items-center justify-between text-xs text-rose-200 font-bold z-30 shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Anti-Cheat Guard: Large code paste (&gt;50 chars) blocked! Please type your solution.</span>
          </div>
        </div>
      )}

      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border-b border-slate-800 px-4 py-2 z-10">
        
        {/* Left Section: Language Switcher, Diagnostics, & Fair Play Shield */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{readOnly ? 'Live Viewer' : 'Editor'}</span>
          </div>

          <select
            value={selectedLanguage}
            disabled={readOnly}
            onChange={(e) => {
              onLanguageChange(e.target.value);
              sounds.playClick();
            }}
            className="bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 outline-none cursor-pointer transition-all font-extrabold disabled:opacity-60"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name || lang.label}
              </option>
            ))}
          </select>

          {/* Real-time Inline Diagnostic Problems Count Badge */}
          <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
            problemCount > 0
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {problemCount > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{problemCount} {problemCount === 1 ? 'Problem' : 'Problems'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Syntax Errors</span>
              </>
            )}
          </div>

          {/* Anti-Cheat Fair Play Active HUD Shield */}
          {room?.status === 'in-progress' && !readOnly && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg font-bold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fair Play Monitored</span>
            </div>
          )}
        </div>

        {/* Right Section: Auto-Save Status, Font Adjuster, Copy, Reset & Fullscreen */}
        <div className="flex items-center gap-2">
          
          {/* Local Draft Persistence Indicator */}
          {!readOnly && (
            <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className={`w-2 h-2 rounded-full ${savedStatus ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <span className="text-[10px]">{savedStatus ? 'Saved' : 'Saving...'}</span>
            </div>
          )}

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-400">
            <span className="text-[10px] font-mono uppercase hidden sm:inline">Font:</span>
            <button
              onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
              className="hover:text-cyan-300 px-1 font-extrabold"
            >
              -
            </button>
            <span className="font-mono text-slate-200 font-bold">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
              className="hover:text-cyan-300 px-1 font-extrabold"
            >
              +
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs flex items-center gap-1"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Reset Code Button */}
          {!readOnly && (
            <button
              onClick={handleResetCode}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs flex items-center gap-1"
              title="Reset to Starter Template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-[11px]">Reset</span>
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => {
              setIsFullscreen(prev => !prev);
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs flex items-center gap-1"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full bg-[#1e1e1e] relative">
        <Editor
          height="100%"
          language={currentLangConfig.monacoLang || 'javascript'}
          value={code}
          onChange={(val) => {
            if (!readOnly) setCode(val || '');
          }}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly: readOnly,
            fontSize: fontSize,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: readOnly ? 'solid' : 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: true, strings: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            acceptSuggestionOnEnter: 'on',
            wordWrap: 'on',
            lineNumbersMinChars: 3
          }}
        />
      </div>

    </div>
  );
}
