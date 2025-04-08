// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // <-- this skips ESLint errors during build
    },
  }
  
  module.exports = nextConfig
  