const nodemailer = require('nodemailer');

class EmailDeliveryError extends Error {
  constructor(message, { code = 'EMAIL_DELIVERY_FAILED', retryable = true, cause } = {}) {
    super(message);
    this.name = 'EmailDeliveryError';
    this.code = code;
    this.retryable = retryable;
    this.cause = cause;
  }
}

const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@threadsapp.local';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const normalizedEmailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

const smtpTransporter =
  process.env.EMAIL_USER && normalizedEmailPass
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 587),
        secure: String(process.env.EMAIL_SECURE || 'false') === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: normalizedEmailPass,
        },
        requireTLS: true,
        connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS || 10000),
        greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT_MS || 10000),
        socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT_MS || 15000),
        tls: {
          rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
        },
      })
    : null;

function resolveProvider() {
  if (EMAIL_PROVIDER === 'resend' || RESEND_API_KEY) {
    return 'resend';
  }

  if (EMAIL_PROVIDER === 'smtp' || smtpTransporter) {
    return 'smtp';
  }

  return 'none';
}

async function verifyTransport() {
  const provider = resolveProvider();

  if (provider === 'resend') {
    console.log('Email service ready via Resend API');
    return;
  }

  if (provider === 'smtp' && smtpTransporter) {
    try {
      await smtpTransporter.verify();
      console.log('Email service ready via SMTP');
    } catch (error) {
      console.error('Email service failed:', error.message);
    }
    return;
  }

  console.warn('Email service is not configured. Set RESEND_API_KEY or SMTP credentials.');
}

void verifyTransport();

async function sendViaResend({ to, subject, html }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.EMAIL_HTTP_TIMEOUT_MS || 10000));

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new EmailDeliveryError(payload?.message || `Resend request failed with status ${response.status}`, {
        code: 'RESEND_REQUEST_FAILED',
        retryable: response.status >= 500,
      });
    }

    console.log('Email sent via Resend:', payload?.id || 'unknown-id');
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new EmailDeliveryError('Email delivery timed out while contacting Resend.', {
        code: 'EMAIL_TIMEOUT',
        retryable: true,
        cause: error,
      });
    }

    if (error instanceof EmailDeliveryError) {
      throw error;
    }

    throw new EmailDeliveryError(`Resend delivery failed: ${error.message}`, {
      code: 'RESEND_DELIVERY_FAILED',
      retryable: true,
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function sendViaSmtp({ to, subject, html, attachments = [] }) {
  if (!smtpTransporter) {
    throw new EmailDeliveryError('SMTP transporter is not configured.', {
      code: 'SMTP_NOT_CONFIGURED',
      retryable: false,
    });
  }

  try {
    const info = await smtpTransporter.sendMail({
      from: `"ThreadsApp" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log('Email sent via SMTP:', info.messageId);
    return info;
  } catch (error) {
    throw new EmailDeliveryError(`SMTP delivery failed: ${error.message}`, {
      code: error.code || 'SMTP_DELIVERY_FAILED',
      retryable: true,
      cause: error,
    });
  }
}

async function sendMail({ to, subject, html, attachments = [] }) {
  const provider = resolveProvider();

  if (provider === 'resend') {
    return sendViaResend({ to, subject, html });
  }

  if (provider === 'smtp') {
    return sendViaSmtp({ to, subject, html, attachments });
  }

  throw new EmailDeliveryError('No email provider is configured.', {
    code: 'EMAIL_PROVIDER_NOT_CONFIGURED',
    retryable: false,
  });
}

async function sendOTPEmail(toEmail, otp, userName = '') {
  return sendMail({
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
  });
}

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
  EmailDeliveryError,
  sendMail,
  sendOTPEmail,
  sendSignupOtp,
  sendOrderConfirmation,
  sendPasswordReset,
};
