import React, { useState } from 'react';
import { Play, Send, CheckCircle2, XCircle, AlertTriangle, Terminal, Layers, Lock, Cpu, Hourglass, Check, Diff, Sparkles } from 'lucide-react';
import { runCode } from '../engine/codeRunner';
import { sounds } from '../engine/soundManager';

export default function TestConsole({ problem, selectedLanguage, code, onProgressUpdate, onSubmitSolution, disabled = false }) {
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' | 'results'
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedResultCaseIdx, setSelectedResultCaseIdx] = useState(0);
  const [diffMode, setDiffMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  if (!problem) return null;

  const allCases = problem.testCases || [];

  const formatParamValue = (val) => {
    if (val === undefined || val === null) return 'null';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  const handleRunCode = async () => {
    if (disabled) return;
    setIsRunning(true);
    sounds.playRun();

    try {
      const res = await runCode(code, selectedLanguage, problem.entryFunction, allCases);
      setTestResults(res);
      setActiveTab('results');

      // Auto-select first failing test case if Wrong Answer
      if (res.results && res.results.length > 0) {
        const firstFailIdx = res.results.findIndex(r => !r.passed);
        setSelectedResultCaseIdx(firstFailIdx !== -1 ? firstFailIdx : 0);
      }

      if (res.success) {
        sounds.playPass();
      } else {
        sounds.playFail();
      }

      onProgressUpdate(res.passedCount, res.totalCount, res.success ? 'Ran Tests (All 4 Passed!)' : `Ran Tests (${res.passedCount}/${res.totalCount})`);
    } catch (err) {
      console.error(err);
      sounds.playFail();
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (disabled) return;
    setIsSubmitting(true);
    sounds.playRun();

    try {
      const res = await runCode(code, selectedLanguage, problem.entryFunction, allCases);
      setTestResults(res);
      setActiveTab('results');

      // Auto-select first failing test case if Wrong Answer
      if (res.results && res.results.length > 0) {
        const firstFailIdx = res.results.findIndex(r => !r.passed);
        setSelectedResultCaseIdx(firstFailIdx !== -1 ? firstFailIdx : 0);
      }

      if (res.success) {
        sounds.playSubmitSuccess();
      } else {
        sounds.playFail();
      }

      onProgressUpdate(res.passedCount, res.totalCount, res.success ? 'Submitted! All 4 Passed' : `Submitted (${res.passedCount}/${res.totalCount})`);
      onSubmitSolution(res);
    } catch (err) {
      console.error(err);
      sounds.playFail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSampleCase = allCases[selectedCaseIdx];
  const activeResultCase = testResults?.results?.[selectedResultCaseIdx];

  return (
    <div className="h-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md font-sans">
      
      {/* Top Header Navigation & Action Bar (LeetCode Style) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border-b border-slate-800 px-4 py-2">
        
        {/* Left: Dual Tabs (Testcase vs Test Result) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold btn-glow transition-all ${
              activeTab === 'testcases'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Testcase</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold btn-glow transition-all relative ${
              activeTab === 'results'
                ? 'bg-slate-800 text-emerald-300 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Result</span>
            {testResults && (
              <span className={`w-2 h-2 rounded-full ${testResults.success ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-rose-400 shadow-sm shadow-rose-400'}`} />
            )}
          </button>
        </div>

        {/* Right: Action Buttons (Run Code & Submit Solution) */}
        <div className="flex items-center gap-2">
          {disabled ? (
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl animate-pulse">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              <span>Waiting for Opponent...</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 btn-glow-cyan transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs btn-glow-emerald transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-950/80 font-sans">
        
        {/* 1. TESTCASE TAB VIEW (Sample Cases Before Execution) */}
        {activeTab === 'testcases' && (
          <div className="space-y-4">
            
            {/* Pill Tabs for Cases */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
              {allCases.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    selectedCaseIdx === idx
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected Sample Case Input Parameters */}
            {currentSampleCase && (
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(currentSampleCase.params || {}).map(([paramName, paramVal]) => (
                  <div key={paramName} className="space-y-1">
                    <div className="text-slate-400 text-[11px] font-bold">{paramName} =</div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-cyan-300 font-semibold">
                      {formatParamValue(paramVal)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TEST RESULT TAB VIEW (Execution Metrics & LeetCode Verdict Banner) */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {!testResults ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs font-mono">Run your solution to see test results, runtime, and memory stats.</p>
              </div>
            ) : (
              <>
                {/* LeetCode Verdict Banner */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                  
                  {/* Verdict Header */}
                  <div className="flex items-center gap-3">
                    {testResults.verdict === 'Accepted' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <div>
                          <div className="text-emerald-400 font-black text-lg tracking-wide">Accepted</div>
                          <div className="text-xs text-emerald-300/80 font-mono">All {testResults.totalCount} Testcases Passed</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-rose-400" />
                        <div>
                          <div className="text-rose-400 font-black text-lg tracking-wide">{testResults.verdict}</div>
                          <div className="text-xs text-rose-300/80 font-mono">{testResults.passedCount} / {testResults.totalCount} Testcases Passed</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Runtime & Memory Stats */}
                  {testResults.verdict === 'Accepted' && (
                    <div className="flex items-center gap-4 text-xs font-mono bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400">Runtime: </span>
                        <span className="text-emerald-400 font-bold">{testResults.runtimeMs} ms</span>
                      </div>
                      <div className="text-slate-700">|</div>
                      <div>
                        <span className="text-slate-400">Memory: </span>
                        <span className="text-cyan-400 font-bold">{testResults.memoryMb} MB</span>
                      </div>
                    </div>
                  )}

                  {/* Diff View Toggle */}
                  <button
                    onClick={() => setDiffMode(!diffMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                      diffMode
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Diff className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Diff Mode</span>
                  </button>
                </div>

                {/* Clickable Pill Case Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
                  {testResults.results.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedResultCaseIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                        selectedResultCaseIdx === idx
                          ? r.passed
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>Case {idx + 1}</span>
                      {r.passed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Selected Result Case Details */}
                {activeResultCase && (
                  <div className="space-y-3 font-mono text-xs">
                    
                    {/* Input */}
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px] font-bold">Input =</div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-cyan-300 font-semibold">
                        {activeResultCase.inputStr}
                      </div>
                    </div>

                    {/* Diff Mode Side-by-Side Comparison */}
                    {diffMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                            <span>Your Output</span>
                            {!activeResultCase.passed && <span className="text-rose-400 text-[10px]">(Mismatch)</span>}
                          </div>
                          <div className={`border rounded-xl px-3.5 py-2 font-semibold ${
                            activeResultCase.passed
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          }`}>
                            {formatParamValue(activeResultCase.actual)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold text-emerald-400">Expected Output</div>
                          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-emerald-300 font-semibold">
                            {formatParamValue(activeResultCase.expected)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Output */}
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold">Output =</div>
                          <div className={`border rounded-xl px-3.5 py-2 font-semibold ${
                            activeResultCase.passed
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          }`}>
                            {formatParamValue(activeResultCase.actual)}
                          </div>
                        </div>

                        {/* Expected Output */}
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold">Expected =</div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-emerald-400 font-semibold">
                            {formatParamValue(activeResultCase.expected)}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Runtime Error Exception Log Trace */}
                    {activeResultCase.error && (
                      <div className="space-y-1 pt-2">
                        <div className="text-rose-400 text-[11px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Console Error Output</span>
                        </div>
                        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-rose-300 text-[11px] whitespace-pre-wrap">
                          {activeResultCase.error}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
