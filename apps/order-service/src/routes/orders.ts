import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
// import {shouldBeUser}  from "@repo/allservicemiddleware";

const router = Router();
console.log("order router loaded");
// Public read
router.post("/create", orderController.createOrder);
router.get("/me", orderController.getMyOrders);

// router.post("/create", (req, res) => {
//   console.log("ROUTE HIT");

//   res.json({
//     success: true,
//   });
// });
// router.get("/:id", shouldBeUser, orderController.getProduct);

// // Protected write
// router.post("/create", shouldBeUser, orderController.createProductHandler);
// router.patch("/:id", shouldBeUser, orderController.updateProductHandler);
// router.delete("/:id", shouldBeUser, orderController.deleteProductHandler);
// router.post("/bulk-delete", shouldBeUser, orderController.bulkDeleteProducts);

export default router;
