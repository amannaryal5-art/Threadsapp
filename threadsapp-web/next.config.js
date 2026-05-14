const path = require("path");

const localTempDir = path.join(__dirname, ".tmp");
process.env.TEMP = process.env.TEMP || localTempDir;
process.env.TMP = process.env.TMP || localTempDir;

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" }
    ]
  },
  experimental: {
    // typedRoutes: true,
  }
};

module.exports = withPWA(nextConfig);
