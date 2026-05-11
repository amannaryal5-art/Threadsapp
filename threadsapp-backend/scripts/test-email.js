require('dotenv').config();

const { sendOTPEmail } = require('../src/services/emailService');

async function main() {
  try {
    await sendOTPEmail(process.env.EMAIL_USER, '123456', 'ThreadsApp Test');
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email test failed:', error.message);
    process.exitCode = 1;
  }
}

main();
