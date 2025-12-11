import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  eslint: {
    // Relax ESLint enforcement during build to avoid blocking pushes while
    // we incrementally fix warnings/errors.
    ignoreDuringBuilds: true
  },
  typescript: {
    // Do not ignore TypeScript build errors. Set to false to surface type errors in CI/build.
    ignoreBuildErrors: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist']
};

let configWithPlugins = baseConfig;

const nextConfig = configWithPlugins;
export default nextConfig;
