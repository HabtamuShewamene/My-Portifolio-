import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

function parseContent(content) {
  const parts = [];
  const matcher = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match = matcher.exec(content);

  while (match) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'text', value: match[2] });
    lastIndex = matcher.lastIndex;
    match = matcher.exec(content);
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts;
}

function formatTimestamp(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function ChatMessage({ message, isDark, themeTokens }) {
  const isUser = message.role === 'user';
  const contentParts = useMemo(() => parseContent(message.content), [message.content]);
  const bubbleClass = isUser
    ? 'text-white'
    : isDark
      ? 'border text-slate-50'
      : 'border text-slate-800';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${bubbleClass}`}
        style={
          isUser
            ? { background: themeTokens.userMessage }
            : {
                background: themeTokens.aiMessage,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(139,92,246,0.25)',
              }
        }
      >
        {contentParts.map((part, index) =>
          part.type === 'code' ? (
            <div key={`${message.id}-code-${index}`} className="my-2 overflow-hidden rounded-lg border border-white/15 bg-slate-950/85">
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
        <span className="mt-1 hidden text-[10px] opacity-75 group-hover:block">
          {formatTimestamp(message.ts)}
        </span>
      </div>
    </motion.div>
  );
}

export default memo(ChatMessage);
