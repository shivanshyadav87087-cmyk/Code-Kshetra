import { PROBLEM_BANK } from '../data/problemBank';
import { socket } from './socketClient';

class RoomEngine {
  constructor() {
    this.currentRoom = null;
    this.listeners = [];
    this.botTimer = null;
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    socket.on('player_joined', (data) => {
      this.notifyListeners('PLAYER_JOINED_TOAST', data);
    });

    const handleMatchStart = (data) => {
      if (data && data.room) {
        const isHost = this.currentRoom?.isHost ?? (socket.id === data.room.host?.id);
        const myPlayer = isHost ? data.room.host : data.room.guest;

        this.currentRoom = {
          ...data.room,
          me: myPlayer,
          isHost
        };
        this.notifyListeners('MATCH_START', JSON.parse(JSON.stringify(this.currentRoom)));
      }
    };

    socket.on('match_started', handleMatchStart);
    socket.on('matchFound', handleMatchStart);
    socket.on('match_found', handleMatchStart);

    socket.on('match_ended', (data) => {
      if (this.currentRoom) {
        this.currentRoom.status = 'ended';
        this.currentRoom.winnerUsername = data.winnerUsername;
        this.currentRoom.winningSolution = data.winningSolution || null;
      }
      this.notifyListeners('MATCH_ENDED', data);
    });

    socket.on('submission_evaluated', (data) => {
      this.notifyListeners('SUBMISSION_EVALUATED', data);
    });

    socket.on('player_left_match', (data) => {
      if (this.currentRoom) {
        this.currentRoom.status = 'ended';
      }
      this.notifyListeners('PLAYER_LEFT_MATCH', data);
    });

    socket.on('opponent_progress', (progress) => {
      if (this.currentRoom) {
        this.currentRoom.opponentProgress = progress;
        this.notifyListeners('OPPONENT_PROGRESS', progress);
      }
    });

    socket.on('opponent_submitted', (submission) => {
      if (this.currentRoom) {
        this.currentRoom.opponentSubmission = submission;
        this.notifyListeners('OPPONENT_SUBMITTED', submission);
      }
    });

    socket.on('rematch_requested', (data) => {
      this.notifyListeners('REMATCH_REQUESTED', data);
    });

    socket.on('rematch_ready_update', (data) => {
      this.notifyListeners('REMATCH_READY_UPDATE', data);
    });

    socket.on('rematch_declined', (data) => {
      this.notifyListeners('REMATCH_DECLINED', data);
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(eventType, payload) {
    this.listeners.forEach(fn => fn(eventType, payload));
  }

  fetchWinningSolution(roomId, callback) {
    const code = roomId || this.currentRoom?.roomId;
    if (!code) {
      if (typeof callback === 'function') callback({ success: false, error: 'No room code available' });
      return;
    }
    socket.emit('get_winning_solution', { roomId: code }, (res) => {
      if (typeof callback === 'function') callback(res);
    });
  }

  requestRematch(explicitRoomId, username) {
    const code = explicitRoomId || this.currentRoom?.roomId;
    const name = username || this.currentRoom?.me?.name || 'Player';

    if (this.currentRoom?.isBot) {
      const freshProblem = PROBLEM_BANK[Math.floor(Math.random() * PROBLEM_BANK.length)];
      this.currentRoom.problem = freshProblem;
      this.currentRoom.status = 'in-progress';
      this.currentRoom.matchStartTime = Date.now();
      this.currentRoom.winningSolution = null;
      this.currentRoom.myProgress = { passed: 0, total: freshProblem.testCases.length, status: 'Coding...' };
      this.currentRoom.opponentProgress = { passed: 0, total: freshProblem.testCases.length, status: 'Coding...' };

      this.notifyListeners('MATCH_START', JSON.parse(JSON.stringify(this.currentRoom)));
      this.startBotSimulation(freshProblem, this.currentRoom.timeLimit || 10);
      return;
    }

    if (code) {
      console.log(`[Rematch Engine] Emitting send_rematch_request for room code: ${code}`);
      socket.emit('send_rematch_request', {
        roomId: code,
        username: name,
        requesterName: name
      });
    }
  }

  sendRematchRequest(explicitRoomId, username) {
    this.requestRematch(explicitRoomId, username);
  }

  acceptRematch(explicitRoomId) {
    const code = explicitRoomId || this.currentRoom?.roomId;
    if (code) {
      console.log(`[Rematch Engine] Emitting accept_rematch for room code: ${code}`);
      socket.emit('accept_rematch', {
        roomId: code,
        username: this.currentRoom?.me?.name
      });
    }
  }

  declineRematch(explicitRoomId) {
    const code = explicitRoomId || this.currentRoom?.roomId;
    if (code) {
      socket.emit('decline_rematch', {
        roomId: code,
        declinerName: this.currentRoom?.me?.name || 'Opponent'
      });
    }
  }

  createRoom({ player, topic = 'all', difficulty = 'all', maxPlayers = 2, timeLimit = 10, password = '', isBot = false, customProblem = null }, onResult) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let selectedProblem = customProblem;

    if (!selectedProblem) {
      let eligible = PROBLEM_BANK;

      if (topic && topic !== 'all') {
        const topicMatches = eligible.filter(p => p.topic.toLowerCase() === topic.toLowerCase());
        if (topicMatches.length > 0) eligible = topicMatches;
      }

      if (difficulty && difficulty !== 'all') {
        const diffMatches = eligible.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
        if (diffMatches.length > 0) eligible = diffMatches;
      }

      selectedProblem = eligible[Math.floor(Math.random() * eligible.length)];
    }

    const room = {
      roomId,
      password,
      topic: customProblem ? customProblem.topic : topic,
      difficulty: customProblem ? customProblem.difficulty : difficulty,
      maxPlayers,
      timeLimit,
      host: player,
      guest: isBot ? { id: 'devbot_9000', name: 'DevBot AI 🤖', rating: 1450, isBot: true } : null,
      me: player,
      isHost: true,
      isBot,
      problem: selectedProblem,
      status: isBot ? 'in-progress' : 'waiting-for-players',
      matchStartTime: isBot ? Date.now() : null,
      startTime: Date.now(),
      winningSolution: null,
      myProgress: { passed: 0, total: selectedProblem.testCases.length, status: 'Coding...' },
      opponentProgress: { passed: 0, total: selectedProblem.testCases.length, status: isBot ? 'Coding...' : 'Waiting...' }
    };

    this.currentRoom = room;

    // Immediately trigger onResult and notify listeners so room creation never gets stuck
    if (onResult) onResult({ success: true, room: this.currentRoom });
    this.notifyListeners('ROOM_UPDATED', this.currentRoom);

    // Sync with backend socket server asynchronously
    socket.emit('create_room', {
      roomId,
      password,
      topic: room.topic,
      difficulty: room.difficulty,
      maxPlayers,
      timeLimit,
      player,
      problem: selectedProblem,
      isBot
    }, (res) => {
      if (res && res.success && res.room) {
        this.currentRoom = {
          ...this.currentRoom,
          ...res.room,
          me: player,
          isHost: true
        };
        this.notifyListeners('ROOM_UPDATED', this.currentRoom);
      }
    });

    if (isBot) {
      this.startBotSimulation(selectedProblem, timeLimit);
    }

    return room;
  }

  joinRoom({ roomId, password = '', player, asSpectator = false }, onResult) {
    const cleanCode = (roomId || '').trim().toUpperCase();
    if (!cleanCode) {
      if (onResult) onResult({ success: false, error: 'Invalid room code' });
      return;
    }

    const mePlayer = player || { id: 'user_' + Math.floor(Math.random() * 89999 + 10000), name: 'Opponent_' + Math.floor(Math.random() * 899 + 100), rating: 0 };

    socket.emit('join_room', {
      roomId: cleanCode,
      password,
      player: mePlayer,
      asSpectator: Boolean(asSpectator)
    }, (res) => {
      if (res && res.success && res.room) {
        const fullRoom = {
          ...res.room,
          me: mePlayer,
          isHost: false,
          isSpectator: Boolean(res.isSpectator)
        };
        this.currentRoom = fullRoom;
        if (typeof onResult === 'function') {
          onResult({ success: true, isSpectator: Boolean(res.isSpectator), room: fullRoom });
        }
        this.notifyListeners('ROOM_UPDATED', fullRoom);
      } else {
        if (typeof onResult === 'function') {
          onResult({ success: false, error: res?.error || `Room "${cleanCode}" not found or expired.` });
        }
      }
    });
  }

  leaveRoom(roomId) {
    const code = roomId || this.currentRoom?.roomId;
    if (code) {
      socket.emit('leave_room', { roomId: code });
    }
    this.stop();
  }

  sendProgress(roomId, progress) {
    socket.emit('progress_update', { roomId, progress });
  }

  submitSolution(roomId, submission) {
    socket.emit('submit_solution', { roomId, submission });
  }

  startBotSimulation(problem, timeLimitMinutes) {
    if (this.botTimer) clearInterval(this.botTimer);
    const totalCases = problem.testCases.length;
    let step = 0;

    this.botTimer = setInterval(() => {
      if (!this.currentRoom || (this.currentRoom.status !== 'in-progress' && this.currentRoom.status !== 'in-game')) {
        clearInterval(this.botTimer);
        return;
      }

      step++;
      if (step === 1) {
        this.notifyListeners('OPPONENT_PROGRESS', { passed: 0, total: totalCases, status: 'Writing code...' });
      } else if (step === 2) {
        const p = Math.min(2, totalCases);
        this.notifyListeners('OPPONENT_PROGRESS', { passed: p, total: totalCases, status: `Testing (${p}/${totalCases})` });
      } else if (step === 3) {
        this.notifyListeners('OPPONENT_PROGRESS', { passed: totalCases, total: totalCases, status: 'All Test Cases Passed!' });
      } else if (step >= 4) {
        clearInterval(this.botTimer);
        const botSubmission = {
          passedCount: totalCases,
          totalCount: totalCases,
          score: 850,
          code: problem.starterTemplates.python || '# DevBot solution',
          timeTakenSeconds: 95
        };
        this.currentRoom.opponentSubmission = botSubmission;
        this.notifyListeners('OPPONENT_SUBMITTED', botSubmission);
      }
    }, 9000);
  }

  findMatch({ player }, callback) {
    const p = player || {
      id: 'user_' + Math.floor(Math.random() * 89999 + 10000),
      name: 'Coder_' + Math.floor(Math.random() * 899 + 100),
      rating: 0
    };

    socket.emit('findMatch', {
      userId: p.id,
      username: p.name,
      elo: p.rating !== undefined ? p.rating : 0
    }, (res) => {
      if (typeof callback === 'function') callback(res);
    });
  }

  cancelMatch(callback) {
    socket.emit('cancelMatch', {}, (res) => {
      if (typeof callback === 'function') callback(res);
    });
  }

  stop() {
    if (this.botTimer) clearInterval(this.botTimer);
    if (this.currentRoom) {
      socket.emit('leave_room', { roomId: this.currentRoom.roomId });
    }
    this.currentRoom = null;
  }
}

export const roomEngine = new RoomEngine();
