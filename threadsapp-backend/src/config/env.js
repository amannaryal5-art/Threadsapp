const requiredVars = [
  'FRONTEND_URL',
];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const hasDiscreteDbConfig = Boolean(process.env.DB_HOST && process.env.DB_PORT && process.env.DB_USER && process.env.DB_NAME);
  const hasJwtConfig = Boolean(
    process.env.JWT_SECRET ||
      (process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET) ||
      (process.env.NEXTAUTH_SECRET && process.env.JWT_REFRESH_SECRET),
  );

  if (!hasDatabaseUrl && !hasDiscreteDbConfig) {
    missing.push('DATABASE_URL or DB_HOST/DB_PORT/DB_USER/DB_NAME');
  }

  if (!hasJwtConfig) {
    missing.push('JWT_SECRET or JWT_ACCESS_SECRET/JWT_REFRESH_SECRET');
  }

  if (missing.length) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Create threadsapp-backend/.env from .env.example before starting the server.',
    );
    error.code = 'ENV_VALIDATION_ERROR';
    throw error;
  }

  if (process.env.NODE_ENV === 'production') {
    const hasResend = Boolean(process.env.RESEND_API_KEY);
    const hasSmtp = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    if (!hasResend && !hasSmtp) {
      const error = new Error(
        'Production email delivery is not configured. Set RESEND_API_KEY or SMTP credentials before starting the server.',
      );
      error.code = 'EMAIL_ENV_VALIDATION_ERROR';
      throw error;
    }
  }
}

module.exports = {
  validateEnv,
};
