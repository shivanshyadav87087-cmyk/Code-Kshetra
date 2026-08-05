import React, { useState, useRef } from 'react';
import { Swords, Lock, User, Key, ArrowRight, Camera, Code, Sparkles, Upload, CheckCircle2, ShieldCheck, Trophy, MapPin, ChevronDown, Heart, Mail } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { COUNTRIES } from '../data/countries';
import FestivalBanner from './FestivalBanner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function LandingAuthGate({ onAuthSuccess }) {
  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('Competitive Coder ⚔️ | LeetCode Challenger');
  const [location, setLocation] = useState('India 🇮🇳');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Country Autocomplete state
  const [countryQuery, setCountryQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const fileInputRef = useRef(null);

  // Real-Time Password Strength Evaluator
  const evaluatePasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '', width: '0%', tip: '' };
    
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[@#$!%*?&-_]/.test(pass)) score += 1;

    if (pass.length < 6) {
      return {
        label: 'Weak Password 🔴',
        color: 'bg-rose-500 text-rose-400',
        width: '25%',
        tip: 'Password must be at least 6 characters.'
      };
    } else if (score <= 2) {
      return {
        label: 'Medium Password 🟡',
        color: 'bg-amber-500 text-amber-400',
        width: '60%',
        tip: 'Add numbers & special symbols (@#$!) to strengthen.'
      };
    } else {
      return {
        label: 'Strong Password 🟢',
        color: 'bg-emerald-500 text-emerald-400',
        width: '100%',
        tip: 'Strong & secure password!'
      };
    }
  };

  const passStrength = evaluatePasswordStrength(password);

  // Photo file upload from device via FileReader
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

  // Filter countries based on user input
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    sounds.playClick();

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          leetcodeUsername,
          avatarUrl,
          bio,
          location
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('codeclash_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('codeclash_user', JSON.stringify(data.user));
      }

      sounds.playSubmitSuccess();
      onAuthSuccess(data.user);
    } catch (err) {
      setErrorMsg(err.message);
      sounds.playFail();
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Animated Glow Grids */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-emerald-600/20 to-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden relative z-10 p-6 sm:p-8 my-6">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <img src="/favicon.svg" alt="Code क्षेत्र logo" className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent">CODE</span>
            <span className="text-slate-100 font-['Noto_Sans_Devanagari'] font-extrabold">क्षेत्र</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto font-mono">
            Official 1v1 Real-Time Competitive Coding Arena. Boost your Rating by solving questions!
          </p>

          {/* Dynamic Festival & Holiday Greetings Banner */}
          <FestivalBanner />
        </div>

        {/* Auth Mode Tabs: Register vs Sign In */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 font-bold text-xs">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2.5 rounded-xl btn-glow transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New User (Register)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); sounds.playClick(); }}
            className={`flex-1 py-2.5 rounded-xl btn-glow transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Existing User (Sign In)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Registration Extra Fields: Photo Upload (Clean UI) */}
          {mode === 'register' && (
            <div className="flex flex-col items-center justify-center space-y-2 pb-2">
              <div className="relative group">
                <img
                  src={displayAvatar}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-3xl object-cover border-2 border-cyan-500/50 shadow-xl group-hover:opacity-80 transition-all"
                />
                
                {/* Upload Button overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/70 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Hidden HTML File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Device Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Email Address Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </span>
              {mode === 'register' && passStrength.label && (
                <span className={`text-[10px] font-bold ${passStrength.color.split(' ')[1]}`}>
                  {passStrength.label}
                </span>
              )}
            </label>
            
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all"
            />

            {/* Live Password Strength Meter Bar */}
            {mode === 'register' && password && (
              <div className="space-y-1 pt-1">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passStrength.color.split(' ')[0]}`}
                    style={{ width: passStrength.width }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-right">
                  {passStrength.tip}
                </p>
              </div>
            )}
          </div>

          {/* Registration Optional Details */}
          {mode === 'register' && (
            <>
              {/* LeetCode Handle */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>LeetCode Username (Optional)</span>
                </label>
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="e.g. tourist"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-2xl px-4 py-2.5 text-xs font-mono text-amber-300 placeholder:text-slate-600 outline-none"
                />
              </div>

              {/* Country Autocomplete Dropdown */}
              <div className="space-y-1 relative">
                <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
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
                    placeholder="Search country (e.g. India, United States, Japan)..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 outline-none"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />

                  {/* Autocomplete Dropdown List */}
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl max-h-44 overflow-y-auto z-50 shadow-2xl">
                      {filteredCountries.map((c, index) => (
                        <div
                          key={c.code || index}
                          onClick={() => handleSelectCountry(c)}
                          className="px-4 py-2 text-xs font-mono hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/50"
                        >
                          <span className="text-slate-200">{c.name}</span>
                          <span className="text-base">{c.flag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Bio / Tagline</label>
                <input
                  type="text"
                  maxLength={60}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Competitive Coder ⚔️"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 outline-none"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-extrabold text-sm btn-glow-cyan transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            <span>{loading ? 'Processing...' : mode === 'register' ? 'Register Account & Enter Arena' : 'Sign In & Enter Arena'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

        </form>
      </div>

      {/* Sleek Footer */}
      <footer className="text-center text-xs text-slate-400 font-mono mt-4 flex items-center justify-center gap-1.5 py-2">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>by</span>
        <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 bg-clip-text text-transparent tracking-widest text-sm">NOVA</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">Code क्षेत्र 1v1 Arena</span>
      </footer>

    </div>
  );
}
