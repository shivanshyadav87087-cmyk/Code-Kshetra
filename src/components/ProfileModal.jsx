import React, { useState, useRef } from 'react';
import { User, Trophy, Camera, MapPin, Code, Save, X, ExternalLink, Sparkles, Shield, CheckCircle2, Upload, ChevronDown } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';

const BACKEND_URL = 'http://localhost:5000';

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

  // Filter countries based on user input (e.g. typing "I" or "In")
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

    const cleanLc = leetcodeUsername.trim().replace(/^@/, '');

    const updatedData = {
      username: player.name,
      avatarUrl,
      bio,
      location,
      leetcodeUsername: cleanLc
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setPlayer(prev => ({
          ...prev,
          ...data.user,
          name: data.user.username
        }));
      } else {
        setPlayer(prev => ({
          ...prev,
          avatarUrl,
          bio,
          location,
          leetcodeUsername: cleanLc
        }));
      }

      setMsg('Profile updated successfully!');
      sounds.playSubmitSuccess();
      setTimeout(() => {
        setMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      setPlayer(prev => ({
        ...prev,
        avatarUrl,
        bio,
        location,
        leetcodeUsername: cleanLc
      }));
      setMsg('Profile updated!');
      sounds.playSubmitSuccess();
      setTimeout(() => {
        setMsg('');
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">LeetCode Coder Profile</h2>
          </div>
          <button
            onClick={() => { onClose(); sounds.playClick(); }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
          
          {/* Profile Card Header */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <div className="relative group shrink-0">
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md shadow-cyan-500/20"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-cyan-300 transition-all"
                title="Upload Photo from Device"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-1.5">
                  <span>{player.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Code Rating: {player.rating || 0}</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{bio}</p>
              {leetcodeUsername && (
                <a
                  href={`https://leetcode.com/u/${leetcodeUsername}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:underline mt-1"
                >
                  <Code className="w-3 h-3" />
                  <span>LeetCode: @{leetcodeUsername}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Success / Info Message */}
          {msg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-bold">
              {msg}
            </div>
          )}

          {/* Device Photo Upload Section (Clean UI - URL Box Hidden!) */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Upload Profile Photo</span>
              </span>
              <span className="text-[10px] text-slate-500">JPG, PNG, GIF up to 5MB</span>
            </label>

            {/* Hidden File Input */}
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
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/10"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo from Device</span>
            </button>
          </div>

          {/* Custom Bio Textarea */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Profile Bio (About You)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about your coding skills, favorite languages, or LeetCode goals..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 outline-none leading-relaxed resize-none"
            />
          </div>

          {/* LeetCode Handle & Interactive World Country Autocomplete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
                LeetCode Handle
              </label>
              <div className="relative">
                <Code className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="e.g. neetchod"
                  className="w-full bg-slate-950 border border-amber-500/30 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-amber-200 placeholder-slate-600 outline-none font-mono"
                />
              </div>
            </div>

            {/* Interactive World Country Autocomplete Selector */}
            <div className="relative">
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location / Country
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={showCountryDropdown ? countryQuery : location}
                  onFocus={() => { setShowCountryDropdown(true); setCountryQuery(''); }}
                  onChange={(e) => { setCountryQuery(e.target.value); setLocation(e.target.value); setShowCountryDropdown(true); }}
                  placeholder="Type country name (e.g. India, I, In)..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* Autocomplete Dropdown List */}
              {showCountryDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 max-h-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-y-auto z-50 custom-scrollbar p-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-900 rounded-lg flex items-center justify-between text-xs text-slate-200 transition-all"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-sm">{c.flag}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-slate-500 text-center text-xs">No matching country found</div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => { onClose(); sounds.playClick(); }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
