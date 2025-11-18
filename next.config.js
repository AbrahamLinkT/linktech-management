/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here
  experimental: {
    optimizePackageImports: ['@clerk/nextjs']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  }
};

module.exports = nextConfig;
