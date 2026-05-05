const https = require('https');

const apiRequest = (method, path, body, token) =>
  new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const request = https.request(
      {
        hostname: 'apiv2.shiprocket.in',
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Length': payload ? Buffer.byteLength(payload) : 0,
        },
      },
      (response) => {
        let raw = '';
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    request.on('error', reject);
    if (payload) request.write(payload);
    request.end();
  });

let cachedToken = null;
let cachedUntil = 0;

const getShiprocketToken = async () => {
  if (cachedToken && Date.now() < cachedUntil) {
    return cachedToken;
  }

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    return null;
  }

  const response = await apiRequest('POST', '/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  cachedToken = response.token;
  cachedUntil = Date.now() + 8 * 24 * 60 * 60 * 1000;
  return cachedToken;
};

module.exports = {
  apiRequest,
  getShiprocketToken,
};
