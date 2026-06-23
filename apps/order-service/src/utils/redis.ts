import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

export const redis = createClient({
  url: redisUrl,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected (order-service)");
  }
}

// clear order cache
export async function clearOrderCache() {
  for await (const key of redis.scanIterator({
    MATCH: "orders:*",
  })) {
    await redis.del(key);
  }
}