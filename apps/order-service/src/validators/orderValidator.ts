

import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.coerce.string(),

      name: z.string().optional(),
      shortDescription: z.string().optional(),
      description: z.string().optional(),

      price: z.coerce.number(),

      category: z.string().nullable().optional(),

      images: z.record(z.string()).optional(),

      colors: z.array(z.string()).optional(),
      sizes: z.array(z.string()).optional(),

      createdAt: z.string().optional(),

      quantity: z.number().int().min(1),

      selectedSize: z.string().optional().nullable(),
      selectedColor: z.string().optional().nullable(),
    })
  ).min(1, "Order must have at least one item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;