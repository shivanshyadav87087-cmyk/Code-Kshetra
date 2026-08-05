import { Room } from '../models/Room.js';
import { Match } from '../models/Match.js';
import { User } from '../models/User.js';
import { PROBLEM_BANK } from '../../src/data/problemBank.js';
import { runCode } from '../../src/engine/codeRunner.js';
import { calculateEloChange } from '../../src/engine/eloEngine.js';

const activeRooms = new Map();
const socketRoomMap = new Map();
const rematchTimeoutMap = new Map();

function cleanRoomCode(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/.*[?&]room=/, '')
    .replace(/.*[?&]code=/, '')
    .trim()
    .toUpperCase();
}

function sanitizeName(raw) {
  if (!raw) return '';
  return String(raw).replace(/<[^>]*>?/gm, '').trim();
}

function validateDisplayName(rawName, roomState = null) {
  const sanitized = sanitizeName(rawName);

  if (!sanitized || sanitized.length < 5) {
    return { valid: false, error: "Handle must be at least 5 characters long (e.g. 'Coder99').", name: sanitized };
  }

  if (sanitized.length > 20) {
    return { valid: false, error: "Handle must not exceed 20 characters.", name: sanitized };
  }

  // ONLY enforce per-room handle uniqueness if the room is ACTIVE (not ended!)
  if (roomState && roomState.status !== 'ended') {
    const lowerNew = sanitized.toLowerCase();

    const hostName = roomState.host?.username?.toLowerCase();
    const guestName = roomState.guest?.username?.toLowerCase();
    const specNames = (roomState.spectators || []).map(s => s.username?.toLowerCase());

    if (hostName === lowerNew || guestName === lowerNew || specNames.includes(lowerNew)) {
      return { valid: false, error: "This handle is already taken in this room. Please choose a different handle.", name: sanitized };
    }
  }

  return { valid: true, name: sanitized };
}

function selectFreshProblem(roomState) {
  const currentProblemId = roomState?.problem?.id;
  const currentProblemNum = roomState?.problem?.number;
  const activeTopic = roomState?.topic || roomState?.problem?.topic || 'all';

  let topicEligible = PROBLEM_BANK;
  if (activeTopic && activeTopic !== 'all') {
    const topicMatches = PROBLEM_BANK.filter(p => p.topic.toLowerCase() === activeTopic.toLowerCase());
    if (topicMatches.length > 0) topicEligible = topicMatches;
  }

  let differentInTopic = topicEligible.filter(p => p.id !== currentProblemId && p.number !== currentProblemNum);

  let newProblem = null;
  if (differentInTopic.length > 0) {
    if (roomState?.difficulty && roomState.difficulty !== 'all') {
      const diffMatches = differentInTopic.filter(p => p.difficulty.toLowerCase() === roomState.difficulty.toLowerCase());
      if (diffMatches.length > 0) {
        newProblem = diffMatches[Math.floor(Math.random() * diffMatches.length)];
      }
    }
    if (!newProblem) {
      newProblem = differentInTopic[Math.floor(Math.random() * differentInTopic.length)];
    }
  }

  if (!newProblem) {
    const globalDifferent = PROBLEM_BANK.filter(p => p.id !== currentProblemId && p.number !== currentProblemNum);
    newProblem = globalDifferent.length > 0 ? globalDifferent[Math.floor(Math.random() * globalDifferent.length)] : PROBLEM_BANK[0];
  }

  return newProblem;
}

