import nodemailer, { Transporter } from 'nodemailer';
import { transporter } from './email_transporter';
import dotenv from 'dotenv';
import path from 'path';

// Determine current environment (default: development)
const env = process.env.NODE_ENV || 'development';

// Resolve the path to the appropriate .env file (e.g., .env.development)
const envFile = path.resolve(__dirname, `../../.env.${env}`);
//console.log(`Loading environment variables from: ${envFile}`);

// Load environment variables from the resolved .env file
const result = dotenv.config({ path: envFile });
if (result.error) {
  console.error(`❌ Failed to load .env file: ${envFile}`);
  console.error(result.error);
  process.exit(1); // Exit the process if env loading fails
}

/**
 * Send an email using the configured transporter.
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - HTML content of the email
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `"IMI Platform" <${process.env.SMTP_USER}>`, // Sender address from environment
      to,                           // Recipient address
      subject,                      // Subject line
      html,                         // HTML body content
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};
