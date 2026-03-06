import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { quickActionPrompts } from '../data/assistantKnowledge.js';
import { ChatContext } from './chatContextObject.js';
import {
  createAssistantMemory,
  createInitialAssistantMessage,
  generateAssistantReply,
  updateMemory,
} from '../services/assistantEngine.js';

const STORAGE_KEYS = {
  messages: 'hatag-chat-history-v2',
  isOpen: 'hatag-chat-open-v1',
  isMinimized: 'hatag-chat-minimized-v1',
  unreadCount: 'hatag-chat-unread-v1',
};

const RATE_LIMIT_MS = 900;
const RESPONSE_DEBOUNCE_MS = 220;

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadInitialState() {
  const fallbackMessages = [createInitialAssistantMessage()];
  try {
    const messages = safeParse(window.localStorage.getItem(STORAGE_KEYS.messages), fallbackMessages);
    const isOpen = safeParse(window.localStorage.getItem(STORAGE_KEYS.isOpen), false);
    const isMinimized = safeParse(window.localStorage.getItem(STORAGE_KEYS.isMinimized), false);
    const unreadCount = safeParse(window.localStorage.getItem(STORAGE_KEYS.unreadCount), 0);
    return {
      messages: Array.isArray(messages) && messages.length ? messages : fallbackMessages,
      isOpen: Boolean(isOpen),
      isMinimized: Boolean(isMinimized),
      unreadCount: Number.isFinite(unreadCount) ? unreadCount : 0,
    };
  } catch {
    return {
      messages: fallbackMessages,
      isOpen: false,
      isMinimized: false,
      unreadCount: 0,
    };
  }
}

function persist(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore persistence failures
  }
}

export function ChatProvider({ children }) {
  const initial = useMemo(() => loadInitialState(), []);
  const [isOpen, setIsOpen] = useState(initial.isOpen);
  const [isMinimized, setIsMinimized] = useState(initial.isMinimized);
  const [messages, setMessages] = useState(initial.messages);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initial.unreadCount);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [helper, setHelper] = useState('');
  const [chatError, setChatError] = useState('');
  const memoryRef = useRef(createAssistantMemory());
  const timeoutRef = useRef(null);

  useEffect(() => {
    persist(STORAGE_KEYS.messages, messages);
  }, [messages]);

  useEffect(() => {
    persist(STORAGE_KEYS.isOpen, isOpen);
  }, [isOpen]);

  useEffect(() => {
    persist(STORAGE_KEYS.isMinimized, isMinimized);
  }, [isMinimized]);

  useEffect(() => {
    persist(STORAGE_KEYS.unreadCount, unreadCount);
  }, [unreadCount]);

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsMinimized(false);
        setUnreadCount(0);
      }
      return next;
    });
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    const intro = createInitialAssistantMessage();
    setMessages([intro]);
    memoryRef.current = createAssistantMemory();
    setHelper('');
    setChatError('');
  }, []);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return { accepted: false, reason: 'empty' };

    const now = Date.now();
    if (now - lastSentAt < RATE_LIMIT_MS) {
      const friendly = 'You are sending messages quickly. Please slow down a little so I can respond clearly. 🙌';
      setHelper(friendly);
      return { accepted: false, reason: 'rate_limited', helper: friendly };
    }

    setLastSentAt(now);
    setHelper('');
    setChatError('');

    const userMessage = {
      id: `user-${now}`,
      from: 'user',
      text: trimmed,
      ts: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      try {
        const reply = generateAssistantReply(trimmed, memoryRef.current);
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          from: 'assistant',
          text: reply.text,
          ts: Date.now(),
          intent: reply.intent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        memoryRef.current = updateMemory(memoryRef.current, reply);
        setIsTyping(false);

        const shouldCountUnread = !isOpen || isMinimized;
        if (shouldCountUnread) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        const fallback = {
          id: `assistant-error-${Date.now()}`,
          from: 'assistant',
          text: 'Sorry, I am having trouble right now. Please try again or use the contact form below.',
          ts: Date.now(),
          intent: 'error',
        };
        setMessages((prev) => [...prev, fallback]);
        setIsTyping(false);
        setChatError('assistant_generation_failed');
      }
    }, RESPONSE_DEBOUNCE_MS + Math.min(trimmed.length * 12, 900));

    return { accepted: true };
  }, [isMinimized, isOpen, lastSentAt]);

  const markRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      isMinimized,
      toggleOpen,
      toggleMinimize,
      openChat,
      closeChat,
      messages,
      isTyping,
      sendMessage,
      clearChat,
      quickActions: quickActionPrompts,
      unreadCount,
      markRead,
      helper,
      chatError,
    }),
    [
      chatError,
      clearChat,
      closeChat,
      helper,
      isMinimized,
      isOpen,
      isTyping,
      markRead,
      messages,
      openChat,
      sendMessage,
      toggleMinimize,
      toggleOpen,
      unreadCount,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
