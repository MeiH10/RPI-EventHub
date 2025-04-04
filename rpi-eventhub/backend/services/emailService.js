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
