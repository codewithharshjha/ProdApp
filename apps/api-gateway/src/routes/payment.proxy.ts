import { createProxyMiddleware } from "http-proxy-middleware";

export const PaymentProxy =createProxyMiddleware({
  target: "http://localhost:8002/payments",
  changeOrigin: true,

  on: {
    proxyReq(proxyReq, req) {
      const userId = (req as any).userId;
console.log("userId from API Gateway to Payment Proxy:", userId);
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