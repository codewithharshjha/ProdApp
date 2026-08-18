"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
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
exports.default = nextConfig;
