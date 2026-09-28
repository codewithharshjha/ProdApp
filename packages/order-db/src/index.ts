import { PrismaClient } from "./generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as {
  orderPrisma: InstanceType<typeof PrismaClient> | undefined;
};

export const orderPrisma =
  globalForPrisma.orderPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.orderPrisma = orderPrisma;

export { PrismaClient };
