const runtimeStore = require('../lib/runtime-store');
const logger = require('../utils/logger');

let cacheClient = runtimeStore;
let redisReady = false;

async function connectRedis() {
  if (!process.env.REDIS_URL) {
    logger.warn('Redis URL not configured. Falling back to in-memory runtime store.');
    return cacheClient;
  }

  try {
    const { createClient } = require('redis');
    const client = createClient({ url: process.env.REDIS_URL });

    client.on('error', (error) => {
      redisReady = false;
      logger.warn(`Redis error: ${error.message}. Falling back to in-memory runtime store.`);
    });

    await client.connect();
    cacheClient = client;
    redisReady = true;
    logger.info('Redis connected');
    return cacheClient;
  } catch (error) {
    redisReady = false;
    logger.warn(`Redis unavailable: ${error.message}. Using in-memory runtime store instead.`);
    return cacheClient;
  }
}

function getCacheClient() {
  return cacheClient;
}

function isRedisReady() {
  return redisReady;
}

module.exports = {
  connectRedis,
  getCacheClient,
  isRedisReady,
};
