
import { userPrisma } from "@repo/user-db"
import type { UpdateProfileInput, AddCartItemInput, UpdateCartItemInput } from "../validators/userValidator";


export async function getOrCreateProfile(userId: string, parsed?: any) {
  try {
    console.log("getOrCreateProfile called with userId:", parsed);

    let profile = await userPrisma.userProfile.findUnique({ where: { userId } });
   
    
    if (!profile) {
      profile = await userPrisma.userProfile.create({
        data: {
          email: parsed.email,
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          imageUrl: parsed.imageUrl,
          phone: parsed.phone,
          address: parsed.address,
          city: parsed.city,
          country: parsed.country,
          userId

        },
      });
      return profile
    }
return profile
  }
  catch (e) {
    console.error("Error in getOrCreateProfile:", e);
  }

}

export async function updateProfile(userId: string, input: UpdateProfileInput, req: any) {
  await userPrisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
  });
  return getOrCreateProfile(userId, req);
}

export async function getCart(userId: string) {
  let cart = await userPrisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    cart = await userPrisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }
  return {
    id: cart.id,
    userId: cart.userId,
    items: cart.items.map((i: any) => ({
      id: i.id,
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      addedAt: i.addedAt,
    })),
    updatedAt: cart.updatedAt,
  };
}

export async function addCartItem(userId: string, input: AddCartItemInput) {
  let cart = await userPrisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await userPrisma.cart.create({ data: { userId } });
  }
  await userPrisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: input.productId,
      quantity: input.quantity,
      size: input.size ?? undefined,
      color: input.color ?? undefined,
    },
  });

  return getCart(userId);
}

export async function updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput) {
  const cart = await userPrisma.cart.findUnique({ where: { userId }, include: { items: true } });
  if (!cart) return null;
  const item = cart.items.find((i: any) => i.id === itemId);
  if (!item) return null;
  if (input.quantity === 0) {
    await userPrisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await userPrisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: input.quantity },
    });
  }
  return getCart(userId);
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await userPrisma.cart.findUnique({ where: { userId }, include: { items: true } });
  if (!cart) return null;
  const item = cart.items.find((i: any) => i.id === itemId);
  if (!item) return null;
  await userPrisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
}

export async function getAllUserService() {
  try {
    const users = await userPrisma.userProfile.findMany();
    if (!users) {
      throw new Error("No users found");
    }
    return users;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new Error("Failed to fetch users");
  }
}