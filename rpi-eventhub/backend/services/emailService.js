// backend/services/emailService.js
const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {logger} = require('../services/eventsLogService');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using SendGrid
 * @param {string|object} toOrOptions - Email address or options object
 * @param {string} subject - Email subject (if toOrOptions is string)
 * @param {string} text - Email body (if toOrOptions is string)
 */
const sendEmail = async (toOrOptions, subject, text) => {
  let mailOptions;

  // Support both call styles for backward compatibility
  if (typeof toOrOptions === 'object' && toOrOptions !== null) {
    mailOptions = {
      to: toOrOptions.to,
      from: process.env.EMAIL_FROM,
      subject: toOrOptions.subject,
      text: toOrOptions.text,
    };
  } else {
    mailOptions = {
      to: toOrOptions,
      from: process.env.EMAIL_FROM,
      subject: subject,
      text: text,
    };
  }

  try {
    await sgMail.send(mailOptions);
    console.log('Email sent successfully to:', mailOptions.to);
    logger.info(`Email sent successfully to: ${mailOptions.to}`);
  } catch (error) {
    console.error('Failed to send email via SendGrid:', error);

    // SendGrid errors have a response property with details
    if (error.response) {
      logger.error(`SendGrid API error: ${error.response.body.errors ? JSON.stringify(error.response.body.errors) : error.message}`);
    } else {
      logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
    }

    throw error;
  }
};

module.exports = { sendEmail };
