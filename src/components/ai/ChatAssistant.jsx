import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import { chatData } from '../../data/chatData.js';
import { buildGreetingReply, detectGreetingIntent } from '../../data/greetingsData.js';
import { downloadResume } from '../../services/resume.js';
import { parseVoiceCommand, voiceCommandsCatalog } from '../../services/voiceCommands.js';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant.js';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import QuickActions from './QuickActions.jsx';
import VoiceSettingsPanel from './VoiceSettingsPanel.jsx';
import VoiceCommandsGuide from './VoiceCommandsGuide.jsx';

const QUICK_ACTIONS = [
  { id: 'about', label: 'About Habtamu', prompt: 'Tell me about Habtamu' },
  { id: 'projects', label: 'View Projects', prompt: 'What projects has he built?' },
  { id: 'skills', label: 'Skills & Tech', prompt: 'What are his skills?' },
  { id: 'contact', label: 'Contact Info', prompt: 'How can I contact him?' },
  { id: 'experience', label: 'Experience Timeline', prompt: 'Tell me about his experience timeline' },
  { id: 'resume', label: 'Download Resume', prompt: 'Can I download your resume?' },
];

const EXAMPLE_QUESTIONS = [
  'What projects has Habtamu built?',
  'Tell me about the Job Portal System',
  'What technologies does he use?',
  'How can I contact him?',
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

function spokenFriendlyText(content) {
  return String(content || '')
    .replace(/👋/g, 'waving hand')
    .replace(/✨/g, 'sparkles')
    .replace(/🚀/g, 'rocket')
    .replace(/✅/g, 'check mark')
    .replace(/📍/g, 'location pin')
    .replace(/📬/g, 'mailbox')
    .replace(/🌐/g, 'globe')
    .replace(/💻/g, 'laptop')
    .replace(/🙌/g, 'celebration')
    .replace(/[•]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return false;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function generateSmartReply(input, context) {
  const text = normalize(input);
  const activeProject = context.lastProjectId
    ? chatData.projects.find((project) => project.id === context.lastProjectId)
    : null;

  const greetingIntent = detectGreetingIntent(input);
  if (greetingIntent.isGreeting) {
    return {
      intent: 'greeting',
      lastProjectId: context.lastProjectId,
      content: buildGreetingReply(greetingIntent),
    };
  }

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

  if (hasAny(text, ['resume', 'cv', 'curriculum vitae'])) {
    return {
      intent: 'resume',
      lastProjectId: context.lastProjectId,
      content:
        `You can download Habtamu's resume from three places:\n` +
        `- Hero section: "Get Resume"\n` +
        `- About section: "Download CV"\n` +
        `- Contact section: "My Resume"`,
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
  const { isDark, toggleTheme, setThemeMode, setManualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState(() => [createWelcomeMessage()]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const contextRef = useRef({ lastIntent: null, lastProjectId: null });
  const scrollRef = useRef(null);
  const replyTimeoutRef = useRef(null);
  const dragControls = useDragControls();

  const handleChatPointerDown = (event) => {
    // Start dragging when the user double-clicks anywhere inside the chat window.
    if (event.button !== 0) return;
    if (event.detail >= 2) {
      dragControls.start(event);
    }
  };

  const voice = useVoiceAssistant({
    onTranscriptFinal: (transcript) => {
      handleVoiceTranscript(transcript);
    },
    onRecognitionError: (errorMessage) => {
      setHelperText(errorMessage);
    },
  });

  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm';
      if (!shortcut || !isOpen) return;
      event.preventDefault();
      voice.toggleListening();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, voice]);

  const resetConversation = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setMessages([createWelcomeMessage()]);
    setDraft('');
    setIsTyping(false);
    setHelperText('');
    setIsConversationMode(false);
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setMessages([createWelcomeMessage()]);
    setHelperText('');
    setIsConversationMode(false);
    contextRef.current = { lastIntent: null, lastProjectId: null };
  };

  const closeChat = () => {
    voice.stopListening();
    voice.stopSpeaking();
    setIsOpen(false);
    setUnreadCount(0);
    setShowMenu(false);
    setShowVoiceGuide(false);
    setShowVoiceSettings(false);
  };

  const handleToggle = () => {
    if (isOpen) {
      closeChat();
      return;
    }
    openChat();
  };

  const backToWelcome = () => {
    setIsConversationMode(false);
    setShowMenu(false);
  };

  const stopGenerating = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setIsTyping(false);
    setHelperText('Response stopped.');
  };

  const appendAssistantMessage = (content, intent = 'voice_action') => {
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      ts: Date.now(),
      intent,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsConversationMode(true);
    if (voice.autoPlay) {
      voice.speak(spokenFriendlyText(content), assistantMessage.id);
    }
  };

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setHelperText('Message copied.');
      window.setTimeout(() => setHelperText(''), 1600);
    } catch {
      setHelperText('Unable to copy message.');
    }
  };

  const regenerateLastResponse = () => {
    if (isTyping) return;
    const lastUser = [...messages].reverse().find((message) => message.role === 'user');
    if (!lastUser) return;

    setMessages((prev) => {
      const next = [...prev];
      const idx = [...next].reverse().findIndex((item) => item.role === 'assistant');
      if (idx >= 0) {
        next.splice(next.length - 1 - idx, 1);
      }
      return next;
    });
    setDraft('');
    sendMessage(lastUser.content);
  };

  const handleVoiceCommand = async (command) => {
    switch (command.type) {
      case 'navigate': {
        const ok = scrollToSection(command.target);
        if (ok) {
          appendAssistantMessage(`Taking you to ${command.target} now.`, 'navigation');
        }
        return true;
      }
      case 'chat-open':
        if (!isOpen) openChat();
        appendAssistantMessage('Chat is open.', 'chat');
        return true;
      case 'chat-close':
        appendAssistantMessage('Closing chat window now.', 'chat');
        window.setTimeout(closeChat, 350);
        return true;
      case 'theme-toggle':
        toggleTheme();
        appendAssistantMessage('Switching theme now.', 'theme');
        return true;
      case 'theme-dark':
        setThemeMode('manual');
        setManualTheme('dark');
        appendAssistantMessage('Dark mode enabled.', 'theme');
        return true;
      case 'theme-light':
        setThemeMode('manual');
        setManualTheme('light');
        appendAssistantMessage('Light mode enabled.', 'theme');
        return true;
      case 'resume-download':
        await downloadResume({ format: 'pdf', placement: 'chat' });
        appendAssistantMessage('Starting your resume download now.', 'resume');
        return true;
      case 'voice-sleep':
        voice.setIsVoiceAwake(false);
        voice.stopListening();
        appendAssistantMessage('Voice mode is sleeping. Say wake up when you need me.', 'voice');
        return true;
      case 'voice-wake':
        voice.setIsVoiceAwake(true);
        appendAssistantMessage('Voice mode is active again.', 'voice');
        return true;
      case 'repeat-last':
        if (lastAssistantMessage) {
          voice.speak(spokenFriendlyText(lastAssistantMessage.content), lastAssistantMessage.id);
        }
        return true;
      case 'voice-replies-on':
        voice.setAutoPlay(true);
        appendAssistantMessage('Voice replies are now enabled. I will speak responses when available.', 'voice');
        return true;
      case 'voice-replies-off':
        voice.setAutoPlay(false);
        voice.stopSpeaking();
        appendAssistantMessage('Voice replies are now off. I will respond in text only.', 'voice');
        return true;
      case 'speak-stop':
        voice.stopSpeaking();
        return true;
      case 'speak-pause':
        voice.pauseSpeaking();
        return true;
      case 'speak-resume':
        voice.resumeSpeaking();
        return true;
      case 'rate-up':
        voice.setSpeechRate((prev) => Math.min(2, Number(prev) + 0.1));
        appendAssistantMessage('Speaking a little faster now.', 'voice');
        return true;
      case 'rate-down':
        voice.setSpeechRate((prev) => Math.max(0.5, Number(prev) - 0.1));
        appendAssistantMessage('Speaking a little slower now.', 'voice');
        return true;
      case 'chat-clear':
        resetConversation();
        appendAssistantMessage('Chat has been cleared.', 'chat');
        return true;
      case 'voice-help':
        setShowVoiceGuide(true);
        appendAssistantMessage('Opening the voice command guide now.', 'voice_help');
        return true;
      case 'search':
        if (command.query) {
          setDraft(command.query);
          sendMessage(command.query);
          return true;
        }
        return false;
      case 'ask':
        if (command.question) {
          sendMessage(command.question);
          return true;
        }
        return false;
      default:
        return false;
    }
  };

  function handleVoiceTranscript(transcript) {
    if (!transcript?.trim()) return;

    const command = parseVoiceCommand(transcript);
    if (command) {
      handleVoiceCommand(command).catch(() => {
        setHelperText('Voice command failed. Please try again.');
      });
      return;
    }

    setDraft(transcript);
    sendMessage(transcript);
  }

  const sendMessage = (nextText) => {
    const trimmed = nextText.trim();
    if (!trimmed || isTyping) return;
    setIsConversationMode(true);

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

        if (voice.autoPlay) {
          voice.speak(spokenFriendlyText(assistantMessage.content), assistantMessage.id);
        }

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
    setIsConversationMode(true);
    sendMessage(prompt);
  };

  const windowClass = isDark
    ? 'text-white'
    : 'text-slate-900';

  const themeTokens = isDark
    ? {
        chatBg: '#111827',
        chatBorder: '#374151',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: '#374151',
        textPrimary: '#f9fafb',
        textSecondary: '#9ca3af',
        inputBg: '#1f2937',
        inputBorder: '#374151',
        quickActionBg: '#1f2937',
        quickActionHover: '#273244',
        bgSecondary: '#1f2937',
      }
    : {
        chatBg: '#ffffff',
        chatBorder: '#e5e7eb',
        userMessage: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        aiMessage: '#f3f4f6',
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        inputBg: '#f8fafc',
        inputBorder: '#e2e8f0',
        quickActionBg: '#f9fafb',
        quickActionHover: '#f1f5f9',
        bgSecondary: '#f9fafb',
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className={`fixed z-40 flex max-h-[85vh] flex-col overflow-hidden border shadow-2xl backdrop-blur-xl ${windowClass} bottom-20 right-4 left-4 rounded-2xl sm:left-auto sm:w-[380px]`}
            style={{
              background: themeTokens.chatBg,
              borderColor: themeTokens.chatBorder,
            }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            onPointerDown={handleChatPointerDown}
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
            <header
              className="relative flex select-none items-center justify-between border-b px-3 py-2"
              style={{
                borderBottomColor: themeTokens.chatBorder,
                background: isDark
                  ? 'linear-gradient(120deg, rgba(55,65,81,0.55), rgba(17,24,39,0.95))'
                  : 'linear-gradient(120deg, rgba(243,244,246,0.8), rgba(255,255,255,0.95))',
              }}
            >
              <div className="flex items-center gap-2">
                {isConversationMode ? (
                  <button
                    type="button"
                    onClick={backToWelcome}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  >
                    ← Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeChat}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  >
                    ✕
                  </button>
                )}

                <div>
                  <h2 className="font-heading text-sm font-semibold" style={{ color: themeTokens.textPrimary }}>
                    Chat with Habtamu&apos;s AI
                  </h2>
                  <p className="text-[10px]" style={{ color: themeTokens.textSecondary }}>
                    {isConversationMode ? 'Ask a follow-up question' : 'How can I help you today?'}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex cursor-grab active:cursor-grabbing items-center rounded-md px-2 py-1 text-xs"
                  style={{ background: themeTokens.quickActionBg, color: themeTokens.textSecondary }}
                  aria-label="Drag chat window"
                  title="Drag to move"
                  onPointerDown={(event) => {
                    dragControls.start(event);
                  }}
                >
                  ⠿
                </button>

                <button
                  type="button"
                  onClick={voice.toggleListening}
                  className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-white ${voice.isListening ? 'bg-red-500' : 'bg-slate-500'}`}
                  aria-label="Toggle voice listening"
                  title={voice.isListening ? 'Listening...' : 'Voice input'}
                >
                  {voice.isListening && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-red-200"
                      animate={{ scale: [1, 1.22, 1], opacity: [0.9, 0.35, 0.9] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    />
                  )}
                  🎤
                </button>

                <button
                  type="button"
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="rounded-md px-2 py-1 text-xs"
                  style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
                  aria-label="Open chat menu"
                >
                  ⋮
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 top-10 z-20 w-44 rounded-xl border p-1 text-xs shadow-xl"
                    style={{ borderColor: themeTokens.chatBorder, background: themeTokens.chatBg }}
                  >
                    <button type="button" className="w-full rounded-lg px-2 py-1 text-left" onClick={() => { setShowVoiceSettings(true); setShowMenu(false); }}>
                      Voice settings
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-1 text-left" onClick={() => { setShowVoiceGuide(true); setShowMenu(false); }}>
                      Voice commands guide
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-1 text-left" onClick={() => { regenerateLastResponse(); setShowMenu(false); }}>
                      Regenerate response
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-1 text-left" onClick={() => { resetConversation(); setShowMenu(false); }}>
                      Clear conversation
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-1 text-left" onClick={() => { closeChat(); setShowMenu(false); }}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </header>

            <VoiceSettingsPanel
              open={showVoiceSettings}
              onClose={() => setShowVoiceSettings(false)}
              voice={voice}
              themeTokens={themeTokens}
            />

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3" style={{ background: themeTokens.bgSecondary }}>
              {!isConversationMode ? (
                <div className="space-y-5 py-4">
                  <div className="text-center">
                    <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow">AI</div>
                    <h3 className="text-base font-semibold" style={{ color: themeTokens.textPrimary }}>
                      Hi, I&apos;m Habtamu&apos;s assistant
                    </h3>
                    <p className="mx-auto mt-1 max-w-[290px] text-xs" style={{ color: themeTokens.textSecondary }}>
                      Ask me anything about his projects, skills, experience, and contact details.
                    </p>
                  </div>

                  <div className="rounded-xl border p-3 text-center text-xs" style={{ borderColor: themeTokens.chatBorder, background: themeTokens.chatBg }}>
                    How can I help you today?
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold" style={{ color: themeTokens.textSecondary }}>Suggested questions</p>
                    <QuickActions
                      actions={QUICK_ACTIONS}
                      visible
                      onSelect={handleQuickAction}
                      isDark={isDark}
                      themeTokens={themeTokens}
                    />
                  </div>

                  <div className="grid gap-2">
                    {EXAMPLE_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleQuickAction(question)}
                        className="rounded-lg border p-2 text-left text-xs transition hover:shadow"
                        style={{ borderColor: themeTokens.chatBorder, background: themeTokens.chatBg, color: themeTokens.textPrimary }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isDark={isDark}
                      themeTokens={themeTokens}
                      isBeingSpoken={voice.isSpeaking && voice.spokenMessageId === message.id}
                      spokenCharIndex={voice.spokenCharIndex}
                      onCopy={copyMessage}
                    />
                  ))}
                  {isTyping && <TypingIndicator onStop={stopGenerating} themeTokens={themeTokens} />}

                  {!isTyping && messages.some((item) => item.role === 'user') && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={regenerateLastResponse}
                        className="rounded-full border px-3 py-1 text-[11px]"
                        style={{ borderColor: themeTokens.chatBorder, background: themeTokens.chatBg }}
                      >
                        Regenerate response
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {helperText && (
              <p className="px-3 pb-1 text-[11px] text-amber-500">{helperText}</p>
            )}

            <ChatInput
              value={draft}
              onChange={setDraft}
              onSend={() => sendMessage(draft)}
              isGenerating={isTyping}
              onStopGenerating={stopGenerating}
              themeTokens={themeTokens}
              onToggleListening={voice.toggleListening}
              isListening={voice.isListening}
              interimTranscript={voice.interimTranscript}
              voiceEnabled={voice.isVoiceEnabled && voice.isVoiceAwake && voice.support.hasRecognition}
            />

            <VoiceCommandsGuide
              open={showVoiceGuide}
              onClose={() => setShowVoiceGuide(false)}
              commands={voiceCommandsCatalog}
              themeTokens={themeTokens}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
