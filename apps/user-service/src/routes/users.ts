import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { shouldBeUser } from "../middleware/authmiddleware.js";

const router = Router();

router.use(shouldBeUser);
console.log("User service is running on user routes");
// Profile (extra data for logged-in user)  
router.post("/sync", userController.getMe);
router.put("/me", userController.updateMe);
router.get("/all", userController.getAllUsers);
// Cart
router.get("/me/cart", userController.getMyCart);
router.post("/me/cart/items", userController.addToCart);
router.patch("/me/cart/items/:itemId", userController.updateMyCartItem);
router.delete("/me/cart/items/:itemId", userController.removeFromCart);

export default router;
