const mongoose = require('mongoose');
const logger = require('../utils/logger');

const ATLAS_SRV_URI =
  'mongodb+srv://Admin:Admin@cluster0.genujkd.mongodb.net/threads?retryWrites=true&w=majority';
const ATLAS_DIRECT_URI =
  'mongodb://Admin:Admin@cluster0-shard-00-00.genujkd.mongodb.net:27017,cluster0-shard-00-01.genujkd.mongodb.net:27017,cluster0-shard-00-02.genujkd.mongodb.net:27017/threads?ssl=true&replicaSet=atlas-xxxx&authSource=admin&retryWrites=true&w=majority';
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/threads';

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
};

let listenersRegistered = false;

function registerConnectionListeners() {
  if (listenersRegistered) {
    return;
  }

  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  listenersRegistered = true;
}

function normalizeErrorCode(error) {
  return error?.code || error?.cause?.code || error?.errorResponse?.code || 'UNKNOWN';
}

function isSrvFailure(error) {
  const code = String(normalizeErrorCode(error)).toUpperCase();
  const message = String(error?.message || '').toUpperCase();
  return code === 'ECONNREFUSED' || code === 'ETIMEOUT' || message.includes('ECONNREFUSED') || message.includes('ETIMEOUT');
}

async function closeExistingConnection() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

async function tryConnect(uri, label) {
  await closeExistingConnection();
  logger.info(`Trying MongoDB connection via ${label}`);
  const conn = await mongoose.connect(uri, CONNECTION_OPTIONS);
  return conn.connection;
}

async function connectDB() {
  registerConnectionListeners();

  if (mongoose.connection.readyState === 1) {
    logger.info('MongoDB already connected');
    return mongoose.connection;
  }

  const atlasSrvUri = process.env.MONGODB_URI || ATLAS_SRV_URI;
  const atlasDirectUri = process.env.MONGODB_URI_DIRECT || ATLAS_DIRECT_URI;

  try {
    return await tryConnect(atlasSrvUri, 'Atlas SRV');
  } catch (srvError) {
    logger.error(`Atlas SRV connection failed: [${normalizeErrorCode(srvError)}] ${srvError.message}`);

    if (isSrvFailure(srvError)) {
      logger.warn('Atlas SRV DNS lookup failed. In Atlas, open Connect > Drivers and copy the "Standard connection string" into MONGODB_URI_DIRECT.');
    }

    try {
      return await tryConnect(atlasDirectUri, 'Atlas direct');
    } catch (directError) {
      logger.error(`Atlas direct connection failed: [${normalizeErrorCode(directError)}] ${directError.message}`);
      logger.warn('In Atlas UI, go to Connect > Drivers > "Standard connection string" and replace MONGODB_URI_DIRECT with the exact replica set URI from your cluster.');

      try {
        logger.warn('⚠️  RUNNING ON LOCAL MONGODB - Atlas unreachable');
        return await tryConnect(LOCAL_MONGO_URI, 'local MongoDB');
      } catch (localError) {
        logger.error(`Local MongoDB fallback failed: [${normalizeErrorCode(localError)}] ${localError.message}`);
        throw new Error(
          `Unable to connect to MongoDB. Atlas SRV failed: ${srvError.message}. Atlas direct failed: ${directError.message}. Local MongoDB failed: ${localError.message}`,
        );
      }
    }
  }
}

module.exports = {
  ATLAS_DIRECT_URI,
  ATLAS_SRV_URI,
  CONNECTION_OPTIONS,
  LOCAL_MONGO_URI,
  connectDB,
};
