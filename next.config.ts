import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables the Next.js dev indicator badge completely
  devIndicators: false,

  allowedDevOrigins: [
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "127.0.0.1",
    "10.0.2.2:3000",
    "10.0.2.2",
    "192.168.1.224:3000",
    "192.168.1.224",
    "192.168.1.239:3000",
    "192.168.1.239",
  ],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
