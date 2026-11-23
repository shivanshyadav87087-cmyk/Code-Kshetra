import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, Code2, Terminal, Snowflake } from 'lucide-react';

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
      
      {/* Top Background Animated Quote Watermark with Winter Frost */}
      <div className={`mt-16 transition-opacity duration-500 max-w-2xl text-center ${fade ? 'opacity-30' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-2 text-sky-400/50 text-xs font-mono font-bold uppercase tracking-widest mb-1">
          <Snowflake className="w-3.5 h-3.5 text-sky-300/60 animate-pulse" />
          <span>CODE क्षेत्र WINTER EDITION • INSPIRATIONAL THOUGHT</span>
          <Snowflake className="w-3.5 h-3.5 text-sky-300/60 animate-pulse" />
        </div>
        <blockquote className="text-slate-300/35 text-sm sm:text-base font-mono font-extrabold italic leading-relaxed">
          "{currentThought.quote}"
        </blockquote>
        <div className="text-[11px] font-mono text-sky-300/40 font-bold mt-1">
          — {currentThought.author}
        </div>
      </div>

      {/* Center Coder Emblem Watermark Graphic with Frost Tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-10 blur-[1px] mix-blend-screen pointer-events-none transition-all duration-1000 animate-pulse">
        <img
          src="/cyberpunk_coder_watermark.jpg"
          alt="Code Kshetra Watermark"
          className="w-full h-full object-cover rounded-full filter saturate-150 contrast-125"
        />
      </div>

      {/* Bottom Background Watermark Bar */}
      <div className={`mb-6 transition-opacity duration-500 text-center ${fade ? 'opacity-25' : 'opacity-0'}`}>
        <div className="inline-flex items-center gap-3 text-sky-300/35 text-xs font-mono tracking-widest uppercase">
          <Code2 className="w-4 h-4 text-sky-400/40" />
          <span>WINTER SPEED DUELS ❄️ • REAL-TIME 1v1 ARENA • ELO RATING • MULTI-LANGUAGE JUDGE</span>
          <Terminal className="w-4 h-4 text-blue-400/40" />
        </div>
      </div>

    </div>
  );
}
