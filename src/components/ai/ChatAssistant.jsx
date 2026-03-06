import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import { chatData } from '../../data/chatData.js';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';

const QUICK_ACTIONS = [
  { id: 'about', label: 'About Me', prompt: 'Tell me about Habtamu' },
  { id: 'projects', label: 'Projects', prompt: 'What projects has he built?' },
  { id: 'skills', label: 'Skills', prompt: 'What are his skills?' },
  { id: 'contact', label: 'Contact', prompt: 'How can I contact him?' },
];

function normalize(value) {
  return value.toLowerCase().trim();
}

function hasAny(text, keywords) {
  return keywords.some((word) => text.includes(word));
}

function formatProjectList(projects) {
  return projects.map((project) => `- ${project.name} (${project.stack.join(', ')})`).join('\n');
}

function formatProjectDetails(project) {
  return (
    `${project.name}\n` +
    `${project.summary}\n` +
    `Tech: ${project.stack.join(', ')}\n` +
    `${project.highlights.map((item) => `- ${item}`).join('\n')}`
  );
}

function resolveProjectByKeyword(text) {
  const words = normalize(text);
  return chatData.projects.find((project) => {
    const name = project.name.toLowerCase();
    const stack = project.stack.join(' ').toLowerCase();
    return words.includes(project.id) || words.includes(name) || words.includes(stack);
  });
}

function resolveProjectSuggestions(text) {
  const normalized = normalize(text);

  if (hasAny(normalized, ['java', 'spring'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => ['java', 'spring boot'].includes(tech.toLowerCase())),
    );
  }

  if (hasAny(normalized, ['react'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => tech.toLowerCase().includes('react')),
    );
  }

  if (hasAny(normalized, ['node', 'express', 'backend', 'api'])) {
    return chatData.projects.filter((project) =>
      project.stack.some((tech) => ['node.js', 'express'].includes(tech.toLowerCase())),
    );
  }

  return chatData.projects;
}

function createWelcomeMessage() {
  return {
    id: `assistant-welcome-${Date.now()}`,
    role: 'assistant',
    content:
      `Hi. I am Habtamu's portfolio assistant.\n` +
      `You can ask about projects, skills, experience, or contact details.`,
    ts: Date.now(),
    intent: 'welcome',
  };
}

function generateSmartReply(input, context) {
  const text = normalize(input);
  const activeProject = context.lastProjectId
    ? chatData.projects.find((project) => project.id === context.lastProjectId)
    : null;

  if (hasAny(text, ['name', 'who are you', 'full name'])) {
    return {
      intent: 'name',
      lastProjectId: context.lastProjectId,
      content: `${chatData.profile.fullName} - ${chatData.profile.role}.`,
    };
  }

  if (hasAny(text, ['skills', 'technologies', 'tech stack'])) {
    return {
      intent: 'skills',
      lastProjectId: context.lastProjectId,
      content:
        `Skills and technologies:\n` +
        `Frontend: ${chatData.skills.frontend.join(', ')}\n` +
        `Backend: ${chatData.skills.backend.join(', ')}\n` +
        `Database: ${chatData.skills.database.join(', ')}\n` +
        `Tools: ${chatData.skills.tools.join(', ')}`,
    };
  }

  if (hasAny(text, ['project', 'projects', 'portfolio'])) {
    const suggestions = resolveProjectSuggestions(text);
    const firstProject = suggestions[0] || chatData.projects[0];
    return {
      intent: 'projects',
      lastProjectId: firstProject?.id || null,
      content:
        `Habtamu has built ${chatData.projects.length} strong projects:\n` +
        `${formatProjectList(suggestions)}\n\n` +
        `Which one interests you most?`,
    };
  }

  if (hasAny(text, ['tell me more about that one', 'that one', 'more about it', 'tell me more'])) {
    if (activeProject) {
      return {
        intent: 'project_detail',
        lastProjectId: activeProject.id,
        content: formatProjectDetails(activeProject),
      };
    }
    return {
      intent: 'project_detail',
      lastProjectId: context.lastProjectId,
      content: `Tell me which project you want details for: ${chatData.projects.map((p) => p.name).join(', ')}.`,
    };
  }

  if (hasAny(text, ['what else', 'anything else', 'more options'])) {
    const remaining = chatData.projects.filter((project) => project.id !== context.lastProjectId);
    return {
      intent: 'projects',
      lastProjectId: remaining[0]?.id || context.lastProjectId,
      content: `Here are more options:\n${formatProjectList(remaining.slice(0, 5))}`,
    };
  }

  if (hasAny(text, ['contact', 'email', 'reach'])) {
    return {
      intent: 'contact',
      lastProjectId: context.lastProjectId,
      content:
        `Email: ${chatData.profile.email}\n` +
        `Use the contact form on this page for opportunities and collaboration requests.`,
    };
  }

  if (hasAny(text, ['experience', 'timeline', 'background'])) {
    return {
      intent: 'experience',
      lastProjectId: context.lastProjectId,
      content:
        `Experience timeline:\n` +
        chatData.experience
          .map((item) => `- ${item.period}: ${item.role}\n  ${item.details}`)
          .join('\n'),
    };
  }

  if (hasAny(text, ['java', 'spring'])) {
    const jobPortal = chatData.projects.find((project) => project.id === 'job-portal');
    return {
      intent: 'project_detail',
      lastProjectId: jobPortal?.id || context.lastProjectId,
      content:
        `For Java/Spring work, the standout project is ${jobPortal?.name}.\n` +
        `${jobPortal ? formatProjectDetails(jobPortal) : ''}`,
    };
  }

  if (hasAny(text, ['react'])) {
    const reactProjects = chatData.projects.filter((project) =>
      ['crypto-tracker', 'news-app'].includes(project.id),
    );
    return {
      intent: 'projects',
      lastProjectId: reactProjects[0]?.id || context.lastProjectId,
      content:
        `React-focused projects:\n${formatProjectList(reactProjects)}\n` +
        `Crypto Tracker and News App are great to review first.`,
    };
  }

  if (hasAny(text, ['github'])) {
    return {
      intent: 'github',
      lastProjectId: context.lastProjectId,
      content: `GitHub: ${chatData.profile.github}`,
    };
  }

  const explicitProject = resolveProjectByKeyword(text);
  if (explicitProject) {
    return {
      intent: 'project_detail',
      lastProjectId: explicitProject.id,
      content: formatProjectDetails(explicitProject),
    };
  }

  return {
    intent: 'fallback',
    lastProjectId: context.lastProjectId,
    content:
      `I'm not sure about that, but I can tell you about Habtamu's:\n` +
      `• Projects (7 full-stack applications)\n` +
      `• Skills (React, Java, Node.js, etc.)\n` +
      `• Experience and background\n` +
      `• How to contact him\n\n` +
      `What would you like to know?`,
  };
}

