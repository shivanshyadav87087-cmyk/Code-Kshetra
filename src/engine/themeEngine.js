// Theme Engine for Code क्षेत्र (Winter Frost Theme & Seasonal Transformations)

const THEME_STORAGE_KEY = 'codeclash_theme';
const SNOW_STORAGE_KEY = 'codeclash_snow';

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'cyberpunk' || saved === 'winter') return saved;
  } catch (e) {}
  // Default to Winter Theme!
  return 'winter';
}

export function saveTheme(themeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (e) {}
}

export function getInitialSnow() {
  try {
    const saved = localStorage.getItem(SNOW_STORAGE_KEY);
    if (saved !== null) return saved === 'true';
  } catch (e) {}
  // Default snow ON!
  return true;
}

export function saveSnow(enabled) {
  try {
    localStorage.setItem(SNOW_STORAGE_KEY, String(enabled));
  } catch (e) {}
}

export const WINTER_THEME_CONFIG = {
  id: 'winter',
  name: 'Winter Frost ❄️',
  ambientGlow: 'from-sky-500/30 via-blue-600/25 to-cyan-400/25',
  cardBorder: 'border-sky-400/40 hover:border-cyan-300/60 shadow-[0_0_20px_rgba(56,189,248,0.18)]',
  badgeBg: 'bg-gradient-to-r from-sky-500/15 via-blue-900/30 to-cyan-500/15 border-sky-400/40 text-sky-200',
  buttonGradient: 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-black shadow-[0_0_20px_rgba(56,189,248,0.35)]',
  frostOverlay: 'bg-slate-950/85 backdrop-blur-xl border-sky-500/30',
  accentText: 'text-sky-300',
  accentBorder: 'border-sky-500/40',
  accentRing: 'focus-visible:ring-sky-400'
};

export const CYBERPUNK_THEME_CONFIG = {
  id: 'cyberpunk',
  name: 'Cyberpunk Neon ⚡',
  ambientGlow: 'from-cyan-500/20 via-emerald-600/20 to-purple-500/20',
  cardBorder: 'border-cyan-500/40 hover:border-emerald-400/60',
  badgeBg: 'bg-gradient-to-r from-cyan-500/20 via-slate-900 to-purple-500/20 border-cyan-500/40 text-cyan-300',
  buttonGradient: 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 text-slate-950 font-black',
  frostOverlay: 'bg-slate-950/85 backdrop-blur-xl border-slate-800',
  accentText: 'text-[#14B8A6]',
  accentBorder: 'border-[#14B8A6]/40',
  accentRing: 'focus-visible:ring-[#14B8A6]'
};
