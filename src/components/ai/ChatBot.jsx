import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat.js';
import { useTheme } from '../../hooks/useTheme.js';
import useReducedMotion from '../../hooks/useReducedMotion.js';

const DOTS = [0, 1, 2];

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function parseMessageContent(text) {
  const parts = [];
  const blockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let cursor = 0;
  let match = blockRegex.exec(text);

  while (match) {
    if (match.index > cursor) {
      parts.push({ type: 'text', value: text.slice(cursor, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'text', value: match[2] });
    cursor = blockRegex.lastIndex;
    match = blockRegex.exec(text);
  }

  if (cursor < text.length) {
    parts.push({ type: 'text', value: text.slice(cursor) });
  }

  return parts;
}

const MessageBubble = memo(function MessageBubble({ message, isDark }) {
  const parsed = useMemo(() => parseMessageContent(message.text), [message.text]);
  const isUser = message.from === 'user';
  const bubbleClass = isUser
    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
    : isDark
      ? 'bg-gradient-to-r from-purple-600/85 to-indigo-600/80 text-slate-50'
      : 'border border-purple-200/80 bg-white/90 text-slate-800';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${bubbleClass}`}>
        {parsed.map((part, index) =>
          part.type === 'code' ? (
            <div key={`${message.id}-code-${index}`} className="my-2 overflow-hidden rounded-lg border border-white/20 bg-slate-950/85">
              <div className="border-b border-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                {part.language}
              </div>
              <pre className="overflow-x-auto px-3 py-2 text-[11px] text-cyan-200">
                <code>{part.value}</code>
              </pre>
            </div>
          ) : (
            <p key={`${message.id}-text-${index}`} className="whitespace-pre-line">
              {part.value}
            </p>
          ),
        )}
        <span className="mt-1 hidden text-[10px] opacity-70 group-hover:block">{formatTime(message.ts)}</span>
      </div>
    </motion.div>
  );
});

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/70 px-3 py-2">
        {DOTS.map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-slate-300"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
});

export default function ChatBot() {
  const {
    isOpen,
    isMinimized,
    toggleOpen,
    toggleMinimize,
    messages,
    isTyping,
    sendMessage,
    quickActions,
    unreadCount,
    markRead,
    helper,
  } = useChat();
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [input, setInput] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseX: 0, baseY: 0 });
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    markRead();
  }, [isOpen, isMinimized, markRead]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    textareaRef.current?.focus();
  }, [isMinimized, isOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        toggleOpen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, toggleOpen]);

  const onSubmit = (event) => {
    event.preventDefault();
    const result = sendMessage(input);
    if (result.accepted) {
      setInput('');
      setShowQuickActions(false);
    }
  };

  const onQuickAction = (prompt) => {
    setInput('');
    setShowQuickActions(false);
    sendMessage(prompt);
  };

  const onInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  const startDrag = (event) => {
    if (!isDesktop) return;
    setIsDragging(true);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: dragPosition.x,
      baseY: dragPosition.y,
    };
  };

  const onDragMove = (event) => {
    if (!isDragging) return;
    const nextX = dragRef.current.baseX + (event.clientX - dragRef.current.startX);
    const nextY = dragRef.current.baseY + (event.clientY - dragRef.current.startY);
    setDragPosition({ x: nextX, y: nextY });
  };

  const stopDrag = () => setIsDragging(false);

  useEffect(() => {
    if (!isDragging) return undefined;
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', stopDrag);
    return () => {
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', stopDrag);
    };
  }, [isDragging]);

  const floatingButtonClass = isDark
    ? 'from-blue-500 to-purple-600 shadow-blue-500/45'
    : 'from-blue-500 to-purple-500 shadow-blue-500/30';

  const basePanelClass = isDark
    ? 'border-white/15 bg-slate-900/70 text-slate-100'
    : 'border-slate-200/90 bg-white/90 text-slate-800';

  const panelStyle = isDesktop
    ? { transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)` }
    : undefined;

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={toggleOpen}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr text-xl text-white shadow-lg transition duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${floatingButtonClass}`}
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-white/25"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>{isOpen ? 'X' : '💬'}</span>
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <div className="pointer-events-none absolute bottom-16 right-0 hidden rounded-lg border border-white/15 bg-slate-900/80 px-2 py-1 text-[11px] text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 sm:block">
          Ask me anything about Habtamu
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Habtamu AI assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className={`fixed z-40 border shadow-2xl backdrop-blur-xl ${isDesktop ? 'bottom-20 right-5 w-[350px] rounded-2xl' : 'inset-0 w-full rounded-none'} ${basePanelClass}`}
            style={panelStyle}
          >
            <header
              className={`flex items-center justify-between gap-2 border-b px-3 py-2 ${isDark ? 'border-white/10' : 'border-slate-200/80'} ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}`}
              onPointerDown={startDrag}
            >
              <div>
                <h2 className="font-heading text-sm font-semibold">Portfolio AI Assistant</h2>
                <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  Context-aware help for skills, projects, and opportunities
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMinimize}
                  className={`rounded-md px-2 py-1 text-xs ${isDark ? 'bg-slate-800/80 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                  aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                >
                  {isMinimized ? '+' : '-'}
                </button>
                <button
                  type="button"
                  onClick={toggleOpen}
                  className={`rounded-md px-2 py-1 text-xs ${isDark ? 'bg-slate-800/80 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                  aria-label="Close chat"
                >
                  Close
                </button>
              </div>
            </header>

            {!isMinimized && (
              <div className="flex h-full max-h-[78vh] flex-col">
                <AnimatePresence>
                  {showQuickActions && !input.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-wrap gap-2 px-3 py-2"
                    >
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => onQuickAction(action.prompt)}
                          className={`rounded-full border px-3 py-1 text-[11px] transition hover:scale-[1.02] ${isDark ? 'border-white/20 bg-white/5 text-slate-100 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  ref={scrollRef}
                  className={`flex-1 space-y-2 overflow-y-auto px-3 pb-2 ${isDesktop ? 'max-h-[360px]' : 'max-h-[calc(100vh-220px)]'}`}
                >
                  {messages.map((message) => (
                    <MessageBubble key={message.id || `${message.from}-${message.ts}`} message={message} isDark={isDark} />
                  ))}
                  {isTyping && <TypingIndicator />}
                </div>

                <div className={`border-t px-3 py-2 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
                  <AnimatePresence>
                    {helper && (
                      <motion.p
                        initial={{ x: -8, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-1 text-[11px] text-amber-500"
                      >
                        {helper}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <form onSubmit={onSubmit} className="flex items-end gap-2">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value);
                        if (event.target.value.trim()) {
                          setShowQuickActions(false);
                        }
                      }}
                      onKeyDown={onInputKeyDown}
                      placeholder="Ask about projects, Java, React, availability..."
                      className={`max-h-28 flex-1 resize-none rounded-xl border px-3 py-2 text-xs outline-none transition ${isDark ? 'border-white/15 bg-slate-950/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.35)]' : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]'}`}
                      aria-label="Message input"
                    />
                    <motion.button
                      type="submit"
                      disabled={!input.trim()}
                      animate={!input.trim() || prefersReducedMotion ? {} : { scale: [1, 1.04, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg disabled:opacity-55"
                    >
                      Send
                    </motion.button>
                  </form>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

