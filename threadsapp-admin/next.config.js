experimental: {
  outputFileTracingExcludes: {
    '*': ['**/(dashboard)/page_client-reference-manifest.js'],
  },
},
/** @type {import('next').NextConfig} */

const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      outputFileTracingExcludes: {
        "*": [
          "node_modules/@swc/core-linux-x64-gnu",
          "node_modules/@swc/core-linux-x64-musl",
          "node_modules/typescript",
          "node_modules/prettier",
        ],
      },
    },
  };
  
  module.exports = nextConfig;
