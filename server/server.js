import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { projects } from '../src/data/projectsData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(helmet());
app.use(express.json());

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

app.get('/api/projects', (req, res) => {
  const { tech } = req.query;

  if (!tech) {
    return res.json(projects);
  }

  const normalized = tech.toLowerCase();
  const filtered = projects.filter((project) =>
    (project.techStack || []).some((t) => t.toLowerCase().includes(normalized)),
  );

  return res.json(filtered);
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body || {};

  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Please include a short message (at least 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const safeName = String(name).trim();
  const safeEmail = String(email).trim();
  const safeMessage = String(message).trim();

  const emailUser = process.env.CONTACT_EMAIL_USER;
  const emailPass = process.env.CONTACT_EMAIL_PASS;
  const recipient = process.env.CONTACT_EMAIL_TO || emailUser;

  if (!emailUser || !emailPass || !recipient) {
    console.log('New contact message received:', {
      name: safeName,
      email: safeEmail,
      message: safeMessage,
    });

    return res.json({
      ok: true,
      message: 'Message received. Email delivery is not configured in this environment.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${emailUser}>`,
      to: recipient,
      replyTo: safeEmail,
      subject: `New portfolio contact from ${safeName}`,
      text: safeMessage,
      html: `<p><strong>Name:</strong> ${safeName}</p>
             <p><strong>Email:</strong> ${safeEmail}</p>
             <p><strong>Message:</strong></p>
             <p>${safeMessage}</p>`,
    });

    return res.json({ ok: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong sending your message. Please try again later.',
    });
  }
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  const text = (message || '').toString().toLowerCase();

  let reply =
    "I'm HataG, a focused assistant for Habtamu’s portfolio. I can talk about his skills, projects, and experience. Try asking “What projects has he built?” or “What are his main skills?” 💻";

  if (text.includes('project')) {
    reply =
      'Habtamu has 7 highlight projects, including a full-stack Job Portal in Java/Spring Boot, an Inventory Management System, a Helpdesk Queue, Task Manager, Bug Tracker, Crypto Tracker, and a News App. 🚀';
  } else if (text.includes('skill')) {
    reply =
      'Habtamu works across the stack with React, Node.js/Express, Java Spring Boot, MySQL, MongoDB, Git, and GitHub. He focuses on clean, maintainable full-stack code. ✨';
  } else if (text.includes('java') || text.includes('spring')) {
    reply =
      'The Java Full Stack Job Portal is his featured project: Spring Boot + MySQL + XAMPP, with job seekers, employers, and admin moderation. 💼';
  } else if (text.includes('interview') || text.includes('schedule')) {
    reply =
      'For mock interviews or chats, you can propose a time using the contact form. In a full setup, this could hook into a real calendar booking link. 📅';
  }

  return res.json({ reply });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Portfolio API listening on http://localhost:${PORT}`);
});

