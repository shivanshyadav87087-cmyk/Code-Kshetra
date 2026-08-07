import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { getCurrentFestival, getAsyncCurrentFestival } from '../data/festivals';
import { sounds } from '../engine/soundManager';

export default function FestivalBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeFestival, setActiveFestival] = useState(() => getCurrentFestival());
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveHolidays() {
      try {
        const fetched = await getAsyncCurrentFestival('IN');
        if (isMounted && fetched) {
          setActiveFestival(fetched);
          setImgError(false);
        }
      } catch (e) {}
    }

    loadLiveHolidays();
    return () => { isMounted = false; };
  }, []);

  // ONLY show banner on an actual festival day! Hide completely on regular days.
  if (!activeFestival || dismissed) return null;

  const showImage = activeFestival.imageUrl && !imgError;

  return (
    <div className={`w-full bg-slate-900/90 border ${activeFestival.borderColor} backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fadeIn my-3 font-sans`}>
      
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br ${activeFestival.bgGradient} rounded-full blur-3xl pointer-events-none z-0`} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: Festival Photo & Wishes */}
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          
          {/* Festival Photo */}
          {showImage ? (
            <div className="relative group shrink-0">
              <img
                src={activeFestival.imageUrl}
                alt={activeFestival.name}
                onError={() => setImgError(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/60 shadow-2xl bg-slate-950"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-950 border border-amber-400/60 flex items-center justify-center text-sm shadow">
                {activeFestival.flag || activeFestival.icon}
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-purple-500/20 border-2 border-amber-400/60 flex items-center justify-center text-4xl shadow-2xl shrink-0 animate-bounce">
              {activeFestival.flag || activeFestival.icon}
            </div>
          )}

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-black text-base sm:text-lg tracking-wide ${activeFestival.textColor} flex items-center gap-1.5`}>
                <span>{activeFestival.title}</span>
                <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed max-w-xl">
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
          className="self-end sm:self-center p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all cursor-pointer shrink-0"
          title="Dismiss Greetings"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
