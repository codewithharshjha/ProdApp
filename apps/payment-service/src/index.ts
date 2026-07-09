import express from "express";

// import { errorHandler } from "./utils/errorHandler.js";
import {shouldBeUser} from "./middleware/authMiddleware.js"
import PaymentRouter from "./routes/paymentRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

console.log("payment service index.ts file")

app.use(express.json());
// app.use("/orders", shouldBeUser,ordersRouter);
app.use("/payments", shouldBeUser,PaymentRouter);

 // connect rabbitmq first


async function startServer() {

// connect rabbitmq first

  app.listen(8002, () => {
    console.log("Payment service is running on port 8002");
  });
}

startServer();