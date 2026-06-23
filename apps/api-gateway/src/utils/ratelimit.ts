import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore, { RedisReply } from "rate-limit-redis";
import Redis from "ioredis";


const redisUrl = process.env.REDIS_URL || undefined;
const redisClient = redisUrl
  ? new Redis(redisUrl)
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    });
export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: any[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  }),

  windowMs: 60 * 1000,
  max: 4000000,

  standardHeaders: true,
  legacyHeaders: false,


  // Use built‑in helper to correctly handle IPv4 & IPv6 addresses
  keyGenerator: (req: any) => req.userId || ipKeyGenerator(req),

  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

