import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@clerk/shared", "@clerk/backend"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
