import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only ignore ESLint during builds, but keep TypeScript checking
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
