import React, { useState, useEffect } from 'react';
import { Users, Snowflake } from 'lucide-react';
import { socket } from '../engine/socketClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LiveUsersBadge({ className = '' }) {
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    // Listen for live socket count updates
    const handleCountUpdate = (data) => {
      if (data && typeof data.count === 'number') {
        setOnlineCount(Math.max(1, data.count));
      }
    };

    socket.on('online_users_count', handleCountUpdate);

    // Initial fetch health poll fallback
    fetch(`${BACKEND_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.onlineUsers === 'number') {
          setOnlineCount(Math.max(1, data.onlineUsers));
        }
      })
      .catch(() => {});

    return () => {
      socket.off('online_users_count', handleCountUpdate);
    };
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 bg-[#0B132B]/85 border border-sky-400/40 text-sky-200 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all hover:border-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]"></span>
      </span>
      <Users className="w-3.5 h-3.5 text-sky-400" />
      <span>{onlineCount} {onlineCount === 1 ? 'Coder Live' : 'Coders Live'}</span>
    </div>
  );
}
