import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeUser } from "./middleware/authmiddleware.js";
import productRoutes from "./routes/products.js";
import { errorHandler } from "./utils/errorHandler.js";
import { connectRedis } from "./utils/redis.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);

app.use(express.json());

// app.use(
//   clerkMiddleware({
//     authorizedParties: ["http://localhost:3002", "http://localhost:3003"],
//   })
// );

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    uptime: process.uptime(),
    status: "ok",
    timestamp: Date.now(),
  });
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({
    message: "Product service is authenticated",
    auth: (req as Request & { userId?: string }).userId,
  });
});

app.use("/products",shouldBeUser, productRoutes);

app.use(errorHandler);


// ✅ Start server with Redis connection
async function startServer() {
  await connectRedis(); // connect redis first

  app.listen(8003, () => {
    console.log("Product service is running on port 8003");
  });
}

startServer();