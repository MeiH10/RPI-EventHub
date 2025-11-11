// backend/services/emailService.js
const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {logger} = require('../services/eventsLogService');

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.SMTP_PASSWORD
  },
  // Add timeouts to fail faster and provide clearer error messages
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});


const sendEmail = async (toOrOptions, subject, text) => {
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

  try {
    await mailer.sendMail(mailOptions);
    console.log('Email sent successfully to:', mailOptions.to);
    logger.info(`Email sent successfully to: ${mailOptions.to}`);
  } catch (error) {
    console.error('Failed to send email', error);
    logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);

    // Detect Railway SMTP port blocking
    if (error.code === 'ETIMEDOUT' && error.command === 'CONN') {
      const detailedError = new Error(
        'SMTP connection timeout - Railway blocks SMTP ports (465/587) on free/hobby plans. ' +
        'Solutions: 1) Upgrade to Railway Pro/Enterprise, 2) Use Gmail API, ' +
        '3) Switch to SendGrid/Postmark, or 4) Deploy on a different platform. ' +
        'See SMTP_ISSUE_RAILWAY.md for details. Original error: ' + error.message
      );
      detailedError.code = error.code;
      detailedError.originalError = error;
      throw detailedError;
    }

    throw error;
  }
};

module.exports = { sendEmail };
