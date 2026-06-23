import { createProxyMiddleware } from "http-proxy-middleware";

export const paymentProxy = createProxyMiddleware({
  target: "http://localhost:8002",
  changeOrigin: true,
  pathRewrite: {
    "^/payments": "",
  },
});