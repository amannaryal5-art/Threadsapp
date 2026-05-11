require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
  requireTLS: true,
  connectionTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    await transporter.verify();
    console.log('Email transporter verified successfully');

    const info = await transporter.sendMail({
      from: `"ThreadsApp" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'ThreadsApp test OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #e85d5d;">ThreadsApp Test Email</h2>
          <p>Your test OTP is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #e85d5d; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
            123456
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully');
    console.log(`MessageId: ${info.messageId}`);
  } catch (error) {
    console.error('Email test failed:', error.message);
    process.exitCode = 1;
  }
}

main();
