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
    console.log("Redis connected");
  }
}
export async function clearProductCache() {
  for await (const keys of redis.scanIterator({
    MATCH: "products:*",
  })) {
    if (!Array.isArray(keys) || keys.length === 0) {
      continue;
    }

    console.log("Deleting:", keys);

    await redis.del({...keys});
  }
}