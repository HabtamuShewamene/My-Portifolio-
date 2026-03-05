import nodemailer from 'nodemailer';
import { env } from './env.js';

let transporter;

export function getMailerTransport() {
  if (transporter) return transporter;
  if (!env.contactEmailUser || !env.contactEmailPass) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.contactEmailUser,
      pass: env.contactEmailPass,
    },
  });
  return transporter;
}
