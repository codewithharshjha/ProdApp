import { Request } from "express";


import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: "rzp_test_TAj9ZNQRCe5GMQ"!,
    key_secret: "Up3dMwImMKiMI8rYKpEjXpDD"!,
});

export async function createPayment(req: Request) {
    try {

        console.log("req.userId from payment service:", req.body);
    const userId = req.userId;

    const {
        price: amount,
        currency = "INR",
    } = req.body;

    const order = await razorpay.orders.create({

        amount: amount * 100,

        currency,

        receipt: `receipt_${Date.now()}`,

    });

    return {

        orderId: order.id,

        amount: order.amount,

        currency: order.currency,

        key: process.env.RAZORPAY_KEY,

        userId,

    };
    }
    catch (error) {
        console.error("Error creating payment:", error);
        throw new Error("Failed to create payment");
    }

}