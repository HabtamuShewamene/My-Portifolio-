import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.lastError = null;

    if (env.email.user && env.email.pass) {
      this.initializeTransporter();
    } else {
      console.warn('Email service disabled: missing CONTACT_EMAIL_USER or CONTACT_EMAIL_PASS');
    }
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: env.email.user,
          pass: env.email.pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      this.isConfigured = true;
      this.lastError = null;
      console.log('Email transporter initialized');
    } catch (error) {
      this.isConfigured = false;
      this.lastError = error.message;
      console.error('Failed to initialize email transporter:', error.message);
    }
  }

  async sendContactEmail({ name, email, message }) {
    console.log('Contact form submission received:', {
      name,
      email,
      preview: `${String(message || '').slice(0, 50)}...`,
    });

    if (!this.isConfigured || !this.transporter) {
      return { success: true, devMode: true };
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${env.email.user}>`,
      to: env.email.to,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: this.generateEmailTemplate({ name, email, message }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.lastError = null;
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.lastError = error.message;
      console.error('Email send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    if (!this.isConfigured || !this.transporter) {
      return { success: false, message: 'Email not configured' };
    }

    try {
      await this.transporter.verify();
      this.lastError = null;
      return { success: true, message: 'SMTP connection verified' };
    } catch (error) {
      this.lastError = error.message;
      return { success: false, error: error.message };
    }
  }

  generateEmailTemplate({ name, email, message }) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
            .container { max-width: 640px; margin: 0 auto; padding: 20px; }
            .card { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
            .header { background: #111827; color: #ffffff; padding: 16px 20px; }
            .content { padding: 20px; background: #ffffff; }
            .label { font-weight: bold; margin-top: 14px; }
            .value { margin-top: 6px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">New Contact Form Message</div>
              <div class="content">
                <div class="label">Name</div>
                <div class="value">${name}</div>
                <div class="label">Email</div>
                <div class="value">${email}</div>
                <div class="label">Message</div>
                <div class="value">${String(message).replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();

