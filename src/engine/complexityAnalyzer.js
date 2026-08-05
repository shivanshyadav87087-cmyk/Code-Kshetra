/**
 * LeetCode-Grade Code Complexity Analyzer & Percentile Judge
 * Evaluates Big-O Time & Space Complexity via static AST/heuristic analysis
 * and generates realistic submission percentiles.
 */

const BACKEND_URL = typeof window !== 'undefined' && window.VITE_BACKEND_URL
  ? window.VITE_BACKEND_URL
  : 'https://code-kshetra.onrender.com';

/**
 * Static Analysis Heuristic for Big-O Time & Space Complexity
 */
export function staticAnalyzeComplexity(code = '', language = 'javascript', entryFunctionName = '') {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // strip comments

  // 1. Loop Depth Analysis (Time Complexity)
  let maxLoopDepth = 0;
  let currentDepth = 0;
  const lines = cleanCode.split('\n');

  for (let line of lines) {
    const trimmed = line.trim();
    if (/\b(for|while)\b/.test(trimmed)) {
      currentDepth++;
      if (currentDepth > maxLoopDepth) maxLoopDepth = currentDepth;
    }
    if (trimmed.includes('}') || (language === 'python' && trimmed === '')) {
      if (currentDepth > 0) currentDepth--;
    }
  }

  // Detect sorting operations
  const hasSort = /\b(sort|sorted|Arrays\.sort|Collections\.sort|std::sort)\b/.test(cleanCode);
  
  // Detect binary search or log division
  const hasLogarithm = /\b(binarySearch|binary_search)\b/.test(cleanCode) ||
                       /(\/=\s*2|>>=\s*1|Math\.floor\([^)]*\/2\)|mid\s*=)/.test(cleanCode);

  // Detect recursion
  const hasRecursion = entryFunctionName && new RegExp(`\\b${entryFunctionName}\\s*\\(`).test(cleanCode);

  // Determine Time Complexity
  let timeComplexity = 'O(1)';
  let timeExplanation = 'Executes in constant time without iteration.';

  if (hasRecursion && maxLoopDepth > 0) {
    timeComplexity = 'O(2ⁿ)';
    timeExplanation = 'Recursive call stack combined with loop iterations.';
  } else if (hasRecursion) {
    timeComplexity = 'O(N)';
    timeExplanation = 'Linear recursive call stack over the input size.';
  } else if (hasSort && maxLoopDepth >= 1) {
    timeComplexity = 'O(N log N)';
    timeExplanation = 'Utilizes sorting combined with linear array traversal.';
  } else if (hasSort) {
    timeComplexity = 'O(N log N)';
    timeExplanation = 'Employs comparison-based sorting (Timsort / QuickSort).';
  } else if (hasLogarithm && maxLoopDepth >= 1) {
    timeComplexity = 'O(N log N)';
    timeExplanation = 'Iterative search with logarithmic divide-and-conquer steps.';
  } else if (hasLogarithm) {
    timeComplexity = 'O(log N)';
    timeExplanation = 'Binary search divide-and-conquer strategy halving search space per step.';
  } else if (maxLoopDepth === 1) {
    timeComplexity = 'O(N)';
    timeExplanation = 'Single linear iteration over the input elements.';
  } else if (maxLoopDepth === 2) {
    timeComplexity = 'O(N²)';
    timeExplanation = 'Nested dual loops iterating over pairs of elements.';
  } else if (maxLoopDepth >= 3) {
    timeComplexity = `O(N³)`;
    timeExplanation = `Triple nested loop structure iterating ${maxLoopDepth} levels deep.`;
  }

  // 2. Space Complexity Analysis
  const hasMatrix = /(\[\s*\]\s*\[\s*\]|vector\s*<\s*vector|new\s+Array\([^)]*\)\.fill\([^)]*Array)/.test(cleanCode);
  const hasAuxDataStructure = /\b(new\s+(Map|Set|HashMap|HashSet|ArrayList|Array|vector|unordered_map|unordered_set|stack|queue|CppMap|CppSet)|defaultdict|dict\(\)|set\(\)|list\(\)|\[\]|\{\})\b/.test(cleanCode);

  let spaceComplexity = 'O(1)';
  let spaceExplanation = 'Uses O(1) constant auxiliary space with scalar variables.';

  if (hasMatrix) {
    spaceComplexity = 'O(N²)';
    spaceExplanation = 'Allocates a 2D matrix/grid proportional to N x N.';
  } else if (hasAuxDataStructure || hasRecursion) {
    spaceComplexity = 'O(N)';
    spaceExplanation = 'Allocates auxiliary data structures (Hash Table / Array / Call Stack) proportional to N.';
  }

  return {
    timeComplexity,
    timeExplanation,
    spaceComplexity,
    spaceExplanation
  };
}

/**
 * Calculate realistic Percentile Beats for Runtime and Memory
 */
export function calculatePercentiles(runtimeMs, memoryMb) {
  // Runtime Percentile: faster time -> higher percentile
  let runtimePercentile = 94.2;
  if (runtimeMs <= 5) {
    runtimePercentile = 98.6;
  } else if (runtimeMs <= 20) {
    runtimePercentile = 91.4;
  } else if (runtimeMs <= 50) {
    runtimePercentile = 84.7;
  } else if (runtimeMs <= 100) {
    runtimePercentile = 72.3;
  } else if (runtimeMs <= 250) {
    runtimePercentile = 55.1;
  } else {
    runtimePercentile = 38.5;
  }

  // Memory Percentile: lower memory -> higher percentile
  let memoryPercentile = 88.5;
  if (memoryMb <= 38.5) {
    memoryPercentile = 96.8;
  } else if (memoryMb <= 41.5) {
    memoryPercentile = 91.2;
  } else if (memoryMb <= 45.0) {
    memoryPercentile = 83.4;
  } else {
    memoryPercentile = 64.9;
  }

  return {
    runtimePercentile: Math.min(99.4, Math.max(30.0, Number(runtimePercentile.toFixed(1)))),
    memoryPercentile: Math.min(99.2, Math.max(35.0, Number(memoryPercentile.toFixed(1))))
  };
}

/**
 * Async Analyzer: Attempts Backend LLM API call with fast fallback to static heuristic
 */
export async function analyzeCodeComplexity(code, language, entryFunctionName) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${BACKEND_URL}/api/analyze-complexity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, entryFunctionName }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.timeComplexity && data.spaceComplexity) {
        return data;
      }
    }
  } catch (e) {
    // Fallback to fast static analysis
  }

  return staticAnalyzeComplexity(code, language, entryFunctionName);
}
