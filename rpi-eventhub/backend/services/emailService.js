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
  }
});



/**
 * Sends an email using nodemailer.
 * @param {object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.text - The plain text body of the email.
 * @returns {Promise<void>}
 * @throws {Error} If sending the email fails.
 */
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Your email address or one authorized by SendGrid
    to,
    subject,
    text,
  };

  try {
    await mailer.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email', error);
  }
};

module.exports = { sendEmail };
