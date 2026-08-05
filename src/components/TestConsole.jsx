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

      if (res.results && res.results.length > 0) {
        const firstFailIdx = res.results.findIndex(r => !r.passed);
        setSelectedResultCaseIdx(firstFailIdx !== -1 ? firstFailIdx : 0);
      }

      if (res.success) {
        sounds.playPass();
      } else {
        sounds.playFail();
      }

      onProgressUpdate(res.passedCount, res.totalCount, res.success ? 'Ran Tests (All Passed!)' : `Ran Tests (${res.passedCount}/${res.totalCount})`);
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

      if (res.results && res.results.length > 0) {
        const firstFailIdx = res.results.findIndex(r => !r.passed);
        setSelectedResultCaseIdx(firstFailIdx !== -1 ? firstFailIdx : 0);
      }

      if (res.success) {
        sounds.playSubmitSuccess();
      } else {
        sounds.playFail();
      }

      onProgressUpdate(res.passedCount, res.totalCount, res.success ? 'Submitted! All Passed' : `Submitted (${res.passedCount}/${res.totalCount})`);
      onSubmitSolution(res);
    } catch (err) {
      console.error(err);
      sounds.playFail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleCases = (problem.testCases || []).filter(c => !c.isSecret);
  const displayCases = sampleCases.length > 0 ? sampleCases : (problem.testCases || []);
  const currentSampleCase = displayCases[selectedCaseIdx] || displayCases[0];
  const activeResultCase = testResults?.results?.[selectedResultCaseIdx];

  // Helper to extract labeled parameter names & values for any test case input
  const getParamEntries = (sampleCase) => {
    if (!sampleCase) return [];

    if (sampleCase.params && typeof sampleCase.params === 'object' && !Array.isArray(sampleCase.params)) {
      return Object.entries(sampleCase.params);
    }

    let paramNames = [];
    const template = problem?.starterTemplates?.[selectedLanguage] ||
                     problem?.starterTemplates?.javascript ||
                     problem?.starterTemplates?.python ||
                     problem?.starterTemplates?.cpp ||
                     problem?.starterTemplates?.java || '';

    if (template) {
      const sigMatch = template.match(/\(([^)]*)\)/);
      if (sigMatch && sigMatch[1]) {
        const rawArgs = sigMatch[1].split(',');
        paramNames = rawArgs
          .map(a => a.trim())
          .filter(a => a && a !== 'self')
          .map(a => {
            const tokens = a.split(':')[0].trim().split(/\s+/);
            const name = tokens[tokens.length - 1].replace(/[&*]/g, '');
            return name;
          })
          .filter(Boolean);
      }
    }

    const rawInput = sampleCase.input !== undefined ? sampleCase.input : sampleCase.params;
    const inputs = Array.isArray(rawInput) ? rawInput : [rawInput];

    return inputs.map((val, idx) => {
      const name = paramNames[idx] || (inputs.length === 1 ? 'input' : `param${idx + 1}`);
      return [name, val];
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md font-sans select-none">
      
      {/* Top Header Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/95 border-b border-slate-800 px-3.5 py-2 z-20">
        
        {/* Left: Dual Tabs (Testcase vs Test Result) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold btn-glow transition-all cursor-pointer ${
              activeTab === 'testcases'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Testcase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold btn-glow transition-all relative cursor-pointer ${
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

        {/* Right: Touch-Friendly Action Buttons */}
        <div className="flex items-center gap-2">
          {disabled ? (
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl animate-pulse">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              <span>Waiting for Opponent...</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                style={{ touchAction: 'manipulation' }}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 btn-glow-cyan transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                style={{ touchAction: 'manipulation' }}
                className="px-5 py-2 min-h-[40px] rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-extrabold text-xs btn-glow-emerald transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Scrollable Compiler Area */}
      <div className="flex-1 p-3.5 overflow-y-auto overflow-x-auto custom-scrollbar bg-slate-950/90 font-sans select-text">
        
        {/* 1. TESTCASE TAB VIEW */}
        {activeTab === 'testcases' && (
          <div className="space-y-4">
            
            {/* Pill Tabs for Cases */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 custom-scrollbar">
              {displayCases.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer whitespace-nowrap ${
                    selectedCaseIdx === idx
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected Sample Case Input Parameters (LeetCode Style Labeled Textboxes) */}
            {currentSampleCase && (
              <div className="space-y-3 font-mono text-xs">
                {getParamEntries(currentSampleCase).map(([paramName, paramVal]) => (
                  <div key={paramName} className="space-y-1">
                    <div className="text-slate-400 text-[11px] font-bold">{paramName} =</div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-cyan-300 font-semibold overflow-x-auto custom-scrollbar whitespace-pre select-all">
                      {formatParamValue(paramVal)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TEST RESULT TAB VIEW */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {!testResults ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs font-mono">Run or Submit your solution to view test results and compiler output.</p>
              </div>
            ) : (
              <>
                {/* LeetCode Post-Submit Verdict Banner & Metrics Grid */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
                  
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      {testResults.verdict === 'Accepted' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                          <div>
                            <div className="text-emerald-400 font-black text-xl tracking-wider">Accepted</div>
                            <div className="text-xs text-emerald-300/80 font-mono font-bold">
                              {testResults.passedCount} / {testResults.totalCount} testcases passed
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-7 h-7 text-rose-400" />
                          <div>
                            <div className="text-rose-400 font-black text-xl tracking-wider">{testResults.verdict}</div>
                            <div className="text-xs text-rose-300/80 font-mono font-bold">
                              {testResults.passedCount} / {testResults.totalCount} testcases passed
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Diff View Toggle */}
                    <button
                      type="button"
                      onClick={() => setDiffMode(!diffMode)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        diffMode
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Diff className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Diff Mode</span>
                    </button>
                  </div>

                  {/* LeetCode Runtime & Memory Percentile Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Runtime Card */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Runtime</span>
                        </span>
                        <span className="text-emerald-400 font-black text-sm">{testResults.runtimeMs || 0} ms</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Beats</span>
                        <span className="text-emerald-300 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          {testResults.runtimePercentile || 87.5}% of users
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${testResults.runtimePercentile || 87.5}%` }}
                        />
                      </div>
                    </div>

                    {/* Memory Card */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Memory</span>
                        </span>
                        <span className="text-cyan-400 font-black text-sm">{testResults.memoryMb || 41.2} MB</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Beats</span>
                        <span className="text-cyan-300 font-extrabold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                          {testResults.memoryPercentile || 91.2}% of users
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${testResults.memoryPercentile || 91.2}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Big-O Complexity Analysis Cards */}
                  {testResults.complexity && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-500/30 space-y-1">
                        <div className="text-[10px] font-mono font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Time Complexity</span>
                        </div>
                        <div className="text-base font-mono font-black text-purple-300">
                          {testResults.complexity.timeComplexity}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {testResults.complexity.timeExplanation}
                        </p>
                      </div>

                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/30 space-y-1">
                        <div className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>Space Complexity</span>
                        </div>
                        <div className="text-base font-mono font-black text-indigo-300">
                          {testResults.complexity.spaceComplexity}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {testResults.complexity.spaceExplanation}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Clickable Pill Case Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 custom-scrollbar">
                  {testResults.results.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedResultCaseIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer whitespace-nowrap ${
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

                {/* Selected Result Case Details (Scrollable Output Boxes) */}
                {activeResultCase && (
                  <div className="space-y-3 font-mono text-xs">
                    
                    {/* Input */}
                    <div className="space-y-2">
                      {getParamEntries(activeResultCase).map(([paramName, paramVal]) => (
                        <div key={paramName} className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold">{paramName} =</div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-cyan-300 font-semibold overflow-x-auto custom-scrollbar whitespace-pre select-all">
                            {formatParamValue(paramVal)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Diff Mode Side-by-Side Comparison */}
                    {diffMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                            <span>Your Output</span>
                            {!activeResultCase.passed && <span className="text-rose-400 text-[10px]">(Mismatch)</span>}
                          </div>
                          <div className={`border rounded-xl px-3.5 py-2 font-semibold overflow-x-auto custom-scrollbar whitespace-pre ${
                            activeResultCase.passed
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          }`}>
                            {formatParamValue(activeResultCase.actual)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold text-emerald-400">Expected Output</div>
                          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-emerald-300 font-semibold overflow-x-auto custom-scrollbar whitespace-pre">
                            {formatParamValue(activeResultCase.expected)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Output */}
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[11px] font-bold">Output =</div>
                          <div className={`border rounded-xl px-3.5 py-2 font-semibold overflow-x-auto custom-scrollbar whitespace-pre ${
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
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-emerald-400 font-semibold overflow-x-auto custom-scrollbar whitespace-pre">
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
                        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-rose-300 text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
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
