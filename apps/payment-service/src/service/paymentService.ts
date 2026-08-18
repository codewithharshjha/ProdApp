import Stripe from "stripe";
import { Request } from "express";
import { paymentPrisma } from "@repo/payment-db"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {})
  : null;

export async function createPayment(req: Request) {
  try {
    const userId = req.userId;

    const items = req.body.items;

    const totalAmount = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * item.quantity,
      0
    );
console.log("totalAmount:", totalAmount);
    // 1. Create Payment record first
    const payment = await paymentPrisma.payment.create({
      data: {
        userId,
        amount: totalAmount,
        status: "PENDING",
        items,
      },
    });
console.log("payment record created:", payment);
    if (!stripe) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // 2. Create Stripe session
    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        billing_address_collection: "required",

        line_items: items.map((item: any) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount:
              Math.round(Number(item.price) * 100),
          },
          quantity: item.quantity,
        })),

        mode: "payment",

        success_url:
          "http://localhost:3002/payment/success?session_id={CHECKOUT_SESSION_ID}",

        cancel_url:
          "http://localhost:3002/payment/cancel",

        metadata: {
          paymentId: payment.id,
        },
      });

    // 3. Save Stripe session id
    await paymentPrisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        stripeSessionId: session.id,
      },
    });

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      "Failed to create Stripe Checkout Session"
    );
  }
}