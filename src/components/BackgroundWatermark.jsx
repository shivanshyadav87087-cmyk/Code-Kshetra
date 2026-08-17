import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, Code2, Terminal, Flame } from 'lucide-react';

const CODING_THOUGHTS = [
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { quote: "Code is like poetry; should be short and concise.", author: "Code क्षेत्र Proverb" }
];

export default function BackgroundWatermark() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % CODING_THOUGHTS.length);
        setFade(true);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentThought = CODING_THOUGHTS[index];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-between p-6 select-none">
      
      {/* Top Background Animated Quote Watermark */}
      <div className={`mt-16 transition-opacity duration-500 max-w-2xl text-center ${fade ? 'opacity-25' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-2 text-cyan-400/40 text-xs font-mono font-bold uppercase tracking-widest mb-1">
          <Quote className="w-4 h-4 text-cyan-500/40 animate-pulse" />
          <span>CODE क्षेत्र INSPIRATIONAL THOUGHT</span>
        </div>
        <blockquote className="text-slate-400/30 text-sm sm:text-base font-mono font-extrabold italic leading-relaxed">
          "{currentThought.quote}"
        </blockquote>
        <div className="text-[11px] font-mono text-purple-400/40 font-bold mt-1">
          — {currentThought.author}
        </div>
      </div>

      {/* Center Cyberpunk Coder Emblem Watermark Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-10 blur-[1px] mix-blend-screen pointer-events-none transition-all duration-1000 animate-pulse">
        <img
          src="/cyberpunk_coder_watermark.jpg"
          alt="Cyberpunk Coder Watermark"
          className="w-full h-full object-cover rounded-full filter saturate-200 contrast-125"
        />
      </div>

      {/* Bottom Background Watermark Bar */}
      <div className={`mb-6 transition-opacity duration-500 text-center ${fade ? 'opacity-20' : 'opacity-0'}`}>
        <div className="inline-flex items-center gap-3 text-slate-500/40 text-xs font-mono tracking-widest uppercase">
          <Code2 className="w-4 h-4 text-cyan-400/30" />
          <span>REAL-TIME 1v1 SPEED DUELS • ELO RATING • MULTI-LANGUAGE COMPILER</span>
          <Terminal className="w-4 h-4 text-purple-400/30" />
        </div>
      </div>

    </div>
  );
}
