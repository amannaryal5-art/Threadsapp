const nodemailer = require('nodemailer');

const normalizedEmailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: normalizedEmailPass,
  },
  requireTLS: true,
  connectionTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Email service failed:', error.message);
  } else {
    console.log('Email service ready');
  }
});

const sendMail = async ({ to, subject, html, attachments = [] }) =>
  transporter.sendMail({
    from: `"ThreadsApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });

const sendOTPEmail = async (toEmail, otp, userName = '') => {
  const mailOptions = {
    from: `"ThreadsApp" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your ThreadsApp account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #e85d5d;">ThreadsApp Email Verification</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>Your verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px;
                    color: #e85d5d; text-align: center; padding: 20px;
                    background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', toEmail, '| MessageId:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const sendSignupOtp = async ({ email, name, otp }) => sendOTPEmail(email, otp, name);

const sendOrderConfirmation = async (user, order, invoiceUrl) =>
  sendMail({
    to: user.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `<p>Hello ${user.name},</p><p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p><p>Total: Rs. ${order.totalAmount}</p><p>Invoice: ${invoiceUrl || 'will be available soon'}</p>`,
  });

const sendPasswordReset = async (user, resetLink) =>
  sendMail({
    to: user.email,
    subject: 'Reset your ThreadsApp password',
    html: `<p>Hello ${user.name},</p><p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });

module.exports = {
  sendMail,
  sendOTPEmail,
  sendSignupOtp,
  sendOrderConfirmation,
  sendPasswordReset,
  transporter,
};
