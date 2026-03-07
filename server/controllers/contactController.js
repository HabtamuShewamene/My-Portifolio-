import { emailService } from '../services/emailService.js';
import { store } from '../models/jsonStore.js';
import { env } from '../config/env.js';

export const contactController = {
  async sendMessage(req, res) {
    try {
      const payload = req.body || {};
      const { name, email, message } = payload;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (message.length < 10) {
        return res.status(400).json({ error: 'Message must be at least 10 characters long' });
      }

      if (message.length > 5000) {
        return res.status(400).json({ error: 'Message must not exceed 5000 characters' });
      }

      const contactData = {
        id: Date.now().toString(),
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      };

      let contactSaved = false;
      try {
        await store.addContact(contactData);
        contactSaved = true;
      } catch (storeError) {
        console.error('Failed to save contact message:', storeError.message);
      }

      // Respond immediately so browser/proxy requests are not held open by SMTP latency.
      const responsePayload = {
        success: contactSaved,
        message: 'Message received successfully!',
        contactSaved,
        emailDelivered: false,
        devMode: false,
      };

      // Send email in background and log the result.
      void emailService.sendContactEmail({ name, email, message })
        .then((emailResult) => {
          console.log('Background email result:', {
            success: Boolean(emailResult?.success),
            devMode: Boolean(emailResult?.devMode),
          });
        })
        .catch((emailError) => {
          console.error('Background email delivery failed:', emailError.message);
        });

      return res.status(200).json(responsePayload);
    } catch (error) {
      console.error('Contact controller error:', error);
      return res.status(200).json({
        success: false,
        message: 'Message could not be processed right now. Please try again later.',
      });
    }
  },

  async getStatus(req, res) {
    try {
      const contacts = await store.getContacts();

      return res.status(200).json({
        emailConfigured: emailService.isConfigured,
        emailLastError: emailService.lastError,
        dataDir: env.dataDir,
        totalMessages: contacts.length,
        recentMessages: contacts.slice(-5).map((item) => ({
          id: item.id,
          name: item.name,
          timestamp: item.timestamp,
        })),
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
