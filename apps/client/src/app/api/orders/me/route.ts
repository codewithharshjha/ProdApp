import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL ?? "http://localhost:8000";
console.log("ORDER_SERVICE_URL", ORDER_SERVICE_URL);
export async function GET(req: NextRequest) {
  try {
    const { getToken, userId } = await auth();
    const token = await getToken();

    const res = await fetch(`${ORDER_SERVICE_URL}/orders/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": userId || "",
      },
     
     
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Order creation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
console.log("data from order service", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}