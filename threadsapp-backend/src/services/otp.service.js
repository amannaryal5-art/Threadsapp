const twilio = require('twilio');
const runtimeStore = require('../lib/runtime-store');
const emailService = require('./email.service');

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

exports.sendOtp = async (phone) => {
  const otp = process.env.NODE_ENV === 'production' ? generateOtp() : '123456';
  await runtimeStore.set(`otp:${phone}`, otp, 'EX', 5 * 60);

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
  const otp = generateOtp();
  const normalizedEmail = email.trim().toLowerCase();
  await runtimeStore.set(`email_otp:${normalizedEmail}`, otp, 'EX', 10 * 60);
  await emailService.sendSignupOtp({ email: normalizedEmail, name, otp });
  return otp;
};

exports.verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cachedOtp = await runtimeStore.get(`email_otp:${normalizedEmail}`);
  if (!cachedOtp || cachedOtp !== otp) {
    return false;
  }

  await runtimeStore.del(`email_otp:${normalizedEmail}`);
  return true;
};