export function setupRoomSockets(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket Connected] ID: ${socket.id}`);

    // Anti-Cheat Event Tracking (Tab Switches, Blocked Pastes, & Fullscreen Exits)
    socket.on('anti_cheat_event', (data) => {
      const { roomId, eventType, length } = data;
      const normalizedRoomId = cleanRoomCode(roomId);
      const roomState = activeRooms.get(normalizedRoomId);

      if (!roomState || roomState.status !== 'in-progress') return;

      const isHost = socket.id === roomState.host?.id || socket.username === roomState.host?.username;

      if (!roomState.antiCheat) {
        roomState.antiCheat = { hostTabSwitches: 0, guestTabSwitches: 0, hostLargePastes: 0, guestLargePastes: 0, flags: [] };
      }

      if (eventType === 'tab_switch') {
        if (isHost) roomState.antiCheat.hostTabSwitches++;
        else roomState.antiCheat.guestTabSwitches++;

        const count = isHost ? roomState.antiCheat.hostTabSwitches : roomState.antiCheat.guestTabSwitches;
        console.log(`[ANTI-CHEAT WARN] Room: "${normalizedRoomId}" | User: "${socket.username}" | Tab Switches: ${count}`);

        if (count >= 3) {
          const flagMsg = `Excessive tab switching by ${socket.username} (${count} times)`;
          if (!roomState.antiCheat.flags.includes(flagMsg)) {
            roomState.antiCheat.flags.push(flagMsg);
          }
        }

        socket.emit('anti_cheat_warning', {
          type: 'tab_switch',
          message: `⚠ Tab switch detected (${count}/3 limit) — monitored for fair play.`
        });
      } else if (eventType === 'fullscreen_exit') {
        if (isHost) roomState.antiCheat.hostTabSwitches++;
        else roomState.antiCheat.guestTabSwitches++;

        const count = isHost ? roomState.antiCheat.hostTabSwitches : roomState.antiCheat.guestTabSwitches;
        console.log(`[ANTI-CHEAT WARN] Room: "${normalizedRoomId}" | User: "${socket.username}" | Exited Fullscreen (${count} violations)`);

        const flagMsg = `Exited Fullscreen by ${socket.username} (${count} times)`;
        if (!roomState.antiCheat.flags.includes(flagMsg)) {
          roomState.antiCheat.flags.push(flagMsg);
        }

        socket.emit('anti_cheat_warning', {
          type: 'fullscreen_exit',
          message: `⚠ Fullscreen exit detected (${count}/3 limit) — click overlay to re-enter.`
        });
      } else if (eventType === 'large_paste_attempt') {
        if (isHost) roomState.antiCheat.hostLargePastes++;
        else roomState.antiCheat.guestLargePastes++;

        console.log(`[ANTI-CHEAT BLOCKED PASTE] Room: "${normalizedRoomId}" | User: "${socket.username}" | Pasted Length: ${length}`);
        const flagMsg = `Blocked large paste attempt by ${socket.username} (${length} chars)`;
        if (!roomState.antiCheat.flags.includes(flagMsg)) {
          roomState.antiCheat.flags.push(flagMsg);
        }
      }
    });

    // Create 1v1 Room
    socket.on('create_room', (data, callback) => {
      try {
        const { roomId, password, topic, difficulty, timeLimit, player, problem, isBot } = data;
        const normalizedRoomId = cleanRoomCode(roomId);
        
        // Validate Host Display Name
        const nameVal = validateDisplayName(player?.name);
        if (!nameVal.valid) {
          if (typeof callback === 'function') callback({ success: false, error: nameVal.error });
          return;
        }

        socket.username = nameVal.name;

        let targetProblem = null;

        if (problem && (problem.id || problem.number)) {
          const matchById = PROBLEM_BANK.find(p => p.id === problem.id || p.number === Number(problem.number));
          if (matchById) targetProblem = matchById;
          else targetProblem = problem;
        }

        if (!targetProblem && topic && topic !== 'all') {
          let eligible = PROBLEM_BANK.filter(p => p.topic.toLowerCase() === topic.toLowerCase());
          if (difficulty && difficulty !== 'all') {
            const diffEligible = eligible.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
            if (diffEligible.length > 0) eligible = diffEligible;
          }
          if (eligible.length > 0) {
            targetProblem = eligible[Math.floor(Math.random() * eligible.length)];
          }
        }

        if (!targetProblem) {
          targetProblem = PROBLEM_BANK[0];
        }

        const roomState = {
          roomId: normalizedRoomId,
          password: password || '',
          topic: topic || targetProblem.topic || 'all',
          difficulty: difficulty || 'all',
          maxPlayers: 2,
          timeLimit: timeLimit || 10,
          host: { id: socket.id, username: nameVal.name, rating: player.rating || 0 },
          guest: isBot ? { id: 'devbot_ai', username: 'DevBot AI 🤖', rating: 1200, isBot: true } : null,
          spectators: [],
          isBot,
          problem: targetProblem,
          status: isBot ? 'in-progress' : 'waiting-for-players',
          matchStartTime: isBot ? Date.now() : null,
          startTime: Date.now(),
          matchEndReason: null,
          winningSolution: null,
          antiCheat: { hostTabSwitches: 0, guestTabSwitches: 0, hostLargePastes: 0, guestLargePastes: 0, flags: [] },
          myProgress: { passed: 0, total: targetProblem.testCases.length, status: 'Coding...' },
          opponentProgress: { passed: 0, total: targetProblem.testCases.length, status: isBot ? 'Coding...' : 'Waiting...' },
          hostCode: targetProblem.starterTemplates?.javascript || '',
          guestCode: targetProblem.starterTemplates?.javascript || ''
        };

        activeRooms.set(normalizedRoomId, roomState);
        socketRoomMap.set(socket.id, normalizedRoomId);
        socket.join(normalizedRoomId);

        console.log(`[Socket 1v1 Room Created] Code: "${normalizedRoomId}" | Host: "${nameVal.name}" | Status: ${roomState.status}`);

        Room.create({
          roomId: normalizedRoomId,
          password: roomState.password,
          topic: roomState.topic,
          difficulty: roomState.difficulty,
          timeLimit: roomState.timeLimit,
          host: roomState.host,
          problemId: targetProblem.id
        }).catch(() => {});

        if (typeof callback === 'function') callback({ success: true, room: roomState });
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
      }
    });

    // Join Room
    socket.on('join_room', async (data, callback) => {
      try {
        const normalizedRoomId = cleanRoomCode(data.roomId);
        let roomState = activeRooms.get(normalizedRoomId);

        if (!roomState) {
          if (typeof callback === 'function') {
            return callback({
              success: false,
              error: `Room code "${normalizedRoomId}" not found or expired.`
            });
          }
          return;
        }

        if (roomState.password && roomState.password !== data.password) {
          if (typeof callback === 'function') return callback({ success: false, error: 'Incorrect room password.' });
          return;
        }

        const nameVal = validateDisplayName(data.player?.name, roomState);
        if (!nameVal.valid) {
          if (typeof callback === 'function') return callback({ success: false, error: nameVal.error });
          return;
        }

        socket.username = nameVal.name;
        const wantSpectator = Boolean(data.asSpectator);

        // SPECTATOR JOIN ATTEMPT
        if (wantSpectator) {
          if (roomState.status === 'ended') {
            if (typeof callback === 'function') {
              return callback({
                success: false,
                error: 'Match has already concluded.'
              });
            }
            return;
          }

          if (roomState.spectators.length >= 3) {
            if (typeof callback === 'function') {
              return callback({
                success: false,
                error: 'Spectator slots full (3/3).'
              });
            }
            return;
          }

          const specUser = {
            id: socket.id,
            username: nameVal.name,
            targetPlayerId: 'host'
          };
          roomState.spectators.push(specUser);
          socketRoomMap.set(socket.id, normalizedRoomId);
          socket.join(normalizedRoomId);

          console.log(`[Spectator Joined] "${nameVal.name}" joined Room "${normalizedRoomId}" (${roomState.spectators.length}/3)`);

          io.to(normalizedRoomId).emit('spectator_update', {
            count: roomState.spectators.length,
            spectators: roomState.spectators
          });

          if (typeof callback === 'function') {
            return callback({
              success: true,
              isSpectator: true,
              room: roomState
            });
          }
          return;
        }

        // PLAYER JOIN ATTEMPT
        const isOriginalHost = nameVal.name === roomState.host?.username;
        const isOriginalGuest = roomState.guest && nameVal.name === roomState.guest?.username;

        if (roomState.guest && !isOriginalHost && !isOriginalGuest && roomState.status !== 'ended') {
          if (roomState.spectators.length < 3) {
            if (typeof callback === 'function') {
              return callback({
                success: false,
                canSpectate: true,
                error: 'Room player slots full (2/2). Auto-switching to Spectator Mode...'
              });
            }
            return;
          }

          if (typeof callback === 'function') {
            return callback({
              success: false,
              error: 'Room is completely full (2/2 Players, 3/3 Spectators).'
            });
          }
          return;
        }

        // IF ROOM HAS ENDED, RESET IT FOR A FRESH MATCH!
        if (roomState.status === 'ended') {
          const freshProblem = selectFreshProblem(roomState);
          roomState.problem = freshProblem;
          roomState.status = 'waiting-for-players';
          roomState.winningSolution = null;
          roomState.matchEndReason = null;
          roomState.antiCheat = { hostTabSwitches: 0, guestTabSwitches: 0, hostLargePastes: 0, guestLargePastes: 0, flags: [] };
          roomState.host = { id: socket.id, username: nameVal.name, rating: data.player.rating || 0 };
          roomState.guest = null;
          roomState.hostCode = freshProblem.starterTemplates?.javascript || '';
          roomState.guestCode = freshProblem.starterTemplates?.javascript || '';
        }

        const guestPlayer = { id: socket.id, username: nameVal.name, rating: data.player.rating || 0 };
        if (!roomState.guest || isOriginalGuest) {
          roomState.guest = guestPlayer;
        }

        if (!roomState.matchStartTime || roomState.status === 'waiting-for-players') {
          roomState.status = 'in-progress';
          roomState.matchStartTime = Date.now();
          console.log(`[SERVER TIMER STARTED] Room: "${normalizedRoomId}" | matchStartTime: ${roomState.matchStartTime}`);
        }

        roomState.startTime = Date.now();
        roomState.myProgress = { passed: 0, total: roomState.problem.testCases.length, status: 'Coding...' };
        roomState.opponentProgress = { passed: 0, total: roomState.problem.testCases.length, status: 'Coding...' };

        socketRoomMap.set(socket.id, normalizedRoomId);
        socket.join(normalizedRoomId);

        console.log(`[Player Joined] Player "${nameVal.name}" joined Room "${normalizedRoomId}"`);

        socket.to(normalizedRoomId).emit('player_joined', {
          player: guestPlayer,
          username: guestPlayer.username
        });

        io.to(normalizedRoomId).emit('match_started', {
          room: roomState,
          matchStartTime: roomState.matchStartTime
        });

        if (typeof callback === 'function') callback({ success: true, isSpectator: false, room: roomState });
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
      }
    });

    // Real-Time Live Code Stream
    socket.on('player_code_update', (data) => {
      const { roomId, code, language } = data;
      const normalizedRoomId = cleanRoomCode(roomId);
      const roomState = activeRooms.get(normalizedRoomId);

      if (!roomState) return;
      if (roomState.spectators.some(s => s.id === socket.id)) return;

      const isHost = socket.id === roomState.host?.id || socket.username === roomState.host?.username;
      if (isHost) {
        roomState.hostCode = code;
      } else {
        roomState.guestCode = code;
      }

      socket.to(normalizedRoomId).emit('spectator_code_stream', {
        role: isHost ? 'host' : 'guest',
        code,
        language
      });
    });

    // Spectator Switches Target Player Perspective
    socket.on('switch_spectate_target', (data) => {
      const { roomId, targetRole } = data;
      const normalizedRoomId = cleanRoomCode(roomId);
      const roomState = activeRooms.get(normalizedRoomId);

      if (!roomState) return;

      const spec = roomState.spectators.find(s => s.id === socket.id);
      if (spec) {
        spec.targetPlayerId = targetRole;
      }

      const activeCode = targetRole === 'host' ? roomState.hostCode : roomState.guestCode;
      socket.emit('spectator_code_stream', {
        role: targetRole,
        code: activeCode || roomState.problem?.starterTemplates?.javascript || ''
      });
    });

    // Dedicated Endpoint: Fetch Winning Solution
    socket.on('get_winning_solution', (data, callback) => {
      const normalizedRoomId = cleanRoomCode(data?.roomId);
      const roomState = activeRooms.get(normalizedRoomId);

      if (!roomState) {
        if (typeof callback === 'function') callback({ success: false, error: 'Room code not found.' });
        return;
      }

      if (roomState.status !== 'ended') {
        if (typeof callback === 'function') {
          callback({
            success: false,
            error: 'Match is still in progress! Solution can only be viewed after the match ends.'
          });
        }
        return;
      }

      if (roomState.matchEndReason === 'opponent-forfeit' || !roomState.winningSolution) {
        if (typeof callback === 'function') {
          callback({
            success: false,
            error: 'No winning solution exists for this match because it ended by opponent forfeit.'
          });
        }
        return;
      }

      if (typeof callback === 'function') {
        callback({
          success: true,
          winningSolution: roomState.winningSolution || null
        });
      }
    });

    // Submit Solution with Sanity Fast-Solve Check
    socket.on('submit_solution', async (data) => {
      const { roomId, code, language, submission } = data;
      const normalizedRoomId = cleanRoomCode(roomId);
      const roomState = activeRooms.get(normalizedRoomId);

      if (!roomState || roomState.status === 'ended') return;

      const evalRes = await runCode(code, language, roomState.problem.entryFunction, roomState.problem.testCases);
      const isWinner = evalRes.verdict === 'Accepted';

      // Anti-Cheat Sanity Check: Solved under 8 seconds
      const elapsedMs = Date.now() - (roomState.matchStartTime || roomState.startTime);
      if (elapsedMs < 8000 && isWinner) {
        const flagMsg = `Suspiciously fast solution by ${socket.username} (${(elapsedMs / 1000).toFixed(1)}s)`;
        if (!roomState.antiCheat.flags.includes(flagMsg)) {
          roomState.antiCheat.flags.push(flagMsg);
        }
      }

      if (isWinner) {
        roomState.status = 'ended';
        roomState.winnerUsername = socket.username;
        roomState.matchEndReason = 'accepted-submission';
        
        roomState.winningSolution = {
          playerId: socket.id,
          username: socket.username,
          code,
          language,
          submittedAt: new Date(),
          problemTitle: roomState.problem.title
        };

        io.to(normalizedRoomId).emit('match_ended', {
          winnerUsername: socket.username,
          matchEndReason: 'accepted-submission',
          winningSolution: roomState.winningSolution,
          result: evalRes,
          submission
        });
      } else {
        socket.to(normalizedRoomId).emit('opponent_submitted', {
          passedCount: evalRes.passedCount,
          totalCount: evalRes.totalCount,
          verdict: evalRes.verdict
        });
      }
    });

    // Leave Room
    socket.on('leave_room', (data) => {
      const roomId = data?.roomId || socketRoomMap.get(socket.id);
      if (!roomId) return;
      handlePlayerDeparture(socket, cleanRoomCode(roomId), 'left the match');
    });

    // Room Chat
    socket.on('send_chat_message', (data) => {
      const { roomId, message } = data;
      const normalizedRoomId = cleanRoomCode(roomId);
      io.to(normalizedRoomId).emit('receive_chat_message', message);
    });

    // Rematch Request
    socket.on('send_rematch_request', async (data, callback) => {
      const roomId = data?.roomId || socketRoomMap.get(socket.id);
      const normalizedRoomId = cleanRoomCode(roomId);
      let roomState = activeRooms.get(normalizedRoomId);

      if (data?.username) socket.username = data.username;

      if (!roomState) {
        if (typeof callback === 'function') callback({ success: false, error: 'Room code not found or expired.' });
        return;
      }

      // Handle AI Bot Instant Rematch
      if (roomState.isBot) {
        const freshProblem = selectFreshProblem(roomState);
        roomState.problem = freshProblem;
        roomState.status = 'in-progress';
        roomState.matchStartTime = Date.now();
        roomState.winningSolution = null;
        roomState.matchEndReason = null;
        roomState.hostCode = freshProblem.starterTemplates?.javascript || '';
        roomState.guestCode = freshProblem.starterTemplates?.javascript || '';

        io.to(normalizedRoomId).emit('match_started', {
          room: roomState,
          matchStartTime: roomState.matchStartTime
        });
        if (typeof callback === 'function') callback({ success: true });
        return;
      }

      const isHost = socket.id === roomState.host?.id || socket.username === roomState.host?.username;
      const opponentName = isHost ? roomState.guest?.username : roomState.host?.username;

      let opponentSocket = null;
      for (const [, sSocket] of io.of("/").sockets) {
        if (sSocket.id !== socket.id && (sSocket.rooms.has(normalizedRoomId) || (opponentName && sSocket.username?.toLowerCase() === opponentName.toLowerCase()))) {
          opponentSocket = sSocket;
          break;
        }
      }

      if (!opponentSocket) {
        if (typeof callback === 'function') {
          callback({
            success: false,
            error: 'Opponent has left the match and is no longer available for a rematch.'
          });
        }
        socket.emit('rematch_failed', {
          error: 'Opponent has disconnected or left the match.'
        });
        return;
      }

      if (rematchTimeoutMap.has(normalizedRoomId)) {
        clearTimeout(rematchTimeoutMap.get(normalizedRoomId));
      }

      const timeoutId = setTimeout(() => {
        rematchTimeoutMap.delete(normalizedRoomId);
        io.to(normalizedRoomId).emit('rematch_timeout', {
          message: 'Rematch request timed out after 30 seconds.'
        });
      }, 30000);

      rematchTimeoutMap.set(normalizedRoomId, timeoutId);

      socket.to(normalizedRoomId).emit('rematch_requested', {
        requesterName: socket.username || 'Opponent',
        readyCount: 1,
        totalCount: 2
      });

      if (typeof callback === 'function') callback({ success: true });
    });

    // Accept Rematch
    socket.on('accept_rematch', async (data) => {
      const roomId = data?.roomId || socketRoomMap.get(socket.id);
      const normalizedRoomId = cleanRoomCode(roomId);
      let roomState = activeRooms.get(normalizedRoomId);

      if (!roomState) return;

      if (rematchTimeoutMap.has(normalizedRoomId)) {
        clearTimeout(rematchTimeoutMap.get(normalizedRoomId));
        rematchTimeoutMap.delete(normalizedRoomId);
      }

      const freshProblem = selectFreshProblem(roomState);

      roomState.problem = freshProblem;
      roomState.status = 'in-progress';
      roomState.matchStartTime = Date.now();
      roomState.winningSolution = null;
      roomState.matchEndReason = null;
      roomState.antiCheat = { hostTabSwitches: 0, guestTabSwitches: 0, hostLargePastes: 0, guestLargePastes: 0, flags: [] };
      roomState.hostCode = freshProblem.starterTemplates?.javascript || '';
      roomState.guestCode = freshProblem.starterTemplates?.javascript || '';

      io.to(normalizedRoomId).emit('match_started', {
        room: roomState,
        matchStartTime: roomState.matchStartTime
      });
    });

    // Decline Rematch
    socket.on('decline_rematch', (data) => {
      const roomId = data?.roomId || socketRoomMap.get(socket.id);
      const normalizedRoomId = cleanRoomCode(roomId);

      if (rematchTimeoutMap.has(normalizedRoomId)) {
        clearTimeout(rematchTimeoutMap.get(normalizedRoomId));
        rematchTimeoutMap.delete(normalizedRoomId);
      }

      io.to(normalizedRoomId).emit('rematch_declined', {
        declinerName: socket.username
      });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket Disconnected] ${socket.id} (${reason})`);
      const roomId = socketRoomMap.get(socket.id);
      if (roomId) {
        handlePlayerDeparture(socket, roomId, 'disconnected');
      }
    });
  });

  function handlePlayerDeparture(socket, normalizedRoomId, departureType) {
    const roomState = activeRooms.get(normalizedRoomId);
    if (!roomState) return;

    const isHost = socket.id === roomState.host?.id || socket.username === roomState.host?.username;
    const isGuest = socket.id === roomState.guest?.id || socket.username === roomState.guest?.username;
    const isSpectator = roomState.spectators.some(s => s.id === socket.id);

    if (isSpectator) {
      roomState.spectators = roomState.spectators.filter(s => s.id !== socket.id);
      socketRoomMap.delete(socket.id);

      io.to(normalizedRoomId).emit('spectator_update', {
        count: roomState.spectators.length,
        spectators: roomState.spectators
      });
      return;
    }

    if ((isHost || isGuest) && roomState.status === 'in-progress') {
      const leaverName = socket.username || (isHost ? roomState.host.username : roomState.guest.username);
      const winnerName = isHost ? (roomState.guest?.username || 'DevBot') : roomState.host.username;

      console.log(`[MATCH ENDED - FORFEIT] Room: "${normalizedRoomId}" | Leaver: "${leaverName}" | Winner: "${winnerName}"`);

      roomState.status = 'ended';
      roomState.winnerUsername = winnerName;
      roomState.matchEndReason = 'opponent-forfeit';
      roomState.winningSolution = null;

      io.to(normalizedRoomId).emit('player_left_match', {
        leaverName,
        winnerName,
        matchEndReason: 'opponent-forfeit'
      });
    }

    socketRoomMap.delete(socket.id);
  }
}
