import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function InstallPwaButton({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    sounds.playClick();
    if (!deferredPrompt) {
      // Fallback instruction for iOS / unsupported prompt
      alert('📲 To Install Code क्षेत्र App:\n\n1. On Android/Chrome: Click "Install" or "Add to Home Screen" in your browser menu.\n2. On iPhone/Safari: Tap the Share button (bottom bar) ➔ "Add to Home Screen".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      sounds.playSubmitSuccess();
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      title="Install Code क्षेत्र as a Mobile & Desktop App"
      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold font-mono tracking-wide shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer ${className}`}
    >
      <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
      <span>Install App 📲</span>
    </button>
  );
}
