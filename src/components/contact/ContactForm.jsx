import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../../services/api.js';

function validateForm({ name, email, message, consent }) {
  if (!name.trim() || !email.trim() || !message.trim()) {
    return 'Please fill in all fields.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }

  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters.';
  }

  if (!consent) {
    return 'Please provide GDPR consent.';
  }

  return null;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
    website: '',
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: '',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (status.error) setStatus((prev) => ({ ...prev, error: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(formData);
    if (validationError) {
      setStatus({ submitting: false, success: false, error: validationError });
      return;
    }

    setStatus({ submitting: true, success: false, error: '' });

    try {
      await sendContactMessage(formData);

      setStatus({ submitting: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '', consent: false, website: '' });

      window.setTimeout(() => {
        setStatus({ submitting: false, success: false, error: '' });
      }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        submitting: false,
        success: false,
        error: error?.message || 'Network error. Please check browser console for details.',
      });
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="section-container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="theme-text-primary mb-10 text-center font-heading text-4xl font-bold"
        >
          Get In Touch
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="theme-surface space-y-5 rounded-2xl p-6"
        >
          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="theme-input w-full rounded-lg border px-4 py-3 text-sm"
              placeholder="Your name"
              disabled={status.submitting}
            />
          </div>

          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="theme-input w-full rounded-lg border px-4 py-3 text-sm"
              placeholder="you@example.com"
              disabled={status.submitting}
            />
          </div>

          <div>
            <label className="theme-text-muted mb-2 block text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="theme-input w-full resize-none rounded-lg border px-4 py-3 text-sm"
              placeholder="Tell me about your project..."
              disabled={status.submitting}
            />
          </div>

          <label className="theme-text-muted flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5"
              disabled={status.submitting}
            />
            <span>I consent to processing my message and contact details for this request.</span>
          </label>

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {status.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
            >
              {status.error}
            </motion.div>
          )}

          {status.success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400"
            >
              Message sent successfully.
            </motion.div>
          )}

          <button
            type="submit"
            disabled={status.submitting}
            className={`theme-button-primary w-full rounded-lg px-6 py-3 text-sm font-semibold ${
              status.submitting ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
