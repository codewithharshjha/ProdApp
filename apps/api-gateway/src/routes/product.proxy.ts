import { createProxyMiddleware } from "http-proxy-middleware";

export const productProxy =createProxyMiddleware({
  target: "http://localhost:8003/products",
  changeOrigin: true,

  on: {
    proxyReq(proxyReq, req) {
      const userId = (req as any).userId;
console.log("userId from API Gateway to Product Proxy:", userId);
      proxyReq.setHeader("x-user-id", userId || "");

      // Re-send body because express.json() already consumed it
      if ((req as any).body) {
        const bodyData = JSON.stringify((req as any).body);

        proxyReq.setHeader(
          "Content-Length",
          Buffer.byteLength(bodyData)
        );

        proxyReq.write(bodyData);
      }
    },
  },
});