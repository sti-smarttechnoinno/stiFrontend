import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for base64 image uploads (default is 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
