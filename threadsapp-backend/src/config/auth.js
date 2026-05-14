const accessTokenSecret =
  process.env.JWT_ACCESS_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  'dev-secret';

const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'dev-secret';

const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_SECRET ||
  'dev-secret';

module.exports = {
  accessTokenSecret,
  nextAuthSecret,
  refreshTokenSecret,
};
