import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/users.js";
import { errorHandler } from "./utils/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 8004;

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003" , "http://localhost:8004"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:3002", "http://localhost:3003"],
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "user-service" });
});


app.use("/users", userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});
