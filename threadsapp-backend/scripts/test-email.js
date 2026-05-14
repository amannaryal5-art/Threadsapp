require('dotenv').config();

const { sendOTPEmail } = require('../src/services/emailService');

async function main() {
  if (process.execArgv.includes('--test')) {
    return;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email test because EMAIL_USER or EMAIL_PASS is not configured.');
    return;
  }

  try {
    await sendOTPEmail(process.env.EMAIL_USER, '123456', 'ThreadsApp Test');
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email test failed:', error.message);
    process.exitCode = 1;
  }
}

main();
