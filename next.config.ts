import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external domains for demo purposes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
