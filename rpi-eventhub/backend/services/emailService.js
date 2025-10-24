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
    throw error;
  }
};

module.exports = { sendEmail };