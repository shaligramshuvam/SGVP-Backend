import nodemailer, { type Transporter } from 'nodemailer';
import { type EmailContacts, type EmailContent } from '@interfaces';
import { google } from 'googleapis';
import config from 'config';
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  config.get('NODEMAILER.CLIENTID'),
  config.get('NODEMAILER.CLIENTSECRET'),
  config.get('NODEMAILER.REDIRECTURI')
);
oauth2Client.setCredentials({
  refresh_token: config.get('NODEMAILER.REFRESHTOKEN'),
});

const accessToken = new Promise((resolve, reject) => {
  oauth2Client.getAccessToken((err, token) => {
    if (err) {
      reject(err);
    }
    resolve(token);
  });
});

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.get('NODEMAILER.USER'),
    accessToken,
    clientId: config.get('NODEMAILER.CLIENTID'),
    clientSecret: config.get('NODEMAILER.CLIENTSECRET'),
    refreshToken: config.get('NODEMAILER.REFRESHTOKEN'),
  },
});

export const emailSender = async (
  to: string[],
  content: EmailContent,
  from: string = `"SGVP Team"`
): Promise<void> => {
  const contacts: EmailContacts = {
    to,
    from,
  };
  const email = { ...content, ...contacts }; // Use spread syntax for object merging

  try {
    const message = await transporter.sendMail(email);
    console.log('Email sent:', message.response); // Log only the response
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

// Verify the transporter (optional, for debugging)
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('SMTP server verification failed:', error.message);
  } else {
    console.log('SMTP server is verified and ready to send emails.');
  }
});
