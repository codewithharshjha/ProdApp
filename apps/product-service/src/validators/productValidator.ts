import { z } from "zod";

const sizes = [
  "xs", "s", "m", "l", "xl", "xxl",
  "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48",
] as const;

const colors = [
  "blue", "green", "red", "yellow", "purple", "orange", "pink", "brown", "gray", "black", "white",
] as const;

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  shortDescription: z.string().min(1).max(500),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().optional(),
  sizes: z.array(z.enum(sizes)).default([]),
  colors: z.array(z.enum(colors)).default([]),
  images: z.record(z.string(), z.string()).default({}),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
