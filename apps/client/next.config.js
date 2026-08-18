"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
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
exports.default = nextConfig;
