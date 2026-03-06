import { memo } from 'react';
import { motion } from 'framer-motion';

const DOTS = [0, 1, 2];

function TypingIndicator() {
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
}

export default memo(TypingIndicator);

