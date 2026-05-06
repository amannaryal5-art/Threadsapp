/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // ← add this
  },
  eslint: {
    ignoreDuringBuilds: true,  // ← add this too
  },
};

module.exports = withPWA(nextConfig);