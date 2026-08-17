/**
 * Output Normalization & Comparison Module
 * Handles safe output comparisons across C++, Java, Python, and JavaScript executions.
 */

export function normalizeOutput(raw) {
  if (raw === null || raw === undefined) return '';
  
  if (typeof raw === 'object') {
    try {
      return JSON.stringify(raw);
    } catch (e) {
      return String(raw);
    }
  }

  let str = String(raw);
  
  // Normalize Windows CRLF to LF
  str = str.replace(/\r\n/g, '\n');

  // Strip trailing whitespace from each line
  str = str.split('\n').map(line => line.trimEnd()).join('\n');

  // Strip leading and trailing newlines/spaces
  return str.trim();
}

/**
 * Compare actual vs expected outputs with configurable mode & type tolerance
 */
export function compareOutputs(actualRaw, expectedRaw, comparisonMode = 'flexible') {
  const actualStr = normalizeOutput(actualRaw);
  const expectedStr = normalizeOutput(expectedRaw);

  if (actualStr === expectedStr) return true;

  // Case-insensitive boolean matching ('true' vs 'True' vs '1')
  if (actualStr.toLowerCase() === expectedStr.toLowerCase()) return true;

  // JSON Deep Equality matching (Arrays & Objects)
  try {
    const actualParsed = typeof actualRaw === 'string' ? JSON.parse(actualStr) : actualRaw;
    const expectedParsed = typeof expectedRaw === 'string' ? JSON.parse(expectedStr) : expectedRaw;

    if (deepEqual(actualParsed, expectedParsed)) return true;
  } catch (e) {
    // Non-JSON format, fall through to token/string matching
  }

  // Floating point number tolerance
  const actualNum = Number(actualStr);
  const expectedNum = Number(expectedStr);
  if (!isNaN(actualNum) && !isNaN(expectedNum)) {
    if (Math.abs(actualNum - expectedNum) < 1e-4) return true;
  }

  // Token-based matching (ignore whitespace differences between elements)
  const actualTokens = actualStr.split(/\s+/).filter(Boolean);
  const expectedTokens = expectedStr.split(/\s+/).filter(Boolean);

  if (actualTokens.length === expectedTokens.length) {
    let match = true;
    for (let i = 0; i < actualTokens.length; i++) {
      const a = actualTokens[i];
      const e = expectedTokens[i];
      if (a !== e && a.toLowerCase() !== e.toLowerCase()) {
        const numA = Number(a);
        const numE = Number(e);
        if (isNaN(numA) || isNaN(numE) || Math.abs(numA - numE) >= 1e-4) {
          match = false;
          break;
        }
      }
    }
    if (match) return true;
  }

  return false;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a === 'undefined' || typeof b === 'undefined') return false;

  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return Boolean(a) === Boolean(b);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-4;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    // Order-sensitive check
    let exact = true;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) { exact = false; break; }
    }
    if (exact) return true;

    // Unsorted primitive elements check (e.g. return pairs or indices in any order)
    if (a.every(x => typeof x === 'number' || typeof x === 'string') &&
        b.every(x => typeof x === 'number' || typeof x === 'string')) {
      const sortA = [...a].sort();
      const sortB = [...b].sort();
      for (let i = 0; i < sortA.length; i++) {
        if (!deepEqual(sortA[i], sortB[i])) return false;
      }
      return true;
    }
    return false;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!b.hasOwnProperty(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return String(a).trim() === String(b).trim();
}
