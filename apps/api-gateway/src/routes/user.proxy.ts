import { createProxyMiddleware } from "http-proxy-middleware";

export const userProxy = createProxyMiddleware({
  target: "http://localhost:8004/users",
  changeOrigin: true,

  on: {
    proxyReq(proxyReq, req) {
      const userId = (req as any).userId;

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