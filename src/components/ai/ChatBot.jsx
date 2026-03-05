import { useState } from 'react';
import { sendChatMessage } from '../../services/api.js';

const defaultIntro =
  "Hi, I'm HataG – a simple assistant for Habtamu's portfolio. Ask me about his projects, skills, or experience!";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: defaultIntro },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (event) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setLoading(true);
    try {
      const response = await sendChatMessage(trimmed);
      const answer = response?.reply;
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          from: 'bot',
          text:
            answer ||
            "I'm still connecting to the full AI backend, but here’s a quick summary: Habtamu is a junior full stack developer who has built systems like an inventory manager, helpdesk queue, bug tracker, news app, and a Java Spring Boot job portal.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text:
            "I'm not fully online yet, but you can ask me about Habtamu's projects like the Job Portal System, Crypto Tracker, or Inventory Management System.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary text-xl shadow-lg shadow-sky-500/40"
        aria-label="Toggle AI chat assistant"
      >
        {open ? '✕' : 'AI'}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-72 max-w-[90vw] rounded-2xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-soft sm:w-80">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-heading text-xs font-semibold">HataG Assistant</p>
              <p className="text-[11px] text-slate-400">
                Ask about Habtamu&apos;s skills or projects.
              </p>
            </div>
          </div>

          <div className="mb-2 max-h-56 space-y-1 overflow-y-auto pr-1">
            {messages.map((msg, index) => (
              <div
                key={`${msg.from}-${index}`}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-xl px-2 py-1.5 ${
                    msg.from === 'user'
                      ? 'bg-primary text-slate-950'
                      : 'bg-slate-900 text-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-[11px] text-slate-400">Thinking about your question...</p>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-1">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-2 py-1 text-[11px] font-semibold text-slate-950 disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

