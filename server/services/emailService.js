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
      this.lastError = 'Email service is not configured. Set CONTACT_EMAIL_USER and CONTACT_EMAIL_PASS.';
      return {
        success: false,
        devMode: true,
        error: this.lastError,
      };
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${env.email.user}>`,
      to: env.email.to,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: this.generatePlainTextEmail({ name, email, message }),
      html: this.generateEmailTemplate({ name, email, message }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.lastError = null;
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      const mapped = this.mapSmtpError(error);
      this.lastError = mapped.internalError;
      console.error('Email send failed:', mapped.internalError);
      return {
        success: false,
        error: mapped.publicError,
        reason: mapped.reason,
      };
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
    const safeName = this.escapeHtml(name);
    const safeEmail = this.escapeHtml(email);
    const safeMessage = this.escapeHtml(String(message)).replace(/\n/g, '<br>');
    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const safeSubmittedAt = this.escapeHtml(submittedAt);
    const encodedReplyEmail = encodeURIComponent(String(email || '').trim());
    const encodedReplySubject = encodeURIComponent(`Re: Your message to Habtamu Shewamene`);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style>
            :root {
              color-scheme: light dark;
            }
            body {
              margin: 0;
              padding: 0;
              background: #eef2ff;
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #172033;
            }
            table {
              border-spacing: 0;
            }
            .wrapper {
              width: 100%;
              background:
                radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 34%),
                linear-gradient(180deg, #f5f7ff 0%, #eef4ff 55%, #f8fbff 100%);
              padding: 32px 16px;
            }
            .shell {
              width: 100%;
              max-width: 680px;
              margin: 0 auto;
            }
            .card {
              background: #ffffff;
              border: 1px solid #dbe4ff;
              border-radius: 28px;
              overflow: hidden;
              box-shadow: 0 22px 60px rgba(31, 41, 55, 0.12);
            }
            .hero {
              padding: 34px 36px 28px;
              background:
                radial-gradient(circle at top right, rgba(255, 255, 255, 0.26), transparent 32%),
                linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%);
              color: #ffffff;
            }
            .eyebrow {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.16);
              border: 1px solid rgba(255, 255, 255, 0.18);
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-weight: 700;
            }
            .hero-title {
              margin: 18px 0 8px;
              font-size: 30px;
              line-height: 1.2;
              font-weight: 800;
            }
            .hero-copy {
              margin: 0;
              font-size: 15px;
              line-height: 1.7;
              color: rgba(255, 255, 255, 0.92);
            }
            .hero-meta {
              margin-top: 22px;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.82);
            }
            .content {
              padding: 30px 36px 36px;
            }
            .info-grid {
              width: 100%;
              margin-bottom: 20px;
            }
            .info-card {
              width: 48%;
              vertical-align: top;
              background: #f8faff;
              border: 1px solid #dbe4ff;
              border-radius: 20px;
              padding: 18px 20px;
            }
            .info-gap {
              width: 4%;
            }
            .info-label {
              margin: 0 0 8px;
              color: #54627a;
              font-size: 11px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-weight: 700;
            }
            .info-value {
              margin: 0;
              color: #111827;
              font-size: 18px;
              font-weight: 700;
              word-break: break-word;
            }
            .message-panel {
              margin-top: 12px;
              background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
              border: 1px solid #dbe4ff;
              border-radius: 24px;
              padding: 24px;
            }
            .section-label {
              margin: 0 0 10px;
              color: #4f46e5;
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-weight: 800;
            }
            .message-body {
              margin: 0;
              color: #1f2937;
              font-size: 16px;
              line-height: 1.8;
            }
            .actions {
              margin-top: 24px;
            }
            .button {
              display: inline-block;
              padding: 14px 22px;
              border-radius: 14px;
              background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
              color: #ffffff !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 700;
              box-shadow: 0 10px 26px rgba(79, 70, 229, 0.24);
            }
            .helper {
              margin: 14px 0 0;
              color: #607089;
              font-size: 13px;
            }
            .footer {
              padding: 18px 36px 30px;
              color: #6b7280;
              font-size: 12px;
              line-height: 1.7;
            }
            .footer a {
              color: #4f46e5;
              text-decoration: none;
            }
            @media only screen and (max-width: 640px) {
              .wrapper {
                padding: 16px 10px;
              }
              .hero,
              .content,
              .footer {
                padding-left: 22px !important;
                padding-right: 22px !important;
              }
              .hero-title {
                font-size: 24px !important;
              }
              .info-card,
              .info-gap {
                display: block !important;
                width: 100% !important;
              }
              .info-gap {
                height: 12px !important;
              }
            }
            @media (prefers-color-scheme: dark) {
              body {
                background: #0b1020;
                color: #edf2ff;
              }
              .wrapper {
                background:
                  radial-gradient(circle at top left, rgba(79, 70, 229, 0.22), transparent 35%),
                  linear-gradient(180deg, #090f1d 0%, #0d1427 55%, #121936 100%);
              }
              .card {
                background: #10182b;
                border-color: #273451;
                box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
              }
              .info-card,
              .message-panel {
                background: #131d34;
                border-color: #2a3a5c;
              }
              .info-label,
              .helper,
              .footer {
                color: #95a4c2 !important;
              }
              .info-value,
              .message-body {
                color: #f3f6ff !important;
              }
              .section-label,
              .footer a {
                color: #a5b4fc !important;
              }
            }
          </style>
        </head>
        <body>
          <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
            New portfolio inquiry from ${safeName}. Open to review the message and reply quickly.
          </div>
          <div class="wrapper">
            <table role="presentation" class="shell" width="100%">
              <tr>
                <td>
                  <div class="card">
                    <div class="hero">
                      <div class="eyebrow">Portfolio Contact</div>
                      <h1 class="hero-title">A new message just landed in your inbox</h1>
                      <p class="hero-copy">
                        Someone visited your full-stack developer portfolio and reached out through the contact form.
                        Everything you need to review and respond is below.
                      </p>
                      <div class="hero-meta">Recipient: Habtamu Shewamene · Submitted ${safeSubmittedAt}</div>
                    </div>
                    <div class="content">
                      <table role="presentation" class="info-grid" width="100%">
                        <tr>
                          <td class="info-card">
                            <p class="info-label">Sender Name</p>
                            <p class="info-value">${safeName}</p>
                          </td>
                          <td class="info-gap"></td>
                          <td class="info-card">
                            <p class="info-label">Reply Email</p>
                            <p class="info-value">${safeEmail}</p>
                          </td>
                        </tr>
                      </table>

                      <div class="message-panel">
                        <p class="section-label">Message</p>
                        <p class="message-body">${safeMessage}</p>
                      </div>

                      <div class="actions">
                        <a
                          class="button"
                          href="mailto:${encodedReplyEmail}?subject=${encodedReplySubject}"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Reply to ${safeName}
                        </a>
                        <p class="helper">
                          Tip: replying from this email keeps the sender address one click away and makes follow-up faster.
                        </p>
                      </div>
                    </div>
                    <div class="footer">
                      Sent from your portfolio contact form for Habtamu Shewamene.<br />
                      This notification was generated automatically by your portfolio backend and uses the sender's email as the reply-to address.
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
  }

  generatePlainTextEmail({ name, email, message }) {
    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return [
      'New Portfolio Contact Message',
      '',
      `Recipient: Habtamu Shewamene`,
      `Submitted: ${submittedAt}`,
      '',
      `Sender: ${String(name || '').trim()}`,
      `Reply Email: ${String(email || '').trim()}`,
      '',
      'Message:',
      String(message || '').trim(),
      '',
      'Reply directly to this email to respond to the sender.',
    ].join('\n');
  }

  escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  mapSmtpError(error) {
    const rawMessage = String(error?.message || 'Unknown SMTP error');
    const normalized = rawMessage.toLowerCase();

    if (
      normalized.includes('badcredentials') ||
      normalized.includes('invalid login') ||
      normalized.includes('username and password not accepted') ||
      normalized.includes('535-5.7.8') ||
      normalized.includes('535 5.7.8')
    ) {
      return {
        reason: 'bad_credentials',
        internalError: rawMessage,
        publicError:
          'Email login failed. For Gmail, enable 2-Step Verification and use a 16-character App Password in CONTACT_EMAIL_PASS (not your normal Gmail password).',
      };
    }

    if (normalized.includes('invalid_grant') || normalized.includes('application-specific password required')) {
      return {
        reason: 'app_password_required',
        internalError: rawMessage,
        publicError:
          'Gmail requires an App Password for SMTP. Generate one in your Google Account security settings and set CONTACT_EMAIL_PASS to that value.',
      };
    }

    if (normalized.includes('econnrefused') || normalized.includes('etimedout')) {
      return {
        reason: 'network_error',
        internalError: rawMessage,
        publicError: 'Email provider could not be reached right now. Please try again shortly.',
      };
    }

    return {
      reason: 'smtp_error',
      internalError: rawMessage,
      publicError: 'Email delivery failed due to an SMTP error. Please verify your email configuration.',
    };
  }
}

export const emailService = new EmailService();

