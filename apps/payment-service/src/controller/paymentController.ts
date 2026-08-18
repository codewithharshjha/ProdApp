// controller/paymentController.ts

import { Request, Response } from "express";
import * as paymentService from "../service/paymentService.js";
import Stripe from "stripe";
import { paymentPrisma } from "../../../../packages/paymentdb/src/index.js";
import { publishPaymentSuccess } from "@repo/emailService";
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);
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
export async function stripeWebhook(
  req: any,
  res: any
) {
  console.log("stripe webhook called from stripehook function");
  const sig =
    req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("EVENT TYPE:", event.type);

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session = event.data.object;

      const paymentId =
        session.metadata?.paymentId;

      console.log(
        "Received checkout.session.completed:",
        paymentId
      );

      // find payment
      const payment =
        await paymentPrisma.payment.findUnique({
          where: {
            id: paymentId,
          },
        });

      if (!payment) {
        console.log(
          "Payment not found:",
          paymentId
        );

        return res.json({
          received: true,
        });
      }

      // prevent duplicate processing
      if (payment.status === "PAID") {
        console.log(
          "Payment already processed"
        );

        return res.json({
          received: true,
        });
      }

      // mark paid
      await paymentPrisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: "PAID",
        },
      });

      await publishPaymentSuccess({
        paymentId,
        userId: payment.userId,
        items: payment.items,
      });

      console.log(
        "PAYMENT COMPLETED AND EVENT PUBLISHED"
      );
    }

    return res.json({
      received: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).send();
  }
}