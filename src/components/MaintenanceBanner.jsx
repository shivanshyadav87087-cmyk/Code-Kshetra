import React, { useState, useEffect } from 'react';
import { Wrench, ShieldAlert, Sparkles, X, RefreshCw } from 'lucide-react';
import { sounds } from '../engine/soundManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function MaintenanceBanner() {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if maintenance mode is enabled locally or from server
    const localMaintenance = localStorage.getItem('codeclash_maintenance_notice');
    if (localMaintenance === 'true') {
      setMaintenance(true);
      setMessage('⚙️ SITE UPDATE NOTICE: New features are currently being deployed to Code क्षेत्र! Real-time duels and features are being updated live.');
    }

    // Fetch server health status
    fetch(`${BACKEND_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data && data.maintenance) {
          setMaintenance(true);
          setMessage(data.message || '⚙️ SITE UNDER MAINTENANCE: Live feature updates in progress!');
        }
      })
      .catch(() => {
        // Silent fallback
      });
  }, []);

  if (!maintenance || dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs font-mono font-bold flex items-center justify-between z-50 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 max-w-4xl mx-auto text-center sm:text-left">
        <Wrench className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
        <span className="leading-tight">
          {message || '⚙️ SITE UNDER MAINTENANCE & UPDATE: New platform features are being deployed live on Code क्षेत्र! Thank you for your patience.'}
        </span>
      </div>

      <button
        onClick={() => {
          setDismissed(true);
          sounds.playClick();
        }}
        className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-300 transition-all shrink-0 cursor-pointer ml-2"
        title="Dismiss Maintenance Warning"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
