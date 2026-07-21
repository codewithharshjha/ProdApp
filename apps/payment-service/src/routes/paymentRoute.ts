import { Router } from "express";
import { createPayment ,stripeWebhook } from "../controller/paymentController.js";
// import * as orderController from "../controllers/orderController.js";
// import {shouldBeUser}  from "@repo/allservicemiddleware";
import express from "express";
const router = Router();
console.log("payment router loaded");
// Public read
// router.post("/create", orderController.createOrder);
// router.get("/me", orderController.getMyOrders);

router.post("/create",createPayment);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );
export default router;
