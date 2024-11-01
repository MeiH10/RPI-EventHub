// backend/services/adminSearchService.js
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });


const mailer = nodemailer.createTransport(sgTransport({
  apiKey: process.env.SENDGRID_API_KEY
}));


const userSearch = async ({ to, subject, text }) => {
  const searchOptions = {
    from: process.env.User_Form, // Your email address or one authorized by SendGrid
    to,
    subject,
    text,
  };

  try {
    await userSearch.User_From(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email', error);
  }
};

module.exports = { userForms };
