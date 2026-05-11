require('dotenv').config();

const dns = require('dns').promises;
const fs = require('fs');
const net = require('net');
const path = require('path');
const mongoose = require('mongoose');
const {
  ATLAS_DIRECT_URI,
  ATLAS_SRV_URI,
  CONNECTION_OPTIONS,
  LOCAL_MONGO_URI,
} = require('../src/config/database');

const SRV_HOST = '_mongodb._tcp.cluster0.genujkd.mongodb.net';
const TCP_HOST = 'cluster0-shard-00-00.genujkd.mongodb.net';
const TCP_PORT = 27017;

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  console.log(`FAIL: ${message}`);
}

function info(message) {
  console.log(`INFO: ${message}`);
}

async function dnsCheck() {
  printSection('DNS CHECK');
  try {
    const records = await dns.resolveSrv(SRV_HOST);
    const ips = [];

    for (const record of records) {
      try {
        const resolved = await dns.resolve4(record.name);
        ips.push(...resolved.map((ip) => `${record.name}:${record.port} -> ${ip}`));
      } catch (error) {
        ips.push(`${record.name}:${record.port} -> resolve4 failed (${error.code || 'UNKNOWN'})`);
      }
    }

    pass(`DNS resolved: ${ips.join(', ')}`);
    return { ok: true, details: records, ips };
  } catch (error) {
    fail(`DNS blocked — try mobile hotspot or change DNS to 8.8.8.8 (${error.code || 'UNKNOWN'}: ${error.message})`);
    return { ok: false, error };
  }
}

async function tcpCheck() {
  printSection('TCP CHECK');
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: TCP_HOST, port: TCP_PORT, timeout: 5000, family: 4 });

    socket.once('connect', () => {
      pass(`Port reachable at ${TCP_HOST}:${TCP_PORT}`);
      socket.destroy();
      resolve({ ok: true });
    });

    socket.once('timeout', () => {
      fail('Port 27017 blocked by firewall or ISP');
      socket.destroy();
      resolve({ ok: false, error: new Error('timeout') });
    });

    socket.once('error', (error) => {
      fail(`Port 27017 blocked by firewall or ISP (${error.code || 'UNKNOWN'}: ${error.message})`);
      socket.destroy();
      resolve({ ok: false, error });
    });
  });
}

async function mongooseCheck() {
  printSection('MONGOOSE CONNECT CHECK');
  try {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI || ATLAS_SRV_URI, {
      ...CONNECTION_OPTIONS,
      serverSelectionTimeoutMS: 8000,
    });
    pass('✅ Atlas connection successful');
    return { ok: true };
  } catch (error) {
    fail(`Atlas connect failed (${error.code || 'UNKNOWN'}): ${error.message}`);
    info('Suggested fixes: try mobile hotspot, set DNS to 8.8.8.8, or use MONGODB_URI_DIRECT from Atlas UI.');
    return { ok: false, error };
  } finally {
    await mongoose.disconnect();
  }
}

async function localMongoCheck() {
  printSection('LOCAL MONGODB CHECK');
  try {
    await mongoose.disconnect();
    await mongoose.connect(LOCAL_MONGO_URI, {
      ...CONNECTION_OPTIONS,
      dbName: 'threads',
    });
    pass('✅ Local MongoDB available as fallback');
    return { ok: true };
  } catch (error) {
    fail(`Local MongoDB not running — install with: winget install MongoDB.Server (${error.code || 'UNKNOWN'}: ${error.message})`);
    return { ok: false, error };
  } finally {
    await mongoose.disconnect();
  }
}

function envCheck() {
  printSection('ENV CHECK');
  const envPath = path.join(__dirname, '..', '.env');
  const envExists = fs.existsSync(envPath);
  const envUri = process.env.MONGODB_URI;
  const directUri = process.env.MONGODB_URI_DIRECT;

  if (!envExists) {
    fail('.env file is missing');
    return { ok: false, envExists, envUri, directUri };
  }

  if (!envUri) {
    fail('MONGODB_URI is not set');
    return { ok: false, envExists, envUri, directUri };
  }

  if (envUri.includes('replace-with') || envUri.includes('<') || envUri.trim() === '') {
    fail('MONGODB_URI looks like a placeholder');
    return { ok: false, envExists, envUri, directUri };
  }

  pass(`.env exists and MONGODB_URI is set${directUri ? '; MONGODB_URI_DIRECT is set' : '; MONGODB_URI_DIRECT is missing'}`);
  return { ok: true, envExists, envUri, directUri };
}

function summarize(results) {
  printSection('SUMMARY');

  let recommendation = 'Atlas looks reachable. Keep using MONGODB_URI.';

  if (!results.env.ok) {
    recommendation = 'Create or fix threadsapp-backend/.env and set MONGODB_URI plus MONGODB_URI_DIRECT.';
  } else if (!results.dns.ok) {
    recommendation = 'DNS is blocking Atlas SRV. Switch DNS to 8.8.8.8, try a mobile hotspot, or use MONGODB_URI_DIRECT.';
  } else if (!results.tcp.ok) {
    recommendation = 'Network is blocking port 27017. Check firewall/ISP rules or use a different network.';
  } else if (!results.mongoose.ok && results.local.ok) {
    recommendation = 'Use local MongoDB for development now, and keep Atlas details in MONGODB_URI_DIRECT for later.';
  } else if (!results.local.ok) {
    recommendation = 'Install and start local MongoDB with winget so you have a working fallback.';
  }

  console.log(`RECOMMENDED ACTION: ${recommendation}`);
}

async function main() {
  const results = {};
  results.dns = await dnsCheck();
  results.tcp = await tcpCheck();
  results.mongoose = await mongooseCheck();
  results.local = await localMongoCheck();
  results.env = envCheck();
  info(`Atlas direct URI configured: ${Boolean(process.env.MONGODB_URI_DIRECT)}; default template: ${ATLAS_DIRECT_URI}`);
  summarize(results);
}

main().catch((error) => {
  console.error('Diagnostic script failed unexpectedly:', error);
  process.exitCode = 1;
});
