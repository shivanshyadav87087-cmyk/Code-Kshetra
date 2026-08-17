/**
 * Centralized Language Registry & Compiler/Runtime Configuration
 * Maps language identifiers cleanly across Frontend, Backend, Executor, and Judge.
 */

export const LANGUAGE_REGISTRY = {
  cpp: {
    id: 'cpp',
    canonicalId: 'cpp',
    name: 'C++ (GCC 17)',
    aliases: ['c++', 'cpp17', 'g++'],
    compiler: 'g++',
    args: ['-O2', '-std=c++17'],
    extension: '.cpp',
    executableExtension: process.platform === 'win32' ? '.exe' : '.out',
    isCompiled: true,
    executionMode: 'native'
  },
  c: {
    id: 'c',
    canonicalId: 'c',
    name: 'C (GCC 11)',
    aliases: ['gcc'],
    compiler: 'gcc',
    args: ['-O2', '-std=c11'],
    extension: '.c',
    executableExtension: process.platform === 'win32' ? '.exe' : '.out',
    isCompiled: true,
    executionMode: 'native'
  },
  java: {
    id: 'java',
    canonicalId: 'java',
    name: 'Java 17',
    aliases: ['javac'],
    compiler: 'javac',
    runtime: 'java',
    extension: '.java',
    mainClass: 'Solution',
    isCompiled: true,
    executionMode: 'java'
  },
  python: {
    id: 'python',
    canonicalId: 'python',
    name: 'Python 3',
    aliases: ['py', 'python3'],
    runtime: process.platform === 'win32' ? 'python' : 'python3',
    extension: '.py',
    isCompiled: false,
    executionMode: 'script'
  },
  javascript: {
    id: 'javascript',
    canonicalId: 'javascript',
    name: 'JavaScript (Node.js)',
    aliases: ['js', 'node'],
    runtime: 'node',
    extension: '.js',
    isCompiled: false,
    executionMode: 'script'
  }
};

/**
 * Normalizes any raw language string (e.g. 'C++', 'py', 'node') to canonical language ID
 */
export function normalizeLanguageId(rawLang) {
  if (!rawLang) return 'javascript';
  const clean = String(rawLang).trim().toLowerCase();

  for (const [key, config] of Object.entries(LANGUAGE_REGISTRY)) {
    if (config.id === clean || config.canonicalId === clean || config.aliases.includes(clean)) {
      return config.id;
    }
  }

  return 'javascript';
}

export function getLanguageConfig(rawLang) {
  const langId = normalizeLanguageId(rawLang);
  return LANGUAGE_REGISTRY[langId] || LANGUAGE_REGISTRY.javascript;
}
