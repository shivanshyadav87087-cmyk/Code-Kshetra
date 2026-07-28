/**
 * LeetCode-Grade Multi-Language Code Execution Judge Engine
 * Auto-injects standard headers (bits/stdc++.h, climits, vector, etc.),
 * protects against infinite loops (TLE), and classifies verdicts.
 */

// Global Standard Polyfills for C++, Python, Java, and JS
const GLOBAL_HEADER_POLYFILLS = `
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;
  const LLONG_MAX = Number.MAX_SAFE_INTEGER;
  const LLONG_MIN = Number.MIN_SAFE_INTEGER;
  const Integer = { MAX_VALUE: 2147483647, MIN_VALUE: -2147483648 };
  const Long = { MAX_VALUE: Number.MAX_SAFE_INTEGER, MIN_VALUE: Number.MIN_SAFE_INTEGER };
  const sys = { maxsize: Number.MAX_SAFE_INTEGER };
  const math = Math;

  function max(...args) { return Math.max(...args); }
  function min(...args) { return Math.min(...args); }
  function abs(val) { return Math.abs(val); }
  function swap(arr, i, j) { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
  function reverse(arr, start = 0, end = arr.length) {
    let l = start, r = end - 1;
    while (l < r) { swap(arr, l, r); l++; r--; }
  }
  function sort(arr) { arr.sort((a, b) => a - b); }

  let __loopCounter = 0;
  function __checkTLE() {
    if (++__loopCounter > 2500000) {
      throw new Error("Time Limit Exceeded (TLE) - Loop iteration limit exceeded.");
    }
  }
`;

// Flexible LeetCode Deep Equality Check
function isEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a === 'undefined' || typeof b === 'undefined') return false;

  // Boolean normalization
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return Boolean(a) === Boolean(b);
  }

  // Floating point number tolerance
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-4;
  }

  // Array comparison (supports exact order & unsorted primitive matches)
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    let exactMatch = true;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        exactMatch = false;
        break;
      }
    }
    if (exactMatch) return true;

    if (a.every(item => typeof item === 'number' || typeof item === 'string') &&
        b.every(item => typeof item === 'number' || typeof item === 'string')) {
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      for (let i = 0; i < sortedA.length; i++) {
        if (!isEqual(sortedA[i], sortedB[i])) return false;
      }
      return true;
    }

    return false;
  }

  // Object comparison
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!b.hasOwnProperty(key) || !isEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return String(a).trim() === String(b).trim();
}

/**
 * Transpile C++, Python, Java & JS code into executable JS Function
 */
