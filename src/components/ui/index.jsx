import React from 'react';
import { Trophy, Swords, Shield, Volume2, VolumeX, LogOut, Code, User, ChevronRight, X, AlertCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../../engine/soundManager';

// 1. BUTTON
export function Button({ variant = 'primary', size = 'md', className = '', children, disabled, loading, onClick, icon: Icon, ...props }) {
  const base = "inline-flex items-center justify-center font-sans font-bold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400";
  
  const variants = {
    primary: "bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 hover:from-sky-300 hover:via-cyan-300 hover:to-blue-400 text-slate-950 font-black shadow-lg shadow-sky-500/25 active:scale-[0.98]",
    frost: "bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-400/40 shadow-lg shadow-sky-500/20 active:scale-[0.98]",
    secondary: "bg-[#0F172A] hover:bg-[#1E293B] text-[#F8FAFC] border border-sky-500/25 hover:border-sky-400/50 active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-sky-500/10 text-slate-400 hover:text-sky-300",
    danger: "bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-[8px] gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-[12px] gap-2",
    lg: "px-6 py-3.5 text-base rounded-[16px] gap-2.5"
  };

  return (
    <button
      onClick={(e) => {
        if (!disabled && !loading) {
          sounds.playClick();
          if (onClick) onClick(e);
        }
      }}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

// 2. CARD
export function Card({ variant = 'default', className = '', children, ...props }) {
  const base = "rounded-[18px] transition-all overflow-hidden";
  const variants = {
    default: "bg-[#0B1120] border border-sky-500/20 shadow-xl",
    glass: "bg-[#0B1120]/80 backdrop-blur-md border border-sky-500/25 shadow-2xl",
    elevated: "bg-[#0F172A] border border-sky-500/25 shadow-2xl hover:border-sky-400/50 hover:shadow-sky-500/10",
    frost: "frost-card"
  };

  return (
    <div className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </div>
  );
}

// 3. BADGE
export function Badge({ variant = 'default', className = '', children }) {
  const variants = {
    default: "bg-white/10 text-slate-300 border border-white/10",
    frost: "bg-sky-500/15 text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
    sky: "bg-sky-500/15 text-sky-300 border border-sky-400/40",
    ice: "bg-cyan-500/15 text-cyan-200 border border-cyan-400/40",
    teal: "bg-sky-500/15 text-sky-300 border border-sky-400/40",
    purple: "bg-blue-600/15 text-blue-300 border border-blue-500/40",
    gold: "bg-amber-500/15 text-amber-300 border border-amber-500/40",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
    danger: "bg-rose-500/15 text-rose-300 border border-rose-500/40"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] text-xs font-mono font-bold border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

// 4. ELO BADGE
export function EloBadge({ rating = 0, className = '' }) {
  let tier = 'Newbie';
  let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (rating >= 2000) {
    tier = 'Guardian 🏆';
    colorClass = 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20';
  } else if (rating >= 1600) {
    tier = 'Knight ⚔️';
    colorClass = 'bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/20';
  } else if (rating >= 900) {
    tier = 'Specialist ⚡';
    colorClass = 'bg-sky-500/15 text-sky-300 border-sky-400/40 shadow-sm shadow-sky-500/20';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${colorClass} ${className}`}>
      <span>{tier}</span>
      <span className="opacity-80">({rating} ELO)</span>
    </span>
  );
}

// 5. INPUT
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      {label && (
        <label className="block text-xs font-bold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-sky-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
        )}
        <input
          className={`w-full bg-[#0B1120] border rounded-[12px] py-2.5 text-sm text-[#F8FAFC] placeholder:text-slate-500 outline-none transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-400 ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${error ? 'border-[#EF4444]' : 'border-sky-500/25'} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[#EF4444] font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// 6. AVATAR
export function Avatar({ src, alt, size = 'md', isOnline, className = '' }) {
  const sizes = {
    sm: "w-8 h-8 rounded-[8px]",
    md: "w-10 h-10 rounded-[12px]",
    lg: "w-14 h-14 rounded-[16px]",
    xl: "w-20 h-20 rounded-[20px]"
  };

  const fallbackSrc = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="relative inline-block shrink-0">
      <img
        src={src || fallbackSrc}
        alt={alt || 'User Avatar'}
        className={`${sizes[size] || sizes.md} object-cover border border-sky-400/30 bg-[#0B1120] shadow-sm ${className}`}
      />
      {isOnline !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0B0F] ${
            isOnline ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-slate-500'
          }`}
        />
      )}
    </div>
  );
}

// 7. COUNTDOWN TIMER
export function CountdownTimer({ seconds = 60, className = '' }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds <= 10;

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-[10px] border transition-all ${
      isUrgent
        ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 animate-pulse'
        : 'bg-[#0B1120] text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
    } ${className}`}>
      <Clock className="w-4 h-4 text-sky-400" />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
}

// 8. TABS
export function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-1 border-b border-sky-500/20 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              sounds.playClick();
              onChange(tab.id);
            }}
            className={`px-4 py-2.5 text-xs font-bold font-sans transition-all border-b-2 cursor-pointer ${
              isActive
                ? 'text-sky-300 border-sky-400 shadow-[0_2px_10px_rgba(56,189,248,0.2)]'
                : 'text-slate-400 hover:text-slate-100 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// 9. STAT CARD
export function StatCard({ label, value, delta, icon: Icon, color = 'sky', className = '' }) {
  return (
    <div className={`p-4 rounded-[16px] bg-[#0B1120] border border-sky-500/25 space-y-1 shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-sky-400" />}
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="text-2xl font-black text-[#F8FAFC] font-mono">{value}</span>
        {delta && (
          <span className={`text-xs font-bold font-mono ${delta.startsWith('+') ? 'text-sky-300' : 'text-[#EF4444]'}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

// 10. PROBLEM DIFFICULTY
export function ProblemDifficulty({ difficulty = 'Easy', className = '' }) {
  const diff = String(difficulty).toLowerCase();
  let styles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (diff === 'medium') styles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  if (diff === 'hard') styles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${styles} ${className}`}>
      {difficulty}
    </span>
  );
}

// 11. EMPTY STATE
export function EmptyState({ title, description, actionText, onAction, icon: Icon = Code }) {
  return (
    <div className="p-12 text-center bg-[#0B1120] border border-sky-500/25 rounded-[22px] max-w-md mx-auto space-y-4 font-sans">
      <div className="w-14 h-14 rounded-[16px] bg-sky-500/15 border border-sky-400/40 text-sky-300 mx-auto flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-[#F8FAFC]">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

// 12. SKELETON
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/5 rounded-[12px] ${className}`} />;
}
