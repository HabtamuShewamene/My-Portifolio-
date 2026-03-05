import { useState } from 'react';
import { sendContactMessage } from '../../services/api.js';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    try {
      await sendContactMessage(form);
      setStatus({
        loading: false,
        success: 'Thanks for reaching out! I will get back to you soon.',
        error: '',
      });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        loading: false,
        success: '',
        error: 'Something went wrong sending your message. Please try again later.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
          Let&apos;s <span className="text-primary">Connect</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Whether you have a project in mind, feedback on my work, or just want to say hi, feel
          free to send a message.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel max-w-xl space-y-4 rounded-2xl p-5"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-slate-200 sm:text-sm"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-200 sm:text-sm"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs font-medium text-slate-200 sm:text-sm"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Tell me a bit about your idea, role, or feedback..."
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </button>

        {status.success && (
          <p className="text-xs text-emerald-400 sm:text-sm">{status.success}</p>
        )}
        {status.error && <p className="text-xs text-red-400 sm:text-sm">{status.error}</p>}
      </form>
    </div>
  );
}

