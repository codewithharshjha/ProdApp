// controller/paymentController.ts

import { Request, Response } from "express";
import * as paymentService from "../service/paymentService.js";

export async function createPayment(
  req: Request,
  res: Response
) {
  try {
    const result = await paymentService.createPayment(req);
console.log("result from payment service:", result);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}