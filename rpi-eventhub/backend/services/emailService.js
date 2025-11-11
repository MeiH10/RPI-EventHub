// backend/services/emailService.js
const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {logger} = require('../services/eventsLogService');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const response = await sgMail.send(mailOptions);
    console.log('Email sent successfully to:', mailOptions.to);
    logger.info(`Email sent successfully to: ${mailOptions.to}`);
    return response;
  } catch (error) {
    console.error('Failed to send email', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
    throw error;
  }
};

module.exports = { sendEmail };