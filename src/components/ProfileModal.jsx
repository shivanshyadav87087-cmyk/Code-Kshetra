import React, { useState, useRef } from 'react';
import { User, Trophy, Camera, MapPin, Code, Save, X, ExternalLink, Sparkles, Shield, CheckCircle2, Upload, ChevronDown } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function ProfileModal({ isOpen, onClose, player, setPlayer }) {
  const [avatarUrl, setAvatarUrl] = useState(player?.avatarUrl || '');
  const [bio, setBio] = useState(player?.bio || 'Competitive Coder ⚔️ | Multi-Language Specialist');
  const [location, setLocation] = useState(player?.location || 'India 🇮🇳');
  const [leetcodeUsername, setLeetcodeUsername] = useState(player?.leetcodeUsername || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Country Autocomplete state
  const [countryQuery, setCountryQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Local Device Photo Upload Handler via FileReader
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result);
        sounds.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().startsWith(countryQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const handleSelectCountry = (country) => {
    setLocation(`${country.name} ${country.flag}`);
    setCountryQuery('');
    setShowCountryDropdown(false);
    sounds.playClick();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    sounds.playClick();

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: player.name,
          avatarUrl,
          bio,
          location,
          leetcodeUsername
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setPlayer(prev => {
        const updated = {
          ...prev,
          avatarUrl: data.user.avatarUrl || avatarUrl,
          bio: data.user.bio || bio,
          location: data.user.location || location,
          leetcodeUsername: data.user.leetcodeUsername || leetcodeUsername
        };
        localStorage.setItem('codeclash_user', JSON.stringify(updated));
        return updated;
      });

      setMsg('Profile updated successfully!');
      sounds.playSubmitSuccess();
      setTimeout(() => {
        setMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      setMsg(err.message);
      sounds.playFail();
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarUrl || player?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-black text-slate-100">User Profile Settings</h2>
          </div>
          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-all btn-glow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs font-mono">
          
          {msg && (
            <div className={`p-3 rounded-xl border text-center font-bold ${
              msg.includes('success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {msg}
            </div>
          )}

          {/* Profile Photo */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group">
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-3xl object-cover border-2 border-cyan-500/50 shadow-xl group-hover:opacity-80 transition-all"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span>Upload</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo from Device</span>
            </button>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-slate-400 font-bold">Username Handle (Locked)</label>
            <input
              type="text"
              disabled
              value={player?.name || ''}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 font-bold cursor-not-allowed opacity-70"
            />
          </div>

          {/* ELO Rating Badge */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-bold">Current ELO Rating</span>
            </div>
            <span className="text-base font-black text-cyan-400">{player?.rating || 0} ELO</span>
          </div>

          {/* LeetCode Username */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>LeetCode Username</span>
            </label>
            <input
              type="text"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              placeholder="e.g. tourist"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2.5 text-amber-300 placeholder:text-slate-600 outline-none"
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-1 relative">
            <label className="text-slate-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Country / Location</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">{location}</span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={countryQuery}
                onFocus={() => setShowCountryDropdown(true)}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setShowCountryDropdown(true);
                }}
                placeholder="Search country..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none"
              />
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />

              {showCountryDropdown && filteredCountries.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl max-h-40 overflow-y-auto z-50 shadow-2xl">
                  {filteredCountries.map(c => (
                    <div
                      key={c.code}
                      onClick={() => handleSelectCountry(c)}
                      className="px-3.5 py-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/50"
                    >
                      <span className="text-slate-200">{c.name}</span>
                      <span className="text-sm">{c.flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Bio / Status Tagline</label>
            <input
              type="text"
              maxLength={60}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Competitive Coder ⚔️"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs btn-glow-cyan transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{loading ? 'Saving...' : 'Save Profile Settings'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
