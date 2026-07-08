import "dotenv/config";
import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import { OrderProxy } from "./routes/order.proxy";
import { PaymentProxy } from "./routes/payment.proxy";
import { productProxy } from "./routes/product.proxy";
import { userProxy } from "./routes/user.proxy";
import { verifyUser } from "./middleware/authMiddleware";

import { limiter } from "./utils/ratelimit";

const app = express();

// Redis connection
// const redisClient = new Redis({
//   host: "localhost",
//   port: 6379,
// });

// // Rate limiter (based on userId)
// const limiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args: any[]) => redisClient.call(...args) as Promise<RedisReply>,
//   }),

//   windowMs: 60 * 1000, 
//   max: 50, 

//   standardHeaders: true,
//   legacyHeaders: false,


//   keyGenerator: (req: any) => {
//     return req.userId || req.ip;
//   },

//   message: {
//     status: 429,
//     message: "Too many requests. Please try again later.",
//   },
// });

app.use(cors());
app.use(express.json());
app.use(
  clerkMiddleware({
    authorizedParties: [
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3000",
    ],
  })
);

// logging middleware
app.use((req, res, next) => {
  console.log("Gateway request:", req.method, req.url);
  next();
});

// Routes with rate limiting
app.use("/products", limiter, verifyUser,  productProxy);
app.use("/orders",limiter, verifyUser,   OrderProxy);

app.use("/payments", limiter, verifyUser,  PaymentProxy);
app.use("/users", limiter, verifyUser,  userProxy);

app.listen(8000, () => {
  console.log("API Gateways running on port 8000");
});