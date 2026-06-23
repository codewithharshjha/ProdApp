import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        v8: "v8",
        "jiti/dist/babel": "jiti/dist/babel",
        jiti: "jiti",
      };
    }
    return config;
  },
};

export default nextConfig;
