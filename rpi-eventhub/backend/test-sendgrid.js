// Quick test script to verify SendGrid API key
// Run: node test-sendgrid.js

require('dotenv').config({ path: './.env' });
const sgMail = require('@sendgrid/mail');

console.log('Testing SendGrid configuration...\n');

// Check if API key is set
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not set in environment variables');
  process.exit(1);
}

if (!process.env.EMAIL_FROM) {
  console.error('❌ EMAIL_FROM is not set in environment variables');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}\n`);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Test sending an email
const testEmail = async () => {
  const msg = {
    to: process.env.EMAIL_FROM, // Send to yourself for testing
    from: process.env.EMAIL_FROM,
    subject: 'SendGrid API Key Test',
    text: 'If you receive this email, your SendGrid API key is working correctly!',
  };

  try {
    console.log('Attempting to send test email...');
    await sgMail.send(msg);
    console.log('✅ SUCCESS! Email sent. Check your inbox at:', process.env.EMAIL_FROM);
    console.log('   Your SendGrid API key is working correctly.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED to send email\n');

    if (error.code === 401) {
      console.error('Error: 401 Unauthorized');
      console.error('This means the API key is invalid, expired, or deleted.\n');
      console.error('Solutions:');
      console.error('1. Go to https://app.sendgrid.com/settings/api_keys');
      console.error('2. Check if your old API key still exists');
      console.error('3. Create a new API key with "Mail Send" permission');
      console.error('4. Update SENDGRID_API_KEY in Railway environment variables\n');
    } else if (error.code === 403) {
      console.error('Error: 403 Forbidden');
      console.error('The API key exists but lacks "Mail Send" permission.\n');
      console.error('Solutions:');
      console.error('1. Go to https://app.sendgrid.com/settings/api_keys');
      console.error('2. Create a new API key with "Full Access" or "Mail Send" permission\n');
    } else if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid API Error:');
      console.error(JSON.stringify(error.response.body.errors, null, 2));
    } else {
      console.error('Error:', error.message);
    }

    process.exit(1);
  }
};

testEmail();
