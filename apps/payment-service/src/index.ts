import express from "express";
import dotenv from "dotenv";

import PaymentRouter from "./routes/paymentRoute.js";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { stripeWebhook } from "./controller/paymentController.js";

import { connectRabbitMQ } from "../../../packages/emailService/src/rabbitmq.js";

dotenv.config();

const app = express();

console.log("payment service index.ts file");

/**
 * Stripe webhook MUST come before express.json()
 * and MUST NOT have auth middleware.
 */
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/**
 * Normal routes
 */
app.use(express.json());

app.use(
  "/payments",
  shouldBeUser,
  PaymentRouter
);

async function startServer() {
  await connectRabbitMQ();

  app.listen(8002, () => {
    console.log(
      "Payment service is running on port 8002"
    );
  });
}

startServer();