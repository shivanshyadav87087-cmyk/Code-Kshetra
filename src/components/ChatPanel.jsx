import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, CheckCheck } from 'lucide-react';
import { socket } from '../engine/socketClient';
import { sounds } from '../engine/soundManager';

export default function ChatPanel({
  room,
  isOpen,
  onClose,
  chatMessages = [],
  setChatMessages,
  unreadCount,
  setUnreadCount
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && typeof setUnreadCount === 'function') {
      setUnreadCount(0);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isOpen, setUnreadCount]);

  if (!isOpen) return null;

  const currentUsername = room?.me?.name || room?.me?.username || 'You';
  const opponentName = room?.isBot ? 'DevBot AI 🤖' : (room?.guest?.username || room?.guest?.name || room?.host?.username || room?.host?.name || 'Opponent');
  const avatarChar = (opponentName || 'Opponent').charAt(0).toUpperCase() || 'O';

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !room) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      senderId: socket.id,
      sender: currentUsername,
      text: inputText.trim(),
      timeStr: formattedTime,
      timestamp: now
    };

    if (typeof setChatMessages === 'function') {
      setChatMessages(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        if (safePrev.some(m => m.id === newMsg.id)) return safePrev;
        return [...safePrev, newMsg];
      });
    }

    setInputText('');
    sounds.playClick();

    socket.emit('send_chat_message', {
      roomId: room.roomId,
      message: newMsg
    });
  };

  const sendQuickEmoji = (emoji) => {
    setInputText(prev => (prev ? prev + ' ' + emoji : emoji));
  };

  const safeMessagesList = Array.isArray(chatMessages) ? chatMessages : [];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-[#111b21] border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col h-[460px] overflow-hidden font-sans animate-in fade-in zoom-in duration-200">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#202c33] border-b border-slate-700/60 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-300 text-xs shrink-0">
            {avatarChar}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
              <span>{opponentName}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">online in duel</div>
          </div>
        </div>

        <button
          onClick={() => { onClose(); sounds.playClick(); }}
          className="p-1 rounded-full bg-slate-800/80 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 custom-scrollbar text-xs bg-[#0b141a]">
        {safeMessagesList.map((m) => {
          const isMe = (m.senderId && socket.id) ? m.senderId === socket.id : (m.sender === currentUsername);
          const timeDisplay = m.timeStr || (m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

          return (
            <div
              key={m.id || Math.random()}
              className={`flex flex-col ${
                m.isSystem ? 'items-center text-center py-1' : isMe ? 'items-end' : 'items-start'
              }`}
            >
              {m.isSystem ? (
                <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-amber-300/90 border border-amber-500/20 font-mono shadow-sm">
                  {m.text}
                </span>
              ) : (
                <div
                  className={`max-w-[82%] px-3.5 py-2 shadow-md relative font-sans text-xs ${
                    isMe
                      ? 'bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs border border-emerald-600/30'
                      : 'bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-xs border border-slate-700/50'
                  }`}
                >
                  <div className={`text-[10px] font-bold mb-1 ${isMe ? 'text-emerald-300' : 'text-[#53bdeb]'}`}>
                    {isMe ? 'You' : (m.sender || 'Opponent')}
                  </div>

                  <div className="break-words leading-relaxed pr-6">{m.text}</div>

                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono mt-1">
                    <span>{timeDisplay}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-300 shrink-0" />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#182229] border-t border-slate-800/80 text-xs">
        {['🚀', '🔥', '💡', '👏', 'GG', '👍', '🤯'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => sendQuickEmoji(emoji)}
            className="px-1.5 py-0.5 hover:bg-[#2a3942] rounded transition-all text-sm"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-[#202c33] border-t border-slate-700/60 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#2a3942] border border-slate-700/60 focus:border-emerald-500 rounded-full px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 outline-none font-sans"
        />
        <button
          type="submit"
          className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
