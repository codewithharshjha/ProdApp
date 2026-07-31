import { prisma } from "@repo/product-db";
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from "../validators/productValidator";
import { redis,clearProductCache } from "../utils/redis";

type ProductRow = Awaited<ReturnType<typeof prisma.product.findUnique>>;

function toProductDto(row: NonNullable<ProductRow>) {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    price: Number(row.price),
    category: row.category ?? undefined,
    sizes: row.sizes,
    colors: row.colors,
    images: (row.images as Record<string, string>) ?? {},
  };
}

export async function listProducts(query: ListProductsQuery) {
  try {
    const cacheKey = `products:${JSON.stringify(query)}`;

    console.log("\n===============================");
    console.log("📦 Product List Request");
    console.log("🔑 Cache Key:", cacheKey);

    // Try Redis first
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("✅ CACHE HIT");
      console.log("===============================\n");

      return JSON.parse(cached);
    }

    console.log("❌ CACHE MISS");
    console.log("🗄️ Fetching products from PostgreSQL...");

    const { page, limit, search, category } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    if (category?.trim() && category.trim() !== "all") {
      where.category = {
        equals: category.trim(),
        mode: "insensitive",
      };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const result = {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    console.log("💾 Saving result to Redis...");

    await redis.set(cacheKey, JSON.stringify(result), {
      EX: 300, // 5 minutes
    });

    const ttl = await redis.ttl(cacheKey);

    console.log(`✅ Cached successfully (TTL: ${ttl}s)`);
    console.log("===============================\n");

    return result;
  } catch (error) {
    console.error("❌ Error listing products:", error);
    throw error;
  }
}



export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  return toProductDto(product);
}

export async function createProduct(input: CreateProductInput) {
 
  try{ console.log("product from service", input);
   await clearProductCache()
 
      const product = await prisma.product.create({
    data: {
      name: input.name,
      shortDescription: input.shortDescription,
      description: input.description,
      price: input.price,
      category: input.category,
      sizes: input.sizes,
      colors: input.colors,
      images: input.images as object,
    },
  });
  console.log("product from servicessss", product);
  return toProductDto(product);
  }
  catch(error){
    console.error("Error creating product:", error);
    throw error;
  }

}

export async function updateProduct(id: string, input: UpdateProductInput) {
  await clearProductCache()
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.shortDescription !== undefined && { shortDescription: input.shortDescription }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.sizes !== undefined && { sizes: input.sizes }),
      ...(input.colors !== undefined && { colors: input.colors }),
      ...(input.images !== undefined && { images: input.images as object }),
    },
  });
  return toProductDto(product);
}

export async function deleteProduct(id: string) {
  await clearProductCache()
  await prisma.product.delete({ where: { id } });
}

export async function deleteProducts(ids: string[]) {
  await clearProductCache()
  await prisma.product.deleteMany({ where: { id: { in: ids } } });
  return { deleted: ids.length };
}
