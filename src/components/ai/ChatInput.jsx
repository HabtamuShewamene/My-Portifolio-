import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QuickActions from './QuickActions.jsx';

function ChatInput({
  value,
  onChange,
  onSend,
  quickActions,
  showQuickActions,
  onQuickAction,
  isDark,
  isGenerating,
  onStopGenerating,
  themeTokens,
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
    <div className="border-t px-3 py-2" style={{ borderTopColor: themeTokens.chatBorder }}>
      <QuickActions
        actions={quickActions}
        visible={showQuickActions}
        onSelect={onQuickAction}
        isDark={isDark}
        themeTokens={themeTokens}
      />
      <form onSubmit={handleSubmit} className="mt-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Habtamu's projects, skills, or contact..."
          aria-label="Chat input"
          className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border px-3 py-2 text-xs outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
          style={{
            borderColor: themeTokens.inputBorder,
            background: themeTokens.inputBg,
            color: themeTokens.textPrimary,
          }}
        />
        <motion.button
          type="submit"
          disabled={!value.trim() || isGenerating}
          animate={!value.trim() ? {} : { scale: [1, 1.04, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg disabled:opacity-55"
        >
          Send
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
    </div>
  );
}

export default memo(ChatInput);
