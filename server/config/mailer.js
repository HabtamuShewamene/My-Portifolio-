import nodemailer from 'nodemailer';
import { env } from './env.js';

let transporter;

export function getMailerTransport() {
  if (transporter) return transporter;
  if (!env.email?.user || !env.email?.pass) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });
  return transporter;
}
