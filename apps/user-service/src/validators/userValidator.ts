import { z } from "zod";

export const updateProfileSchema = z.object({
  email: z.string().email(),
  
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
