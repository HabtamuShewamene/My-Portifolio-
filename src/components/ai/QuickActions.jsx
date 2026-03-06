import { memo } from 'react';
import { motion } from 'framer-motion';

function QuickActions({ actions, visible, onSelect, isDark, themeTokens }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-wrap gap-2"
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onSelect(action.prompt)}
          className={`rounded-full border px-3 py-1 text-[11px] transition hover:scale-[1.02] ${
            isDark ? 'text-slate-100' : 'text-slate-700'
          }`}
          style={{
            borderColor: themeTokens.inputBorder,
            background: themeTokens.quickActionBg,
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = themeTokens.quickActionHover;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = themeTokens.quickActionBg;
          }}
        >
          {action.label}
        </button>
      ))}
    </motion.div>
  );
}

export default memo(QuickActions);
