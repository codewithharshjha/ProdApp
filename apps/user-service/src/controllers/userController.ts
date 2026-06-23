import type { Request, Response } from "express";
import {
  getOrCreateProfile,
  updateProfile,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../services/userService.js";
import {
  updateProfileSchema,
  addCartItemSchema,
  updateCartItemSchema,
} from "../validators/userValidator.js";

export async function getMe(req: Request, res: Response) {
  console.log("getMe controller called");
 try {
   const userId = req.userId;
  const parsed = updateProfileSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  console.log("Parsed data in getMe:", parsed.data);

  const profile = await getOrCreateProfile(userId, parsed.data);
  console.log("Profile in getMe:", profile);
  return res.status(200).json(profile);
 }
 catch(e) {
  console.error("Error in getMe:", e);
  return res.status(500).json({ error: "Internal Server Error from getme userservice" });
 }
}

export async function updateMe(req: Request, res: Response) {
  const userId = req.userId;
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const profile = await updateProfile(userId, parsed.data, req);
  return res.json(profile);
}

export async function getMyCart(req: Request, res: Response) {
  const userId = req.userId;
  const cart = await getCart(userId);
  return res.json(cart);
}

export async function addToCart(req: Request, res: Response) {
  const userId = req.userId;
  const parsed = addCartItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const cart = await addCartItem(userId, parsed.data);
  return res.status(201).json(cart);
}

export async function updateMyCartItem(req: Request, res: Response) {
  const userId = req.userId;
  const { itemId } = req.params;
  const parsed = updateCartItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const cart = await updateCartItem(userId, itemId, parsed.data);
  if (!cart) return res.status(404).json({ error: "Cart item not found" });
  return res.json(cart);
}

export async function removeFromCart(req: Request, res: Response) {
  const userId = req.userId;
  const { itemId } = req.params;
  const cart = await removeCartItem(userId, itemId);
  if (!cart) return res.status(404).json({ error: "Cart item not found" });
  return res.json(cart);
}
