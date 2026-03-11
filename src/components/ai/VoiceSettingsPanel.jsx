import { motion } from 'framer-motion';

export default function VoiceSettingsPanel({
  open,
  onClose,
  voice,
  themeTokens,
}) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-3 mb-2 max-h-[45vh] overflow-y-auto rounded-xl border p-3"
      style={{ borderColor: themeTokens.chatBorder, background: themeTokens.quickActionBg }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold" style={{ color: themeTokens.textPrimary }}>Voice Settings</h4>
        <button
          type="button"
          className="rounded px-2 py-1 text-[11px]"
          style={{ background: themeTokens.inputBg, color: themeTokens.textPrimary }}
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="grid gap-2 text-[11px] sm:grid-cols-2">
        <label className="flex items-center justify-between gap-2">
          <span>Enable voice</span>
          <input type="checkbox" checked={voice.isVoiceEnabled} onChange={(e) => voice.setIsVoiceEnabled(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-2">
          <span>Auto-play response</span>
          <input type="checkbox" checked={voice.autoPlay} onChange={(e) => voice.setAutoPlay(e.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-2 sm:col-span-2">
          <span>Accent profile</span>
          <select
            value={voice.selectedAccent}
            onChange={(e) => voice.setSelectedAccent(e.target.value)}
            className="rounded border px-2 py-1"
            style={{ borderColor: themeTokens.inputBorder, background: themeTokens.inputBg, color: themeTokens.textPrimary }}
          >
            {voice.accents.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between gap-2 sm:col-span-2">
          <span>Voice</span>
          <select
            value={voice.voiceUri}
            onChange={(e) => voice.setVoiceUri(e.target.value)}
            className="max-w-[210px] rounded border px-2 py-1"
            style={{ borderColor: themeTokens.inputBorder, background: themeTokens.inputBg, color: themeTokens.textPrimary }}
          >
            {voice.voices.map((item) => (
              <option key={item.voiceURI} value={item.voiceURI}>{item.name} ({item.lang})</option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mr-2">Speed: {voice.speechRate.toFixed(2)}x</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voice.speechRate}
            onChange={(e) => voice.setSpeechRate(Number(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mr-2">Pitch: {voice.speechPitch.toFixed(2)}</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voice.speechPitch}
            onChange={(e) => voice.setSpeechPitch(Number(e.target.value))}
            className="w-full"
          />
        </label>

        <div className="sm:col-span-2 rounded border px-2 py-2" style={{ borderColor: themeTokens.chatBorder }}>
          <p className="font-semibold">Compatibility</p>
          <p>{voice.compatibility.summary}</p>
          <p>Mic permission: {voice.micPermission}</p>
          <p>TTS voices: {voice.compatibility.voicesCount}</p>
          {voice.recognitionError ? <p className="mt-1 text-amber-500">{voice.recognitionError}</p> : null}
          <button
            type="button"
            className="mt-2 rounded px-2 py-1"
            style={{ background: themeTokens.inputBg, color: themeTokens.textPrimary }}
            onClick={voice.requestMicPermission}
          >
            Retry microphone permission
          </button>
        </div>
      </div>
    </motion.div>
  );
}
