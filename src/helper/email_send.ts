import { renderTemplateFromFile } from "./template_renderer";
import { sendMail } from "../utils/email_sender.ts";
import path from 'path';

// Interface to define the structure of email data options
export interface EmailOptions {
  to: string;                 // Recipient email address
  subject: string;            // Email subject line
  templatePath: string;       // Path for the main email template (layout)
  mail_content_path: string;  // Path for the dynamic content section (specific message)
  variables: any;             // Object containing key-value pairs for dynamic template replacement
}

// Function to send all email
export const sendAllMail = async (emailData: EmailOptions) => {
  // Resolve template paths — fallback to defaults if not provided
  const templatePath = emailData.templatePath 
    ?? path.resolve(__dirname, '../views/templates/email_template_1.html');

  const mailContentPath = emailData.mail_content_path 
    ?? path.resolve(__dirname, '../views/templates/signup.html');

  // Render the mail content template with provided variables and assign it to variables object
  emailData.variables.mail_content = renderTemplateFromFile(mailContentPath, emailData.variables);

  // Render the main email template with all variables (including the rendered mail content)
  const htmlContent = renderTemplateFromFile(templatePath, emailData.variables);

  // Send the email using the configured sendMail utility
  const isSent = await sendMail(emailData.to, emailData.subject, htmlContent);

  // Log the result based on whether the email was sent successfully
  if (isSent) {
    console.log("✅ Email sent successfully!");
  } else {
    console.log("❌ Failed to send email.");
  }
};
