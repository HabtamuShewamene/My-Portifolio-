import { memo } from 'react';
import { motion } from 'framer-motion';

const DOTS = [0, 1, 2];

function TypingIndicator({ onStop, themeTokens }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div
        className="inline-flex items-center gap-1 rounded-full border px-3 py-2"
        style={{ borderColor: themeTokens.inputBorder, background: themeTokens.inputBg }}
      >
        {DOTS.map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-slate-300"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.1 }}
          />
        ))}
      </div>
      <motion.button
        type="button"
        onClick={onStop}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-flex items-center gap-1 rounded-lg border border-red-400/45 bg-red-500/90 px-2 py-1 text-[11px] font-semibold text-white"
        aria-label="Stop generating"
      >
        <span className="h-2 w-2 rounded-sm bg-white" />
        Stop generating
      </motion.button>
    </div>
  );
}

export default memo(TypingIndicator);