function transpileToJs(code, language, entryFunctionName) {
  let jsCode = code;

  if (language === 'python') {
    // 1. Strip comments & imports
    jsCode = jsCode.replace(/#.*/g, '');
    jsCode = jsCode.replace(/(?:from\s+\w+\s+)?import\s+[\w*,\s]+/g, '');

    // 2. Infinity & sys values
    jsCode = jsCode.replace(/float\(['"]inf['"]\)/g, 'Infinity');
    jsCode = jsCode.replace(/float\(['"]-inf['"]\)/g, '-Infinity');

    // 3. Remove class Solution: wrapper
    jsCode = jsCode.replace(/class\s+Solution\s*(?:\([^)]*\))?\s*:\s*/g, '');

    // 4. Clean function signature: def maxProfit(self, prices: List[int]) -> int:
    jsCode = jsCode.replace(/def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*[^:]+)?\s*:/g, (match, name, args) => {
      const cleanArgs = args.split(',').map(a => a.trim()).filter(a => a && a !== 'self').map(a => a.split(':')[0].trim()).join(', ');
      return `function ${name}(${cleanArgs}) {`;
    });

    // 5. Line-by-line Python indentation stack transpilation
    const lines = jsCode.split('\n');
    const outLines = [];
    const indentStack = [];

    for (let rawLine of lines) {
      let line = rawLine;
      const indentMatch = line.match(/^(\s*)/);
      const indentLevel = indentMatch ? indentMatch[1].length : 0;

      while (indentStack.length > 0 && indentLevel < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        outLines.push('}');
      }

      line = line.replace(/while\s+(.*?):/g, 'while ($1) { __checkTLE();');
      line = line.replace(/for\s+(\w+)\s+in\s+range\((.*?)\)\s*:/g, 'for (let $1 = 0; $1 < $2; $1++) { __checkTLE();');
      line = line.replace(/for\s+(\w+)\s+in\s+(.*?):/g, 'for (let $1 of $2) { __checkTLE();');
      line = line.replace(/elif\s+(.*?):/g, 'else if ($1) {');
      line = line.replace(/if\s+(.*?):/g, 'if ($1) {');
      line = line.replace(/else\s*:/g, 'else {');

      if (line.includes('{')) {
        indentStack.push(indentLevel + 2);
      }

      line = line.replace(/\bTrue\b/g, 'true');
      line = line.replace(/\bFalse\b/g, 'false');
      line = line.replace(/\bNone\b/g, 'null');
      line = line.replace(/\band\b/g, '&&');
      line = line.replace(/\bor\b/g, '||');
      line = line.replace(/\bnot\b/g, '!');
      line = line.replace(/\blen\((.*?)\)/g, '$1.length');

      outLines.push(line);
    }

    while (indentStack.length > 0) {
      indentStack.pop();
      outLines.push('}');
    }

    jsCode = outLines.join('\n');
  } else if (language === 'cpp' || language === 'java') {
    // 1. Strip C++ headers & using namespace std;
    jsCode = jsCode.replace(/#include\s*<.*?>/g, '');
    jsCode = jsCode.replace(/#include\s*".*?"/g, '');
    jsCode = jsCode.replace(/using\s+namespace\s+std\s*;/g, '');

    // 2. Strip class Solution & public:
    jsCode = jsCode.replace(/class\s+Solution\s*\{/g, '');
    jsCode = jsCode.replace(/public\s*:/g, '');

    // 3. Convert C++ initializer list returns FIRST
    jsCode = jsCode.replace(/return\s*\{\s*\}\s*;/g, 'return [];');
    jsCode = jsCode.replace(/return\s*\{([^{}]*)\}\s*;/g, 'return [$1];');

    // 4. Strip trailing C++ class closing brace & semicolon ONLY at end of string
    jsCode = jsCode.trim();
    if (jsCode.endsWith('};')) {
      jsCode = jsCode.substring(0, jsCode.length - 2).trim();
    } else if (jsCode.endsWith('}')) {
      jsCode = jsCode.substring(0, jsCode.length - 1).trim();
    }

    // 5. Convert C++ ranged-for loops: for (int x : vec) -> for (let x of vec)
    jsCode = jsCode.replace(/for\s*\(\s*(?:int|size_t|auto|double|float|long|short|string|char|const\s+[\w<>&]+)\s+(\w+)\s*:\s*(.*?)\)\s*\{/g, 'for (let $1 of $2) { __checkTLE();');

    // 6. Strip C++ / Java return types & parameter types from function signatures
    jsCode = jsCode.replace(/(?:vector<[\w<>,\s]+>&?|int\[\]|int|boolean|bool|string|void|List<[\w<>,\s]+>)\s+(\w+)\s*\((.*?)\)\s*\{/gi, (match, fnName, args) => {
      const cleanArgs = args.split(',').map(arg => {
        const parts = arg.trim().split(/\s+/);
        return parts[parts.length - 1].replace(/[&*]/g, '');
      }).join(', ');
      return `function ${fnName}(${cleanArgs}) {`;
    });

    // 7. Convert C++ / Java index loop variable declarations
    jsCode = jsCode.replace(/for\s*\(\s*(?:int|size_t|auto|double|float|long|short)\s+(\w+)(.*?)\)\s*\{/g, 'for (let $1$2) { __checkTLE();');
    jsCode = jsCode.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) { __checkTLE();');

    // 8. Convert standalone variable initializations: int n = ...; -> let n = ...;
    jsCode = jsCode.replace(/(?:int|double|float|string|bool|auto|vector<[\w<>,\s]+>)\s+(\w+)\s*=/g, 'let $1 =');

    // 9. C++ / Java methods & symbols
    jsCode = jsCode.replace(/\.size\(\)/g, '.length');
    jsCode = jsCode.replace(/\.length\(\)/g, '.length');
    jsCode = jsCode.replace(/\bpush_back\b/g, 'push');
    jsCode = jsCode.replace(/\bstd::/g, '');
  } else if (language === 'javascript' || language === 'typescript') {
    // Inject TLE check into JS while / for loops
    jsCode = jsCode.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) { __checkTLE();');
    jsCode = jsCode.replace(/for\s*\((.*?)\)\s*\{/g, 'for ($1) { __checkTLE();');
  }

  return jsCode;
}

/**
 * Execute User Code against Test Cases with LeetCode Verdict Classification & TLE Sandboxing
 */
export async function runCode(code, language, entryFunctionName, testCases) {
  const startTime = performance.now();
  const results = [];
  let passedCount = 0;
  let hasTLE = false;

  // Clean and transpile user code to JS Function
  let executableCode = code;
  executableCode = transpileToJs(executableCode, language, entryFunctionName);

  // Intercept console.log
  const capturedLogs = [];
  const customConsole = {
    log: (...args) => {
      capturedLogs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args) => {
      capturedLogs.push('[ERROR] ' + args.map(a => String(a)).join(' '));
    },
    warn: (...args) => {
      capturedLogs.push('[WARN] ' + args.map(a => String(a)).join(' '));
    }
  };

  try {
    // Build sandboxed runner function with Auto-Injected Headers & Polyfills
    const wrapperCode = GLOBAL_HEADER_POLYFILLS + "\n\n" +
      executableCode + "\n\n" +
      "__loopCounter = 0;\n" +
      "if (typeof " + entryFunctionName + " === 'function') {\n" +
      "  return " + entryFunctionName + ";\n" +
      "}\n" +
      "if (typeof Solution !== 'undefined') {\n" +
      "  const inst = new Solution();\n" +
      "  if (typeof inst." + entryFunctionName + " === 'function') {\n" +
      "    return inst." + entryFunctionName + ".bind(inst);\n" +
      "  }\n" +
      "}\n" +
      "throw new Error(\"Function '" + entryFunctionName + "' is not defined. Please check your function signature.\");";

    const userFnFactory = new Function('console', wrapperCode);
    const userFn = userFnFactory(customConsole);

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const testStart = performance.now();
      let actualOutput;
      let pass = false;
      let errorMsg = null;

      try {
        const inputClone = JSON.parse(JSON.stringify(tc.input));
        
        // Reset loop counter per testcase
        actualOutput = userFn(...inputClone);

        if (typeof actualOutput === 'undefined' && Array.isArray(inputClone[0])) {
          actualOutput = inputClone[0];
        }
        
        pass = isEqual(actualOutput, tc.expectedOutput);
        if (pass) passedCount++;
      } catch (err) {
        errorMsg = err.message || String(err);
        if (errorMsg.includes('Time Limit Exceeded')) {
          hasTLE = true;
          actualOutput = 'Time Limit Exceeded ⏱️';
        } else {
          actualOutput = 'Runtime Error: ' + errorMsg;
        }
        pass = false;
      }
      const testEnd = performance.now();

      results.push({
        testIndex: i + 1,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: actualOutput,
        passed: pass,
        error: errorMsg,
        executionTimeMs: Math.round((testEnd - testStart) * 100) / 100,
        isSecret: tc.isSecret || false,
        logs: [...capturedLogs]
      });
      capturedLogs.length = 0;
    }
  } catch (outerErr) {
    // Compile Error
    return {
      success: false,
      verdict: 'Compile Error',
      passedCount: 0,
      totalCount: testCases.length,
      runtimeMs: Math.round(performance.now() - startTime),
      error: `[${language.toUpperCase()} Compile Error] ` + (outerErr.message || 'Syntax error in code signature.'),
      results: testCases.map((tc, idx) => ({
        testIndex: idx + 1,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: 'Compile Error',
        passed: false,
        error: outerErr.message,
        executionTimeMs: 0,
        isSecret: tc.isSecret || false,
        logs: [`[${language.toUpperCase()} Compiler Error] ${outerErr.message}`]
      }))
    };
  }

  const endTime = performance.now();
  const totalMs = Math.round(endTime - startTime);

  let verdict = 'Wrong Answer';
  if (passedCount === testCases.length) {
    verdict = 'Accepted';
  } else if (hasTLE) {
    verdict = 'Time Limit Exceeded';
  }

  return {
    success: verdict === 'Accepted',
    verdict,
    passedCount,
    totalCount: testCases.length,
    runtimeMs: totalMs,
    results,
    error: verdict === 'Accepted' ? null : `Verdict: ${verdict}`
  };
}
