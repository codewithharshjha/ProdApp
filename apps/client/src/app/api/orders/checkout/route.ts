import { auth ,getAuth } from "@clerk/nextjs/server";
import { NextResponse  } from "next/server";
import { Request } from "express";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL ?? "http://localhost:8000";
console.log("ORDER_SERVICE_URL", ORDER_SERVICE_URL);
export async function POST(req: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken();
     const authuser = getAuth(req);

  const userId = authuser?.userId;

    const body = await (req as any).json();
console.log("body from client", body);
    const res = await fetch(`${ORDER_SERVICE_URL}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": userId || "",
      },
     
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Order creation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}