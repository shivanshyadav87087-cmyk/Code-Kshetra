/**
 * Standard ELO Rating Calculation Engine (K-factor = 32)
 * Probability formula: E_A = 1 / (1 + 10^((R_B - R_A) / 400))
 */
export function calculateEloChange(winnerRating = 0, loserRating = 0, K = 32) {
  const rW = Number(winnerRating) || 0;
  const rL = Number(loserRating) || 0;

  const expectedWinner = 1 / (1 + Math.pow(10, (rL - rW) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (rW - rL) / 400));

  const winnerGain = Math.max(8, Math.round(K * (1 - expectedWinner)));
  const loserLoss = Math.max(4, Math.round(K * expectedLoser));

  return { winnerGain, loserLoss };
}

/**
 * Competitive Rank Tier Classification
 */
export function getRatingTier(rating = 0) {
  const r = Number(rating) || 0;

  if (r >= 2100) {
    return {
      name: 'Grandmaster',
      badge: '🔴',
      color: 'text-rose-400',
      bg: 'bg-rose-500/20 border-rose-500/40',
      min: 2100,
      nextMin: 3000,
      pct: 100
    };
  }
  if (r >= 1700) {
    return {
      name: 'Master',
      badge: '🧡',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20 border-amber-500/40',
      min: 1700,
      nextMin: 2100,
      pct: Math.min(100, Math.round(((r - 1700) / 400) * 100))
    };
  }
  if (r >= 1300) {
    return {
      name: 'Expert',
      badge: '🟡',
      color: 'text-yellow-300',
      bg: 'bg-yellow-500/20 border-yellow-500/40',
      min: 1300,
      nextMin: 1700,
      pct: Math.min(100, Math.round(((r - 1300) / 400) * 100))
    };
  }
  if (r >= 900) {
    return {
      name: 'Specialist',
      badge: '🟣',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20 border-purple-500/40',
      min: 900,
      nextMin: 1300,
      pct: Math.min(100, Math.round(((r - 900) / 400) * 100))
    };
  }
  if (r >= 500) {
    return {
      name: 'Apprentice',
      badge: '🔵',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20 border-cyan-500/40',
      min: 500,
      nextMin: 900,
      pct: Math.min(100, Math.round(((r - 500) / 400) * 100))
    };
  }

  return {
    name: 'Newbie',
    badge: '🟢',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/40',
    min: 0,
    nextMin: 500,
    pct: Math.min(100, Math.round((r / 500) * 100))
  };
}
