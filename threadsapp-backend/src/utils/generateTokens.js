const jwt = require('jsonwebtoken');
const runtimeStore = require('../lib/runtime-store');

const accessTokenSecret = process.env.NEXTAUTH_SECRET || process.env.JWT_ACCESS_SECRET;
const accessTokenExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const refreshTokenTtlSeconds = 30 * 24 * 60 * 60;

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, phone: user.phone, email: user.email },
    accessTokenSecret,
    { expiresIn: accessTokenExpiresIn },
  );

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpiresIn });
  await runtimeStore.set(`refresh:${user.id}:${refreshToken}`, 'valid', 'EX', refreshTokenTtlSeconds);

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
