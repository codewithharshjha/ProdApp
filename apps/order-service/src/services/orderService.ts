import { orderPrisma } from "@repo/order-db";

import type { CreateOrderInput } from "../validators/orderValidator.js";
import { redis } from "../utils/redis.js";

function toOrderDto(order: {
  
  userId: string;
  status: string;
  totalAmount: { toNumber(): number } | number | string;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string;
    productName: string;
    productShortDescription: string;
    productDescription: string;
    productColors: string[];
    productSizes: string[];
    productImages: Record<string, string>;
    quantity: number;
    price: { toNumber(): number } | number | string;
    selectedSize: string | null;
    selectedColor: string | null;
  }[];
}) {
  return {
    
    userId: order.userId,
    status: order.status,
    totalAmount:
      typeof order.totalAmount === "object" && "toNumber" in order.totalAmount
        ? order.totalAmount.toNumber()
        : Number(order.totalAmount),
    items: order.items.map((item) => ({
      
      productId: item.productId,
      name: item.productName,
      shortDescription: item.productShortDescription,
      description: item.productDescription,
      quantity: item.quantity,
      images: item.productImages,
      price:
        typeof item.price === "object" && "toNumber" in item.price
          ? item.price.toNumber()
          : Number(item.price),
      size: item.selectedSize,
      color: item.selectedColor,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function createOrder(userId: string, input: CreateOrderInput) {
   
  // await clearProductCache()
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

console.log("items from createOrder",input.items);
  const order = await orderPrisma.order.create({
   
    data: {
      userId,
      totalAmount,
      status: "CONFIRMED",
      items: {
        create: input.items.map((item) => ({
          name: item.name ?? "",
          productId: item.id ,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize ?? "",
         
          shortDescription: item.shortDescription ?? "",
          description: item.description ?? "",
          color: item.colors?? [],
          
          
          
        })),
      },
    },
    include: { items: true },
  });
 
  // return toOrderDto(order as any);
  return order
}

export async function getOrdersByUser(userId: string) {
  const orders = await orderPrisma.order.findMany({
    where: { userId },
    include: { 
      // name: true,
      // shortDescription: true,
      // description: true,
      // images: true,
      // quantity: true,
      // color: true,
      // size: true,
      items: true
     },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrderDto as any);
}

export async function getOrderById(userId: string, orderId: string) {
  const cached = await redis.get(`order:${orderId}`);

  if (cached) {
    console.log("CACHE HIT");
    return JSON.parse(cached);
  }

  console.log("CACHE MISS");
  const order = await orderPrisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.userId !== userId) return null;
  await redis.set(`order:${order.id}`, JSON.stringify(order), { EX: 3600 });
  return toOrderDto(order as any);
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await orderPrisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) return null;

  if (order.status === "CANCELLED") {
    throw Object.assign(new Error("Order is already cancelled"), { statusCode: 400 });
  }
  if (!["PENDING", "CONFIRMED"].includes(order.status)) {
    throw Object.assign(new Error("Order cannot be cancelled at this stage"), { statusCode: 400 });
  }

  const updated = await orderPrisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
    include: { items: true },
  });
  return toOrderDto(updated as any);
}
