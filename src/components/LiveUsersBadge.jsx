import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { socket } from '../engine/socketClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LiveUsersBadge({ className = '' }) {
  const [onlineCount, setOnlineCount] = useState(() => {
    try {
      const cached = sessionStorage.getItem('codekshetra_live_users');
      if (cached && !isNaN(Number(cached))) return Math.max(1, Number(cached));
    } catch (e) {}
    return 1;
  });

  useEffect(() => {
    let isMounted = true;

    const updateCount = (newCount) => {
      if (!isMounted) return;
      const valid = Math.max(1, Number(newCount) || 1);
      setOnlineCount(valid);
      try {
        sessionStorage.setItem('codekshetra_live_users', String(valid));
      } catch (e) {}
    };

    // 1. Socket Live Events
    const handleCountUpdate = (data) => {
      if (data && typeof data.count === 'number') {
        updateCount(data.count);
      }
    };

    const handleConnect = () => {
      socket.emit('get_online_users_count', (res) => {
        if (res && typeof res.count === 'number') {
          updateCount(res.count);
        }
      });
    };

    socket.on('online_users_count', handleCountUpdate);
    socket.on('connect', handleConnect);

    // If socket is already connected on mount, request immediately
    if (socket.connected) {
      handleConnect();
    }

    // 2. HTTP Fetch Poll Fallback (wakes Render server and handles cold start)
    const fetchOnlineUsers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/online-users`);
        const data = await res.json();
        if (data && typeof data.count === 'number') {
          updateCount(data.count);
          return;
        }
      } catch (e) {}

      try {
        const res2 = await fetch(`${BACKEND_URL}/api/health`);
        const data2 = await res2.json();
        if (data2 && (typeof data2.onlineUsers === 'number' || typeof data2.count === 'number')) {
          updateCount(data2.onlineUsers || data2.count);
        }
      } catch (e) {}
    };

    fetchOnlineUsers();

    // 3. Periodic Keep-Alive Sync every 10 seconds
    const pollInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('get_online_users_count', (res) => {
          if (res && typeof res.count === 'number') updateCount(res.count);
        });
      } else {
        fetchOnlineUsers();
      }
    }, 10000);

    return () => {
      isMounted = false;
      socket.off('online_users_count', handleCountUpdate);
      socket.off('connect', handleConnect);
      clearInterval(pollInterval);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 bg-[#0B132B]/85 border border-sky-400/40 text-sky-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-mono font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all hover:border-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] ${className}`}
      title={`${onlineCount} active coder${onlineCount === 1 ? '' : 's'} live on Code क्षेत्र`}
    >
      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]"></span>
      </span>
      <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
      <span className="whitespace-nowrap flex items-center gap-1">
        <span className="font-extrabold text-sky-100">{onlineCount}</span>
        <span className="hidden sm:inline">{onlineCount === 1 ? 'Coder Live' : 'Coders Live'}</span>
        <span className="sm:hidden">Live</span>
      </span>
    </div>
  );
}
