function contains(text, words) {
  return words.some((word) => text.includes(word));
}

function normalize(text) {
  return String(text || '').toLowerCase().trim();
}

export function parseVoiceCommand(input) {
  const text = normalize(input);
  if (!text) return null;

  const sectionMap = [
    { id: 'home', keys: ['go to home', 'home section'] },
    { id: 'about', keys: ['go to about', 'read about habtamu', 'about section'] },
    { id: 'projects', keys: ['go to projects', 'show me projects', 'what projects has habtamu worked on', 'tell me about the job portal'] },
    { id: 'skills', keys: ['show me skills', 'what technologies does he know', 'technologies'] },
    { id: 'experience', keys: ['go to experience', 'show experience'] },
    { id: 'contact', keys: ['take me to contact', 'how can i contact him', 'contact form'] },
  ];

  for (const section of sectionMap) {
    if (contains(text, section.keys)) {
      return { type: 'navigate', target: section.id };
    }
  }

  if (contains(text, ['open ai chat', 'open chat'])) return { type: 'chat-open' };
  if (contains(text, ['close ai chat', 'close chat'])) return { type: 'chat-close' };

  if (contains(text, ['change theme', 'toggle theme'])) return { type: 'theme-toggle' };
  if (contains(text, ['dark mode', 'go to dark mode'])) return { type: 'theme-dark' };
  if (contains(text, ['light mode', 'go to light mode'])) return { type: 'theme-light' };

  if (contains(text, ['download resume', 'download cv'])) return { type: 'resume-download' };

  if (contains(text, ['stop listening', 'go to sleep'])) return { type: 'voice-sleep' };
  if (contains(text, ['wake up', 'hey assistant'])) return { type: 'voice-wake' };

  if (contains(text, ['read that again', 'repeat that', 'say that again', 'read last message'])) return { type: 'repeat-last' };
  if (contains(text, ['respond by voice', 'voice response on', 'speak responses', 'talk to me'])) return { type: 'voice-replies-on' };
  if (contains(text, ['text only', 'voice response off', 'do not speak', 'stop voice replies'])) return { type: 'voice-replies-off' };
  if (contains(text, ['stop reading'])) return { type: 'speak-stop' };
  if (contains(text, ['pause'])) return { type: 'speak-pause' };
  if (contains(text, ['resume reading'])) return { type: 'speak-resume' };
  if (contains(text, ['speak faster'])) return { type: 'rate-up' };
  if (contains(text, ['speak slower'])) return { type: 'rate-down' };

  if (contains(text, ['clear chat', 'start over'])) return { type: 'chat-clear' };
  if (contains(text, ['help', 'what can i say'])) return { type: 'voice-help' };

  if (text.startsWith('search for ')) {
    return { type: 'search', query: input.slice('search for '.length).trim() };
  }

  if (text.startsWith('search ')) {
    return { type: 'search', query: input.slice('search '.length).trim() };
  }

  if (text.startsWith('find ')) {
    return { type: 'search', query: input.slice('find '.length).trim() };
  }

  if (text.startsWith('look for ')) {
    return { type: 'search', query: input.slice('look for '.length).trim() };
  }

  if (text.startsWith('ask ')) {
    return { type: 'ask', question: input.slice(4).trim() };
  }

  return null;
}

export const voiceCommandsCatalog = [
  { category: 'Navigation', command: 'Go to projects', example: 'Go to projects' },
  { category: 'Navigation', command: 'Show me skills', example: 'Show me skills' },
  { category: 'Navigation', command: 'Take me to contact', example: 'Take me to contact' },
  { category: 'Actions', command: 'Download resume', example: 'Download resume' },
  { category: 'Actions', command: 'Dark mode / Light mode', example: 'Dark mode' },
  { category: 'Voice', command: 'Stop listening / Wake up', example: 'Stop listening' },
  { category: 'Voice', command: 'Read that again', example: 'Read that again' },
  { category: 'Voice', command: 'Respond by voice', example: 'Respond by voice' },
  { category: 'Voice', command: 'Text only', example: 'Text only' },
  { category: 'Chat', command: 'Clear chat', example: 'Clear chat' },
  { category: 'Chat', command: 'Search for [topic]', example: 'Search for Java projects' },
  { category: 'Chat', command: 'Ask [question]', example: 'Ask what projects has Habtamu built' },
];
