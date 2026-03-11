import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function ChatInput({
  value,
  onChange,
  onSend,
  isGenerating,
  onStopGenerating,
  themeTokens,
  onToggleListening,
  isListening,
  interimTranscript,
  voiceEnabled,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t px-3 py-3" style={{ borderTopColor: themeTokens.chatBorder }}>
      <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-2xl border p-2" style={{ borderColor: themeTokens.inputBorder, background: themeTokens.inputBg }}>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm opacity-75"
          style={{ background: themeTokens.quickActionBg, color: themeTokens.textPrimary }}
          aria-label="Attachments"
          title="Attachment (coming soon)"
        >
          📎
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Assistant..."
          aria-label="Chat input"
          className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border-0 px-2 py-2 text-xs outline-none"
          style={{
            background: 'transparent',
            color: themeTokens.textPrimary,
          }}
        />

        <button
          type="button"
          onClick={onToggleListening}
          disabled={!voiceEnabled}
          className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white ${isListening ? 'bg-red-500' : 'bg-slate-500'}`}
          aria-label="Toggle microphone"
          title={isListening ? 'Listening...' : 'Start voice input'}
        >
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full border border-red-200"
              animate={{ scale: [1, 1.22, 1], opacity: [0.9, 0.3, 0.9] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          )}
          <span>🎤</span>
        </button>

        <motion.button
          type="submit"
          disabled={!value.trim() || isGenerating}
          whileHover={!value.trim() ? {} : { scale: 1.05 }}
          className={`rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-lg transition ${!value.trim() ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          ➤
        </motion.button>
        {isGenerating && (
          <motion.button
            type="button"
            onClick={onStopGenerating}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/90 px-3 py-2 text-xs font-semibold text-white shadow-lg"
            aria-label="Stop generating"
          >
            <span className="h-2.5 w-2.5 rounded-sm bg-white" />
            Stop
          </motion.button>
        )}
      </form>

      <div className="mt-1 flex items-center justify-between px-1 text-[10px]" style={{ color: themeTokens.textSecondary }}>
        <span>{isListening ? 'Listening... try "search for React projects"' : 'Voice shortcut: Ctrl/Cmd + M'}</span>
        {interimTranscript ? <span className="max-w-[52%] truncate italic">{interimTranscript}</span> : null}
      </div>
    </div>
  );
}

export default memo(ChatInput);
