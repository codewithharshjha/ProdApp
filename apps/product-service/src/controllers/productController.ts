import type { Request, Response } from "express";
import {
  listProducts as listProductsService,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
} from "../services/productService";
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from "../validators/productValidator.js";
function isPrismaNotFound(e: unknown): boolean {
  return typeof (e as { code?: string })?.code === "string" && (e as { code: string }).code === "P2025";
}

export async function listProducts(req: Request, res: Response) {
  console.log("createProductHandler",req);
  const parsed = listProductsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
  }
  const result = await listProductsService(parsed.data);
  return res.json(result);
}

export async function getProduct(req: Request, res: Response) {
  try{
  const { id } = req.params;
  const product = await getProductById(id as string);
  console.log("getProduct", product, id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

}

export async function createProductHandler(req: Request, res: Response) {
  console.log("createProductHandler",req.body);
  try {
      const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const product = await createProduct(parsed.data);
  return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
 
}

export async function updateProductHandler(req: Request, res: Response) {
  const { id } = req.params;
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  try {
    const product = await updateProduct(id as string, parsed.data);
    return res.json(product);
  } catch (e) {
    if (isPrismaNotFound(e)) {
      return res.status(404).json({ error: "Product not found" });
    }
    throw e;
  }
}

export async function deleteProductHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await deleteProduct(id as string);
    return res.status(204).send();
  } catch (e) {
    if (isPrismaNotFound(e)) {
      return res.status(404).json({ error: "Product not found" });
    }
    throw e;
  }
}

export async function bulkDeleteProducts(req: Request, res: Response) {
  const body = req.body;
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  if (ids.length === 0) {
    return res.status(400).json({ error: "ids array is required and must not be empty" });
  }
  const result = await deleteProducts(ids);
  return res.json(result);
}
