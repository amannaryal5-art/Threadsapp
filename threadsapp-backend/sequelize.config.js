require('dotenv').config();

const buildDatabaseUrl = () => {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'threads';
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const credentials = password ? `${encodedUser}:${encodedPassword}` : encodedUser;

  return `postgres://${credentials}@${host}:${port}/${database}`;
};

const localPostgresUrl = buildDatabaseUrl();

module.exports = {
  development: {
    url: localPostgresUrl,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    url: localPostgresUrl,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: localPostgresUrl,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
