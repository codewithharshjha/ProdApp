import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { shouldBeUser } from "../middleware/authmiddleware.js";

const router = Router();

// Public read
router.get("/", shouldBeUser, productController.listProducts);
router.get("/:id", shouldBeUser, productController.getProduct);

// Protected write
router.post("/create", shouldBeUser, productController.createProductHandler);
router.patch("/:id", shouldBeUser, productController.updateProductHandler);
router.delete("/:id", shouldBeUser, productController.deleteProductHandler);
router.post("/bulk-delete", shouldBeUser, productController.bulkDeleteProducts);

export default router;
