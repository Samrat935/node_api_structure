import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Determine current environment (default to 'development' if not set)
const env = process.env.NODE_ENV || 'development';

// Resolve the correct .env file path based on the environment
const envFile = path.resolve(__dirname, `../../.env.${env}`);

// Uncomment this if you want to debug loaded environment file  
// console.log(`Loading environment variables from: ${envFile}`);

// Load environment variables from the resolved .env file
const result = dotenv.config({ path: envFile });

if (result.error) {
  console.error(`❌ Failed to load .env file: ${envFile}`);
  console.error(result.error);
  process.exit(1); // Exit the process if .env file fails to load
}

// Create and export the Nodemailer transporter instance
export const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // SMTP host (default to Gmail SMTP)
  port: Number(process.env.SMTP_PORT) || 587,      // SMTP port (587 = TLS, 465 = SSL)
  secure: process.env.SMTP_SECURE === 'true',      // true = SSL (465), false = TLS (587)
  auth: {
    user: process.env.SMTP_USER,                   // SMTP username (your email)
    pass: process.env.SMTP_PASS,                   // SMTP password (App password, not account password)
  },
});

// Optional: Verify transporter connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP connection successful, ready to send emails');
  }
});
