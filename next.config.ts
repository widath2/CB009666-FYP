import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal configuration to avoid bundling issues
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
