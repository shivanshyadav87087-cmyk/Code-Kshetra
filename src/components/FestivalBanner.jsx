import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Gift, Globe } from 'lucide-react';
import { getCurrentFestival, getAsyncCurrentFestival } from '../data/festivals';
import { sounds } from '../engine/soundManager';

export default function FestivalBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeFestival, setActiveFestival] = useState(() => getCurrentFestival());

  useEffect(() => {
    let isMounted = true;

    async function loadLiveHolidays() {
      try {
        const fetched = await getAsyncCurrentFestival('IN');
        if (isMounted && fetched) {
          setActiveFestival(fetched);
        }
      } catch (e) {}
    }

    loadLiveHolidays();
    return () => { isMounted = false; };
  }, []);

  if (!activeFestival || dismissed) return null;

  return (
    <div className={`w-full bg-gradient-to-r ${activeFestival.bgGradient} border ${activeFestival.borderColor} backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 shadow-xl relative overflow-hidden animate-fadeIn my-2 font-sans`}>
      
      {/* Background Animated Sparkles Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        
        {/* Left: Festive Icon & Wishing Text */}
        <div className="flex items-center gap-3">
          
          {/* Festive Artwork Badge */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0 animate-bounce">
            {activeFestival.flag || activeFestival.icon}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`font-black text-xs sm:text-sm tracking-wide ${activeFestival.textColor} flex items-center gap-1.5`}>
                <span>{activeFestival.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-300 font-bold">
                <Globe className="w-2.5 h-2.5" /> Auto Calendar Sync
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-300 font-mono leading-relaxed max-w-2xl">
              {activeFestival.wishingText}
            </p>
          </div>

        </div>

        {/* Right: Close Banner Button */}
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            sounds.playClick();
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
          title="Dismiss Greetings"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
