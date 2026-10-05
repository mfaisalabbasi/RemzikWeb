import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_MARKETPLACE_ADDRESS:
      process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // 👇 Only include hostnames without ports or protocols
  allowedDevOrigins: ["192.168.1.239", "localhost"],
};

export default nextConfig;
