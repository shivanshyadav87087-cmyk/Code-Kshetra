import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Gift, Globe } from 'lucide-react';
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

  if (!activeFestival || dismissed) return null;

  const showImage = activeFestival.imageUrl && !imgError;

  return (
    <div className={`w-full bg-slate-900/90 border ${activeFestival.borderColor} backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fadeIn my-3 font-sans`}>
      
      {/* Background HD Image Overlay with Dark Gradient Tint */}
      {showImage && (
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img
            src={activeFestival.imageUrl}
            alt={activeFestival.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover filter blur-[2px] scale-105"
          />
        </div>
      )}

      {/* Ambient Radial Color Glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br ${activeFestival.bgGradient} rounded-full blur-3xl pointer-events-none z-0`} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: Festival Picture Thumbnail / Artwork Badge & Greetings Content */}
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          
          {/* Festival Picture Thumbnail or Artwork Badge */}
          {showImage ? (
            <div className="relative group shrink-0">
              <img
                src={activeFestival.imageUrl}
                alt={activeFestival.name}
                onError={() => setImgError(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl group-hover:scale-105 transition-all duration-300 bg-slate-950"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-amber-400/60 flex items-center justify-center text-xs shadow">
                {activeFestival.flag || activeFestival.icon}
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-purple-500/20 border-2 border-amber-400/60 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 animate-bounce">
              {activeFestival.flag || activeFestival.icon}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-black text-sm sm:text-base tracking-wide ${activeFestival.textColor} flex items-center gap-1.5`}>
                <span>{activeFestival.title}</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </span>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-extrabold shadow-sm">
                <Globe className="w-3 h-3 text-cyan-400" /> Live Festival Sync
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
