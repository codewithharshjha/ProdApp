import { Router } from "express";
import { createPayment } from "../controller/paymentController.js";
// import * as orderController from "../controllers/orderController.js";
// import {shouldBeUser}  from "@repo/allservicemiddleware";

const router = Router();
console.log("payment router loaded");
// Public read
// router.post("/create", orderController.createOrder);
// router.get("/me", orderController.getMyOrders);

router.post("/create",createPayment);

export default router;
