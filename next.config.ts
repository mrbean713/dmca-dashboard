/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'xcnxdvtdvdfhpnozstli.supabase.co', // your Supabase bucket
      },
    ],
  },
}

module.exports = nextConfig
