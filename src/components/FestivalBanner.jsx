import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Gift, Globe, Eye, ChevronRight } from 'lucide-react';
import { FESTIVALS, getCurrentFestival, getAsyncCurrentFestival } from '../data/festivals';
import { sounds } from '../engine/soundManager';

export default function FestivalBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeFestival, setActiveFestival] = useState(() => getCurrentFestival());
  const [imgError, setImgError] = useState(false);
  const [showPreviewSelector, setShowPreviewSelector] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveHolidays() {
      try {
        const fetched = await getAsyncCurrentFestival('IN');
        if (isMounted) {
          // If today is an exact festival day, show it; otherwise keep null unless previewing
          setActiveFestival(prev => prev || fetched);
          setImgError(false);
        }
      } catch (e) {}
    }

    loadLiveHolidays();
    return () => { isMounted = false; };
  }, []);

  const handleSelectPreview = (fest) => {
    setActiveFestival(fest);
    setImgError(false);
    setDismissed(false);
    setShowPreviewSelector(false);
    sounds.playClick();
  };

  // Render Preview Trigger when no festival is active today
  if (!activeFestival && !showPreviewSelector) {
    return (
      <div className="w-full flex items-center justify-end py-1">
        <button
          type="button"
          onClick={() => setShowPreviewSelector(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 text-[11px] font-mono font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Preview Festival Banners</span>
        </button>
      </div>
    );
  }

  // Render Festival Selector Popup
  if (showPreviewSelector) {
    return (
      <div className="w-full bg-slate-900/95 border border-slate-800 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl animate-scaleUp my-3 text-left font-sans">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Select Festival to Preview</span>
          </div>
          <button
            type="button"
            onClick={() => setShowPreviewSelector(false)}
            className="text-slate-400 hover:text-slate-200 text-xs p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FESTIVALS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelectPreview(f)}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-400/50 text-left text-xs text-slate-200 hover:text-amber-300 transition-all cursor-pointer"
            >
              <span className="text-base">{f.flag || f.icon}</span>
              <span className="font-semibold truncate">{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (dismissed) return null;

  const showImage = activeFestival.imageUrl && !imgError;

  return (
    <div className={`w-full bg-slate-900/90 border ${activeFestival.borderColor} backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fadeIn my-3 font-sans`}>
      
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br ${activeFestival.bgGradient} rounded-full blur-3xl pointer-events-none z-0`} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: Medium-Sized Photo & Wishes */}
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          
          {/* Medium-Sized Festival Photo */}
          {showImage ? (
            <div className="relative group shrink-0">
              <img
                src={activeFestival.imageUrl}
                alt={activeFestival.name}
                onError={() => setImgError(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/60 shadow-2xl group-hover:scale-105 transition-all duration-300 bg-slate-950"
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
              
              <button
                type="button"
                onClick={() => setShowPreviewSelector(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-extrabold shadow-sm hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                <Eye className="w-3 h-3 text-cyan-400" /> Switch Festival
              </button>
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
