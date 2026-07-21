import { Request, Response } from "express";

import axios from "axios";
import { createOrderSchema } from "../validators/orderValidator.js";
import * as orderService from "../services/orderService.js";
import { sendOrderEmail } from "../../../../packages/emailService/src/sendEmail.js"
import { publishOrderEmail } from "../../../../packages/emailService/src/publisher.js"
interface WithOrderId extends Request {
  params: {
    id: string;
  };
  userId: string;
}

export async function createOrder(req: Request, res: Response) {

  try {


    const userId = req.headers["x-user-id"] as string | undefined;

    const userProfile = await axios.post(`http://localhost:8004/users/sync`,
      {},
      {
        headers: {
          "x-user-id": userId || "",
        }
      }

    ).then(response => response.data).catch(error => {
      console.error("Error fetching user profile:", error);
      return null;
    });

    const userEmail = userProfile.email;
    if (!userEmail) {
      return res.status(400).send({ error: "User email not found" });
    }
    const parsed = createOrderSchema.safeParse(req.body);


    // Try resolving userId from multiple possible sources (header, req.userId set by gateway, query, or body)


    if (!parsed.success) {
      console.log(parsed.error.issues);
      return res.status(400).send({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });

    }

    const order = await orderService.createOrder(userId!, parsed.data);
    console.log("order from controller", order);
    // await sendOrderEmail(order, userEmail);
    await publishOrderEmail(order, userEmail);
    return res.status(201).send(order);
  }
  catch (error) {
    console.error("Error in createOrder controller:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }


}

export async function getMyOrders(req: Request & { userId: string }, res: Response) {
  console.log("userId from getMyOrders controller", req.userId);
  const orders = await orderService.getOrdersByUser(req.userId);

  return res.send(orders);
}

export async function getOrderById(req: WithOrderId, res: Response) {
  const { id } = req.params;

  const order = await orderService.getOrderById(req.userId, id);

  if (!order) {
    return res.status(404).send({ error: "Order not found" });
  }

  return res.send(order);
}

export async function cancelOrder(req: WithOrderId, res: Response) {
  const { id } = req.params;

  const order = await orderService.cancelOrder(req.userId, id);

  if (!order) {
    return res.status(404).send({ error: "Order not found" });
  }

  return res.send(order);
}