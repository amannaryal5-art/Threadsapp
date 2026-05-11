const nodemailer = require('nodemailer');

const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: {
          rejectUnauthorized: process.env.EMAIL_ALLOW_INSECURE_TLS === 'true' ? false : true,
        },
      })
    : nodemailer.createTransport({ jsonTransport: true });

exports.isCertificateError = (error) =>
  /unable to verify the first certificate|self[- ]signed certificate|unable to get local issuer certificate/i.test(error?.message || '');

exports.sendMail = async ({ to, subject, html, attachments = [] }) =>
  transporter.sendMail({
    from: process.env.EMAIL_USER || 'no-reply@threadsapp.local',
    to,
    subject,
    html,
    attachments,
  });

exports.isEmailConfigured = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

exports.sendSignupOtp = async ({ email, name, otp }) =>
  exports.sendMail({
    to: email,
    subject: 'Verify your ThreadsApp account',
    html: `<p>Hello ${name || 'there'},</p><p>Your ThreadsApp verification code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${otp}</p><p>This code will expire in 10 minutes.</p>`,
  });

exports.sendOrderConfirmation = async (user, order, invoiceUrl) =>
  exports.sendMail({
    to: user.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `<p>Hello ${user.name},</p><p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p><p>Total: Rs. ${order.totalAmount}</p><p>Invoice: ${invoiceUrl || 'will be available soon'}</p>`,
  });

exports.sendPasswordReset = async (user, resetLink) =>
  exports.sendMail({
    to: user.email,
    subject: 'Reset your ThreadsApp password',
    html: `<p>Hello ${user.name},</p><p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
