// backend/services/emailService.js
const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {logger} = require('../services/eventsLogService');

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  pool: true, // Use connection pooling
  maxConnections: 5,
  maxMessages: 10
});


const sendEmail = async (toOrOptions, subject, text, retries = 3) => {
  let mailOptions;

  if (typeof toOrOptions === 'object' && toOrOptions !== null) {
    mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toOrOptions.to,
      subject: toOrOptions.subject,
      text: toOrOptions.text,
    };
  } else {
    mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toOrOptions,
      subject: subject,
      text: text,
    };
  }

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mailer.sendMail(mailOptions);
      console.log('Email sent successfully to:', mailOptions.to);
      logger.info(`Email sent successfully to: ${mailOptions.to}`);
      return; // Success, exit function
    } catch (error) {
      lastError = error;
      console.error(`Failed to send email (attempt ${attempt}/${retries})`, error);
      logger.error(`Failed to send email to ${mailOptions.to} (attempt ${attempt}/${retries}): ${error.message}`);

      // If not the last attempt, wait before retrying
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw lastError;
};

module.exports = { sendEmail };