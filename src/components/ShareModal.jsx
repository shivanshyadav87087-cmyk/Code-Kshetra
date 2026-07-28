import React, { useState } from 'react';
import { Share2, Copy, Check, X, MessageCircle, ExternalLink, Sparkles, Send } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export default function ShareModal({ isOpen, onClose, room, roomId }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Resolve room code safely from either roomId or room prop
  const roomCode = (typeof roomId === 'string' ? roomId : (roomId?.roomId || room?.roomId || room)) || 'CLASH1';
  const shareUrl = `${window.location.origin}/?room=${roomCode}`;
  const shareText = `⚔️ Challenge me to a 1v1 LeetCode Battle on CodeClash!\nRoom Code: ${roomCode}\nJoin Duel: ${shareUrl}`;

  // Robust Clipboard Helper (supports HTTPS & HTTP fallback)
  const copyToClipboard = (text, setSuccessState) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setSuccessState(true);
        sounds.playSubmitSuccess();
        setTimeout(() => setSuccessState(false), 2500);
      }).catch(() => fallbackCopy(text, setSuccessState));
    } else {
      fallbackCopy(text, setSuccessState);
    }
  };

  const fallbackCopy = (text, setSuccessState) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setSuccessState(true);
      sounds.playSubmitSuccess();
      setTimeout(() => setSuccessState(false), 2500);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  // Native Web Share API Trigger
  const handleNativeShare = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeClash 1v1 Duel Invitation',
          text: `⚔️ Join my 1v1 LeetCode Battle on CodeClash! Room Code: ${roomCode}`,
          url: shareUrl
        });
      } catch (err) {}
    } else {
      copyToClipboard(shareUrl, setCopiedLink);
    }
  };

  // WhatsApp One-Click Share
  const handleWhatsAppShare = () => {
    sounds.playClick();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative p-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Share 1v1 Room Code & Link</h2>
          </div>
          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room Code Display Box */}
        <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 text-center mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            YOUR 6-CHARACTER ROOM CODE
          </span>
          
          <div className="font-mono font-extrabold text-3xl text-cyan-300 tracking-widest my-1 select-all">
            {roomCode}
          </div>

          <button
            onClick={() => copyToClipboard(roomCode, setCopiedCode)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-bold mt-2 transition-all shadow-md active:scale-95"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Code Copied! ✓' : 'Copy Room Code'}</span>
          </button>
        </div>

        {/* Direct Shareable URL */}
        <div className="space-y-2 mb-5">
          <label className="block text-xs font-semibold text-slate-300">
            Direct Shareable Duel Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-cyan-200 font-mono outline-none select-all font-bold"
            />
            <button
              onClick={() => copyToClipboard(shareUrl, setCopiedLink)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied! ✓' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Instant Multi-Channel Sharing Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleWhatsAppShare}
            className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Share</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/40 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Send className="w-4 h-4 text-indigo-400" />
            <span>Share Sheet</span>
          </button>
        </div>

      </div>
    </div>
  );
}
