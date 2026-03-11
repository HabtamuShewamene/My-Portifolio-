import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function VoiceCommandsGuide({ open, onClose, commands, themeTokens }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter((item) =>
      [item.category, item.command, item.example].join(' ').toLowerCase().includes(q),
    );
  }, [commands, query]);

  if (!open) return null;

  return (
    <motion.aside
      initial={{ x: 260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute inset-y-0 right-0 z-10 w-[260px] border-l p-3"
      style={{ borderColor: themeTokens.chatBorder, background: themeTokens.chatBg }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold" style={{ color: themeTokens.textPrimary }}>Voice Commands</h4>
        <button type="button" onClick={onClose} className="rounded px-2 py-1 text-[11px]" style={{ background: themeTokens.inputBg }}>
          Close
        </button>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search command"
        className="mb-2 w-full rounded border px-2 py-1 text-[11px]"
        style={{ borderColor: themeTokens.inputBorder, background: themeTokens.inputBg, color: themeTokens.textPrimary }}
      />
      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1 text-[11px]">
        {filtered.map((item, idx) => (
          <div key={`${item.command}-${idx}`} className="rounded border p-2" style={{ borderColor: themeTokens.chatBorder }}>
            <p className="font-semibold">{item.category}</p>
            <p>{item.command}</p>
            <p className="opacity-80">e.g. {item.example}</p>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
