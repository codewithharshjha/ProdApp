import express from "express";
import {shouldBeUser} from "./middleware/authMiddleware.js"
import {connectRabbitMQ} from "../../../packages/emailService/src/rabbitmq.js";
import ordersRouter from "./routes/orders.js";
import { startEmailConsumer } from "../../../packages/emailService/src/consumer.js";
// import { errorHandler } from "./utils/errorHandler.js";
 import { connectRedis } from "./utils/redis.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

console.log("order service index.ts file")

app.use(express.json());
app.use("/orders", shouldBeUser,ordersRouter);


 // connect rabbitmq first


async function startServer() {
  await connectRedis(); // connect redis first
 await connectRabbitMQ();
  await startEmailConsumer();
// connect rabbitmq first

  app.listen(8001, () => {
    console.log("Order service is running on port 8001");
  });
}

startServer();