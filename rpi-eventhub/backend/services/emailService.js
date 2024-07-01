// backend/services/emailService.js
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });


const mailer = nodemailer.createTransport(sgTransport({
  apiKey: process.env.SENDGRID_API_KEY
}));


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