export default function ChatAssistant() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helperText, setHelperText] = useState('');
  const contextRef = useRef({ lastIntent: null, lastProjectId: null });
  const scrollRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  const showQuickActions = !draft.trim();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }
  }, []);

  const resetConversation = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setMessages([]);
    setDraft('');
    setIsTyping(false);
    setHelperText('');
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setMessages([createWelcomeMessage()]);
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const closeChat = () => {
    setIsOpen(false);
    setUnreadCount(0);
    resetConversation();
  };

  const handleToggle = () => {
    if (isOpen) {
      closeChat();
      return;
    }
    openChat();
  };

  const stopGenerating = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setIsTyping(false);
    setHelperText('Response stopped.');
  };

  useEffect(() => {
    if (!isOpen) return;
    if (!messages.length) {
      setMessages([createWelcomeMessage()]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = (nextText) => {
    const trimmed = nextText.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsTyping(true);
    setHelperText('');

    const delay = 1000 + Math.floor(Math.random() * 1000);

    replyTimeoutRef.current = window.setTimeout(() => {
      replyTimeoutRef.current = null;
      try {
        const reply = generateSmartReply(trimmed, contextRef.current);
        contextRef.current = {
          lastIntent: reply.intent,
          lastProjectId: reply.lastProjectId,
        };

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.content,
          ts: Date.now(),
          intent: reply.intent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: 'assistant',
            content:
              'Sorry, I am having trouble right now. Please try again or use the contact form below.',
            ts: Date.now(),
            intent: 'error',
          },
        ]);
        setIsTyping(false);
        setHelperText("I couldn't process that response. Please try again.");
      }
    }, delay);
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  const windowClass = isDark
    ? 'text-white'
    : 'text-slate-900';

  const themeTokens = isDark
    ? {
        chatBg: 'rgba(10, 25, 41, 0.95)',
        chatBorder: 'rgba(59, 130, 246, 0.3)',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1',
        inputBg: '#1e293b',
        inputBorder: '#334155',
        quickActionBg: '#1e293b',
        quickActionHover: '#334155',
      }
    : {
        chatBg: 'rgba(255, 255, 255, 0.95)',
        chatBorder: 'rgba(59, 130, 246, 0.2)',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        inputBg: '#f8fafc',
        inputBorder: '#e2e8f0',
        quickActionBg: '#f1f5f9',
        quickActionHover: '#e2e8f0',
      };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={handleToggle}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-xl text-white shadow-lg shadow-blue-500/40 transition hover:scale-105"
          aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-white/25"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>{isOpen ? 'X' : 'AI'}</span>
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className={`fixed z-40 border shadow-2xl backdrop-blur-xl ${windowClass} bottom-20 right-4 left-4 rounded-2xl sm:left-auto sm:w-[380px]`}
            style={{ background: themeTokens.chatBg, borderColor: themeTokens.chatBorder }}
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
            <header className="flex items-center justify-between border-b px-3 py-2" style={{ borderBottomColor: themeTokens.chatBorder }}>
              <div>
                <h2 className="font-heading text-sm font-semibold" style={{ color: themeTokens.textPrimary }}>AI Assistant</h2>
                <p className="text-[11px]" style={{ color: themeTokens.textSecondary }}>
                  Ask about Habtamu's projects, skills, and contact details
                </p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-md px-2 py-1 text-xs"
                style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                aria-label="Close chat"
              >
                Close
              </button>
            </header>

            <div
              ref={scrollRef}
              className="max-h-[52vh] space-y-2 overflow-y-auto px-3 py-3 sm:max-h-[420px]"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isDark={isDark} themeTokens={themeTokens} />
              ))}
              {isTyping && <TypingIndicator onStop={stopGenerating} themeTokens={themeTokens} />}
            </div>

            {helperText && (
              <p className="px-3 pb-1 text-[11px] text-amber-500">{helperText}</p>
            )}

            <ChatInput
              value={draft}
              onChange={setDraft}
              onSend={() => sendMessage(draft)}
              quickActions={QUICK_ACTIONS}
              showQuickActions={showQuickActions}
              onQuickAction={handleQuickAction}
              isDark={isDark}
              isGenerating={isTyping}
              onStopGenerating={stopGenerating}
              themeTokens={themeTokens}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
