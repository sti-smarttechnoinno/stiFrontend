import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Standalone deployment to drastically cut disk space usage
  output: "standalone",

  // 2. Disable heavy server-side image processing to prevent RAM/CPU crashes on cPanel
  images: {
    unoptimized: true,
  },

  // 3. Keep your custom server actions body limit for base64 uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;