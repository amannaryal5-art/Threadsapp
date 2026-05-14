const twilio = require('twilio');
const runtimeStore = require('../lib/runtime-store');
const { sendOTPEmail } = require('./emailService');

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

exports.sendOtp = async (phone) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const otp = generateOtp();
  await runtimeStore.set(`otp:${phone}`, otp, 'EX', 5 * 60);

  if (isDevelopment) {
    console.log(`DEV PHONE OTP for ${phone}: ${otp}`);
  }

  if (client && process.env.TWILIO_PHONE_NUMBER) {
    await client.messages.create({
      body: `${process.env.PLATFORM_NAME || 'ThreadsApp'} OTP: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }

  return otp;
};

exports.verifyOtp = async (phone, otp) => {
  const cachedOtp = await runtimeStore.get(`otp:${phone}`);
  if (!cachedOtp || cachedOtp !== otp) {
    return false;
  }

  await runtimeStore.del(`otp:${phone}`);
  return true;
};

exports.sendEmailOtp = async (email, name) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const otp = generateOtp();
  const normalizedEmail = email.trim().toLowerCase();
  await runtimeStore.set(`email_otp:${normalizedEmail}`, otp, 'EX', 10 * 60);

  try {
    await sendOTPEmail(normalizedEmail, otp, name);
    if (isDevelopment) {
      console.log(`DEV EMAIL OTP sent for ${normalizedEmail}`);
    }

    return { delivered: true, fallback: false };
  } catch (error) {
    if (isDevelopment) {
      console.warn(`Email OTP delivery failed in development for ${normalizedEmail}.`);
      console.warn(`Use this OTP from backend terminal: ${otp}`);
      console.warn(`Email delivery error: ${error.message}`);
      return { delivered: false, fallback: true };
    }

    await runtimeStore.del(`email_otp:${normalizedEmail}`);
    throw error;
  }
};

exports.verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cachedOtp = await runtimeStore.get(`email_otp:${normalizedEmail}`);

  if (cachedOtp && cachedOtp === otp) {
    await runtimeStore.del(`email_otp:${normalizedEmail}`);
    return { valid: true };
  }

  return { valid: false, reason: 'invalid' };
};
