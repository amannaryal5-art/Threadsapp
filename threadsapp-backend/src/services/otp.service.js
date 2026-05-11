const twilio = require('twilio');
const crypto = require('crypto');
const runtimeStore = require('../lib/runtime-store');
const { EmailOtp } = require('../models');
const { sendOTPEmail } = require('./emailService');

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;
const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

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
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await runtimeStore.set(`email_otp:${normalizedEmail}`, otp, 'EX', 10 * 60);
  await EmailOtp.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      otpHash: hashOtp(otp),
      expiresAt,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  await sendOTPEmail(normalizedEmail, otp, name);
  return { delivered: true };
};

exports.verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cachedOtp = await runtimeStore.get(`email_otp:${normalizedEmail}`);

  if (cachedOtp && cachedOtp === otp) {
    await runtimeStore.del(`email_otp:${normalizedEmail}`);
    await EmailOtp.deleteOne({ email: normalizedEmail });
    return { valid: true };
  }

  const storedOtp = await EmailOtp.findOne({ email: normalizedEmail });
  if (!storedOtp) {
    return { valid: false, reason: 'missing' };
  }

  if (storedOtp.expiresAt.getTime() <= Date.now()) {
    await EmailOtp.deleteOne({ email: normalizedEmail });
    await runtimeStore.del(`email_otp:${normalizedEmail}`);
    return { valid: false, reason: 'expired' };
  }

  if (storedOtp.otpHash !== hashOtp(otp)) {
    return { valid: false, reason: 'invalid' };
  }

  await runtimeStore.del(`email_otp:${normalizedEmail}`);
  await EmailOtp.deleteOne({ email: normalizedEmail });
  return { valid: true };
};
