import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RoomLobby from './components/RoomLobby';
import ProblemDescription from './components/ProblemDescription';
import CodeEditor from './components/CodeEditor';
import TestConsole from './components/TestConsole';
import OpponentPanel from './components/OpponentPanel';
import PostMatchModal from './components/PostMatchModal';
import SolutionViewerModal from './components/SolutionViewerModal';
import AuthModal from './components/AuthModal';
import LeaderboardModal from './components/LeaderboardModal';
import ShareModal from './components/ShareModal';
import ChatPanel from './components/ChatPanel';
import JoinToast from './components/JoinToast';
import RematchModal from './components/RematchModal';
import ProfileModal from './components/ProfileModal';
import LandingAuthGate from './components/LandingAuthGate';
import Layer3MatchStartOverlay from './components/Layer3MatchStartOverlay';
import { Heart, Sparkles, Maximize2, ShieldAlert } from 'lucide-react';

import { roomEngine } from './engine/roomEngine';
import { socket } from './engine/socketClient';
import { sounds } from './engine/soundManager';

import { getCurrentFestival } from './data/festivals';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = Boolean(localStorage.getItem('codeclash_token'));
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room') || urlParams.get('join') || urlParams.get('code');
    const hash = window.location.hash;
    const hasRoomInHash = hash && (hash.includes('room=') || hash.includes('join='));
    return hasToken || Boolean(roomParam) || Boolean(hasRoomInHash);
  });

  const [player, setPlayer] = useState(() => {
    try {
      const savedUser = localStorage.getItem('codeclash_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const nameToUse = parsed.username || parsed.name || ('Coder_' + Math.floor(Math.random() * 899 + 100));
        return {
          id: parsed._id || parsed.id || ('user_' + Math.floor(Math.random() * 89999 + 10000)),
          email: parsed.email || '',
          name: nameToUse,
          rating: parsed.rating !== undefined ? parsed.rating : 1200,
          wins: parsed.wins || 0,
          losses: parsed.losses || 0,
          draws: parsed.draws || 0,
          totalMatches: parsed.totalMatches || 0,
          avatarUrl: parsed.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          bio: parsed.bio || 'Competitive Coder ⚔️ | Multi-Language Specialist',
          location: parsed.location || 'India 🇮🇳',
          leetcodeUsername: parsed.leetcodeUsername || ''
        };
      }
    } catch (e) {}

    const defaultName = 'Coder_' + Math.floor(Math.random() * 899 + 100);
    return {
      id: 'user_' + Math.floor(Math.random() * 89999 + 10000),
      email: '',
      name: defaultName,
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      totalMatches: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: 'Competitive Coder ⚔️ | Multi-Language Specialist',
      location: 'India 🇮🇳',
      leetcodeUsername: ''
    };
  });

  const [room, setRoom] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  const [myProgress, setMyProgress] = useState({ passed: 0, total: 4, status: 'Coding...' });
  const [opponentProgress, setOpponentProgress] = useState({ passed: 0, total: 4, status: 'Waiting...' });
  
  const [mySubmission, setMySubmission] = useState(null);
  const [opponentSubmission, setOpponentSubmission] = useState(null);
  const [showPostMatch, setShowPostMatch] = useState(false);
  const [showMatchStartOverlay, setShowMatchStartOverlay] = useState(false);

  // Solution Viewer & Auto Matchmaking State
  const [showSolutionViewerModal, setShowSolutionViewerModal] = useState(false);
  const [winningSolutionData, setWinningSolutionData] = useState(null);
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);

  // SPECTATOR MODE STATE
  const [isSpectator, setIsSpectator] = useState(false);
  const [spectateTarget, setSpectateTarget] = useState('host'); // 'host' or 'guest'

  const [pendingRoomId, setPendingRoomId] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room') || urlParams.get('join') || urlParams.get('code');
      if (roomParam) {
        return roomParam.toUpperCase();
      }
      const hash = window.location.hash;
      if (hash && (hash.includes('room=') || hash.includes('join='))) {
        const extracted = hash.split(/room=|join=/)[1]?.split('&')[0]?.toUpperCase();
        if (extracted) {
          return extracted;
        }
      }
      return '';
    } catch (e) {
      return '';
    }
  });

  // Mobile Arena Tab Switcher ('problem' | 'editor')
  const [mobileArenaTab, setMobileArenaTab] = useState('editor');

  // Fullscreen State
  const [isFullscreenActive, setIsFullscreenActive] = useState(() => Boolean(document.fullscreenElement));

  // Auto-join contest room on initial load if user is already authenticated and has a contest link
  useEffect(() => {
    if (isAuthenticated && pendingRoomId && !room) {
      const targetRoom = pendingRoomId;
      sessionStorage.removeItem('pending_contest_room');
      setPendingRoomId('');
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}

      handleJoinRoom({ roomId: targetRoom, userName: player.name }, (res) => {
        if (!res || !res.success) {
          alert(res?.error || `Room code "${targetRoom}" not found or expired.`);
        }
      });
    }
  }, [isAuthenticated, pendingRoomId, room]);

  // Sync player profile with server on load if authenticated
  useEffect(() => {
    const queryKey = player.email || player.name;
    if (isAuthenticated && queryKey) {
      fetch(`${BACKEND_URL}/api/auth/me?email=${encodeURIComponent(queryKey)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.user) {
            setPlayer(prev => ({
              ...prev,
              email: data.user.email || prev.email,
              name: data.user.username || prev.name,
              rating: data.user.rating !== undefined ? data.user.rating : prev.rating,
              wins: data.user.wins || prev.wins,
              losses: data.user.losses || prev.losses,
              draws: data.user.draws || prev.draws,
              totalMatches: data.user.totalMatches || prev.totalMatches,
              avatarUrl: data.user.avatarUrl || prev.avatarUrl,
              bio: data.user.bio || prev.bio,
              location: data.user.location || prev.location,
              leetcodeUsername: data.user.leetcodeUsername || prev.leetcodeUsername
            }));
            localStorage.setItem('codeclash_user', JSON.stringify(data.user));
          } else {
            // Missing profile on server -> auto-register guest instance on backend, NEVER call handleSignOut()!
            fetch(`${BACKEND_URL}/api/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: queryKey,
                email: player.email || `${queryKey.toLowerCase()}@codekshetra.com`,
                password: 'GuestPassword123!'
              })
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Helper to persist rating delta & match result to server & localStorage
  const syncPlayerStats = async (ratingDelta, result) => {
    const queryKey = player.email || player.name;
    if (!queryKey) return;

    try {
      const newRating = Math.max(0, (player.rating || 0) + ratingDelta);
      const newWins = result === 'win' ? (player.wins || 0) + 1 : (player.wins || 0);
      const newLosses = result === 'loss' ? (player.losses || 0) + 1 : (player.losses || 0);

      setPlayer(prev => {
        const updated = {
          ...prev,
          rating: newRating,
          wins: newWins,
          losses: newLosses,
          totalMatches: (prev.totalMatches || 0) + 1
        };
        localStorage.setItem('codeclash_user', JSON.stringify(updated));
        return updated;
      });

      await fetch(`${BACKEND_URL}/api/auth/update-stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: player.email,
          username: player.name,
          ratingDelta,
          result
        })
      });
    } catch (e) {}
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreenActive(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Global Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 'sys_1', sender: 'System', text: '⚔️ 1v1 Match started! Good luck & happy coding!', isSystem: true, timestamp: new Date() }
  ]);

  // Pop-up Toast State
  const [joinNotification, setJoinNotification] = useState(null);

  // Rematch Modal State
  const [rematchRequesterName, setRematchRequesterName] = useState(null);
  const [rematchReadyText, setRematchReadyText] = useState('');

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Global Chat, Rematch Timeout & Anti-Cheat Socket Handler
  useEffect(() => {
    const handleGlobalChatMessage = (msg) => {
      setChatMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      sounds.playTick();
      if (!showChatPanel) {
        setUnreadChatCount(prev => prev + 1);
      }
    };

    const handleRematchTimeout = () => {
      sounds.playFail();
      setRematchRequesterName(null);
      setRematchReadyText('');
      setJoinNotification({ username: 'Rematch', text: 'request timed out after 30s.' });
    };

    const handleRematchFailed = (data) => {
      sounds.playFail();
      setRematchRequesterName(null);
      setRematchReadyText('');
      setJoinNotification({ username: 'Rematch Error', text: data?.error || 'Opponent is no longer available.' });
    };

    const handleAntiCheatWarning = (data) => {
      setJoinNotification({
        username: 'Fair Play Guard',
        text: data.message
      });
    };

    socket.on('receive_chat_message', handleGlobalChatMessage);
    socket.on('rematch_timeout', handleRematchTimeout);
    socket.on('rematch_failed', handleRematchFailed);
    socket.on('anti_cheat_warning', handleAntiCheatWarning);

    return () => {
      socket.off('receive_chat_message', handleGlobalChatMessage);
      socket.off('rematch_timeout', handleRematchTimeout);
      socket.off('rematch_failed', handleRematchFailed);
      socket.off('anti_cheat_warning', handleAntiCheatWarning);
    };
  }, [showChatPanel]);

  // SPECTATOR SOCKET LISTENERS
  useEffect(() => {
    const handleSpectatorCodeStream = (data) => {
      if (isSpectator) {
        if (data.role === spectateTarget) {
          setCode(data.code || '');
          if (data.language) setSelectedLanguage(data.language);
        }
      }
    };

    const handleSpectatorUpdate = (data) => {
      setRoom(prev => {
        if (!prev) return prev;
        return { ...prev, spectators: data.spectators };
      });
    };

    socket.on('spectator_code_stream', handleSpectatorCodeStream);
    socket.on('spectator_update', handleSpectatorUpdate);

    return () => {
      socket.off('spectator_code_stream', handleSpectatorCodeStream);
      socket.off('spectator_update', handleSpectatorUpdate);
    };
  }, [isSpectator, spectateTarget]);

  // Broadcast player code typing to spectators
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (room && !isSpectator) {
      socket.emit('player_code_update', {
        roomId: room.roomId,
        code: newCode,
        language: selectedLanguage
      });
    }
  };

  // Switch Spectator Target Player Perspective
  const handleSwitchSpectateTarget = (targetRole) => {
    setSpectateTarget(targetRole);
    if (room) {
      socket.emit('switch_spectate_target', {
        roomId: room.roomId,
        targetRole
      });
    }
  };

  // Persistent Single RoomEngine Subscription
  useEffect(() => {
    const unsubscribe = roomEngine.subscribe((eventType, payload) => {
      if (eventType === 'PLAYER_JOINED_TOAST') {
        setJoinNotification(payload);
      } else if (eventType === 'PLAYER_LEFT_MATCH') {
        if (isSpectator) return;
        sounds.playSubmitSuccess();
        setJoinNotification({
          username: payload.leaverName,
          text: `left the duel! You are declared WINNER (+10 Rating)! 🏆`
        });

        syncPlayerStats(10, 'win');
        
        setRoom(prev => prev ? {
          ...prev,
          status: 'ended',
          winnerUsername: payload.winnerName,
          matchEndReason: 'opponent-forfeit',
          winningSolution: null
        } : null);

        setMySubmission(null);
        setOpponentSubmission(null);

        setTimeout(() => {
          setShowPostMatch(true);
        }, 800);
      } else if (eventType === 'MATCH_ENDED') {
        sounds.playSubmitSuccess();
        setRoom(prev => prev ? {
          ...prev,
          status: 'ended',
          winnerUsername: payload.winnerUsername,
          matchEndReason: payload.matchEndReason || 'accepted-submission',
          winningSolution: payload.winningSolution
        } : null);

        if (payload.winningSolution) {
          setWinningSolutionData(payload.winningSolution);
        }

        const isWinnerMe = payload.winnerUsername === player.name;
        if (isWinnerMe) {
          syncPlayerStats(25, 'win');
          setMySubmission(payload.submission || payload.result);
        } else {
          syncPlayerStats(-5, 'loss');
          setOpponentSubmission(payload.submission || payload.result);
        }

        setTimeout(() => {
          setShowPostMatch(true);
        }, 800);
      } else if (eventType === 'SUBMISSION_EVALUATED') {
        if (payload.result) {
          setMyProgress({
            passed: payload.result.passedCount,
            total: payload.result.totalCount,
            status: payload.result.verdict
          });
        }
      } else if (eventType === 'REMATCH_REQUESTED') {
        sounds.playTick();
        setRematchRequesterName(payload.requesterName);
        setRematchReadyText(`Waiting for all players... (${payload.readyCount || 1}/${payload.totalCount || 2} Ready)`);
      } else if (eventType === 'REMATCH_READY_UPDATE') {
        sounds.playTick();
        setRematchReadyText(`Waiting for all players... (${payload.readyCount}/${payload.totalCount} Ready)`);
      } else if (eventType === 'REMATCH_DECLINED') {
        sounds.playFail();
        setRematchRequesterName(null);
        setRematchReadyText('');
        setJoinNotification({ username: payload.declinerName, text: 'declined the rematch request.' });
      } else if (eventType === 'ROOM_UPDATED') {
        setRoom({ ...payload });
      } else if (eventType === 'MATCH_START') {
        setIsSearchingMatch(false);
        sounds.playSubmitSuccess();
        
        const freshRoom = JSON.parse(JSON.stringify(payload));
        setRoom(freshRoom);
        setShowMatchStartOverlay(true);

        setShowPostMatch(false);
        setShowSolutionViewerModal(false);
        setWinningSolutionData(null);
        setRematchRequesterName(null);
        setRematchReadyText('');

        if (!isSpectator) {
          const initialTemplate = freshRoom.problem?.starterTemplates?.[selectedLanguage] ||
                                  freshRoom.problem?.starterTemplates?.javascript ||
                                  '// Write solution here';
          setCode(initialTemplate);
        }

        setMySubmission(null);
        setOpponentSubmission(null);
        setMyProgress({ passed: 0, total: freshRoom.problem?.testCases?.length || 4, status: 'Coding...' });
        setOpponentProgress({ passed: 0, total: freshRoom.problem?.testCases?.length || 4, status: 'Coding...' });
      } else if (eventType === 'OPPONENT_PROGRESS') {
        setOpponentProgress(payload);
      } else if (eventType === 'OPPONENT_SUBMITTED') {
        setOpponentSubmission(payload);
        setOpponentProgress({ passed: payload.passedCount, total: payload.totalCount, status: 'Submitted!' });
      }
    });

    return () => unsubscribe();
  }, [selectedLanguage, isSpectator, player.name]);

  const handleFetchWinningSolution = () => {
    if (winningSolutionData) {
      setShowSolutionViewerModal(true);
      return;
    }

    roomEngine.fetchWinningSolution(room?.roomId, (res) => {
      if (res && res.success && res.winningSolution) {
        setWinningSolutionData(res.winningSolution);
        setShowSolutionViewerModal(true);
      } else {
        alert(res?.error || 'Winning solution not available for this match.');
      }
    });
  };

  const handleAcceptRematch = () => {
    const targetRoomId = room?.roomId || roomEngine.currentRoom?.roomId;
    roomEngine.acceptRematch(targetRoomId);
    setRematchRequesterName(null);
    setShowPostMatch(false);

    if (!room && roomEngine.currentRoom) {
      setRoom(roomEngine.currentRoom);
    }
  };

  const handleDeclineRematch = () => {
    const targetRoomId = room?.roomId || roomEngine.currentRoom?.roomId;
    roomEngine.declineRematch(targetRoomId);
    setRematchRequesterName(null);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    const updated = {
      id: userData.id || userData._id,
      email: userData.email || '',
      name: userData.username || (userData.email ? userData.email.split('@')[0] : ''),
      rating: userData.rating !== undefined ? userData.rating : 0,
      wins: userData.wins || 0,
      losses: userData.losses || 0,
      draws: userData.draws || 0,
      totalMatches: userData.totalMatches || 0,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: userData.bio || 'Competitive Coder ⚔️ | Multi-Language Specialist',
      location: userData.location || 'India 🇮🇳',
      leetcodeUsername: userData.leetcodeUsername || ''
    };

    setPlayer(updated);
    localStorage.setItem('codeclash_user', JSON.stringify(updated));

    setRoom(null);
    setIsSpectator(false);

    // Auto-join contest room ONLY if URL contains explicit room link parameter
    const urlParams = new URLSearchParams(window.location.search);
    const targetRoom = urlParams.get('room') || urlParams.get('join') || urlParams.get('code');
    if (targetRoom) {
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}

      handleJoinRoom({ roomId: targetRoom.toUpperCase(), userName: updated.name }, (res) => {
        if (!res || !res.success) {
          alert(res?.error || `Room code "${targetRoom}" not found or expired.`);
        }
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('codeclash_token');
    localStorage.removeItem('codeclash_user');
    sessionStorage.removeItem('pending_contest_room');
    setIsAuthenticated(false);
    setRoom(null);
    setIsSpectator(false);
    setPlayer({
      id: 'user_' + Math.floor(Math.random() * 89999 + 10000),
      email: '',
      name: '',
      rating: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalMatches: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: 'Competitive Coder ⚔️ | Multi-Language Specialist',
      location: 'India 🇮🇳',
      leetcodeUsername: ''
    });
    roomEngine.stop();
  };

  const handleCreateRoom = ({ userName, topic, difficulty, maxPlayers = 2, timeLimit, password, isBot, customProblem } = {}) => {
    const validName = userName || player.name || ('Coder_' + Math.floor(Math.random() * 899 + 100));
    const p = { ...player, name: validName };
    setPlayer(p);
    setIsSpectator(false);
    
    roomEngine.createRoom({
      player: p,
      topic,
      difficulty,
      maxPlayers,
      timeLimit,
      password,
      isBot,
      customProblem
    }, (res) => {
      if (res && res.success && res.room) {
        setRoom(res.room);
        setShowMatchStartOverlay(Boolean(isBot));
        const template = res.room.problem?.starterTemplates?.[selectedLanguage] || res.room.problem?.starterTemplates?.javascript || '';
        setCode(template);
        setMyProgress({ passed: 0, total: res.room.problem?.testCases?.length || 4, status: 'Coding...' });
        setOpponentProgress({ passed: 0, total: res.room.problem?.testCases?.length || 4, status: isBot ? 'Coding...' : 'Waiting for opponent...' });
      }
    });
  };

  const handleJoinRoom = ({ roomId, password, userName, asSpectator = false }, cb) => {
    const validName = userName || player.name || ('Coder_' + Math.floor(Math.random() * 899 + 100));
    const p = { ...player, name: validName };
    setPlayer(p);
    
    roomEngine.joinRoom({ roomId, password, player: p, asSpectator }, (res) => {
      if (res && res.success && res.room) {
        setRoom(res.room);
        setShowMatchStartOverlay(true);
        setIsSpectator(Boolean(res.isSpectator));
        if (res.isSpectator) {
          setSpectateTarget('host');
          setCode(res.room.hostCode || res.room.problem?.starterTemplates?.javascript || '');
        } else {
          const template = res.room.problem?.starterTemplates?.[selectedLanguage] || res.room.problem?.starterTemplates?.javascript || '';
          setCode(template);
        }
        setMyProgress({ passed: 0, total: res.room.problem?.testCases?.length || 4, status: 'Coding...' });
        setOpponentProgress({ passed: 0, total: res.room.problem?.testCases?.length || 4, status: 'Coding...' });
      }
      
      if (typeof cb === 'function') cb(res);
    });
  };

  const handleAutoMatch = ({ userName, rating }) => {
    const validName = userName || player.name || ('Coder_' + Math.floor(Math.random() * 899 + 100));
    const p = { ...player, name: validName, rating: rating !== undefined ? rating : player.rating };
    setPlayer(p);
    setIsSpectator(false);
    setIsSearchingMatch(true);

    roomEngine.findMatch({ player: p }, (res) => {
      if (res && !res.success) {
        setIsSearchingMatch(false);
        sounds.playFail();
        alert(res.error || 'Failed to enter matchmaking queue.');
      }
    });
  };

  const handleCancelAutoMatch = () => {
    roomEngine.cancelMatch();
    setIsSearchingMatch(false);
  };

  useEffect(() => {
    const handleDisconnect = () => {
      if (isSearchingMatch) {
        setIsSearchingMatch(false);
        setJoinNotification({
          username: 'Matchmaking Error',
          text: 'Disconnected from server while searching for match.'
        });
      }
    };
    socket.on('disconnect', handleDisconnect);
    return () => socket.off('disconnect', handleDisconnect);
  }, [isSearchingMatch]);

  const handleLeaveRoom = () => {
    if (room && room.status === 'in-progress' && !isSpectator) {
      sounds.playFail();
      syncPlayerStats(-5, 'loss');
      setJoinNotification({
        username: 'You',
        text: 'forfeited the match (-5 Rating).'
      });
    }

    roomEngine.leaveRoom(room?.roomId);
    setRoom(null);
    setIsSpectator(false);
    setShowPostMatch(false);
    setShowSolutionViewerModal(false);
    setWinningSolutionData(null);
    setMySubmission(null);
    setOpponentSubmission(null);
  };

  const handleProgressUpdate = (passed, total, statusText) => {
    if (isSpectator) return;
    const progressObj = { passed, total, status: statusText };
    setMyProgress(progressObj);
    if (room) {
      roomEngine.sendProgress(room.roomId, progressObj);
    }
  };

  const handleSubmitSolution = (submissionResult) => {
    if (isSpectator) return;
    setMySubmission(submissionResult);
    if (room) {
      roomEngine.submitSolution(room.roomId, {
        code,
        language: selectedLanguage,
        submission: submissionResult
      });
    }
  };

  const activeFest = getCurrentFestival();
  const ambientThemeGlow = activeFest?.theme?.ambientGlow || 'from-cyan-500/20 via-emerald-600/20 to-purple-500/20';

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#14B8A6]/30 selection:text-[#14B8A6] overflow-x-hidden relative">
      
      {/* Dynamic Ambient Background Mesh */}
      <div className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr ${ambientThemeGlow} rounded-full blur-[140px] pointer-events-none -z-10 animate-float-slow`} />

      {!isAuthenticated ? (
        <LandingAuthGate
          isAuthenticated={isAuthenticated}
          player={player}
          onAuthSuccess={handleAuthSuccess}
          onSignOut={handleSignOut}
        />
      ) : (
        <>
          {/* Single Unified Navbar */}
          <Navbar
            isAuthenticated={isAuthenticated}
            player={player}
            room={room}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onSignOut={handleSignOut}
            onLeaveRoom={handleLeaveRoom}
          />

          {/* Main Container */}
          <main className="flex-1 flex flex-col p-2 sm:p-4 gap-3 max-w-[1920px] mx-auto w-full overflow-hidden">
            {!room ? (
              /* Lobby State */
              <RoomLobby
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                onAutoMatch={handleAutoMatch}
                onCancelAutoMatch={handleCancelAutoMatch}
                isSearchingMatch={isSearchingMatch}
                player={player}
                setPlayer={setPlayer}
              />
            ) : (
          /* Active Arena State (100% Responsive Fitted Height) */
          <div className="flex-1 flex flex-col gap-3 lg:h-[calc(100vh-76px)] overflow-y-auto lg:overflow-hidden">
            
            {/* Top Opponent HUD Panel */}
            <OpponentPanel
              room={room}
              myProgress={myProgress}
              opponentProgress={opponentProgress}
              timeLimitMinutes={room.timeLimit || 10}
              onTimeExpired={() => setShowPostMatch(true)}
              onOpenChat={() => {
                setShowChatPanel(true);
                setUnreadChatCount(0);
              }}
              onOpenShare={() => setShowShareModal(true)}
              unreadChatCount={unreadChatCount}
              isSpectator={isSpectator}
              spectateTarget={spectateTarget}
              onSwitchSpectateTarget={handleSwitchSpectateTarget}
            />

            {/* Mobile Tab View Switcher (< 1024px) */}
            <div className="flex lg:hidden bg-slate-900 border border-slate-800 p-1.5 rounded-2xl font-mono text-xs font-bold shrink-0 shadow-lg">
              <button
                type="button"
                onClick={() => setMobileArenaTab('problem')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mobileArenaTab === 'problem'
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📝 Problem Description
              </button>
              <button
                type="button"
                onClick={() => setMobileArenaTab('editor')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mobileArenaTab === 'editor'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💻 Code & Test Console
              </button>
            </div>

            {/* Split Arena Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-y-auto lg:overflow-hidden">
              
              {/* Left Column: Problem Description */}
              <div className={`lg:col-span-5 h-full overflow-hidden ${mobileArenaTab === 'problem' ? 'block' : 'hidden lg:block'}`}>
                <ProblemDescription problem={room.problem} />
              </div>

              {/* Right Column: Code Editor & Test Console */}
              <div className={`lg:col-span-7 flex flex-col gap-3 h-full overflow-hidden ${mobileArenaTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
                {/* Code Editor */}
                <div className="flex-1 min-h-[350px] lg:min-h-0 overflow-hidden">
                  <CodeEditor
                    problem={room.problem}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    code={code}
                    setCode={handleCodeChange}
                    readOnly={isSpectator || room?.status === 'waiting-for-players' || room?.status === 'ended'}
                    room={room}
                  />
                </div>

                {/* Test Console */}
                {!isSpectator && (
                  <div className="h-[250px] sm:h-[270px] shrink-0">
                    <TestConsole
                      problem={room.problem}
                      selectedLanguage={selectedLanguage}
                      code={code}
                      onProgressUpdate={handleProgressUpdate}
                      onSubmitSolution={handleSubmitSolution}
                      disabled={room?.status === 'waiting-for-players' || room?.status === 'ended'}
                    />
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Fullscreen Fallback Overlay */}
      {room?.status === 'in-progress' && !isSpectator && !isFullscreenActive && (
        <div className="fixed inset-0 z-100 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-md bg-slate-900 border border-cyan-500/40 p-8 rounded-3xl shadow-2xl space-y-4 font-sans">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
              <Maximize2 className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-100 tracking-wide">Enter Fullscreen Duel</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              This duel is monitored for fair play. Click below to enter fullscreen mode and continue coding!
            </p>
            <button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
                setIsFullscreenActive(true);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm btn-glow-cyan transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              ⛶ Enter Fullscreen & Continue Duel
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal
          isOpen={showLeaderboardModal}
          onClose={() => setShowLeaderboardModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          player={player}
          setPlayer={setPlayer}
          onSignOut={handleSignOut}
        />
      )}

      {showShareModal && room && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          roomId={room.roomId}
        />
      )}

      {showChatPanel && room && (
        <ChatPanel
          isOpen={showChatPanel}
          onClose={() => setShowChatPanel(false)}
          room={room}
          playerName={player.name}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          unreadCount={unreadChatCount}
          setUnreadCount={setUnreadChatCount}
        />
      )}

      {rematchRequesterName && (
        <RematchModal
          isOpen={Boolean(rematchRequesterName)}
          requesterName={rematchRequesterName}
          readyStatusText={rematchReadyText}
          onAccept={handleAcceptRematch}
          onDecline={handleDeclineRematch}
        />
      )}

      {showPostMatch && room && (
        <PostMatchModal
          room={room}
          mySubmission={mySubmission}
          opponentSubmission={opponentSubmission}
          onViewSolution={handleFetchWinningSolution}
          onRematch={(cb) => {
            roomEngine.requestRematch(room.roomId, player.name);
            setJoinNotification({ username: 'You', text: 'requested a rematch!' });
            if (typeof cb === 'function') cb({ success: true });
          }}
          onNewDuel={handleLeaveRoom}
        />
      )}

      {showSolutionViewerModal && winningSolutionData && (
        <SolutionViewerModal
          isOpen={showSolutionViewerModal}
          onClose={() => setShowSolutionViewerModal(false)}
          winningSolution={winningSolutionData}
        />
      )}

      {joinNotification && (
        <JoinToast
          notification={joinNotification}
          onClose={() => setJoinNotification(null)}
        />
      )}

      {/* LAYER 3: 3-Second 1v1 Battle Start Overlay Animation ("READY FOR THE TEST ⚔️") */}
      {showMatchStartOverlay && room && (
        <Layer3MatchStartOverlay
          room={room}
          onComplete={() => setShowMatchStartOverlay(false)}
        />
      )}

        </>
      )}

    </div>
  );
}
