const requiredVars = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'NEXTAUTH_SECRET',
  'FRONTEND_URL',
];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Create threadsapp-backend/.env from .env.example before starting the server.',
    );
    error.code = 'ENV_VALIDATION_ERROR';
    throw error;
  }
}

module.exports = {
  validateEnv,
};
