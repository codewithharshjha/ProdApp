import { PrismaClient } from "./generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const userPrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = userPrisma;

export { PrismaClient };
