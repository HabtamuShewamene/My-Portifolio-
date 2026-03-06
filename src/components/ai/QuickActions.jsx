import { memo } from 'react';
import { motion } from 'framer-motion';

function QuickActions({ actions, visible, onSelect, isDark }) {
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
            isDark
              ? 'border-white/20 bg-white/5 text-slate-100 hover:bg-white/10'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {action.label}
        </button>
      ))}
    </motion.div>
  );
}

export default memo(QuickActions);

