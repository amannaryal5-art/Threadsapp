require('dotenv').config();

const http = require('http');
const { validateEnv } = require('./src/config/env');
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`ThreadsApp backend running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Startup failure: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

startServer();
