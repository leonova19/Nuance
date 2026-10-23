import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the development compiler cache separate from production builds.
  // This prevents `next build` from invalidating a running `next dev` server.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

export default nextConfig;
