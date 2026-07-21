import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../packages/paymentdb/.env") });

const globalForPrisma = globalThis as unknown as {
  paymentPrisma: InstanceType<typeof PrismaClient> | undefined;
};

export const paymentPrisma =
  globalForPrisma.paymentPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.paymentPrisma = paymentPrisma;

export { PrismaClient };
