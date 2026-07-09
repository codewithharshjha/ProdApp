import Stripe from "stripe";
import { Request } from "express";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// //   apiVersion: "2025-06-30.basil",
// });
const stripe= new Stripe(process.env.STRIPE_SECRET_KEY!,{

})
export async function createPayment(req: Request) {
  try {
    console.log("createPayment called with request body:", req.body.items[0].price);
    const userId = req.userId;

    const {
      price,
      name,
      quantity = 1,
    } = req.body.items[0];

  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],

  billing_address_collection: "required",

  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name,
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: 1,
    },
  ],

  mode: "payment",

 success_url: "http://localhost:3002/payments/success?session_id={CHECKOUT_SESSION_ID}",

cancel_url: "http://localhost:3002/payments/cancel",
});

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create Stripe Checkout Session");
  }
}